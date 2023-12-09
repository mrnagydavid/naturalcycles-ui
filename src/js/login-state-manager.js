import { auth, onAuthStateChanged, signInWithPhoneNumber, RecaptchaVerifier } from './auth.js'

export { onLoggedIn, onLoggedOut, login, logout, verifySMSCode }

let loaded = false
const callbacksForLoggedIn = []
const callbacksForLoggedOut = []

if (!loaded) {
  onAuthStateChanged(auth, (user) => {
    if (user) {
      handleLoggedIn(user)
    } else {
      handleLoggedOut()
    }
  })

  loaded = true
}

function login(phoneNumber) {
  return new Promise((resolve, reject) => {
    if (window.recaptchaVerifier) {
      window.recaptchaVerifier.clear()
    }

    window.recaptchaVerifier = new RecaptchaVerifier(auth, 'recaptcha-container', {
      size: 'normal',
      callback: async function (_token) {
        console.debug('Recaptcha verified.')
        signInWithPhoneNumber(auth, phoneNumber, window.recaptchaVerifier)
          .then((confirmationResult) => {
            console.debug('Confirmation result received.')
            console.log(confirmationResult)
            window.confirmationResult = confirmationResult
            resolve()
          })
          .catch((error) => {
            console.error(error)
            reject(error)
          })
      },
      'expired-callback': () => {
        console.debug('Recaptcha expired.')
        reject('Recaptcha expired.')
      }
    })

    window.recaptchaVerifier.render()
  })
}

async function verifySMSCode(code) {
  try {
    await window.confirmationResult.confirm(code)
    console.debug('Credential received.')
    cleanUpRecaptchaItems()
    return true
  } catch (error) {
    if (
      error.code === 'auth/invalid-verification-code' ||
      error.code === 'auth/missing-verification-code'
    ) {
      return false
    } else {
      throw error
    }
  }
}

function logout() {
  auth.signOut()
}

function isLoggedIn() {
  return auth.currentUser !== null
}

function isLoggedOut() {
  return !isLoggedIn()
}

function onLoggedIn(callback) {
  callbacksForLoggedIn.push(callback)
  if (isLoggedIn()) {
    callback(auth.currentUser)
  }
}

function onLoggedOut(callback) {
  callbacksForLoggedOut.push(callback)
  if (isLoggedOut()) {
    callback()
  }
}

function handleLoggedIn(user) {
  console.debug('Logged in.')
  console.debug(user.uid)
  callbacksForLoggedIn.forEach((callback) => callback(user))
}

function handleLoggedOut() {
  console.debug('Logged out.')
  callbacksForLoggedOut.forEach((callback) => callback())
}

function cleanUpRecaptchaItems() {
  if (window.recaptchaVerifier) {
    window.recaptchaVerifier.clear()
    window.recaptchaVerifier = null
  }

  window.confirmationResult = null
}
