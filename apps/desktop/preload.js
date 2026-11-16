const { contextBridge, ipcRenderer } = require("electron");

// Only the local setup/error pages get an API; the remote admin page gets none.
if (location.protocol === "file:") {
  contextBridge.exposeInMainWorld("captionsDesktop", {
    getServer: () => ipcRenderer.invoke("get-server"),
    saveServer: (url) => ipcRenderer.invoke("save-server", url),
    retry: () => ipcRenderer.invoke("retry"),
    changeServer: () => ipcRenderer.invoke("change-server"),
  });
}