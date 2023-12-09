import { Application, Controller } from 'https://unpkg.com/@hotwired/stimulus/dist/stimulus.js'

let started = false

if (!started) {
  window.Stimulus = Application.start()
  started = true
}

export { Controller }
