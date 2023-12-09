import {
  getAuth,
  onAuthStateChanged,
  signInWithPhoneNumber,
  RecaptchaVerifier
} from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js'

import { app } from './firebase.js'

const auth = getAuth(app)

export { auth, onAuthStateChanged, signInWithPhoneNumber, RecaptchaVerifier }
