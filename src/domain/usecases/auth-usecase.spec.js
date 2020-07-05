import { MissingParamError } from '../../utils/errors'
import AuthUseCase from './auth_usecase'

const makeEncrypter = () => {
  class EncrypterSpy {
    async compare (password, hashedPassword) {
      this.password = password
      this.hashedPassword = hashedPassword
      return this.isValid
    }
  }
  const encrypterSpy = new EncrypterSpy()
  encrypterSpy.isValid = true
  return encrypterSpy
}
const makeTokenGenerator = () => {
  class TokenGeneratorSpy {
    async generate (userId) {
      this.userId = userId
      return this.accessToken
    }
  }
  const tokenGeneratorSpy = new TokenGeneratorSpy()
  tokenGeneratorSpy.accessToken = 'any_token'
  return tokenGeneratorSpy
}

const makeloadUserByEmailRepository = () => {
  class LoadUserByEmailRepositorySpy {
    async load (email) {
      this.email = email
      return this.user
    }
  }
  const loadUserByEmailRepositorySpy = new LoadUserByEmailRepositorySpy()
  loadUserByEmailRepositorySpy.user = {
    id: 'any_id',
    password: 'hashed_password'
  }
  return loadUserByEmailRepositorySpy
}
const makeSut = () => {
  const encrypterSpy = makeEncrypter()
  const loadUserByEmailRepositorySpy = makeloadUserByEmailRepository()
  const tokenGeneratorSpy = makeTokenGenerator()
  const sut = new AuthUseCase({
    loadUserByEmailRepository: loadUserByEmailRepositorySpy,
    encrypter: encrypterSpy,
    tokenGenerator: tokenGeneratorSpy
  })
  return {
    sut,
    loadUserByEmailRepositorySpy,
    encrypterSpy,
    tokenGeneratorSpy
  }
}

describe('Auth UseCase', () => {
  it('Should throw if no email is provided', async () => {
    const { sut } = makeSut()
    const promise = sut.auth()
    expect(promise).rejects.toThrow(new MissingParamError('email'))
  })

  it('Should throw if no password is provided', async () => {
    const { sut } = makeSut()
    const promise = sut.auth('any_email@mail.com')
    expect(promise).rejects.toThrow(new MissingParamError('password'))
  })

  it('Should call LoadUserByEmailRepository with correct email', async () => {
    const { sut, loadUserByEmailRepositorySpy } = makeSut()
    await sut.auth('any_email@mail.com', 'any_password@mail.com')
    expect(loadUserByEmailRepositorySpy.email).toBe('any_email@mail.com')
  })

  it('Should throw if no dependency is provided', async () => {
    const sut = new AuthUseCase()
    const promise = sut.auth('any_email@mail.com', 'any_password@mail.com')
    expect(promise).rejects.toThrow()
  })

  it('Should throw if no LoadUserByEmailRepository is provided', async () => {
    const sut = new AuthUseCase({})
    const promise = sut.auth('any_email@mail.com', 'any_password@mail.com')
    expect(promise).rejects.toThrow()
  })

  it('Should throw if LoadUserByEmailRepository has no load method', async () => {
    const sut = new AuthUseCase({ loadUserByEmailRepository: {} })
    const promise = sut.auth('any_email@mail.com', 'any_password@mail.com')
    expect(promise).rejects.toThrow()
  })

  it('Should return null if invalid email is provided', async () => {
    const { sut, loadUserByEmailRepositorySpy } = makeSut()
    loadUserByEmailRepositorySpy.user = null
    const accessToken = await sut.auth('invalid_email@mail.com', 'any_password@mail.com')
    expect(accessToken).toBeNull()
  })

  it('Should return null if invalid password is provided', async () => {
    const { sut, encrypterSpy } = makeSut()
    encrypterSpy.isValid = false
    const accessToken = await sut.auth('valid_email@mail.com', 'invalid_password@mail.com')
    expect(accessToken).toBeNull()
  })

  it('Should call Encrypter with correct values', async () => {
    const { sut, loadUserByEmailRepositorySpy, encrypterSpy } = makeSut()
    await sut.auth('valid_email@mail.com', 'any_password@mail.com')
    expect(encrypterSpy.password).toBe('any_password@mail.com')
    expect(encrypterSpy.hashedPassword).toBe(loadUserByEmailRepositorySpy.user.password)
  })

  it('Should call TokenGenerator with correct userId', async () => {
    const { sut, loadUserByEmailRepositorySpy, tokenGeneratorSpy } = makeSut()
    await sut.auth('valid_email@mail.com', 'valid_password@mail.com')
    expect(tokenGeneratorSpy.userId).toBe(loadUserByEmailRepositorySpy.user.id)
  })

  it('Should return an accessToken if correct credentials are provided', async () => {
    const { sut, tokenGeneratorSpy } = makeSut()
    const accessToken = await sut.auth('valid_email@mail.com', 'valid_password@mail.com')
    expect(accessToken).toBe(tokenGeneratorSpy.accessToken)
    expect(accessToken).toBeTruthy()
  })
})
