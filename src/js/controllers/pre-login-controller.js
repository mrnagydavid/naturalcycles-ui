import { Controller } from '../stimulus.js'
import { onLoggedIn, onLoggedOut } from '../login-state-manager.js'

export default class extends Controller {
  connect() {
    onLoggedIn(() => this.hideSelf())
    onLoggedOut(() => this.hideSelf())
  }

  hideSelf() {
    this.element.classList.add('hidden')
  }
}
