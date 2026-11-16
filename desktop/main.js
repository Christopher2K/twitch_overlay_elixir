const { app, BrowserWindow, Menu, ipcMain, session, shell } = require("electron");
const fs = require("node:fs");
const path = require("node:path");

const CAPTIONS_PATH = "/admin/captions";
const SETUP_PAGE = path.join(__dirname, "pages", "setup.html");
const ERROR_PAGE = path.join(__dirname, "pages", "error.html");
const INSECURE_ORIGIN_SWITCH = "unsafely-treat-insecure-origin-as-secure";
const SMOKE_FLAG = process.argv.includes("--smoke");

let mainWindow = null;
let serverUrl = null;

function configPath() {
  return path.join(app.getPath("userData"), "config.json");
}

function readConfig() {
  try {
    const parsed = JSON.parse(fs.readFileSync(configPath(), "utf8"));
    if (typeof parsed.serverUrl === "string" && parsed.serverUrl !== "") {
      return parsed.serverUrl;
    }
  } catch {
    // Missing or unreadable config falls through to the setup screen.
  }
  return null;
}

function writeConfig(url) {
  fs.mkdirSync(path.dirname(configPath()), { recursive: true });
  fs.writeFileSync(configPath(), `${JSON.stringify({ serverUrl: url }, null, 2)}\n`);
}

function normalizeServerUrl(value) {
  let url;
  try {
    url = new URL(value);
  } catch {
    throw new Error("Enter a full address, like http://localhost:4000");
  }
  if (url.protocol !== "http:" && url.protocol !== "https:") {
    throw new Error("The address must start with http:// or https://");
  }
  return url.origin;
}

// getUserMedia needs a secure context. localhost already qualifies; a plain
// http:// LAN or production host needs this Chromium flag, set before ready.
function needsInsecureOriginFlag(origin) {
  const { protocol, hostname } = new URL(origin);
  return (
    protocol === "http:" &&
    !["localhost", "127.0.0.1", "[::1]"].includes(hostname)
  );
}

function isTrustedOrigin(origin) {
  if (!serverUrl) return false;
  try {
    return new URL(origin).origin === serverUrl;
  } catch {
    return false;
  }
}

function loadCaptions() {
  if (!mainWindow || !serverUrl) return;
  mainWindow.loadURL(serverUrl + CAPTIONS_PATH).catch(() => {
    // did-fail-load shows the error page.
  });
}

function loadSetup() {
  mainWindow?.loadFile(SETUP_PAGE).catch(() => {});
}

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 980,
    height: 820,
    minWidth: 620,
    minHeight: 480,
    title: "Stream Captions",
    backgroundColor: "#fafafa",
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
      contextIsolation: true,
      nodeIntegration: false,
      // Keep the 180ms caption publish timer running while minimized.
      backgroundThrottling: false,
      spellcheck: false,
    },
  });

  mainWindow.webContents.on(
    "did-fail-load",
    (_event, errorCode, errorDescription, validatedURL, isMainFrame) => {
      if (!isMainFrame || errorCode === -3) return; // -3 = aborted navigation
      mainWindow
        .loadFile(ERROR_PAGE, {
          query: {
            message: `${errorDescription} (${errorCode})`,
            url: validatedURL || serverUrl || "",
          },
        })
        .catch(() => {});
    },
  );

  // After login Phoenix redirects to /admin; go straight to the captions page.
  mainWindow.webContents.on("did-navigate", (_event, url) => {
    if (serverUrl && (url === `${serverUrl}/admin` || url === `${serverUrl}/admin/`)) {
      loadCaptions();
    }
  });

  mainWindow.webContents.on("will-navigate", (event, url) => {
    if (!isTrustedOrigin(url) && !url.startsWith("file:")) {
      event.preventDefault();
      shell.openExternal(url);
    }
  });

  mainWindow.webContents.setWindowOpenHandler(({ url }) => {
    // e.g. the /overlay/captions link on the admin page opens in the browser.
    shell.openExternal(url);
    return { action: "deny" };
  });

  mainWindow.on("closed", () => {
    mainWindow = null;
  });

  if (SMOKE_FLAG) {
    mainWindow.webContents.once("did-finish-load", async () => {
      const image = await mainWindow.webContents.capturePage();
      const output =
        process.env.SMOKE_OUTPUT ||
        path.join(app.getPath("temp"), "stream-captions-smoke.png");
      fs.writeFileSync(output, image.toPNG());
      console.log(`smoke screenshot: ${output}`);
      app.quit();
    });
  }

  if (serverUrl) {
    loadCaptions();
  } else {
    loadSetup();
  }
}

function buildMenu() {
  Menu.setApplicationMenu(
    Menu.buildFromTemplate([
      { role: "appMenu" },
      { role: "editMenu" },
      {
        label: "Captions",
        submenu: [
          { label: "Change Server…", click: loadSetup },
          {
            label: "Open Overlay in Browser",
            enabled: Boolean(serverUrl),
            click: () => shell.openExternal(serverUrl + "/overlay/captions"),
          },
          { type: "separator" },
          { role: "reload" },
          { role: "forceReload" },
          { role: "toggleDevTools" },
        ],
      },
      { role: "windowMenu" },
    ]),
  );
}

function registerIpcHandlers() {
  ipcMain.handle("get-server", () => serverUrl);

  ipcMain.handle("save-server", (_event, value) => {
    let origin;
    try {
      origin = normalizeServerUrl(String(value ?? "").trim());
    } catch (error) {
      return { ok: false, error: error.message };
    }

    const needsFlag = needsInsecureOriginFlag(origin);
    const flagApplied =
      app.commandLine.getSwitchValue(INSECURE_ORIGIN_SWITCH) === origin;
    writeConfig(origin);
    serverUrl = origin;

    if (needsFlag && !flagApplied) {
      // The secure-context flag only applies at process start.
      app.relaunch();
      app.quit();
      return { ok: true, restarting: true };
    }

    loadCaptions();
    return { ok: true, restarting: false };
  });

  ipcMain.handle("retry", loadCaptions);
  ipcMain.handle("change-server", loadSetup);
}

serverUrl = readConfig();
if (serverUrl && needsInsecureOriginFlag(serverUrl)) {
  app.commandLine.appendSwitch(INSECURE_ORIGIN_SWITCH, serverUrl);
}

if (!app.requestSingleInstanceLock()) {
  app.quit();
} else {
  app.on("second-instance", () => {
    if (mainWindow) {
      if (mainWindow.isMinimized()) mainWindow.restore();
      mainWindow.focus();
    }
  });

  app.whenReady().then(() => {
    // Only the configured overlay server may use the microphone; the remote
    // page gets no Node access and no other permissions.
    session.defaultSession.setPermissionRequestHandler(
      (webContents, permission, callback, details) => {
        const origin = details?.requestingOrigin || webContents.getURL();
        callback(permission === "media" && isTrustedOrigin(origin));
      },
    );
    session.defaultSession.setPermissionCheckHandler(
      (_webContents, permission, requestingOrigin) =>
        permission === "media" && isTrustedOrigin(requestingOrigin),
    );

    registerIpcHandlers();
    buildMenu();
    createWindow();

    app.on("activate", () => {
      if (BrowserWindow.getAllWindows().length === 0) createWindow();
    });
  });

  // Closing the window stops captions (the page clears them on pagehide).
  app.on("window-all-closed", () => {
    app.quit();
  });
}