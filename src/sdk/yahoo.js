import Promise from 'bluebird'
import { rslError } from '../utils'

let yahooAuth
let yahooAccessToken

const load = ({ appId, redirect }) => new Promise((resolve) => {
  yahooAuth = `https://api.login.yahoo.com/oauth2/request_auth?client_id=${appId}&redirect_uri=${redirect}&response_type=token&language=en-us`
  return resolve()
})

const checkLogin = (autoLogin = false) => {
  if (autoLogin) return login()
  if (!yahooAccessToken) {
    return Promise.reject(rslError({
      provider: 'yahoo',
      type: 'access_token',
      description: 'No access token available',
      error: null
    }))
  }
  return new Promise((resolve, reject) => {
    fetch(`https://social.yahooapis.com/v1/user/dhksrl2589/profile?format=json`, { headers: { Authorization: `Bearer ${yahooAccessToken}` } })
      .then(res => res.json())
      .then(json => {
        if (json.meta.code !== 200) {
          return reject(rslError({
            provider: 'yahoo',
            type: 'check_login',
            description: 'Failed to fetch user data',
            error: json.meta
          }))
        }
        resolve({ data: json.data, accessToken: yahooAccessToken })
      })
  })
}

const login = () => new Promise((resolve, reject) => {
  checkLogin()
    .then(res => resolve(res))
    .catch(err => {
      if (!err.fetchErr) {
        window.open(yahooAuth, '_self')
      } else {
        return reject(err.err)
      }
    })
})

const generateUser = data => ({
  profile: {
    id: null,
    name: null,
    firstName: null,
    lastName: null,
    email: null,
    profilePicURL: null
  },
  token: {
    accessToken: null,
    expiresAt: null
  }
})

const logout = () => new Promise((resolve) => {
  yahooAccessToken = null
  return resolve()
})

export default {
  checkLogin,
  generateUser,
  load,
  login,
  logout
}
