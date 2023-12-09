import { Application, Controller } from 'https://unpkg.com/@hotwired/stimulus/dist/stimulus.js'

let started = false

if (!started) {
  window.Stimulus = Application.start()
  console.debug('Stimulus started.')
  started = true
}

export { Controller }
