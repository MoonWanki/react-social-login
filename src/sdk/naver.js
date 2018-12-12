import Promise from 'bluebird'

import { rslError } from '../utils'
// import { getQueryStringValue, parseAsURL, rslError } from '../utils'

// let client_id = appId
// var client_secret
let state = 'RANDOM_STATE'
let naverAuth
// let naver_code
// let redirectURI = encodeURI(redirect)
// let api_url =""
// Load fetch polyfill for browsers not supporting fetch API
// if (typeof window !== 'undefined' && !window.fetch) {
//   require('whatwg-fetch')
// }

/**
 * Fake Github SDK loading (needed to trick RSL into thinking its loaded).
 * @param {string} appId
 * @param {string} redirect
 */
const load = ({ appId, redirect, secretid }) => new Promise((resolve, reject) => {
  var clientId = appId
  let redirectURI = redirect
  naverAuth = 'https://nid.naver.com/oauth2.0/authorize?response_type=code&client_id=' + clientId + '&redirect_uri=' + encodeURI(redirectURI) + '&state=' + state
  // client_secret = secretid
  return resolve()
})

/**
 * Check if user is logged in to app through GitHub.
 * @see https://developer.github.com/apps/building-integrations/setting-up-and-registering-oauth-apps/about-authorization-options-for-oauth-apps/#redirect-urls
 */
// const checkLogin = (autoLogin = false) => {
//     console.log('checkLogin started')
//     if (autoLogin) return login()
//     if (!naverAccessToken) {
//       return Promise.reject(rslError({
//         provider: 'naver',
//         type: 'access_token',
//         description: 'No access token available',
//         error: null
//       }))
//     }
//     return new Promise((resolve, reject) => {
//       fetch('https://nid.naver.com/oauth2.0/token?grant_type=authorization_code&client_id='
//       + client_id + '&client_secret=' + client_secret + '&redirect_uri=' + redirectURI + '&code=' + code + '&state=' + state, { headers: { Authorization: `Bearer ${yahooAccessToken}` } })
//         .then(res => res.json())
//         .then(json => {
//           if (json.meta.code !== 200) {
//             return reject(rslError({
//               provider: 'yahoo',
//               type: 'check_login',
//               description: 'Failed to fetch user data',
//               error: json.meta
//             }))
//           }
//           resolve({ data: json.data, accessToken: yahooAccessToken })
//         })
//     })
// }

/**
 * Trigger GitHub login process.
 * This code only triggers login request, response is handled by a callback handled on SDK load.
 * @see https://developer.github.com/apps/building-integrations/setting-up-and-registering-oauth-apps/about-authorization-options-for-oauth-apps
 */
const requestLoginAuth = (naverAuth) => new Promise((resolve, reject) => {
  open(naverAuth)
    .then((response) => (response).json())
    .then((json) => {
      if (json.state) {
        if (!json.error) {
          // getAccessToken()
          // naver_code = json.code
          // state = json.state
          // console.log(naver_code)
          console.log(state)
          return resolve(json)
        } else {
          return reject(rslError({
            provide: 'naver',
            type: 'request_login',
            description: json.error_description
          }))
        }
      } else {
        return reject(rslError({
          provide: 'naver',
          type: 'request_login',
          description: 'Failed to fetch user data due to window.fetch() error'
        }))
      }
    })
})
const login = () => new Promise((resolve, reject) => {
  requestLoginAuth(naverAuth)
    .then(console.log('성공'))
    // .then(getAccessToken())
    // if(window.open(naverAuth, '_self')){
    //     resolve(response.json())
    // }
    // .then((response) => response.json())
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
//   checkLogin()
//     .then((response) => resolve(response))
//     .catch((err) => {
//       if (!err.fetchErr) {
//         window.open(naverAuth, '_self')
//       } else {
//           return reject(err, err)
//       }
//     })
})

/**
 * Fake GitHub logout always throwing error.
 */
// const logout = () => new Promise((resolve, reject) => reject(rslError({
//   provider: 'naver',
//   type: 'logout',
//   description: 'Cannot logout from naver provider',
//   error: null
// })))

// /**
//  * Get access token with authorization code
//  * @see https://github.com/prose/gatekeeper
//  * @see https://developer.github.com/apps/building-integrations/setting-up-and-registering-oauth-apps/about-authorization-options-for-oauth-apps
//  */

// const getAccessToken = () => new Promise((resolve, reject) => {
//   // const authorizationCode = getQueryStringValue('code')
//   console.log('getAccessToke method 접근')

//   const naverAuthCode = getQueryStringValue('code')
//   const naverStateToken = getQueryStringValue('state')

//   if (!naverAuthCode) {
//     return reject(new Error('Authorization code not found'))
//   }
//   // window.fetch(naverAuth, {mode: 'no-cors'})
//   console.log('naver app id: ' + naverAppId)
//   console.log('naver client secret: ' + naverSecretId)
//   console.log('naver auth code: ' + naverAuthCode)
//   console.log('naver state token: ' + encodeURIComponent(naverStateToken))

//   window.fetch(`https://nid.naver.com/oauth2.0/token?grant_type=authorization_code&client_id=${naverAppId}&client_secret=${naverSecretId}&code=${naverAuthCode}&state=${naverStateToken}`, { header: {Authorization: `Bearer` ${}]mode: 'no-cors'})// ${encodeURIComponent(naverStateToken)}`, {method: 'GET', headers: new Headers(), mode: 'no-cors', cache: 'default'})
//     .then((response) => console.log(response)) //, response.json())
//     // .then((json) => {
//     //   if (json.error || !json.token) {
//     //     return reject(rslError({
//     //       provider: 'naver',
//     //       type: 'access_token',
//     //       description: 'Got error from fetch access token',
//     //       error: json
//     //     }))
//     //   }

//     //   return resolve(json.token)
//     // })
//     .catch((error) => {
//       console.error(error)
//       return reject(rslError({
//         provider: 'naver',
//         type: 'access_token',
//         description: 'Failed to fetch user data due to window.fetch() error',
//         error
//       }))
//     })
// })

// /**
//  * Helper to generate user account data.
//  * @param {Object} viewer
//  * @see About token expiration: https://gist.github.com/technoweenie/419219#gistcomment-3232
//  */
// const generateUser = ({ data: { viewer } }) => {
//   return {
//     profile: {
//       id: viewer.id,
//       name: viewer.login,
//       firstName: viewer.name,
//       lastName: viewer.name,
//       email: viewer.email,
//       profilePicURL: viewer.avatarUrl
//     },
//     token: {
//       accessToken: naverAccessToken,
//       expiresAt: Infinity
//     }
//   }
// }

export default {
  // checkLogin,
//   generateUser,
//   load,
//   login,
//   logout
  load,
  login
}
