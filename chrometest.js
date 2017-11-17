require('babel-register')({
  presets:['react']
});

const chromeLauncher = require('chrome-launcher');
const CDP = require('chrome-remote-interface');
const file = require('fs');
const containerUrl = `file:///${__dirname}/lib/container.html`;
const React = require('react');
const ReactDOMServer = require('react-dom/server');

const component = require('./testComponent');

(async function() {
  async function launchChrome() {
    return await chromeLauncher.launch({
      chromeFlags: [
        '--disable-gpu',
        '--headless'
      ]
    });
  }
  const chrome = await launchChrome();
  const protocol = await CDP({
    port: chrome.port
  });

  // ALL FOLLOWING CODE SNIPPETS HERE
  const {
    DOM,
    Page,
    Emulation,
    Runtime
  } = protocol;
  await Promise.all([Page.enable(), Runtime.enable(), DOM.enable()]);

  Page.navigate({
    url: containerUrl
  });

  Page.loadEventFired(async() => {
    const script1 = "document.querySelector('html').textContent";
    console.log(component)
    const renderedComponent = ReactDOMServer.renderToStaticMarkup(React.createElement(component));
    console.log('ben', renderedComponent);
    const injectedRenderedComponent = `document.getElementById('componentHousing').innerHTML = "${renderedComponent}"`;
    // Evaluate script1
    const result = await Runtime.evaluate({
      expression: injectedRenderedComponent
    });
    console.log(result);

    const ss = await Page.captureScreenshot({format: 'png', fromSurface: true});
    file.writeFile('screenshot.png', ss.data, 'base64', function(err) {
      if (err) {
        console.log(err);
      }
    });

    protocol.close();
    chrome.kill();
  });
})();