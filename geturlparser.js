const url = require("url");

/**
 * extracts the parameters from a URL and returns an object representing the GET request. 
 * Multiple parameters are put in arrays
 * 
 * @param {string} urltoparse URL to extract the GET request parameters from
 * 
 * @returns {Object} Object in the format {"parameter key": "parameter value"} or {"parameter key": ["parameter value1", "parameter value2"]}
 */
const parseGetQuery = function parseGetQuery(urltoparse) {

	const urlQueryArray = url.parse(urltoparse).query.split("&");
	const query = {};

	urlQueryArray.forEach(queryParam => {
		query[queryParam.split("=")[0]] = [];
	});

	urlQueryArray.forEach(queryParam => {
		query[queryParam.split("=")[0]].push(decodeURIComponent(queryParam.split("=")[1]));
	});

	for (const queryParamKey in query) {
		if (query.hasOwnProperty(queryParamKey)) {
			const queryParamParsed = query[queryParamKey];
			if (queryParamParsed.length === 1) {
				query[queryParamKey] = queryParamParsed.pop();
			}
		}
	}
	return query;
};

module.exports = parseGetQuery;