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
      redirectURI: _redirect.toString(),
      scopeList: [
        'https://auth.snapchat.com/oauth2/api/user.display_name',
        'https://auth.snapchat.com/oauth2/api/user.bitmoji.avatar'
      ],
      handleResponseCallback: () => {
        window.snap.loginkit.fetchUserInfo()
          .then((data) => {
            return resolve(data)
          })
          .catch((err) => {
            console.log(err)
            return reject(rslError({
              provider: 'snapchat',
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
