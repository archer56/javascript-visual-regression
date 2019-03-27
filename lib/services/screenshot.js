const takeScreenshot = async (currTest, page, imageSaveLocation) => {
  try {
    await page.goto(currTest.url);
  } catch {
    throw new Error(`Failed, could not load ${currTest.url}`);
  }
  await page.screenshot({ path: imageSaveLocation, fullPage: true });
};

module.exports = {
  takeScreenshot
};
