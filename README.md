
# Extension for [React Social Login](https://github.com/deepakaggarwal7/react-social-login) library
![titleimg](/sample.png) 

Name | Position  
---|---
:swimmer: Park Jinyong (Media 13) | NAVER button
:alien: Moon Wanki (Media 13) | Yahoo! button
:skull: Song Chiwan (Media 14) | kakao button
:kiss: Um Taegyeong (Media 13) | Snapchat button

## Demo  
[여기](https://opensw.octopusfantasy.com/)에서 데모 페이지를 확인할 수 있습니다.  

## Features  

[React Social Login](https://github.com/deepakaggarwal7/react-social-login)  
위 라이브러리는 대규모 SNS 업체가 제공하는 소셜 로그인 API (Google+, Facebook, Amazon, Instagram, GitHub, LinkedIn)가 자체 내장되어 ReactJS 컴포넌트로 사용가능한 버튼을 제공하는 라이브러리입니다.  

우리는 이 라이브러리를 확장하여 현재 지원하고 있지 않은 Snapchat, Yahoo!, Naver, Kakao 로그인도 추가로 지원하게 하여 라이브러리가 지원하는 공급자의 폭을 늘립니다.
  
최근 웹 개발 생태계에서 ReactJS가 큰 영향을 끼치고 있습다. 그에 따라 이와 같은 ReactJS를 위한 보조 라이브러리들이 오픈소스로 많이 개발되고 있으며 다양한 개발자들이 협업하고 있습니다. 우리도 이들과 함께 오픈소스 라이브러리 개발에 참여함으로써 개발자로서의 협업 경험을 쌓고 개발 역량을 키우는 좋은 기회로 삼고자 합니다.

## Usage

```
npm install --save react-social-login
```
  
본 라이브러리는 컴포넌트가 아닌 함수 형태로 제공됩니다.  
평범한 버튼 컴포넌트를 파라미터로 넣어주면 소셜 로그인 기능이 적용되어 리턴됩니다.  
예를 들면, 다음과 같이 버튼을 구성할 수 있습니다.


**SocialButton.js**

```js
import React from 'react'
import SocialLogin from 'react-social-login'

const Button = ({ children, triggerLogin, ...props }) => (
  <button onClick={triggerLogin} {...props}>
    { children }
  </button>
)

export default SocialLogin(Button)
```

그리고 이를 다음과 같이 실제 로그인 버튼이 쓰일 곳에 사용하면 됩니다.  

**index.js**

```js
import React from 'react'
import ReactDOM from 'react-dom'

import SocialButton from './SocialButton'

const handleSocialLogin = (user) => {
  console.log(user)
}

const handleSocialLoginFailure = (err) => {
  console.error(err)
}

ReactDOM.render(
  <div>
    <SocialButton
      provider='facebook'
      appId='YOUR_APP_ID'
      onLoginSuccess={handleSocialLogin}
      onLoginFailure={handleSocialLoginFailure}
    >
      Login with Facebook
    </SocialButton>
  </div>,
  document.getElementById('app')
)
```
  
## Props

컴포넌트는 다음과 같은 props들을 취할 수 있습니다.

| Prop  | Default  | Type / Values  | Description  |
|---|---|---|---|
| appId  | —  | string  | Your app identifier (see [find my appId][findmyappid])  |
| autoCleanUri  | false  | boolean  | Enable auto URI cleaning with OAuth callbacks  |
| autoLogin  | false  | boolean  | Enable auto login on `componentDidMount`  |
| gatekeeper  | —  | string  | Gatekeeper URL to use for GitHub OAuth support (see [GitHub specifics][githubspecifics])  |
| getInstance  | —  | function  | Return node ref like `ref` function would normally do ([react known issue](https://github.com/facebook/react/issues/4213))  |
| onLoginFailure  | —  | function  | Callback on login fail  |
| onLoginSuccess  | —  | function  | Callback on login success  |
| onLogoutFailure  | —  | function  | Callback on logout fail (`google` only)  |
| onLogoutSuccess  | —  | function  | Callback on logout success  |
| provider  | —  | `amazon`, `facebook`, `github`, `google`, `instagram`, `linkedin`  | Social provider to use  |
| redirect  | -  | string  | URL to redirect after login (available for `github` and `instagram` only)  |
| scope  | -  | array, string  | An array or string of scopes to be granted on login.  |
| any other prop  | —  | —  | Any other prop will be forwarded to your component  |



## Original project
- **React Social Login** | https://github.com/deepakaggarwal7/react-social-login  
React Social Login is an HOC which provides social login through multiple providers.  

## References
- **ReactJS** | https://reactjs.org  
No.1 Front-end library in 2018, ReactJS.  

- **Bluebird** | http://bluebirdjs.com  
Bluebird is a fully featured promise library with focus on innovative features and performance    

## Social login providers
- **Snapchat** | https://docs.snapchat.com/docs/  
- **Yahoo!** | https://developer.yahoo.com  
- **NAVER** | https://developers.naver.com  
- **kakao** | https://developers.kakao.com  