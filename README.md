
# Extension for [React Social Login](https://github.com/deepakaggarwal7/react-social-login) library
![titleimg](/sample.png) 

Name | Position  
---|---
:swimmer: Park Jinyong (Media 13) | NAVER button
:alien: Moon Wanki (Media 13) | Yahoo! button
:skull: Song Chiwan (Media 14) | kakao button
:kiss: Um Taegyeong (Media 13) | Snapchat button
  
## Features  

[React Social Login](https://github.com/deepakaggarwal7/react-social-login)  
위 라이브러리는 일부 업체(구글+, 페이스북, 아마존, 인스타그램, 깃허브, 링크드인) 소셜 로그인 API가 적용된 React 버튼 컴포넌트로 사용할 수 있는 환경을 제공하는 라이브러리이다.  

우리는 위의 프로젝트를 FORK 하여 현재 제공하고 있지 않은 스냅챗 (이전 트위터), 야후 (이전 마이크로소프트), 네이버, 카카오 소셜 로그인을 추가하여 지원하는 소셜 로그인 환경을 확장한다.  

또한, [React Social Login Buttons](https://github.com/MichalSzorad/react-social-login-buttons) 라이브러리를 자체 적용시켜 버튼 디자인을 동시에 제공함으로써 별도의 버튼 이미지를 불러올 필요를 없앤다.  

이를 통해 기존보다 다양한 소셜 로그인 기능을 갖춘 React components를 제공할 수 있게되며  
소셜 로그인 API 연동이 필요한 React 개발자들은 별도의 API 적용 작업 없이 단순한 컴포넌트 import를 통해 사용할 수 있게 된다.  
  
## Background  
최근 리액트JS를 활용한 어플리케이션들이 늘어나고 있다. 그에 따라 리액트 생태계가 넓어지면서 많은 오픈소스 라이브러리가 생겨나고 있어 웹어플리케이션을 제작하는데 있어 기존의 소셜로그인 기능을 리액트를 통해서 사용하고자 하는 일이 많아질 것으로 예상된다. 이를 통해서 리액트를 이용하는 SW 개발자들에게 로그인 라이브러리를 제공하여 간편하게 기능을 구현할 수 있도록 하고자 한다.  

## Usage

Create the component of your choice and transform it into a SocialLogin component.

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

Then, use it like a normal component.

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

Raw component props (before transform):

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

*Note about `redirect`: if you are redirecting on root (eg: https://localhost:8080), you **have** to omit the trailing slash.*

Transformed component props:

| Prop  | Type  | Description  |
|---|---|---|
| triggerLogin  | function  | Function to trigger login process, usually attached to an event listener  |
| triggerLogout  | function  | Function to trigger logout process, usually attached to a container handling login state  |
| all your props  | —  | All props from your original component, minus SocialLogin specific props  |

## Logout

To implement logout, we need a container handling login state and triggering logout function from a `ref` to `SocialLogin` component.

As it is implemented in the demo, we have two components working together to trigger logout:

 * [`Demo` container][democontainer]
 * [`UserCard` component][usercardcomponent]
 
Here is how they work together:

 1. [`Demo` is displaying `UserCard` only if user is logged][logoutstep1]
 2. [`UserCard` gets forwarded a `logout` function][logoutstep2]
 3. [`UserCard` calls forwarded `logout` prop on click on the logout button][logoutstep3]
 4. [`logout` function triggers `triggerLogout` prop from a ref to SocialLogin component][logoutstep4]

## Old component support

We decided to keep the old behavior as a fallback, it only supports `facebook`, `google` and `linkedin` providers and is available as a named export:

```js
import React from 'react'
import ReactDOM from 'react-dom'
import { OldSocialLogin as SocialLogin } from 'react-social-login'

const handleSocialLogin = (user, err) => {
  console.log(user)
  console.log(err)
}

ReactDOM.render(
  <div>
    <SocialLogin
      provider='facebook'
      appId='YOUR_APP_ID'
      callback={handleSocialLogin}
    >
      <button>Login with Google</button>
    </SocialLogin>
  </div>,
  document.getElementById('app')
)
```  
## Improvement
![titleimg](/improve.png)  
기존의 facebook, google, instagram, linkedin, amazon 만 있던 프로젝트에서 Naver, Kakao, Yahoo, Snapchat 의 로그인을 추가하였다.

## New Demo page
[react-social-login-demo](http://git.ajou.ac.kr/open-source-SW-2018-fall/react-social-login-demo)  
기존의 서비스에 추가한 서비스를 제공하는 데모 페이지를 제작하였다.  
혹은 이 [Link](https://opensw.octopusfantasy.com/) 를 통해서 확인가능하다.  
이 링크에서 데모서비스 사용과 코드의 샘플을 볼 수 있다.  

## Forked project
- **React Social Login** | https://github.com/deepakaggarwal7/react-social-login  
React Social Login is an HOC which provides social login through multiple providers.  

## Integrate with
- **React Social Login Buttons** | https://github.com/MichalSzorad/react-social-login-buttons  
A simple package to display social login buttons using React.  

## References
- **ReactJS** | https://reactjs.org  
No.1 Front-end library in 2018, ReactJS.  

- **Bluebird** | http://bluebirdjs.com  
Bluebird is a fully featured promise library with focus on innovative features and performance    

## Social login APIs
- **Snapchat** | https://docs.snapchat.com/docs/  
- **Yahoo!** | https://developer.yahoo.com/?guccounter=1  
- **NAVER** | https://developers.naver.com  
- **kakao** | https://developers.kakao.com  

## After...
버튼 Component에 해당 버튼의 속성(크키 등)을 props를 통해 제어할 수 있는 기능을 추가한다.