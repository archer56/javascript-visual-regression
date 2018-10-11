# react-visual-regression

## notes
Visual regression tool for react components

THIS IS CURRENTLY IN DEV

Rendering
Allow react-visual-regression to do all the rendering (recommended) or pass in custom renderer that would look something like this:

renderer = (component, props) => {
//Custom rendering
}//<div>hello world</div>

It must return rendered component as a string.

## config ( jvr.js )
```
module.exports = {
  baseImagesSrc: '/images/base',
  saveImageLocation: '/images/', //if you want to save the images relative to the location running. JVR will add a hashed folder
  saveImageScript: (images) => {}, //if you want to save the images with ftp etc, this function will pass you the image.
  reportSrc: '/report',
  comparisonTolerance: 80, //percentage difference
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
      beforeTest: () => {console.log('this will run before the screenshot has taken, but after the page has loaded')}
      hideElements: ['.cookie-banner', '.carousel']
    }
  ],
  screenWidths: [
    {name: 'mobile', width: 320}
    {name: 'tablet', width: 720}
    {name: 'desktop', width: 1200}
  ],
}
```

## Usage

### from the command line ( recommended )
```
  jvr
```

### within a node application
```
import jvr from 'jvr';

jvr({
  config: {...},
})
```

## CI
Use a docker image that has chrome installed
