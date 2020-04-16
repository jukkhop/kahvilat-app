'use strict'

const { getPlaces } = require('../models/places')
const { getCorsHeaders } = require('../utils/cors')

module.exports.handler = async () => {
  const places = await getPlaces()
  return {
    statusCode: 200,
    headers: getCorsHeaders(),
    body: JSON.stringify({ places }, null, 2),
  }
}
