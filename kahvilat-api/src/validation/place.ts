import Ajv, { Schema } from 'ajv'
import { GetPlacesParams, GetPlacesParamsRaw } from '../types/api'
import { Result } from '../types/result'
import { ValidationError } from '../types/validation'

// prettier-ignore
const GetPlacesSchema: Schema = {
  type: 'object',
  properties: {
    cursor: {},
    keyword: {},
    latitude: {},
    longitude: {},
    radius: {},
    type: {},
  },
  additionalProperties: false,
  oneOf: [
    { required: ['keyword', 'latitude', 'longitude', 'radius', 'type'] },
    { required: ['cursor'] },
  ],
}

export function validateGetPlacesParams(params: GetPlacesParamsRaw): Result<GetPlacesParams, ValidationError[]> {
  const ajv = new Ajv()
  const validate = ajv.compile(GetPlacesSchema)

  // prettier-ignore
  return validate(params)
    ? { ok: true, value: params }
    : { ok: false, error: validate.errors ?? [] }
}
