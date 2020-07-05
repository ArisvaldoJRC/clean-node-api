import bcrypt from 'bcrypt'

export default class Encrypter {
  compare (value, hash) {
    const isValid = bcrypt.compare(value, hash)
    return isValid
  }
}
