'use strict'

const placesModel = require('../models/places')
const { getCorsHeaders } = require('../utils/cors')

module.exports.handler = async () => {
  const places = await placesModel.getPlaces()

  return {
    statusCode: 200,
    headers: getCorsHeaders(),
    body: JSON.stringify({ places }, null, 2),
  }
}
