const moduleAlias: any = require("module-alias");
const tsConfiguration: any = require("./tsconfig");

Object.keys(tsConfiguration.paths).forEach((key: string): void => {
    const normalizedAlias: string = key.endsWith("/*") ? key.substr(0, key.length - 2) : key;
    const plainPath: string = tsConfiguration.paths[key];
    const normalizedPath: string = plainPath.endsWith("/*") ? plainPath.substr(0, plainPath.length - 2) : plainPath;

    moduleAlias.addAlias(normalizedAlias, normalizedPath);
});
