import esbuild from "esbuild";

const args = process.argv.slice(2);
const watch = args.includes("--watch");
const deploy = args.includes("--deploy");
const ssr = args.includes("--ssr");

const clientOpts = {
  entryPoints: ["js/app.tsx"],
  bundle: true,
  minify: deploy,
  sourcemap: watch && "inline",
  logLevel: "info",
  jsx: "automatic",
  target: "es2017",
  outdir: "../priv/static/assets",
  external: ["*.css", "fonts/*", "images/*", "sounds/*"],
  nodePaths: ["../deps"],
};

const serverOpts = {
  entryPoints: ["js/ssr.tsx"],
  bundle: true,
  minify: false,
  sourcemap: watch && "inline",
  logLevel: "info",
  jsx: "automatic",
  platform: "node",
  format: "cjs",
  outdir: "../priv",
  external: ["*.css", "fonts/*", "images/*"],
  nodePaths: ["../deps"],
};

const opts = ssr ? serverOpts : clientOpts;

if (watch) {
  esbuild
    .context(opts)
    .then((ctx) => {
      ctx.watch();
    })
    .catch((_error) => {
      process.exit(1);
    });
} else {
  esbuild.build(opts);
}
