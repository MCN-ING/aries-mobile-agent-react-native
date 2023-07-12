import fs from 'fs'
import path from 'path'

import { credentialSortFn, formatIfDate, normalizeInvitationUri } from '../../App/utils/helpers'

const proofCredentialPath = path.join(__dirname, '../fixtures/proof-credential.json')
const credentials = JSON.parse(fs.readFileSync(proofCredentialPath, 'utf8'))

describe('credentialSortFn', () => {
  test('Sorts retrieved credentials by revocation', async () => {
    const key = '0_surname_uuid'
    const { requestedAttributes } = credentials
    const sortedCreds = requestedAttributes[key].sort(credentialSortFn)

    expect(sortedCreds).toMatchSnapshot()
  })
})

describe('formatIfDate', () => {
  let setter = jest.fn()

  beforeEach(() => {
    setter = jest.fn()
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  test('without format', () => {
    formatIfDate(undefined, '20020523', setter)
    expect(setter).toBeCalledTimes(0)
  })

  test('with format and string date', () => {
    formatIfDate('YYYYMMDD', '20020523', setter)
    expect(setter).toBeCalledTimes(1)
  })

  test('with format and number date', () => {
    formatIfDate('YYYYMMDD', 20020523, setter)
    expect(setter).toBeCalledTimes(1)
  })

  test('with format but invalid string date', () => {
    formatIfDate('YYYYMMDD', '203', setter)
    expect(setter).toBeCalledTimes(0)
  })

  test('with format but invalid number date', () => {
    formatIfDate('YYYYMMDD', 203, setter)
    expect(setter).toBeCalledTimes(0)
  })
})

describe('normalizeInvitationUri', () => {
  const query = 'c_i=eyJAdHlwZSI6IIsImF13IiOiJodHRwczovL'
  const shortenedUrl = `https://bit.ly/3f2X2lM?`

  test('with a connection invitation uri normalize invitation should return the same url', () => {
    const uri = `https://example.com?${query}`
    expect(normalizeInvitationUri(uri)).toBe(uri)
  })

  test('with a deeplink connection invitation uri normalize invitation should return the same deeplink uri', () => {
    const deeplink = `didcomm://invite?${query}`

    expect(normalizeInvitationUri(deeplink)).toBe(deeplink)
  })

  test('with a shortened url normalize invitation should return the same url', () => {
    expect(normalizeInvitationUri(shortenedUrl)).toBe(shortenedUrl)
  })

  test('with a deeplink shortened url normalize invitation should return the shortened url', () => {
    const deeplink = `didcomm://invite?${shortenedUrl}`

    expect(normalizeInvitationUri(deeplink)).toBe(shortenedUrl)
  })
})
