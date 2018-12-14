import Promise from 'bluebird'

import { rslError } from '../utils'

let _clientId

const load = ({ appId, redirect }) => new Promise((resolve, reject) => {
  _clientId = appId

  const firstJS = document.getElementsByTagName('script')[0]
  const js = document.createElement('script')
  if (document.getElementById('loginkit-sdk')) {
    return reject(rslError({
      provider: 'snapchat',
      type: 'load',
      description: 'already load Element',
      error: null
    }))
  }
  js.id = 'loginkit-sdk'
  js.src = `https://sdk.snapkit.com/js/v1/login.js`
  firstJS.parentNode.insertBefore(js, firstJS)

  window.snapKitInit = function () {
    window.snap.loginkit.mountButton('my-login-button-target', {
      clientId: _clientId,
      redirectURI: redirect,
      // state: window.snap.loginkit.generateClientState(),
      scopeList: [
        `https://auth.snapchat.com/oauth2/api/user.display_name`,
        `https://auth.snapchat.com/oauth2/api/user.bitmoji.avatar`
      ],
      handleResponseCallback: function (err) {
        console.warn(err)
        window.snap.loginkit.fetchUserInfo()
          .then(data => {
            console.log(data)
          })
          .catch(e => {
            console.log(e)
          })
      }
      // handleAuthGrantFlowCallback: () => {
      //   console.log(window.snap.loginkit.generateClientState())
      //   console.log(window.snap.loginkit.generateCodeVerifierCodeChallenge())
      // }
    })
  }
  return resolve()
})

const checkLogin = (autoLogin) => {
  if (autoLogin) return login()
  return Promise.reject(rslError({
    provider: 'snapchat',
    type: 'check_login',
    description: '--',
    error: null
  }))
}

const login = () => new Promise((resolve) => {
  checkLogin()
  return resolve()
})
// const generateUser = () => new Promise(() => {
//   return resolve()
// })

const logout = () => new Promise((resolve) => {
  return resolve()
})

export default {
  load,
  // generateUser,
  checkLogin,
  logout,
  login
}
