const moduleAlias = require("module-alias");
const tsConfiguration = require("./tsconfig");

Object.keys(tsConfiguration.compilerOptions.paths).forEach((key) => {
    const normalizedAlias = key.endsWith("/*") ? key.substr(0, key.length - 2) : key;
    const plainPath = tsConfiguration.compilerOptions.paths[key][0];
    const normalizedPath = plainPath.endsWith("/*") ? plainPath.substr(0, plainPath.length - 2) : plainPath;

    moduleAlias.addAlias(normalizedAlias, normalizedPath);
});
