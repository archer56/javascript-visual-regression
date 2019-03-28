# react-visual-regression
Visual regression tool for react components

## NOTE: THIS IS CURRENTLY IN DEV, CONFIG IS NOT FULLY IMPLEMENTED AND API MAY CHANGE UNTIL FIRST MAJOR RELEASE

## config ( jvr.config.js )
Config must return a function, which in turn returns the config as an object.
```
module.exports = () => ({
  baseImagesSrc: '/images/base',
  saveImageLocation: '/images/', //if you want to save the images relative to the location running. JVR will add a hashed folder
  saveImageScript: (images) => {}, //if you want to save the images with ftp etc, this function will pass you the image.
  reportSrc: '/report',
  comparisonTolerance: 0.05, //percentage difference of 5%
  tests: [
    {
      title: 'should screenshot a react component',
      testType: 'component',
      component: '', //my component
      props: {},
      beforeTest: null,
      hideElements: null,
    },
    {
      title: 'should screenshot a component using a custom renderer',
      testType: 'component',
      component: '', //my component
      props: {},
      renderer: (component, props) => {return rendererFn(component)}} //must return a string
      beforeTest: null,
      hideElements: null,
    },
    {
      title: 'should screenshot a live page',
      testType: 'website',
      url: 'https://www.google.com',
      beforeTest: () => {console.log('this will run before the screenshot has taken, but after the page has loaded')},
      hideElements: ['.cookie-banner', '.carousel'],
    }
  ],
  screenWidths: [
    {name: 'mobile', width: 320},
    {name: 'tablet', width: 720},
    {name: 'desktop', width: 1200},
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
