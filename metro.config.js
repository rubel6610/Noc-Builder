const { getDefaultConfig } = require("expo/metro-config");
const { withNativeWind } = require("nativewind/metro");

/** @type {import('expo/metro-config').MetroConfig} */
const config = getDefaultConfig(__dirname);

// Enable package exports and prioritize react-native fields
config.resolver.unstable_enablePackageExports = true;
config.resolver.resolverMainFields = ['react-native', 'browser', 'main'];
config.resolver.sourceExts = [...config.resolver.sourceExts, 'mjs', 'cjs'];

// Fix for zod resolution issues on Windows/Metro
config.resolver.resolveRequest = (context, moduleName, platform) => {
  if (moduleName.includes('zod/v4/locales/en.js')) {
     // Force resolve to the correct file if Metro is getting confused
     return {
       type: 'sourceFile',
       filePath: context.originModulePath.replace(/v4[\\\/]classic[\\\/]external\.js$/, 'v4/locales/en.js'),
     };
  }
  return context.resolveRequest(context, moduleName, platform);
};

module.exports = withNativeWind(config, { input: "./global.css" });
