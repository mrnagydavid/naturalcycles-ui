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

async function login(phoneNumber) {
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
