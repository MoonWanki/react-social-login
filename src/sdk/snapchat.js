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
      scopeList: [
        `https://auth.snapchat.com/oauth2/api/user.display_name`,
        `https://auth.snapchat.com/oauth2/api/user.bitmoji.avatar`
      ],

      handleResponseCallback: function (err) {
        console.log(err)
        let d = window.snap.loginkit.generateClientState()
        console.log(d)
        window.snap.loginkit.fetchUserInfo()
          .then((data) => {
            console.log(data)
            return resolve(data)
          }, err => console.log(err))
      }

      // handleAuthGrantFlowCallback: () => {
      //   console.log(window.snap.loginkit.generateClientState())
      //   console.log(window.snap.loginkit.generateCodeVerifierCodeChallenge())
      // }
    })
  }
})

const checkLogin = () => new Promise((resolve, reject) => {

})

const login = () => new Promise((resolve, reject) => {

})

const generateUser = () => new Promise((resolve, reject) => {
  return resolve()
})

const logout = () => new Promise((resolve, reject) => {
  resolve()
})

export default {
  load,
  generateUser,
  checkLogin,
  logout,
  login
}
