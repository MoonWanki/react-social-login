import Promise from 'bluebird'

import { rslError, parseAsURL } from '../utils'

let _clientId
let _redirect

const load = ({ appId, redirect }) => new Promise((resolve, reject) => {
  _clientId = appId
  _redirect = parseAsURL(redirect)

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
      /*
      handleAuthGrantFlowCallback: () => {
        window.snap.loginkit.getSharedDataAccessToken()
          .then((token) => {
            console.log(token)
            return resolve(token)
          })
      },
      */
      redirectURI: _redirect.toString(),
      scopeList: [
        `user.display_name`,
        `user.bitmoji.avatar`
      ],
      handleResponseCallback: () => {
        /*
        window.snap.getSharedDataAccessToken()
          .then((data) => {
            console.log(data)
            return resolve(data)
          })
        */
        window.snap.loginkit.fetchUserInfo()
          .then((data) => {
            console.log(data)
            return resolve(data)
          })
      }
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
