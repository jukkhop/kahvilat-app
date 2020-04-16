const { select } = require('../utils/db')

const getPlaces = async () => {
  const sql = 'SELECT id, external_id, name FROM places'
  return select(sql)
}

module.exports = {
  getPlaces,
}
