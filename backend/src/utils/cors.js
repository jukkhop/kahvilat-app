const getCorsHeaders = () => {
  // eslint-disable-next-line no-undef
  const { STAGE, FRONTEND_URL } = process.env
  const origin = STAGE === 'dev' ? '*' : FRONTEND_URL
  return {
    'Access-Control-Allow-Origin': origin,
    'Access-Control-Allow-Credentials': true,
  }
}

module.exports = {
  getCorsHeaders,
}
