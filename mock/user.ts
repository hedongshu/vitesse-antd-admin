import type { MockMethod } from 'vite-plugin-mock'
import type { requestParams } from './_util'
import { getRequestToken, resultError, resultSuccess } from './_util'

export function createFakeUserList() {
  return [
    {
      userId: '1',
      username: 'admin',
      realName: 'sssgoEasy Admin',
      avatar: '',
      desc: 'manager',
      password: '123456',
      token: 'fakeToken1',
      roles: ['admin', 'user'],
      mobile: 13000000000,
      last_login: '2021-11-11 12:00',
    },
    {
      userId: '2',
      username: 'test',
      password: '123456',
      realName: 'test user',
      avatar: '',
      desc: 'tester',
      token: 'fakeToken2',
      roles: ['user'],
      mobile: 18000000000,
      last_login: '2021-11-11 12:12',
    },
  ]
}

export default [
  // mock user login
  {
    url: '/v1/user/login',
    timeout: 200,
    method: 'post',
    response: ({ body }) => {
      const { username, password } = body
      const checkUser = createFakeUserList().find(
        item => item.username === username && password === item.password,
      )
      if (!checkUser)
        return resultError('Incorrect account or password！')

      return resultSuccess(checkUser)
    },
  },
  {
    url: '/v1/user/logout',
    timeout: 200,
    method: 'get',
    response: (request: requestParams) => {
      const token = getRequestToken(request)
      if (!token) return resultError('Invalid token')
      const checkUser = createFakeUserList().find(item => item.token === token)
      if (!checkUser)
        return resultError('Invalid token!')

      return resultSuccess(undefined, { message: 'Token has been destroyed' })
    },
  },
  {
    url: '/v1/account/info',
    method: 'get',
    response: (request: requestParams) => {
      const token = getRequestToken(request)
      if (!token) return resultError('Invalid token')
      const checkUser = createFakeUserList().find(item => item.token === token)
      if (!checkUser)
        return resultError('The corresponding user information was not obtained!')

      return resultSuccess(checkUser)
    },
  },
] as MockMethod[]
