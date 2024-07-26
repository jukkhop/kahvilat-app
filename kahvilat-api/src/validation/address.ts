import Ajv, { Schema } from 'ajv'
import { GetAddressesParams, GetAddressesParamsRaw } from '../types/api'
import { Result } from '../types/result'
import { ValidationError } from '../types/validation'

// prettier-ignore
const GetAddressesSchema: Schema = {
  type: 'object',
  properties: {
    address: {},
    latitude: {},
    longitude: {},
  },
  additionalProperties: false,
  oneOf: [
    { required: ['latitude', 'longitude'] },
    { required: ['address'] },
  ],
}

export function validateGetAddressesParams(
  params: GetAddressesParamsRaw,
): Result<GetAddressesParams, ValidationError[]> {
  const ajv = new Ajv()
  const validate = ajv.compile(GetAddressesSchema)

  // prettier-ignore
  return validate(params)
    ? { ok: true, value: params }
    : { ok: false, error: validate.errors ?? [] }
}
