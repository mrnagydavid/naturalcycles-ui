import { Controller } from '../stimulus.js'
import { onLoggedIn, onLoggedOut, logout } from '../login-state-manager.js'

export default class extends Controller {
  static targets = ['logoutButton']

  connect() {
    onLoggedIn(() => this.onLoggedIn())
    onLoggedOut(() => this.onLoggedOut())
  }

  async logout() {
    logout()
  }

  showLogoutButton() {
    this.logoutButtonTarget.classList.remove('invisible')
  }

  hideLogoutButton() {
    this.logoutButtonTarget.classList.add('invisible')
  }

  onLoggedIn() {
    this.showLogoutButton()
  }

  onLoggedOut() {
    this.hideLogoutButton()
  }
}
