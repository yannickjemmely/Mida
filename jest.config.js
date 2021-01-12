module.exports = {
    testEnvironment: "node",
    coverageProvider: "v8",
    roots: [
        "./tests"
    ],
    clearMocks: true,
    testMatch: [
        "**/?(*.)+(spec|test).+(ts|tsx|js)"
    ],
    transform: {
        "^.+\\.(ts|tsx)$": "ts-jest"
    },
};
