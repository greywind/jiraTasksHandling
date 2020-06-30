module.exports = {
    setupFiles: [
        "<rootDir>/jestConfig/env.js",
    ],
    setupFilesAfterEnv: [
        "<rootDir>/jestConfig/enzyme.js",
    ],
    globals: {
        "__DEV__": true,
    },
    moduleNameMapper: {
        "\\.(jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$": "<rootDir>/jestConfig/fileMock.js",
        "^@core(.*)$": "<rootDir>/src/core$1",
        "^@components(.*)$": "<rootDir>/src/components$1",
        "^@shared(.*)$": "<rootDir>/src/components/_shared$1",
        "^@img(.*)$": "<rootDir>/public/img$1",
        "^@services(.*)$": "<rootDir>/src/services$1",
    },
    snapshotResolver: "<rootDir>/jestConfig/snapshotResolver.js",
    modulePathIgnorePatterns: ["<rootDir>/tools", "<rootDir>/theme"],
};
