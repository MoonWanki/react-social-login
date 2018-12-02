import Promise from 'bluebird'

import { rslError, parseAsURL } from '../utils'

let _clientId
let _redirect
const load = ({ appId, redirect }) => new Promise((resolve, reject) => {
  _clientId = appId
  _redirect = parseAsURL(redirect)

  if (document.getElementById('my-login-button-target')) {
    return resolve()
  }
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
  resolve()
})

const login = () => new Promise((resolve) => {
  const loginButtonIconId = 'my-login-button-target'
  window.snapKitInit = function () {
    window.snap.loginkit.mountButton(loginButtonIconId, {
      clientId: _clientId,
      redirectURI: _redirect,
      scopeList: [
        'user.display_name',
        'user.bitmoji.avatar'
      ],
      handleResponseCallback: () => {
        window.snap.loginkit.fetchUserInfo()
          .then(data => console.log('User info:', data))
      }
    })
  }
  return resolve()
})

export default {
  load,
  login
}
