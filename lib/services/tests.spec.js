const { getTransformedTestData } = require('./tests');

const MOCK_TESTS = [
  {
    title: 'home',
    testType: 'website',
    url: `www.sometestwebsite.com`,
    hideElements: ['.cookie-banner'],
  },
];

const MOCK_SCREEN_WIDTHS = [
  { title: 'mobile', width: 320 },
  { title: 'tablet', width: 720 },
  { title: 'desktop', width: 1200 },
];

describe('getTransformedTestData', () => {
  it('should return false if no tests are passed', () => {
    const data = getTransformedTestData();
    expect(data).toBeFalsy();
  });

  it('should return test data with default width when no screenWidths is defined', () => {
    const tests = getTransformedTestData({
      tests: MOCK_TESTS,
    });

    expect(tests.length).toEqual(1);
    expect(tests).toEqual([
      {
        ...MOCK_TESTS[0],
        title: 'home-default',
        width: 1200,
      },
    ]);
  });

  it('should return test data with title containing screen width and width', () => {
    const tests = getTransformedTestData({
      tests: MOCK_TESTS,
      screenWidths: MOCK_SCREEN_WIDTHS,
    });

    expect(tests.length).toEqual(3);
    expect(tests).toEqual([
      {
        ...MOCK_TESTS[0],
        title: `home-mobile`,
        width: 320,
      },
      {
        ...MOCK_TESTS[0],
        title: `home-tablet`,
        width: 720,
      },
      {
        ...MOCK_TESTS[0],
        title: `home-desktop`,
        width: 1200,
      },
    ]);
  });
});
