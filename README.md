# react-visual-regression
Visual regression tool for react components

## config ( jvr.config.js )
Config must return a function, which in turn returns the config as an object.
```
module.exports = () => ({
  saveImageLocation: '/images/', //if you want to save the images relative to the location running. JVR will add a hashed folder
  comparisonTolerance: 0.05, //percentage difference of 5%
  noSandbox: false, //by default puppeteer will run with a sandbox. Use this with caution.
  tests: [
    {
      title: 'should screenshot a live page',
      testType: 'website',
      url: 'https://www.google.com',
      hideElements: ['.cookie-banner', '.carousel'],
    }
  ],
  screenWidths: [
    {title: 'mobile', width: 320},
    {title: 'tablet', width: 720},
    {title: 'desktop', width: 1200},
  ],
});
```

## Usage

### from the command line ( recommended )
#### To generate the base imageSaveLocation
```
  jvr --generateBase
```

#### To run the tests
```
  jvr
```

## CI
Use a docker image that has chrome installed
