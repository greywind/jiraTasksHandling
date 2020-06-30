module.exports = {
    resolveSnapshotPath: (testPath, snapshotExtension) =>
        testPath.replace("test.tsx", `snapshot${snapshotExtension}`),
    resolveTestPath: (snapshotFilePath, snapshotExtension) =>
        snapshotFilePath.replace(`snapshot${snapshotExtension}`, "test.tsx"),
    testPathForConsistencyCheck: "some/example/test.tsx",
};