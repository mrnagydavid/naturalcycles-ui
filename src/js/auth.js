import {
  getAuth,
  onAuthStateChanged,
  signInWithPhoneNumber,
  RecaptchaVerifier
} from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js'

import { app } from './firebase.js'

export {
  auth,
  signInWithPhoneNumberErrorMap,
  onAuthStateChanged,
  signInWithPhoneNumber,
  RecaptchaVerifier
}

const auth = getAuth(app)

const signInWithPhoneNumberErrorMap = {
  'auth/captcha-check-failed':
    'reCAPTCHA response token was invalid, expired, or this method was called from a non-whitelisted domain.',
  'auth/invalid-phone-number': 'The phone number has an invalid format.',
  'auth/missing-phone-number': 'The phone number is missing.',
  'auth/quota-exceeded': 'The SMS quota for the Firebase project has been exceeded.',
  'auth/user-disabled': 'The user corresponding to the given phone number has been disabled.',
  'auth/maximum-second-factor-count-exceeded':
    'The maximum allowed number of second factors on a user has been exceeded.',
  'auth/second-factor-already-in-use': 'The second factor is already enrolled on this account.',
  'auth/unsupported-first-factor': 'The first factor being used to sign in is not supported.',
  'auth/unverified-email': 'The email of the account is not verified.',
  'auth/internal-error': 'An internal error has occurred.'
}
