'use strict'

const placesModel = require('../models/places')

module.exports.handler = async () => {
  //
  const places = await placesModel.getPlaces()
  console.log('places', places)
  //
  return {
    statusCode: 200,
    body: JSON.stringify(places, null, 2),
  }
}
