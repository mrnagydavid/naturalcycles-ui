import { Controller } from '../stimulus.js'
import { onLoggedIn, onLoggedOut } from '../login-state-manager.js'
import { fetchProfile, updateProfile } from '../api/profile.js'

export default class extends Controller {
  static targets = [
    'nameInput',
    'emailInput',
    'saveButton',
    'nameInputErrorLabel',
    'emailInputErrorLabel',
    'progressIndicatorLabel',
    'successMessageLabel'
  ]

  notificationDisplayDuration = 5000

  connect() {
    console.debug('[ProfileController] Profile controller connected.')
    onLoggedIn(() => this.onLoggedIn())
    onLoggedOut(() => this.onLoggedOut())
  }

  async fetchProfileInfo() {
    try {
      this.showProgressIndicator()
      this.disableForm()
      const { name, email } = await fetchProfile()
      this.nameInputTarget.value = name
      this.emailInputTarget.value = email
    } finally {
      this.hideProgressIndicator()
      this.enableForm()
    }
  }

  async updateProfileInfo() {
    try {
      if (!this.validateForm()) {
        return
      }

      this.disableForm()

      const params = {
        name: this.nameInputTarget.value,
        email: this.emailInputTarget.value
      }

      const response = await updateProfile(params)

      if (!response.success) {
        this.setErrors(response.errors)
        return
      }

      this.showSuccessNotification()
    } finally {
      this.enableForm()
    }
  }

  validateForm() {
    this.clearErrors()

    if (!this.isValidEmail()) {
      this.setErrorForField('email', 'Please enter a valid email address.')
    }

    if (!this.isValidName()) {
      this.setErrorForField('name', 'Please enter your name.')
    }

    return this.isValidForm()
  }

  isValidForm() {
    return this.isValidName() && this.isValidEmail()
  }

  isValidName() {
    const name = this.nameInputTarget.value
    return name && name.length > 0
  }

  isValidEmail() {
    const email = this.emailInputTarget.value
    return email && /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(email)
  }

  setErrors(errors) {
    this.setErrorForField('name', errors.name?._errors.join(','))
    this.setErrorForField('email', errors.email?._errors.join(','))
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

  clearFields() {
    this.nameInputTarget.value = ''
    this.emailInputTarget.value = ''
  }

  clearErrors() {
    this.nameInputErrorLabelTarget.value = ''
    this.emailInputErrorLabelTarget.value = ''
    this.nameInputErrorLabelTarget.classList.add('hidden')
    this.emailInputErrorLabelTarget.classList.add('hidden')
  }

  showProfileForm() {
    this.element.classList.remove('hidden')
  }

  hideProfileForm() {
    this.element.classList.add('hidden')
  }

  showProgressIndicator() {
    this.progressIndicatorLabelTarget.classList.remove('hidden')
  }

  hideProgressIndicator() {
    this.progressIndicatorLabelTarget.classList.add('hidden')
  }

  disableForm() {
    this.saveButtonTarget.disabled = true
    this.nameInputTarget.disabled = true
    this.emailInputTarget.disabled = true
  }

  enableForm() {
    this.saveButtonTarget.disabled = false
    this.nameInputTarget.disabled = false
    this.emailInputTarget.disabled = false
  }

  showSuccessNotification() {
    this.successMessageLabelTarget.classList.remove('hidden')

    setTimeout(() => {
      this.successMessageLabelTarget.classList.add('hidden')
    }, this.notificationDisplayDuration)
  }

  onLoggedIn() {
    this.fetchProfileInfo()
    this.showProfileForm()
  }

  onLoggedOut() {
    this.hideProfileForm()
    this.clearFields()
    this.clearErrors()
  }
}
