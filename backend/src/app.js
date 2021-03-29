const express = require('express')
const app = express()
require('dotenv').config({ path: '.env' });
const { defaultPort } = require('./constants')
const PORT = process.env.PORT || defaultPort
const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser')
const cors = require('cors')
const getAggregates = require('./routes/aggregates')

if (process.env.LOCAL_CORS === 'true') {
	app.use(cors({
		origin: 'http://localhost:3000',
		credentials: true
	}))
} else {
	app.use(cors())
}

app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())
app.use(cookieParser())

app.get('/api/aggregates', getAggregates)

app.listen(PORT, () => {
	console.log(`listening on port ${PORT}`)
})

module.exports = app;
