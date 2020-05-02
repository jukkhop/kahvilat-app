import { Pool, QueryResult } from 'pg'

async function setDefaultSchema(pool: Pool): Promise<void> {
  await pool.query('SET search_path TO public')
}

async function query(sql: string): Promise<QueryResult<any>> {
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

export async function select(sql: string): Promise<any[]> {
  const res = await query(sql)
  return res.rows
}

export async function selectOne(sql: string): Promise<any> {
  const rows = await select(sql)
  return rows[0]
}
