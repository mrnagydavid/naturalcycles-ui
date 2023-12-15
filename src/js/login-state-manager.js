import {
  auth,
  onAuthStateChanged,
  signInWithPhoneNumber,
  RecaptchaVerifier,
  signInWithPhoneNumberErrorMap
} from './auth.js'
import { InternalError } from './errors.js'

export { onLoggedIn, onLoggedOut, login, logout, verifySMSCode }

let loaded = false
let authStateDetermined = false
const callbacksForLoggedIn = []
const callbacksForLoggedOut = []

if (!loaded) {
  onAuthStateChanged(auth, (user) => {
    if (user) {
      handleLoggedIn(user)
    } else {
      handleLoggedOut()
    }
    authStateDetermined = true
  })

  loaded = true
}

async function login(phoneNumber) {
  try {
    if (window.recaptchaVerifier) {
      window.recaptchaVerifier.clear()
    }

    window.recaptchaVerifier = new RecaptchaVerifier(auth, 'recaptcha-container', {})
    window.recaptchaVerifier.render()
    const _token = await window.recaptchaVerifier.verify()

    const confirmationResult = await signInWithPhoneNumber(
      auth,
      phoneNumber,
      window.recaptchaVerifier
    )

    window.confirmationResult = confirmationResult
  } catch (error) {
    if (typeof error.code === 'string' && error.code.startsWith('auth/')) {
      handleFirebaseErrorForLogin(error)
      return
    }

    throw new InternalError(error.message)
  }
}

async function verifySMSCode(code) {
  try {
    await window.confirmationResult.confirm(code)
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
  return authStateDetermined && auth.currentUser !== null
}

function isLoggedOut() {
  return authStateDetermined && !isLoggedIn()
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
  callbacksForLoggedIn.forEach((callback) => callback(user))
}

function handleLoggedOut() {
  callbacksForLoggedOut.forEach((callback) => callback())
}

function cleanUpRecaptchaItems() {
  if (window.recaptchaVerifier) {
    window.recaptchaVerifier.clear()
    window.recaptchaVerifier = null
  }

  window.confirmationResult = null
}

function handleFirebaseErrorForLogin(error) {
  const message =
    signInWithPhoneNumberErrorMap[error.code] || signInWithPhoneNumber['auth/internal-error']

  if (error.code === 'auth/invalid-phone-number' || error.code === 'auth/missing-phone-number') {
    throw new Error(message)
  }

  throw new InternalError(message)
}
