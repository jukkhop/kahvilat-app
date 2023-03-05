import * as JsonSchema from 'jsonschema'
import { ValidationError } from '../types/validation'

const convertValidationError = (error: JsonSchema.ValidationError): ValidationError => {
  return {
    field: error.property.replace('instance.', ''),
    value: error.instance,
    type: error.name,
    message: error.message,
  }
}

export { convertValidationError }
