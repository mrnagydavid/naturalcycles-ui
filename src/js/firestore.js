import {
  getFirestore,
  collection,
  query,
  getDocs,
  where,
} from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js'

import { app } from './firebase.js'

const db = getFirestore(app)

export { db, collection, query, getDocs, where }
