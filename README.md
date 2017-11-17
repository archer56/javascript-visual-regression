# react-visual-regression
Visual regression tool for react components

THIS IS CURRENTLY IN DEV

Rendering
Allow react-visual-regression to do all the rendering (recommended) or pass in custom renderer that would look something like this:

renderer = (component, props) => {
//Custom rendering
}//<div>hello world</div>

It must return rendered component as a string.
