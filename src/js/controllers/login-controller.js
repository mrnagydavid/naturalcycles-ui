import { Controller } from '../stimulus.js'
import { onLoggedIn, onLoggedOut, login, verifySMSCode } from '../login-state-manager.js'

export default class extends Controller {
  static targets = ['phoneInput', 'smsCodeInput', 'loginButton', 'verifyButton', 'recaptcha']

  connect() {
    console.debug('Login controller connected.')
    onLoggedIn(() => this.onLoggedIn())
    onLoggedOut(() => this.onLoggedOut())
    console.log({ this: this })
  }

  async login() {
    try {
      console.debug('Login button clicked.')
      console.debug(this.phoneInputTarget.value)

      const phoneNumber = this.phoneInputTarget.value
      if (!phoneNumber) {
        alert('Please enter your phone number.')
        return
      }

      this.disableLoginButton()

      await login(this.phoneInputTarget.value)
      this.showSMSCodeInput()
      this.hideLoginInput()
    } finally {
      this.enableLoginButton()
    }
  }

  async verify() {
    try {
      console.debug('Verify button clicked.')
      console.debug(this.smsCodeInputTarget.value)

      const code = this.smsCodeInputTarget.value
      if (!code || code.length !== 6) {
        alert('Please enter the verification code.')
        return
      }

      this.disableVerifyButton()

      const verified = await verifySMSCode(this.smsCodeInputTarget.value)
      if (verified) {
        this.hideSMSCodeInput()
        this.showLoginForm()
      }
    } finally {
      this.enableVerifyButton()
    }
  }

  hideLoginForm() {
    this.element.classList.add('hidden')
  }

  showLoginForm() {
    this.element.classList.remove('hidden')
  }

  hideLoginInput() {
    this.phoneInputTarget.classList.add('hidden')
    this.loginButtonTarget.classList.add('hidden')
    this.recaptchaTarget.classList.add('invisible')
  }

  showLoginInput() {
    this.phoneInputTarget.classList.remove('hidden')
    this.loginButtonTarget.classList.remove('hidden')
    this.recaptchaTarget.classList.remove('invisible')
    this.phoneInputTarget.focus()
  }

  showSMSCodeInput() {
    this.smsCodeInputTarget.classList.remove('hidden')
    this.verifyButtonTarget.classList.remove('hidden')
    this.smsCodeInputTarget.focus()
  }

  hideSMSCodeInput() {
    this.smsCodeInputTarget.classList.add('hidden')
    this.verifyButtonTarget.classList.add('hidden')
  }

  disableLoginButton() {
    this.loginButtonTarget.disabled = true
  }

  enableLoginButton() {
    this.loginButtonTarget.disabled = false
  }

  disableVerifyButton() {
    this.verifyButtonTarget.disabled = true
  }

  enableVerifyButton() {
    this.verifyButtonTarget.disabled = false
  }

  onLoggedIn() {
    this.hideLoginForm()
  }

  onLoggedOut() {
    this.showLoginForm()
  }
}
