import Promise from 'bluebird'
// import uuid from 'uuid/v5'

import { getQueryStringValue, parseAsURL, rslError } from '../utils'

// const NAVER_API = 'https://static.nid.naver.com/js/naveridlogin_js_sdk_2.0.0.js'

// let oauth = false
// let gatekeeperURL

// 발급 받은 accessToken
let naverAccessToken
let naverAppId
// 로그인 요청 url
let naverAuth
// 상태 토큰
// let naverStateToken
let naverSecretId
// accessToken 받기 위한 코드
// let naverAuthCode

// const generateState = () => {
//   var array = new Uint32Array(32)
//   window.crypto.getRandomValues(array)
//   array.toString(32)
//   let randNum = array.map(Number)
//   return randNum
// }

// naverStateToken = generateState()

// Load fetch polyfill for browsers not supporting fetch API
if (typeof window !== 'undefined' && !window.fetch) {
  require('whatwg-fetch')
}

/**
 * Fake Github SDK loading (needed to trick RSL into thinking its loaded).
 * @param {string} appId
 * @param {string} gatekeeper
 * @param {string} redirect
 * @param {array|string} scope
 */
const load = ({ appId, gatekeeper, redirect, secretid }) => new Promise((resolve, reject) => {
  if (!appId) {
    return reject(rslError({
      provider: 'naver',
      type: 'load',
      description: 'Cannot load SDK without appId',
      error: null
    }))
  }

  naverAppId = appId
  naverSecretId = secretid
  console.log(secretid)
  console.log('naver client secret: ' + naverSecretId)

  const _redirect = parseAsURL(redirect)
  const searchParams = 'rslCallback=naver'

  _redirect.search = _redirect.search ? _redirect.search + '&' + searchParams + '&code' : '?' + searchParams

  // naverAuth = `https://nid.naver.com/oauth2.0/authorize?client_id=${naverAppId}&response_type=code&redirect_uri=${encodeURIComponent(_redirect.toString())}&state=${encodeURIComponent(naverStateToken)}`

  naverAuth = `https://nid.naver.com/oauth2.0/authorize?client_id=${naverAppId}&response_type=code&redirect_uri=${encodeURIComponent(_redirect.toString())}&state=RAMDOM_STATE`// ${"RANDOM-STATE"encodeURIComponent(naverStateToken)}`
  // if (getQueryStringValue('code')) {
  //   naverAuthCode = 'code'
  //   console.log(naverAuthCode)
  // }

  if (getQueryStringValue('rslCallback') === 'naver') {
    console.log('naver client secret: ' + naverSecretId)

    getAccessToken()
      .then((accessToken) => {
        naverAccessToken = accessToken
        console.log(naverAccessToken)
        return resolve(naverAccessToken)
      })
      .catch(reject)
  } else {
    return resolve()
  }
})

/**
 * Check if user is logged in to app through GitHub.
 * @see https://developer.github.com/apps/building-integrations/setting-up-and-registering-oauth-apps/about-authorization-options-for-oauth-apps/#redirect-urls
 */
// const checkLogin = (autoLogin = false) => {
//   console.log('체크 로그인 요청')

//   if (autoLogin) {
//     return login()
//   }

//   if (!naverAccessToken && oauth) {
//     return Promise.reject(rslError({
//       provider: 'naver',
//       type: 'access_token',
//       description: 'No access token available',
//       error: null
//     }))
//   }

//   return new Promise((resolve, reject) => {
//     console.log('프로미즈 안')
//     window.fetch(naverAuth, {mode: 'no-cors'})
//       .then((response) => response.json())
//       // .then((json) => {
//       //   naverAuthCode = json.code,
//       //   naverStateToken = json.state
//       // })
//       .then((json) => {
//         if (json.message || json.errors) {
//           return reject(rslError({
//             provider: 'naver',
//             type: 'check_login',
//             description: 'Failed to fetch user data',
//             error: json
//           }))
//         }

//         return resolve(json)
//       })
//       .catch(err => {
//         console.error(err)
//         reject(
//           rslError({
//             provider: 'naver',
//             type: 'check_login',
//             description: 'Failed to fetch user data due to window.fetch() error',
//             error: null
//           })
//         )
//       })
//   })
// }

/**
 * Trigger GitHub login process.
 * This code only triggers login request, response is handled by a callback handled on SDK load.
 * @see https://developer.github.com/apps/building-integrations/setting-up-and-registering-oauth-apps/about-authorization-options-for-oauth-apps
 */
const login = () => new Promise((resolve, reject) => {
  console.log('naver client secret: ' + naverSecretId)
  window.open(naverAuth, '_self')
  console.log('로그인 요청')
  // checkLogin()
  //   .then((response) => resolve(response))
  //   .catch((error) => {
  //     if (!oauth) {
  //       return reject(error)
  //     }

  //     window.open(naverAuth, '_self')
  //   })
})

/**
 * Fake GitHub logout always throwing error.
 */
const logout = () => new Promise((resolve, reject) => reject(rslError({
  provider: 'naver',
  type: 'logout',
  description: 'Cannot logout from naver provider',
  error: null
})))

/**
 * Get access token with authorization code
 * @see https://github.com/prose/gatekeeper
 * @see https://developer.github.com/apps/building-integrations/setting-up-and-registering-oauth-apps/about-authorization-options-for-oauth-apps
 */

const getAccessToken = () => new Promise((resolve, reject) => {
  // const authorizationCode = getQueryStringValue('code')
  console.log('getAccessToke method 접근')

  const naverAuthCode = getQueryStringValue('code')
  const naverStateToken = getQueryStringValue('state')

  if (!naverAuthCode) {
    return reject(new Error('Authorization code not found'))
  }
  // window.fetch(naverAuth, {mode: 'no-cors'})
  console.log('naver app id: ' + naverAppId)
  console.log('naver client secret: ' + naverSecretId)
  console.log('naver auth code: ' + naverAuthCode)
  console.log('naver state token: ' + encodeURIComponent(naverStateToken))

  window.fetch(`https://nid.naver.com/oauth2.0/token?grant_type=authorization_code&client_id=${naverAppId}&client_secret=${naverSecretId}&code=${naverAuthCode}&state=${naverStateToken}`, {mode: 'no-cors'})// ${encodeURIComponent(naverStateToken)}`, {method: 'GET', headers: new Headers(), mode: 'no-cors', cache: 'default'})
    .then((response) => response.json())
    .then((json) => {
      if (json.error || !json.token) {
        return reject(rslError({
          provider: 'naver',
          type: 'access_token',
          description: 'Got error from fetch access token',
          error: json
        }))
      }

      return resolve(json.token)
    })
    .catch((error) => {
      console.error(error)
      return reject(rslError({
        provider: 'naver',
        type: 'access_token',
        description: 'Failed to fetch user data due to window.fetch() error',
        error
      }))
    })
})

/**
 * Helper to generate user account data.
 * @param {Object} viewer
 * @see About token expiration: https://gist.github.com/technoweenie/419219#gistcomment-3232
 */
const generateUser = ({ data: { viewer } }) => {
  return {
    profile: {
      id: viewer.id,
      name: viewer.login,
      firstName: viewer.name,
      lastName: viewer.name,
      email: viewer.email,
      profilePicURL: viewer.avatarUrl
    },
    token: {
      accessToken: naverAccessToken,
      expiresAt: Infinity
    }
  }
}

export default {
  // checkLogin,
  generateUser,
  load,
  login,
  logout
}
