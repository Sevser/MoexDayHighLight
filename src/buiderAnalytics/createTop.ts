const createOfftop = async () => {
  const title = figma.createText();
  try {
    title.fontName = { family: "RS NEWS Sans", style: "Regular" };
    await figma.loadFontAsync(title.fontName);
  } catch {
    title.fontName = { family: "Roboto", style: "Regular" };
    await figma.loadFontAsync(title.fontName);
  }
  title.characters = '*Среди бумаг входящих в индекс Мосбиржи';
  title.fills = [{
    type: 'SOLID',
    color: {
      r: 1,
      g: 1,
      b: 1,
    }
  }];
  title.setRangeFontSize(0, title.characters.length, 24);
  title.x = 28;
  return title;
}

export default createOfftop;