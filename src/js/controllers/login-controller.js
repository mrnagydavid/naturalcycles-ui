import { Controller } from '../stimulus.js'
import { onLoggedIn, onLoggedOut, login, verifySMSCode } from '../login-state-manager.js'

export default class extends Controller {
  static targets = [
    'phoneInput',
    'smsCodeInput',
    'loginButton',
    'verifyButton',
    'recaptcha',
    'phoneInputErrorLabel',
    'smsCodeInputErrorLabel'
  ]

  connect() {
    onLoggedIn(() => this.onLoggedIn())
    onLoggedOut(() => this.onLoggedOut())
  }

  async login() {
    try {
      this.setErrorForField('phone', '')
      const phoneNumber = this.phoneInputTarget.value
      const isValid = /^\+[1-9]\d{1,14}$/.test(phoneNumber)

      if (!phoneNumber || !isValid) {
        this.setErrorForField('phone', 'Please enter a valid phone number.')
        this.phoneInputTarget.focus()
        this.phoneInputTarget.select()
        return
      }

      this.disableLoginButton()
      this.disablePhoneInput()

      await login(this.phoneInputTarget.value)
      this.showSMSCodeInput()
      this.hideLoginInput()
    } finally {
      this.enablePhoneInput()
      this.enableLoginButton()
    }
  }

  async verify() {
    this.setErrorForField('smsCode', '')
    const code = this.smsCodeInputTarget.value
    if (!code || code.length !== 6) {
      this.setErrorForField('smsCode', 'Please enter the verification code.')
      return
    }

    this.disableVerifyButton()
    this.disableSMSCodeInput()

    const verified = await verifySMSCode(this.smsCodeInputTarget.value)
    if (!verified) {
      this.enableVerifyButton()
      this.enableSMSCodeInput()
      this.setErrorForField('smsCode', 'Incorrect verification code.')
      return
    }

    this.hideSMSCodeInput()
    this.showLoginInput()
    this.enableVerifyButton()
    this.enableSMSCodeInput()
  }

  setErrorForField(fieldName, error) {
    if (!error) {
      this[fieldName + 'InputErrorLabelTarget'].innerText = ''
      this[fieldName + 'InputErrorLabelTarget'].classList.add('hidden')
      return
    }

    this[fieldName + 'InputErrorLabelTarget'].innerText = error
    this[fieldName + 'InputErrorLabelTarget'].classList.remove('hidden')
    this[fieldName + 'InputTarget'].focus()
  }

  hideLoginForm() {
    this.element.classList.add('hidden')
  }

  showLoginForm() {
    this.hideSMSCodeInput()
    this.showLoginInput()
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

  disablePhoneInput() {
    this.phoneInputTarget.disabled = true
  }

  enablePhoneInput() {
    this.phoneInputTarget.disabled = false
  }

  disableLoginButton() {
    this.loginButtonTarget.disabled = true
  }

  enableLoginButton() {
    this.loginButtonTarget.disabled = false
  }

  disableSMSCodeInput() {
    this.smsCodeInputTarget.disabled = true
  }

  enableSMSCodeInput() {
    this.smsCodeInputTarget.disabled = false
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
