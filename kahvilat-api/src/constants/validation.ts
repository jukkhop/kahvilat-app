import { Schema } from '../types/validation'

const required: Schema = {
  required: true,
}

const optional: Schema = {
  required: false,
}

const boolean: Schema = {
  type: 'boolean',
}

const number: Schema = {
  type: 'number',
}

const integer: Schema = {
  type: 'integer',
}

const array: Schema = {
  type: 'array',
}

const object: Schema = {
  type: 'object',
}

const string: Schema = {
  type: 'string',
}

const stringOrNull: Schema = {
  type: ['string', 'null'],
}

const uuid: Schema = {
  type: 'string',
  pattern: '^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$',
}

export {
  // prettier-ignore
  array,
  boolean,
  integer,
  number,
  object,
  optional,
  required,
  string,
  stringOrNull,
  uuid,
}
