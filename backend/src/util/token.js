const fetch = require('node-fetch')
require('dotenv').config();
const NodeCache = require('node-cache')
const myCache = new NodeCache()
const log = require('../util/logger').createLogger('token.js')
const { httpStatus } = require('../constants')
const base64 = require('base-64')

/*
  * getToken - retrieves a bearer token stored in the cache. if there is no token in
  * the cache or it expires then a network request is made for a new token
*/

const getToken = async () => {
	log.debug('Checking for cached token')

	//Generate URL encoded form data
	const details = {
		'grant_type': 'client_credentials'
	};
	let reqBody = [];
	for (var property in details) {
		var encodedKey = encodeURIComponent(property)
		var encodedValue = encodeURIComponent(details[property])
		reqBody.push(encodedKey + "=" + encodedValue)
	}
	reqBody = reqBody.join("&")

	//Check for cached token
	if (myCache.get('token') === undefined) {
		log.debug('Obtaining a new token')

		const options = {
			method: 'POST',
			body: reqBody,
			headers: {
				'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
				'Authorization': 'Basic ' + base64.encode(process.env.CLIENT_ID + ":" + process.env.CLIENT_SECRET)
			}
		}

		// Auth server
		const response = await fetch('https://login.mypurecloud.com/oauth/token', options)

		// console.log(response)
		if (response.status !== httpStatus.OK) {
			throw new Error('Error Receiving credentials')
		}

		const token = await response.json()
		const tokenTimeout = 3600
		myCache.set('token', token.access_token, tokenTimeout)
	} else {
		log.debug('Cached token found')
	}
	return myCache.get('token')
}
module.exports = { getToken }
