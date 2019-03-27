const navigateTo = async (currTest, page) => {
  try {
    await page.goto(currTest.url);
  } catch {
    throw new Error(`Failed, could not load ${currTest.url}`);
  }
}

hideElements = async (elements = [], page) => {
  if(!elements.length) return;
  const selectors = elements.join(',');
  await page.addStyleTag({content: `${selectors}{visibility: hidden;}`});
}

module.exports = {
  navigateTo,
  hideElements,
}
