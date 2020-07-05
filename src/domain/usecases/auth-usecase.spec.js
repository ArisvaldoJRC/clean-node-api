import { MissingParamError } from '../../utils/errors'

class AuthUseCase {
  async auth (email) {
    if (!email) {
      throw new MissingParamError()
    }
  }
}

describe('Auth UseCase', () => {
  it('Should throw if no email is provided', async () => {
    const sut = new AuthUseCase()
    const promise = sut.auth()
    expect(promise).rejects.toThrow(new MissingParamError())
  })
})
