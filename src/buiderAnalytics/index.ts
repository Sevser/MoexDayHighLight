import createIndexAndCurr from "./createIndexAndCurr";
import createListCompanies from "./createListCompanies";
import createShadow from "./createShadow";
import createOfftop from "./createTop";
import createTitle from "./title";

const createAnalytics = async ({
  usd, eur, cny, moex, rtsi, fall, rise
}) => {
  const frame = figma.createFrame();
  frame.clipsContent = true;
  frame.fills = [{
    type: 'SOLID',
    color: {
      r: 6 / 256,
      g: 24 / 256,
      b: 88 / 256,
    }
  }];
  frame.paddingTop = 50;
  frame.paddingBottom = 50;
  frame.paddingLeft = 50;
  frame.paddingRight = 50;
  frame.layoutMode = 'VERTICAL';
  frame.resize(1000, 1000);
  frame.itemSpacing = 10;
  frame.insertChild(0, await createOfftop());
  const fallCompanies = await createListCompanies(fall, 'Лидеры падения*');
  fallCompanies && frame.insertChild(0, fallCompanies);
  const riseCompanies = await createListCompanies(rise, 'Лидеры роста*');
  riseCompanies && frame.insertChild(0, riseCompanies);
  frame.insertChild(0, await createIndexAndCurr({
    usd, eur, cny, moex, rtsi
  }));
  frame.insertChild(0, await createTitle());
  const shadow = await createShadow();
  frame.insertChild(0, shadow);
  shadow.layoutPositioning = 'ABSOLUTE';
  shadow.x = 0;
  shadow.y = 0;
}

export default createAnalytics;