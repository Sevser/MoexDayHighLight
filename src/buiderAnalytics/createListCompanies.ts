import companyNameMapping from "../mapping/companyNames";


const createTitle = async (text) => {
  const title = figma.createText();
  try {
    title.fontName = { family: "RS NEWS Sans", style: "Regular" };
    await figma.loadFontAsync(title.fontName);
  } catch {
    title.fontName = { family: "Roboto", style: "Regular" };
    await figma.loadFontAsync(title.fontName);
  }
  title.characters = text;
  title.fills = [{
    type: 'SOLID',
    color: {
      r: 1,
      g: 1,
      b: 1,
    }
  }];
  title.textCase = 'UPPER';
  title.setRangeFontSize(0, title.characters.length, 24);
  title.x = 28;
  return title;
};

const createTitleCompany = async (el) => {
  const title = figma.createText();
  try {
    title.fontName = { family: "RS NEWS Sans", style: "DemiBold" };
    await figma.loadFontAsync(title.fontName);
  } catch {
    title.fontName = { family: "Roboto", style: "Regular" };
    await figma.loadFontAsync(title.fontName);
  }
  title.characters = companyNameMapping(el.securityInfo.SECID);
  title.fills = [{
    type: 'SOLID',
    color: {
      r: 1,
      g: 1,
      b: 1,
    }
  }];
  title.setRangeFontSize(0, title.characters.length, 36);
  title.x = 28;
  return title;
}
const createSecIdCompany = async (el) => {
  const title = figma.createText();
  try {
    title.fontName = { family: "RS NEWS Sans", style: "Light" };
    await figma.loadFontAsync(title.fontName);
  } catch {
    title.fontName = { family: "Roboto", style: "Regular" };
    await figma.loadFontAsync(title.fontName);
  }
  await figma.loadFontAsync(title.fontName);
  title.characters = el.securityInfo.SECID;
  title.fills = [{
    type: 'SOLID',
    color: {
      r: 1,
      g: 1,
      b: 1,
    }
  }];
  title.setRangeFontSize(0, title.characters.length, 36);
  title.x = 28;
  return title;
}

const formatPercentage = (num) => {
  let result = '';
  if (num > 0) {
    result += '+' + num.toFixed(2);
  } else {
    result += num.toFixed(2);
  }
  return result.toString().replace('.', ',').concat('%');
}

const createPercentGrow = async (el) => {
  const title = figma.createText();
  try {
    title.fontName = { family: "RS NEWS Sans", style: "Regular" };
    await figma.loadFontAsync(title.fontName);
  } catch {
    title.fontName = { family: "Roboto", style: "Regular" };
    await figma.loadFontAsync(title.fontName);
  }
  title.characters = formatPercentage(el.LASTTOPREVPRICE);
  if (el.LASTTOPREVPRICE < 0) {
    title.fills = [{
      type: 'SOLID',
      color: {
        r: 251 / 256,
        g: 61 / 256,
        b: 61 / 256,
      }
    }];
  } else if (el.LASTTOPREVPRICE > 0) {
    title.fills = [{
      type: 'SOLID',
      color: {
        r: 195 / 256,
        g: 253 / 256,
        b: 32 / 256,
      }
    }];
  } else {
    title.fills = [{
      type: 'SOLID',
      color: {
        r: 1,
        g: 1,
        b: 1,
      }
    }];
  }

  title.textAlignHorizontal = 'RIGHT';
  title.setRangeFontSize(0, title.characters.length, 36);
  title.x = 166;
  return title;
};

const createTotalGrow = async (el) => {
  const title = figma.createText();
  try {
    title.fontName = { family: "RS NEWS Sans", style: "DemiBold" };
    await figma.loadFontAsync(title.fontName);
  } catch {
    title.fontName = { family: "Roboto", style: "Regular" };
    await figma.loadFontAsync(title.fontName);
  }
  const value = el.CLOSINGAUCTIONPRICE || el.LAST || 0;
  const afterDecimals = countDecimals(value);
  if (afterDecimals > 2) {
    title.characters = value.toString().replace('.', ',');
  } else {
    title.characters = value.toFixed(2).toString().replace('.', ',');
  }

  title.fills = [{
    type: 'SOLID',
    color: {
      r: 1,
      g: 1,
      b: 1,
    }
  }];
  title.layoutGrow = 0;
  title.resize(180, title.height);
  title.textAlignHorizontal = 'RIGHT';
  title.setRangeFontSize(0, title.characters.length, 36);
  title.x = 302;
  return title;
};

function countDecimals(num = 0) {
  if (Math.floor(num.valueOf()) === num.valueOf()) return 0;
  return num.toString().split(".")[1].length || 0;
}

const createCompany = async (el) => {
  const div = figma.createFrame();
  div.clipsContent = false;
  div.fills = [];
  div.layoutMode = 'HORIZONTAL';
  div.primaryAxisAlignItems = 'CENTER';
  div.counterAxisAlignItems = 'BASELINE';
  div.counterAxisSizingMode = 'AUTO';
  div.primaryAxisSizingMode = 'FIXED';
  div.itemSpacing = 15;
  div.resize(900, div.height);
  div.insertChild(0, await createTotalGrow(el));
  div.insertChild(0, await createPercentGrow(el));
  div.insertChild(0, await createDashLine());
  div.insertChild(0, await createSecIdCompany(el));
  div.insertChild(0, await createTitleCompany(el));
  return div;
}

const createDashLine = () => {
  const div = figma.createFrame();
  div.strokes = [{
    color: {
      r: 1,
      g: 1,
      b: 1,
    },
    type: 'SOLID',
  }];
  div.dashPattern = [1, 3];
  div.fills = [];
  div.primaryAxisSizingMode = 'AUTO';
  div.strokeTopWeight = 0;
  div.strokeLeftWeight = 0;
  div.strokeRightWeight = 0;
  div.strokeBottomWeight = 1;
  div.layoutGrow = 1;
  div.resize(div.width, 39);
  return div;
}

const createListCompanies = async (arr, title) => {
  if (arr.length) {
    const div = figma.createFrame();
    (await Promise.all(arr.map((el) => {
      return createCompany(el);
    }))).reverse().forEach((el) => {
      div.insertChild(0, el)
    });
    div.insertChild(0, await createTitle(title));
    div.clipsContent = false;
    div.fills = [];
    div.layoutMode = 'VERTICAL';
    div.layoutAlign = 'STRETCH';
    div.itemSpacing = 15;
    div.paddingBottom = 35;
    div.x = 50;
    return div;
  }
  return null;
}

export default createListCompanies;