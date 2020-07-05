import bcrypt from 'bcrypt'

class Encrypter {
  compare (value, hash) {
    const isValid = bcrypt.compare(value, hash)
    return isValid
  }
}

describe('Encrypter', () => {
  it('Should return true if bcrypt returns true', async () => {
    const sut = new Encrypter()
    const isValid = await sut.compare('any_value', 'hash_value')
    expect(isValid).toBe(true)
  })

  it('Should return false if bcrypt returns false', async () => {
    const sut = new Encrypter()
    bcrypt.isValid = false
    const isValid = await sut.compare('any_value', 'hash_value')
    expect(isValid).toBe(false)
  })
})
