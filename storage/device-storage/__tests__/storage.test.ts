import * as storage from '../storage'

describe('storage', () => {
  it('sets a key/value pair', async () => {
    await expect(storage.setItem('tools', [1, 2, 3])).resolves.not.toThrow()
  })

  it('gets a key', async () => {
    await storage.setItem('tools', [1, 2, 3])
    const value = await storage.getItem('tools')
    expect(value).toEqual([1, 2, 3])
  })
})
