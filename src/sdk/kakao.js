// import Promise from 'bluebird'
// import { rslError } from '../utils'

// const load = ({ appId }) => new Promise((resolve) => {
//   // @TODO: handle errors
//   if (document.getElementById('kakao-login-btn')) {
//     return resolve()
//   }

//   const firstJS = document.getElementsByTagName('script')[0]
//   const js = document.createElement('script')

//   js.src = '//developers.kakao.com/sdk/js/kakao.min.js'
//   js.id = 'kakao-login-btn'

//   js.onload = () => {
//     window.Kakao.init(appId)

//     return resolve()
//   }

//   if (!firstJS) {
//     document.appendChild(js)
//   } else {
//     firstJS.parentNode.appendChild(js)
//   }
// })

// const checkLogin = () => new Promise((resolve, reject) => {
//   if (!window.IN.User.isAuthorized()) {
//     return reject(rslError({
//       provider: 'kakao',
//       type: 'check_login',
//       description: 'Not authenticated',
//       error: null
//     }))
//   }

//   return getProfile().then(resolve, reject)
// })

/**
   * Trigger LinkedIn login popup.
   * Requires SDK to be loaded first.
   * @see https://developers.kakao.com/docs/js/kakaologin
   */

// const checkLogin = () => new Promise((resolve, reject) => {
//   if (!window.IN.User.isAuthorized()) {
//     return reject(rslError({
//       provider: 'kakao',
//       type: 'check_login',
//       description: 'Not authenticated',
//       error: null
//     }))
//   }// return getProfile().then(resolve, reject)
// })

// const login = () => new Promise((resolve, reject) => {
//   // 로그인 창을 띄웁니다.
//   // window.IN.User.authorize(() => checkLogin()
//   //   // .then(getProfile)
//   //   .then(resolve)
//   //   .catch(reject))
//   // window.Kakao.init('4362604e902c8262f104bcbcc38ee9cb')
//   window.Kakao.Auth.createLoginButton({
//     container: '',
//     success: function (authObj) {
//       alert(JSON.stringify(authObj))
//     },
//     fail: function (err) {
//       alert(JSON.stringify(err))
//     }
//   })
// window.window.Kakao.Auth.login({
//   success: function (authObj) {
//     alert(JSON.stringify(authObj))
//   },
//   fail: function (err) {
//     alert(JSON.stringify(err))
//   }
// })

/**
   * Triggers logout process.
   */
/* logout () {
  if (this.state.isLoaded && this.state.isConnected) {
      this.sdk.logout().then(this.onLogoutSuccess, this.onLogoutFailure)
    } else if (this.state.isLoaded && !this.state.isConnected) {
      this.props.onLoginFailure('User not connected')
    } else {
      this.props.onLoginFailure('SDK not loaded')
    }
  } */

/* const logout = () => new Promise((resolve) => {
    window.IN.User.logout(resolve)
  })
*/
// })

// const getProfile = () => new Promise((resolve, reject) => {
//   window.IN.API.Profile('me').fields([
//     'id',
//     'firstName',
//     'lastName',
//     'pictureUrl',
//     'publicProfileUrl',
//     'emailAddress'
//   ]).result(resolve).error((err) => reject(rslError({
//     provider: 'kakao',
//     type: 'get_profile',
//     description: 'Failed to get user profile',
//     error: err
//   })))
// })

// var ret = window.open('https://kauth.kakao.com/oauth/authorize',_blank,channelmode=yes|no|1|0,false)

// GET /oauth/authorize?client_id={'885ff360b748f666fa5affe576505b3d'}&redirect_uri={'https://www.naver.com/kakao_oauth'}&response_type=code HTTP/1.1
// Host: kauth.kakao.com

// //get user token
// POST /oauth/token HTTP/1.1
// Host: kauth.kakao.com

//  //logout request
//  POST /v1/user/logout HTTP/1.1
// Host: kapi.kakao.com
// Authorization: Bearer {access_token}

// curl -v -X POST https://kapi.kakao.com/v1/user/logout \
//   -H "Authorization: Bearer xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"

// //link to app
// POST /v1/user/signup HTTP/1.1
// Host: kapi.kakao.com
// Authorization: Bearer {access_token}
// Content-Type: application/x-www-form-urlencoded;charset=utf-8

// curl -v -X POST https://kapi.kakao.com/v1/user/signup \
//   -H "Authorization: Bearer xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx" \
//   --data-urlencode 'properties={"age":"23", "gender":"female"}'

//   //break link to app
//   POST /v1/user/unlink HTTP/1.1
//   Host: kapi.kakao.com
//   Authorization: Bearer {access_token}

//   POST /v1/user/unlink HTTP/1.1
// Host: kapi.kakao.com
// Authorization: KakaoAK {admin_key}

// curl -v -X POST https://kapi.kakao.com/v1/user/unlink \
//   -H "Authorization: Bearer xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"

//   curl -v -X POST https://kapi.kakao.com/v1/user/unlink \
//   -H "Authorization: KakaoAK kkkkkkkkkkkkkkkkkkkkkkkkkkkkkk" \
//   -d 'target_id_type=user_id&target_id=123456789'

//   //request user info
//   GET/POST /v2/user/me HTTP/1.1
// Host: kapi.kakao.com
// Authorization: Bearer {access_token}
// Content-type: application/x-www-form-urlencoded;charset=utf-8

// GET/POST /v2/user/me HTTP/1.1
// Host: kapi.kakao.com
// Authorization: KakaoAK {admin_key}
// Content-type: application/x-www-form-urlencoded;charset=utf-8

// //get all info
// curl -v -X GET https://kapi.kakao.com/v2/user/me \
//   -H "Authorization: Bearer xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
// export default {
//   checkLogin,
//   load,
//   login
// }

// window.open('https://kauth.kakao.com/oauth/authorize')
import Promise from 'bluebird'

import { rslError, parseAsURL } from '../utils'

let _clientId
let _redirect

const load = ({ appId, redirect }) => new Promise((resolve, reject) => {
  _clientId = appId
  _redirect = parseAsURL(redirect)

  const firstJS = document.getElementsByTagName('script')[0]
  const js = document.createElement('script')
  if (document.getElementById('kakao-login-btn')) {
    return reject(rslError({
      provider: 'kakao',
      type: 'load',
      description: 'already load Element',
      error: null
    }))
  }
  js.id = 'kakao-login-btn'
  js.src = `//developers.kakao.com/sdk/js/kakao.min.js`
  firstJS.parentNode.insertBefore(js, firstJS)

  window.kakaoKitInit = function () {
    window.kakao.loginkit.mountButton('my-login-button-target', {
      clientId: _clientId,
      redirectURI: _redirect.toString(),
      scopeList: [
        'https://auth.kakao.com/oauth2/api/user.display_name',
        'https://auth.kakao.com/oauth2/api/user.bitmoji.avatar'
      ],
      handleResponseCallback: () => {
        window.kakao.loginkit.fetchUserInfo()
          .then((data) => {
            return resolve(data)
          })
          .catch((err) => {
            console.log(err)
            return reject(rslError({
              provider: 'kakao',
              type: 'load',
              description: 'not fetch user',
              error: null
            }))
          })
      }
    })
  }
})

const login = () => new Promise((resolve, reject) => {

})

const generateUser = () => new Promise((resolve, reject) => {
  return resolve()
})

export default {
  load,
  generateUser,
  login
}
