const navigateTo = async (currTest, page) => {
  try {
    await page.goto(currTest.url);
  } catch {
    throw new Error(`Failed, could not load ${currTest.url}`);
  }
}

module.exports = {
  navigateTo,
}
