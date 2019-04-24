const takeScreenshot = async (imageSaveLocation, page) => {
  try {
    await page.screenshot({ path: imageSaveLocation, fullPage: true });
  } catch (e) {
    console.log('Could not record screenshot', e);
  }
};

module.exports = {
  takeScreenshot,
};
