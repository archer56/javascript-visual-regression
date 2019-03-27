const takeScreenshot = async (imageSaveLocation, page) => {
  await page.screenshot({ path: imageSaveLocation, fullPage: true });
};

module.exports = {
  takeScreenshot,
};
