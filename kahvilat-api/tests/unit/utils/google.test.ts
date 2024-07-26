import { convertAddress, convertPlace } from '../../../src/utils/google'
import { ApiTestData } from '../../data/api'
import { GoogleTestData } from '../../data/google'

describe('convertAddress', () => {
  it('converts address', () => {
    expect(convertAddress(GoogleTestData.address1)).toEqual(ApiTestData.address1)
    expect(convertAddress(GoogleTestData.address2)).toEqual(ApiTestData.address2)
  })
})

describe('convertPlace', () => {
  it('converts place', () => {
    expect(convertPlace(GoogleTestData.place1)).toEqual(ApiTestData.place1)
    expect(convertPlace(GoogleTestData.place2)).toEqual(ApiTestData.place2)
  })
})
