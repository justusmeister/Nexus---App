// Learn more: https://docs.expo.dev/guides/customizing-metro/
const { getDefaultConfig } = require("expo/metro-config");

const config = getDefaultConfig(__dirname);

config.resolver.assetExts = config.resolver.assetExts.filter(ext => ext !== "svg");
config.resolver.assetExts.push("db");
config.resolver.sourceExts.push("cjs", "svg");

config.transformer = {
  ...config.transformer,
  babelTransformerPath: require.resolve("react-native-svg-transformer"),
};

module.exports = config;
