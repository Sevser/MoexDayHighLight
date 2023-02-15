import * as url from 'whatwg-url';
import * as buffer from 'buffer';
global.URL = (url as any).URL;
global.Buffer = buffer.Buffer;
import MoexAPI from './moexApi/index.js';
/* import fall from './data/fall';
import rise from './data/rise';
import cny from './data/cny';
import usd from './data/usd';
import eur from './data/eur';
import moex from './data/moex';
import rtsi from './data/rtsi';*/
import createAnalytics from './buiderAnalytics/index';
import miexIndexSet from './data/moexIndex';

async function main(): Promise<string | undefined> {
  const moexApi = new MoexAPI();
  const fonts = [{ family: "Roboto", style: "Regular" }, { family: "RS NEWS Sans", style: "Bold" }, { family: "RS NEWS Sans", style: "DemiBold" }, { family: "RS NEWS Sans", style: "Regular" }, { family: "RS NEWS Sans", style: "Light" }];


  await Promise.all(fonts.map(f => figma.loadFontAsync(f)));

  try {
    const usd = await moexApi.securityMarketData("USD000UTSTOM");
    const eur = await moexApi.securityMarketData("EUR_RUB__TOM");
    const cny = await moexApi.securityMarketData("CNYRUB_TOM");
    const moex = await moexApi.securityMarketData("IMOEX");
    const rtsi = await moexApi.securityMarketData("RTSI");
    const sec = (await moexApi.securitiesMarketData('stock', 'shares'));
    const shares = Object.keys(sec).reduce((acc, item) => { acc.push(sec[item]); return acc; }, []).filter(stock => miexIndexSet.has(stock.SECID)).sort((a, b) => a.LASTTOPREVPRICE - b.LASTTOPREVPRICE);
    const rise = shares.filter(s => s.LASTTOPREVPRICE > 0).slice(-3).reverse();
    const fall = shares.slice(0, 6 - rise.length);
    console.log(usd, eur, cny, moex, rtsi, fall, rise, shares);
    await createAnalytics({
      usd, eur, cny, moex, rtsi, fall, rise
    });
  } catch (e) {
    console.error(e);
  }

  return 'success';
}

main().then((message: string | undefined) => {
  figma.closePlugin(message)
});