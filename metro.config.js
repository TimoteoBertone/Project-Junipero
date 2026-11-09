const path = require("path");
const { getDefaultConfig } = require("expo/metro-config");

/** @type {import('expo/metro-config').MetroConfig} */
const config = getDefaultConfig(__dirname);

const asyncStorageRoot = path.dirname(
  require.resolve("@react-native-async-storage/async-storage/package.json")
);
const asyncStorageEntry = path.join(
  asyncStorageRoot,
  "lib/commonjs/index.js"
);

/**
 * AsyncStorage 2.x sets package.json "react-native" → src/index.ts.
 * Expo Go / Metro then fails resolving sibling .ts modules from that entry.
 * Force the published commonjs build instead.
 */
const previousResolveRequest = config.resolver.resolveRequest;
config.resolver.resolveRequest = (context, moduleName, platform) => {
  if (
    moduleName === "@react-native-async-storage/async-storage" ||
    moduleName === "@react-native-async-storage/async-storage/lib/commonjs/index.js"
  ) {
    return {
      type: "sourceFile",
      filePath: asyncStorageEntry,
    };
  }

  if (typeof previousResolveRequest === "function") {
    return previousResolveRequest(context, moduleName, platform);
  }
  return context.resolveRequest(context, moduleName, platform);
};

module.exports = config;
