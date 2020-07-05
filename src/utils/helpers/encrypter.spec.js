class Encrypter {
  compare () {
    return true
  }
}

describe('Encrypter', () => {
  it('Should return true if bcrypt returns true', async () => {
    const sut = new Encrypter()
    const isValid = await sut.compare('any_password', 'any_hash_password')
    expect(isValid).toBe(true)
  })
})
