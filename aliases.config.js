const moduleAlias = require("module-alias");
const tsConfiguration = require("./tsconfig");

Object.keys(tsConfiguration.compilerOptions.paths).forEach((key) => {
    const normalizedAlias = key.endsWith("/*") ? key.substr(0, key.length - 2) : key;

    for (const plainPath of tsConfiguration.compilerOptions.paths[key]) {
        const normalizedPath = plainPath.endsWith("/*") ? plainPath.substr(0, plainPath.length - 2) : plainPath;

        console.log(__dirname);

        moduleAlias.addAlias(normalizedAlias, `${__dirname}/${tsConfiguration.compilerOptions.outDir}/${normalizedPath}`);
    }
});
