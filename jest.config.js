module.exports = {
  testEnvironment: 'node',

  setupFiles: ['<rootDir>/tests/setup.js'],

  testMatch: [
    '**/tests/**/*.test.js',
    '**/src/tests/**/*.test.js'
  ]
};