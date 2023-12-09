import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js'

const firebaseConfig = {
  apiKey: 'AIzaSyCtvG-ksYkdMeHXB13vRV7oU9yLEqro2UI',
  authDomain: 'naturalcycles-assessment.firebaseapp.com',
  projectId: 'naturalcycles-assessment',
  storageBucket: 'naturalcycles-assessment.appspot.com',
  messagingSenderId: '798736484153',
  appId: '1:798736484153:web:f530f0088815d03f40cae8',
}

const app = initializeApp(firebaseConfig)

export { app }
