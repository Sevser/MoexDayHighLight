const createTitle = async () => {
  const title = figma.createText();
  try {
    title.fontName = { family: "RS NEWS Sans", style: "Bold" };
    await figma.loadFontAsync(title.fontName);
  } catch {
    title.fontName = { family: "Roboto", style: "Regular" };
    await figma.loadFontAsync(title.fontName);
  }
  title.characters = 'Итоги основных торгов на Мосбирже';
  title.setRangeFontSize(0, title.characters.length, 52);
  title.fills = [{
    type: 'SOLID',
    color: {
      r: 1,
      g: 1,
      b: 1,
    }
  }];
  title.resize(614, 124);
  title.constraints = {
    horizontal: 'MIN',
    vertical: 'MIN',
  }
  title.lineHeight = {
    value: 120,
    unit: 'PERCENT',
  }
  title.x = 50;
  title.y = 50;
  return title;
}

export default createTitle;