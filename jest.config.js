module.exports = {
    testEnvironment: "node",
    coverageProvider: "v8",
    roots: [
        "./build/tests"
    ],
    clearMocks: true,
    testMatch: [
        "**/?(*.)+(spec|test).+(ts|tsx|js)"
    ],
    moduleNameMapper: {
        "^#periods/(.*)": __dirname + "/build/src/periods/$1"
    }
};
