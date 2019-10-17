const Bundler = require("parcel-bundler");
const path = require("path");
const p = file => path.resolve(__dirname, file);

/**
 * List all of the entry points
 */
const entryFiles = [p("../src/main.js"), p("../src/vendor.js")];

const options = {
  logLevel: 3,
  outDir: "./build",
  publicUrl: "/static/build/",
  cacheDir: ".cache",
  target: "browser",
  watch: true,
  cache: true,
  minify: false,
  sourceMaps: true,
  contentHash: true,
  hmr: false
};

(async () => {
  // build JS and CSS
  const bundler = new Bundler(entryFiles, options);
  await bundler.bundle();

  bundler.on("buildStart", entryPoints => {
    console.log("Building ", entryPoints);
  });
})();
