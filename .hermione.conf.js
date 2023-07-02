module.exports = {
  baseUrl: "http://localhost:3000/hw/store",
  sets: {
    desktop: {
      files: "test/hermione",
    },
  },

  browsers: {
    chrome: {
      automationProtocol: "devtools",
      desiredCapabilities: {
        browserName: "chrome",
      },
      testsPerSession: 1,
      windowSize: {
        width: 1920,
        height: 1080,
      },
    },
  },
  plugins: {
    "html-reporter/hermione": {
      enabled: true,
    },
  },
};
