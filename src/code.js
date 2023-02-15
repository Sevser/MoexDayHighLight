"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const url_1 = require("url");
global.URL = url_1.URL;
console.log(url_1.URL);
const moex_api_1 = require("moex-api");
const moexApi = new moex_api_1.default();
function main() {
    return __awaiter(this, void 0, void 0, function* () {
        yield figma.loadFontAsync({ family: "Roboto", style: "Regular" });
        const security = yield moexApi.securityMarketData("USD000UTSTOM");
        console.log(security);
        return 'success';
    });
}
main().then((message) => {
    figma.closePlugin(message);
}).catch((message) => {
    figma.closePlugin(message);
});
