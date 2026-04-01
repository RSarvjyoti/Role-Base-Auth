module.exports = {
  testEnvironment: "node",
  testMatch: ["**/__tests__/**/*.js", "**/?(*.)+(spec|test).js"],
  collectCoverageFrom: ["src/**/*.js", "!src/test/**", "!node_modules/**"],
  testTimeout: 10000,
  detectOpenHandles: true,
  forceExit: true,
};
