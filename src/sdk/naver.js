import Promise from 'bluebird'

// import { rslError } from '../utils'
// import { getQueryStringValue, parseAsURL, rslError } from '../utils'

let naverLogin, email, name, firstName, lastName, id, profilePicURL
/**
 * Fake Github SDK loading (needed to trick RSL into thinking its loaded).
 * @param {string} appId
 * @param {string} redirect
 */
const load = ({ appId, redirect }) => new Promise((resolve, reject) => {
  const firstJS = document.getElementsByTagName('script')[0]
  const js = document.createElement('script')

  js.src = `https://static.nid.naver.com/js/naveridlogin_js_sdk_2.0.0.js`

  js.onload = () => {
    naverLogin = new window.naver.LoginWithNaverId({
      clientId: appId,
      callbackUrl: redirect,
      isPopup: false,
      state: 'state',
      loginButton: {color: 'green', type: 3, height: 60}
    })
    /* (4) 네아로 로그인 정보를 초기화하기 위하여 init을 호출 */
    naverLogin.init()
    /* (4-1) 임의의 링크를 설정해줄 필요가 있는 경우 */
    // $("#gnbLogin").attr("href", naverLogin.generateAuthorizeUrl());

    /* (5) 현재 로그인 상태를 확인 */
    window.addEventListener('load', function () {
      naverLogin.getLoginStatus(function (status) {
        if (status) {
          console.log(status)
          return resolve()
        } else {
          return reject(status)
        }
      })
    })
  }
  if (!firstJS) {
    document.appendChild(js)
  } else {
    firstJS.parentNode.appendChild(js)
  }
})

/**
 * Check if user is logged in to app through GitHub.
 * @see https://developer.github.com/apps/building-integrations/setting-up-and-registering-oauth-apps/about-authorization-options-for-oauth-apps/#redirect-urls
 */
const checkLogin = () => new Promise((resolve, reject) => {
  naverLogin.getLoginStatus(function (status) {
    console.log(status)
    if (status) {
      /* (5) 필수적으로 받아야하는 프로필 정보가 있다면 callback처리 시점에 체크 */
      email = naverLogin.user.getEmail()
      name = naverLogin.user.getNickName()
      firstName = naverLogin.user.getFirstName()
      lastName = naverLogin.user.getLastName()
      id = naverLogin.user.getId()
      profilePicURL = naverLogin.user.getProfileImage()

      // window.location.replace('/')
      return resolve(status)
    } else {
      console.log('callback 처리에 실패하였습니다.')
      return reject(status)
    }
  })
  return resolve()
})

/**
 * Trigger GitHub login process.
 * This code only triggers login request, response is handled by a callback handled on SDK load.
 * @see https://developer.github.com/apps/building-integrations/setting-up-and-registering-oauth-apps/about-authorization-options-for-oauth-apps
 */
// const requestLoginAuth = (naverAuth) => new Promise((resolve, reject) => {
//   open(naverAuth)
//     .then((response) => (response).json())
//     .then((json) => {
//       if (json.state) {
//         if (!json.error) {
//           // getAccessToken()
//           // naver_code = json.code
//           // state = json.state
//           // console.log(naver_code)
//           console.log(state)
//           return resolve(json)
//         } else {
//           return reject(rslError({
//             provide: 'naver',
//             type: 'request_login',
//             description: json.error_description
//           }))
//         }
//       } else {
//         return reject(rslError({
//           provide: 'naver',
//           type: 'request_login',
//           description: 'Failed to fetch user data due to window.fetch() error'
//         }))
//       }
//     })
// })
const login = () => new Promise((resolve, reject) => {
  // setTimeout(() => resolve(), 5000)
  return checkLogin()
    .then(resolve, reject)
})
// const login = () => new Promise((resolve, reject) => {
//   requestLoginAuth(naverAuth)
//     .then(console.log('성공'))
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
// })

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
const generateUser = () => {
  return {
    profile: {
      id: id,
      name: name,
      firstName: firstName,
      lastName: lastName,
      email: email,
      profilePicURL: profilePicURL
    },
    token: {
      // accessToken: access_token,
      expiresAt: Infinity
    }
  }
}

export default {
  checkLogin,
  generateUser,
  load,
  // load,
  // login,
  // logout
  login
}
