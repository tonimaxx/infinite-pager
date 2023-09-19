module.exports = function(api) {
  api.cache(true); // Enables Babel caching, which can improve performance.
  return {
    presets: ['babel-preset-expo'], // Uses the Babel preset for Expo.
    plugins: ["react-native-reanimated/plugin"], // Uses the Reanimated Babel plugin.
  };
};