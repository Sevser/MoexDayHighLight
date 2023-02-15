const positioning = {
  'USD000UTSTOM': {
    x: 500,
    y: 0,
  },
  'EUR_RUB__TOM': {
    x: 500,
    y: 56,
  },
  'CNYRUB_TOM': {
    x: 500,
    y: 112,
  },
  'IMOEX': {
    x: 0,
    y: 0,
  },
  'RTSI': {
    x: 0,
    y: 56,
  },
}

const valueMapping = {
  'USD000UTSTOM': (el) => el.LAST.toFixed(2),
  'EUR_RUB__TOM': (el) => el.LAST.toFixed(2),
  'CNYRUB_TOM': (el) => el.LAST.toFixed(3),
  'IMOEX': (el) => ((el.CURRENTVALUE).toString()),
  'RTSI': (el) => ((el.CURRENTVALUE).toString()),
}

const changeMapping = {
  'USD000UTSTOM': (el) => ((el.LASTTOPREVPRICE)),
  'EUR_RUB__TOM': (el) => ((el.LASTTOPREVPRICE)),
  'CNYRUB_TOM': (el) => ((el.LASTTOPREVPRICE)),
  'IMOEX': (el) => ((el.LASTCHANGEPRC)),
  'RTSI': (el) => ((el.LASTCHANGEPRC)),
}

const titleMapping = {
  'USD000UTSTOM': (el) => ((el.securityInfo.FACEUNIT).toString()),
  'EUR_RUB__TOM': (el) => ((el.securityInfo.FACEUNIT).toString()),
  'CNYRUB_TOM': (el) => ((el.securityInfo.FACEUNIT).toString()),
  'IMOEX': (el) => ((el.securityInfo.SECID).toString()),
  'RTSI': (el) => ((el.securityInfo.NAME).toString().slice(7)),
}

const createTitle = async (el) => {
  const title = figma.createText();
  try {
    title.fontName = { family: "RS NEWS Sans", style: "DemiBold" };
    await figma.loadFontAsync(title.fontName);
  } catch {
    title.fontName = { family: "Roboto", style: "Regular" };
    await figma.loadFontAsync(title.fontName);
  }
  title.characters = titleMapping[el.securityInfo.SECID](el);
  title.fills = [{
    type: 'SOLID',
    color: {
      r: 1,
      g: 1,
      b: 1,
    }
  }];
  title.resize(116, title.height);
  title.setRangeFontSize(0, title.characters.length, 36);
  title.x = 28;
  return title;
};

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
  title.characters = formatPercentage(changeMapping[el.securityInfo.SECID](el));
  title.fills = [{
    type: 'SOLID',
    color: {
      r: 1,
      g: 1,
      b: 1,
    }
  }];
  title.setRangeFontSize(0, title.characters.length, 36);
  title.x = 166;
  return title;
};

const createTotalGrow = async (el) => {
  const title = figma.createText();
  try {
    title.fontName = { family: "RS NEWS Sans", style: "DemiBold" };
    await figma.loadFontAsync(title.fontName);
  } catch (e) {
    console.log(e);
    title.fontName = { family: "Roboto", style: "Regular" };
    await figma.loadFontAsync(title.fontName);
  }
  title.characters = valueMapping[el.securityInfo.SECID](el).replace('.', ',');
  title.fills = [{
    type: 'SOLID',
    color: {
      r: 1,
      g: 1,
      b: 1,
    }
  }];
  title.layoutGrow = 1;
  title.textAlignHorizontal = 'RIGHT';
  title.textAutoResize = 'TRUNCATE';
  title.setRangeFontSize(0, title.characters.length, 36);
  title.x = 302;
  return title;
};

const createArrow = async (el) => {
  const change = changeMapping[el.securityInfo.SECID](el);
  if (change > 0) {
    return await figma.createNodeFromSvg(`<svg width="22" height="25" viewBox="0 0 22 25" fill="none" xmlns="http://www.w3.org/2000/svg">
  <path d="M9 25H11H13V21H22L11 0L0 21H9V25Z" fill="#C3FD20"/>
  </svg>
  `);
  }
  return await figma.createNodeFromSvg(`<svg width="22" height="25" viewBox="0 0 22 25" fill="none" xmlns="http://www.w3.org/2000/svg">
  <path d="M9 0H11H13V4H22L11 25L0 4H9V0Z" fill="#FB3D3D"/>
  </svg>
  `);
}

const createIndex = async (el) => {
  const div = figma.createFrame();
  const arrow = await createArrow(el);
  const title = await createTitle(el);
  div.insertChild(0, await createTotalGrow(el));
  div.insertChild(0, await createPercentGrow(el));
  div.insertChild(0, title);
  div.insertChild(0, arrow);
  div.x = positioning[el.securityInfo.SECID].x;
  div.y = positioning[el.securityInfo.SECID].y;
  div.clipsContent = false;
  div.layoutMode = 'HORIZONTAL';
  arrow.layoutPositioning = 'ABSOLUTE';
  arrow.y = 10;
  div.paddingLeft = 30;
  div.itemSpacing = 20;
  div.primaryAxisSizingMode = 'FIXED';
  div.counterAxisSizingMode = 'AUTO';
  div.resize(430, div.height);
  div.fills = [];
  return div;
};

const createTitleCurrency = async (el) => {
  const title = figma.createText();
  try {
    title.fontName = { family: "RS NEWS Sans", style: "DemiBold" };
    await figma.loadFontAsync(title.fontName);
  } catch {
    title.fontName = { family: "Roboto", style: "Regular" };
    await figma.loadFontAsync(title.fontName);
  }
  title.characters = titleMapping[el.securityInfo.SECID](el);
  title.fills = [{
    type: 'SOLID',
    color: {
      r: 1,
      g: 1,
      b: 1,
    }
  }];
  title.resize(75, title.height);
  title.setRangeFontSize(0, title.characters.length, 36);
  title.x = 28;
  return title;
};


const createCurrency = async (el) => {
  const div = figma.createFrame();
  const arrow = await createArrow(el);
  const title = await createTitleCurrency(el);
  div.insertChild(0, await createTotalGrow(el));
  div.insertChild(0, await createPercentGrow(el));
  div.insertChild(0, title);
  div.insertChild(0, arrow);
  div.x = positioning[el.securityInfo.SECID].x;
  div.y = positioning[el.securityInfo.SECID].y;
  div.clipsContent = false;
  div.layoutMode = 'HORIZONTAL';
  arrow.layoutPositioning = 'ABSOLUTE';
  arrow.y = 10;
  div.paddingLeft = 30;
  div.itemSpacing = 20;
  div.primaryAxisSizingMode = 'FIXED';
  div.counterAxisSizingMode = 'AUTO';
  div.resize(400, div.height);
  div.fills = [];
  return div;
};

const createIndexAndCurr = async ({
  usd, eur, cny, moex, rtsi
}) => {
  const div = figma.createFrame();
  const arr = [usd, eur, cny];
  const indexes = [moex, rtsi];
  (await Promise.all(arr.map((el) => {
    return createCurrency(el);
  }))).forEach(index => {
    div.insertChild(0, index)
  });
  (await Promise.all(indexes.map((el) => {
    return createIndex(el);
  }))).forEach(index => {
    div.insertChild(0, index)
  });
  div.x = 50;
  div.y = 210;
  div.resize(900, 152);
  div.clipsContent = false;
  div.fills = [];
  return div;
};

export default createIndexAndCurr;