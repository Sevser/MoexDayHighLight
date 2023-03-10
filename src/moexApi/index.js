import fetch from 'node-fetch';
const debug = require("debug")("moex.api");

import _ from '../lodash'

function required(parameter = "") {
	throw `Missing ${parameter} parameter`;
}

const API_BASE = "https://iss.moex.com/iss";
const SECURITY_INFO = {};
const SECURITIES_ORDERING_COLUMN = "VALTODAY";

class MoexAPI {

	/**
     * difference with securityMarketDataExplicit - this method works without
     * engine / market parameters (it will use first pair from security
     * definition). It makes additional request to MOEX API for
     * first time for specific security, than cache this engine / market
     * for this security.
     */
	securityMarketData(security = required("security"), currency) {
		return this.getSecurityInfo(security)
			.then(({
				engine, market
			}) => {
				return this.securityMarketDataExplicit(engine, market, security, currency);
			});
	}

	getSecurityInfo(security) {
		if (SECURITY_INFO[security]) {
			return Promise.resolve(SECURITY_INFO[security]);
		}
		return this.securityDefinition(security)
			.then((data) => {
				let boards = _.values(data.boards);
				if (!boards.length)
					throw `Security ${security} doesn"t have any board in definition`;
				let board = boards[0];
				let info = {
					engine: board.engine,
					market: board.market
				};
				SECURITY_INFO[security] = info;
				return info;
			});
	}

	securityMarketDataExplicit(engine = required("engine"),
		market = required("market"), security = required("security"), currency) {
		return this.securityDataRawExplicit(engine, market, security)
			.then((response) => {
				let rows = MoexAPI._responseToSecurities(response, {
					engine, market
				});
				rows = rows.filter(row => row.node.last && this.filterByCurrency(row, currency));
				rows = _.sortByOrder(rows, SECURITIES_ORDERING_COLUMN, "desc");
				return rows.length ? rows[0] : null;
			});
	}


	filterByCurrency(security, currency) {
		return currency !== undefined ? security.securityInfo.CURRENCYID === currency : true;
	}

	securityDataRawExplicit(engine = required("engine"),
		market = required("market"), security = required("security")) {
		let url = `engines/${engine}/markets/${market}/securities/${security}`;
		return MoexAPI._request(url);
	}

	/*return marketdata grouped by security id (board with most trading volume
     * is selected from data) */
	securitiesMarketData(engine = required("engine"),
		market = required("market"), query = {}) {

		const COLUMN = SECURITIES_ORDERING_COLUMN;
		if (!query.sort_column) {
			query.sort_order = "desc";
			query.sort_column = 'LASTTOPREVPRICE';
		}
		let first = null;
		if (query.first) {
			first = query.first;
			delete query.first;
		}

		return this.securitiesDataRaw(engine, market, query)
			.then((response) => {

				let rows = MoexAPI._responseToSecurities(response, {
					engine, market
				});
				let data = {};
				for (let row of rows) {
					let secID = row.SECID;
					//so we use board with max VALTODAY for quotes
					if (row.node.last && (!data[secID] ||
                        data[secID][COLUMN] < row[COLUMN])) {
						data[secID] = row;
					}
				}

				if (first) {
					rows = _.values(data);
					rows = _.sortByOrder(rows, COLUMN, "desc");
					rows = rows.slice(0, first);
					data = _.indexBy(rows, "SECID");
				}
				return data;
			});
	}

	static _responseToSecurities(response, requestParams) {
		function indexBy(row) {
			return `${row.SECID}_${row.BOARDID}`;
		}

		let blocks = MoexAPI._responseToBlocks(response);
		let securitiesInfoIndex = _.indexBy(blocks.securities, indexBy);
		let securities = blocks.marketdata;
		//let"s store info from securitiesInfo block
		securities.forEach((security) =>
			security.securityInfo = securitiesInfoIndex[indexBy(security)]);

		MoexAPI._securitiesCustomFields(securities, requestParams);
		return securities;
	}

	//not structured response with marketdata from Api
	securitiesDataRaw(engine = required("engine"),
		market = required("market"), query = {}) {
		return MoexAPI._request(`engines/${engine}/markets/${market}/securities`, query);
	}

	securityDefinition(security = required("security")) {
		return MoexAPI._request(`securities/${security}`)
			.then((response) => {
				let security = MoexAPI._responseToBlocks(response);
				security.description = _.indexBy(security.description, "name");
				security.boards = _.indexBy(security.boards, "boardid");
				return security;
			});
	}

	securitiesDefinitions(query = {}) {
		return MoexAPI._request("securities", query).then(MoexAPI._responseFirstBlockToArray);
	}

	boards(engine = required("engine"), market = required("market")) {
		return MoexAPI._request(`engines/${engine}/markets/${market}/boards`).then(MoexAPI._responseFirstBlockToArray);
	}

	markets(engine = required("engine")) {
		return MoexAPI._request(`engines/${engine}/markets`).then(MoexAPI._responseFirstBlockToArray);
	}

	engines() {
		return MoexAPI._request("engines").then(MoexAPI._responseFirstBlockToArray);
	}

	// global constants
	index() {
		return MoexAPI._request("").then(MoexAPI._responseToBlocks);
	}


	static _securitiesCustomFields(securities, requestParams) {
		securities.forEach((security) => MoexAPI._securityCustomFields(security, requestParams));
	}

	static _securityCustomFields(security, requestParams) {
		security.node = {
			last: security.LAST || security.CURRENTVALUE,
			volume: security.VALTODAY_RUR || security.VALTODAY || security.VALTODAY_USD,
			friendlyTitle: this._securityFriendlyTitle(security, requestParams),
			id: security.SECID
		};
		//in case market closed for today or there are no deals for this security
		let info = security.securityInfo;
		if (!security.node.last && info) {
			security.node.last = info.PREVPRICE;
		}
	}

	static _securityFriendlyTitle(security, {market}) {
		let info = security.securityInfo;
		if (!info) return security.SECID;
		switch (market) {
		case "index":
			return info.NAME || info.SHORTNAME;
		case "forts":
			return info.SECNAME || info.SHORTNAME;
		default:
			return info.SHORTNAME;
		}
	}

	//call _responseBlockToArray for multiple blocks
	static _responseToBlocks(response) {
		return _.mapValues(response, (block) => MoexAPI._responseBlockToArray(block));
	}

	//same as _responseToBlocks, just only parse first block
	static _responseFirstBlockToArray(response) {
		let key = _.keys(response)[0];
		return MoexAPI._responseBlockToArray(response[key]);
	}

	//combine columns and data to array of objects
	static _responseBlockToArray(block) {
		return block.data.map((data) => _.combine(block.columns, data));
	}

	static _request(method, query = {}) {
		let BASE = method ? API_BASE + "/" : API_BASE;
		return new Promise(async (resolve, reject) => {
			const url = new URL(`${BASE}${method}.json`);
			url.search = Object.keys(query).map(key => `${key}=${query[key]}`).join('&');
			let result = {};
			try {
				result = await fetch(url.href);
				if (!result.ok) {
					const textError = `Request was failed: ${result.status} (${result.statusText})`;
					MoexAPI._debugAndReject(url, result, reject, new Error(textError), textError);
				}
				const json = await result.json();
				resolve(json);
			} catch (error) {
				MoexAPI._debugAndReject(url, result, reject, error, "Unable to get body");
			}
		});
	}

	static _debugAndReject(url, result, reject, error, errorText) {
		debug(errorText);
		debug(url);
		debug(result);
		reject(error);
	}

}

export default MoexAPI;
