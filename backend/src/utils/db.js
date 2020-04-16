const { Pool } = require('pg')

const setDefaultSchema = async (pool) =>
  await pool.query('SET search_path TO public')

const query = async (sql) => {
  let result = null
  const pool = new Pool()

  try {
    await setDefaultSchema(pool)
    result = await pool.query(sql)
  } finally {
    await pool.end()
  }

  return result
}

const select = async (sql) => {
  const res = await query(sql)
  return res.rows
}

const selectOne = async (sql) => select(sql)[0]

module.exports = {
  select,
  selectOne,
}
