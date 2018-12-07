import Promise from 'bluebird'
// import { rslError, timestampFromNow, parseAsURL } from '../utils'
import { parseAsURL } from '../utils'

var secureRandom = require('secure-random')

// let naverScopes = [ 'response_type', 'redirect_uri', 'state' ]

// let oauth = false
// let gatekeeperURL
// let githubAccessToken
// let githubAppId
let naverAuth
let stateToken

/**
 * Loads naver SDK.
 * @param {string} appId
 * @param {array|string} scope
 * @see https://developers.naver.com/docs/login/web/#2--javascript%EB%A1%9C-%EB%84%A4%EC%9D%B4%EB%B2%84-%EC%95%84%EC%9D%B4%EB%94%94%EB%A1%9C-%EB%A1%9C%EA%B7%B8%EC%9D%B8-%EC%A0%81%EC%9A%A9%ED%95%98%EA%B8%B0
 */

let generateState = () => {
  secureRandom(44).toString(32)
}

stateToken = generateState()

const load = ({ appId, redirect, scope }) => new Promise((resolve) => {
  const _redirect = parseAsURL(redirect)

  // @TODO: handle errors
  if (document.getElementById('naverIdLogin')) {
    return resolve()
  }

  const firstJS = document.getElementsByTagName('script')[ 0 ]
  const js = document.createElement('script')

  js.src = '//static.nid.naver.com/js/naveridlogin_js_sdk_2.0.0.js'
  js.id = 'naverIdLogin'
  js.type = 'text/javascript'

  // window.naverInit = function(){
  // }
  // window.naverAsyncInit = () => {
  //   var naverLogin = new window.naver.LoginWithNaverId(
  //     {
  //       clientId: appId,
  //       callbackUrl: redirectUri,
  //       isPopup: true, /* 팝업을 통한 연동처리 여부 */
  //       loginButton: {color: 'green', type: 3, height: 60} /* 로그인 버튼의 타입을 지정 */
  //     })
  //   naverLogin.init()
  //   return resolve()
  // }
  js.onload = () => {
    var naverLogin = new window.naver.LoginWithNaverId(
      {
        clientId: appId,
        callbackUrl: redirect,
        isPopup: true, /* 팝업을 통한 연동처리 여부 */
        loginButton: {color: 'green', type: 3, height: 60} /* 로그인 버튼의 타입을 지정 */
      })
    naverLogin.init()

    naverAuth = `https://nid.naver.com/oauth2.0/authorize?response_type=code&client_id=${appId}&redirect_uri=${encodeURIComponent(_redirect.toString())}&state=${encodeURIComponent(stateToken)}`
    // 이게 뭘까
    // window.addEventListener('load', function () {
    //   naverLogin.getLoginStatus(function (status) {
    //     if (status) {
    //       /* (5) 필수적으로 받아야하는 프로필 정보가 있다면 callback처리 시점에 체크 */
    //       var email = naverLogin.user.getEmail()
    //       if (email === undefined || email == null) {
    //         alert('이메일은 필수정보입니다. 정보제공을 동의해주세요.')
    //         /* (5-1) 사용자 정보 재동의를 위하여 다시 네아로 동의페이지로 이동함 */
    //         naverLogin.reprompt()
    //         return
    //       }
    //       // callback으로 돌아가기
    //       window.location.replace('http://' + window.location.hostname + ((location.port === '' || location.port === undefined) ? ':' : '' + location.port) + '/sample/main.html')
    //     } else {
    //       console.log('callback 처리에 실패하였습니다.')
    //     }
    //   })
    // })
    return resolve()
  }

  // var naverLogin = new window.naver.LoginWithNaverId(
  //   {
  //     clientId: appId,
  //     callbackUrl: redirectUri,
  //     isPopup: true, /* 팝업을 통한 연동처리 여부 */
  //     loginButton: {color: 'green', type: 3, height: 60} /* 로그인 버튼의 타입을 지정 */
  //   })
  // naverLogin.init()
  // return resolve()

  if (!firstJS) {
    document.appendChild(js)
  } else {
    firstJS.parentNode.appendChild(js)
  }
})

/**
 * Checks if user is logged in to app through Amazon.
 * Requires SDK to be loaded first.
 * @see https://developer.amazon.com/public/apis/engage/login-with-amazon/docs/javascript_sdk_reference.html#authorize
 */
// const checkLogin = () => new Promise((resolve, reject) => {
//   window.amazon.Login.authorize({ scope: naverScopes }, (response) => {
//     if (response.error) {
//       return reject(rslError({
//         provider: 'amazon',
//         type: 'auth',
//         description: 'Authentication failed',
//         error: response
//       }))
//     }

//     return getProfile(response).then(resolve, reject)
//   })
// })

/**
 * Trigger naver login process.
 * Requires SDK to be loaded first.
 */
const login = () => new Promise((resolve, reject) => {
  window.open(naverAuth)
  // const GoogleAuth = window.gapi.auth2.getAuthInstance()

  // GoogleAuth.signIn().then(
  //   () => checkLogin().then(resolve, reject),
  //   (err) => reject(rslError({
  //     provider: 'google',
  //     type: 'auth',
  //     description: 'Authentication failed',
  //     error: err
  //   }))
  // )
})

/**
 * Trigger Amazon logout.
 * Requires SDK to be loaded first.
 * @see https://developer.amazon.com/docs/login-with-amazon/javascript-sdk-reference.html#logout
 */
// const logout = () => new Promise((resolve) => {
//   window.amazon.Login.logout()

//   return resolve()
// })

/**
 * Gets currently logged in user profile data.
 * Requires SDK to be loaded first.
 * @see https://developer.amazon.com/public/apis/engage/login-with-amazon/docs/javascript_sdk_reference.html#retrieveProfile
 */
// const getProfile = (authResponse) => new Promise((resolve, reject) => {
//   //naver status
//   window.naverLogin.getLoginStatus(function (status) {
//     if (status) {
//       var email = window.naverLogin.user.getEmail()
//       var name = window.naverLogin.user.getNickName()
//       var profileImage = window.naverLogin.user.getProfileImage()
//       var birthday = window.naverLogin.user.getBirthday()
//       var uniqId = window.naverLogin.user.getId()
//       var age = window.naverLogin.user.getAge()
//     } else {
//       console.log('AccessToken이 올바르지 않습니다.')
//     }
//   })

// window.amazon.Login.retrieveProfile(authResponse.access_token, (response) => {
//   if (response.error) {
//     return reject(rslError({
//       provider: 'amazon',
//       type: 'get_profile',
//       description: 'Failed to get user profile',
//       error: response
//     }))
//   }

//   return resolve({ ...authResponse, ...response })
// })
// })

/**
 * Helper to generate user account data.
 * @param {Object} response
 * @see https://developer.amazon.com/public/apis/engage/login-with-amazon/docs/javascript_sdk_reference.html#retrieveProfile
 */
// const generateUser = (response) => ({
//   profile: {

//     email = window.naverLogin.user.getEmail(),
//     name = window.naverLogin.user.getNickName(),
//     profileImage = window.naverLogin.user.getProfileImage(),
//     birthday = window.naverLogin.user.getBirthday(),
//     uniqId = window.naverLogin.user.getId(),
//     age = window.naverLogin.user.getAge()
//     // id: response.id,
//     // name: response.name,
//     // firstName: response.name,
//     // lastName: response.name,
//     // email: response.email,
//     // profilePicURL: response.profile_image,
//     // nickname: response.nickname,
//     // age: response.age,
//     // gender: response.gender,
//     // birthday: response.birthday
//   },
//   token: {
//     accessToken: response.access_token,
//     expiresAt: timestampFromNow(response.expires_in)
//   }
// })

export default {
  // checkLogin,
  // generateUser,
  load,
  login
  // logout
}
