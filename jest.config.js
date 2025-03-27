/** @type {import("ts-jest").JestConfigWithTsJest} **/
module.exports = {
  preset: "ts-jest",
  collectCoverage: true,
  collectCoverageFrom: [
    "<rootDir>/src/**/*.ts"
  ],
  coverageReporters: ["lcov", "html"],
  roots: [
    "<rootDir>/src/"
  ],
  setupFiles: [
    "<rootDir>/setupJest.js"
  ],
  testEnvironment: "jsdom",
  transform: {
    "^.+.ts?$": ["ts-jest",{}]
  },
  transformIgnorePatterns: [
    "/node_modules/(?!lodash-es)"
  ],
};