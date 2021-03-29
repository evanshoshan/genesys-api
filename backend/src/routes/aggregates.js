const token = require('../util/token')
const { httpStatus } = require('../constants');
const fetch = require('node-fetch');

const getAggregates = async (req, res) => {
	const { interval } = req.query;
	let bearerToken = ''
	console.log(`Getting aggregate data for range ${interval}`)
	try {
		bearerToken = await token.getToken()
	}
	catch (err) {
		res.status(httpStatus.UNAUTHORIZED).json({
			error: err.message,
		});
	}
	const body = {
		"interval": interval,
		"groupBy": [
			"conversationId",
			"dnis",
			"flowId",
			"flowName",
			"flowOutcome",
			"flowOutcomeId",
			"flowOutcomeValue"
		],
		"filter": {
			"type": "or",
			"predicates": [
				{
					"type": "dimension",
					"dimension": "flowOutcomeId",
					"operator": "matches",
					"value": "ffd9500c-3d72-41f8-81f1-75033d07f077"
				},
				{
					"type": "dimension",
					"dimension": "divisionId",
					"operator": "matches",
					"value": "dd98f235-f70c-4fac-ad0b-00b003cafa1a"
				}
			]
		},
		"views": [],
		"metrics": [
			"nFlow",
			"nFlowOutcome"
		]
	}

	const options = {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
			"Authorization": `Bearer ${bearerToken}`
		},
		body: JSON.stringify(body)
	}
	let requestURL = ''
	// Construct URL
	try {
		requestURL = `https://api.mypurecloud.com/api/v2/analytics/flows/aggregates/query`
	} catch (err) {
		res.status(httpStatus.SERVER_ERROR).json({
			error: `Not a valid Asset URL ${err.message}`,
		});
	}

	try {
		// return JSON response directly from anypoint API
		console.log('Fetching' + requestURL)
		const response = await fetch(requestURL, options)
		const respBody = await response.json()
		res.send(respBody)
	} catch (err) {
		console.log('Failed to fetch', err.message)

		res.status(httpStatus.SERVER_ERROR).json({
			error: `Failed to fetch ${err.message}`,
		});
	}

}

module.exports = getAggregates;