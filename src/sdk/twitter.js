import { rslError, parseAsURL } from '../utils'
let _redirect
let _consumerkey

const load = ({appId, redirect, scope}) => new Promise((resolve, reject) => {
  if (!appId) {
    return reject(rslError({
      provider: 'twitter',
      type: 'load',
      description: 'Cannot load SDK without appId',
      error: null
    }))
  }
  _consumerkey = appId
  _redirect = parseAsURL(redirect)
  return resolve()
})

const login = () => new Promise((resolve, reject) => {
  window.open('https://api.twitter.com/oauth/access_token')
  return checkLogin()
    .then(resolve, reject)
})

const checkLogin = (autoLogin = false) => {
  if (autoLogin) {
    return login()
  }
  return new Promise((resolve, reject) => {
    window.fetch('https://api.twitter.com/oauth/request_token', {
      method: 'POST',
      header: new Headers({
        'oauth_nonce': '',
        'oauth_Callback': _redirect,
        'oauth_signature_method': 'HMAC-SHA1',
        'oauth_timestampl': '1300228849',
        'oauth_consumer_key': _consumerkey,
        'oauth_signature': 'Pc%2BMLdv028fxCErFyi8KXFM%2BddU%3D',
        'oauth_version': '1.0'
      }),
      body: JSON.stringify() || null
    })
      .then((response) => response.json())
      .then((json) => {
        if (json.message || json.errors) {
          return reject(rslError({
            provider: 'twitter',
            type: 'check_login',
            description: 'Failed to fetch user data',
            error: json
          }))
        }
        return resolve(json)
      })
      .catch(() => reject(rslError({
        provider: 'twitter',
        type: 'check_login',
        description: 'Failed to fetch user data due to window.fetch() error',
        error: null
      })))
  })
}

export default {
  load,
  checkLogin,
  login
}
