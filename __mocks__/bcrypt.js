export default {
  isValid: true,
  value: '',
  hash: '',
  compare (value, hash) {
    this.value = value
    this.hash = hash
    return this.isValid
  }
}
