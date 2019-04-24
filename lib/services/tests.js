const { DEFAULT_SCREENWIDTHS } = require('../constants');

const getTransformedTestData = ({
  tests = [],
  screenWidths = DEFAULT_SCREENWIDTHS,
  ...config
} = {}) => {
  if (!tests.length) return false;

  return (transformedTests = tests.reduce((acc, test) => {
    const testsWithWidths = screenWidths.map(screenWidth => {
      return {
        ...test,
        title: `${test.title}-${screenWidth.title}`,
        width: screenWidth.width,
      };
    });
    return acc.concat(testsWithWidths);
  }, []));
};

module.exports = {
  getTransformedTestData,
};
