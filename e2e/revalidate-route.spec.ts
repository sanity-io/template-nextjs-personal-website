import {expect, test} from '@playwright/test'

const secret = process.env.SANITY_REVALIDATE_SECRET

test.describe('POST /api/revalidate', () => {
  test.skip(!secret, 'Requires SANITY_REVALIDATE_SECRET to be set for the running server')

  test('rejects requests without the shared secret', async ({request}) => {
    const response = await request.post('/api/revalidate', {data: {syncTags: ['s1:abc']}})
    expect(response.status()).toBe(401)

    const wrongSecret = await request.post('/api/revalidate', {
      headers: {authorization: 'Bearer not-the-secret'},
      data: {syncTags: ['s1:abc']},
    })
    expect(wrongSecret.status()).toBe(401)
  })

  test('rejects malformed payloads', async ({request}) => {
    const headers = {authorization: `Bearer ${secret}`}
    for (const data of [{}, {syncTags: []}, {syncTags: [1, 2]}, {syncTags: 's1:abc'}]) {
      const response = await request.post('/api/revalidate', {headers, data})
      expect(response.status(), JSON.stringify(data)).toBe(400)
    }
  })

  test('expires the sanity-prefixed cache tags', async ({request}) => {
    const response = await request.post('/api/revalidate', {
      headers: {authorization: `Bearer ${secret}`},
      data: {syncTags: ['s1:abc', 's1:def']},
    })
    expect(response.status()).toBe(200)
    await expect(response.json()).resolves.toMatchObject({
      revalidated: true,
      tags: ['sanity:s1:abc', 'sanity:s1:def'],
    })
  })
})
