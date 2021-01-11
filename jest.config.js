module.exports = {
    testEnvironment: "node",
    coverageProvider: "v8",
    roots: [
        "./tests"
    ],
    clearMocks: true,
    testMatch: [
        "**/__tests__/**/*.+(ts|tsx|js)",
        "**/?(*.)+(spec|test).+(ts|tsx|js)"
    ],
    transform: {
        "^.+\\.(ts|tsx)$": "ts-jest"
    },
};
