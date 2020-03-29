import firebase from 'firebase';
import 'firebase/firestore';

var firebaseConfig = {
  apiKey: 'AIzaSyA7Xrti3uJIMonqO8HITaSsI9Bx-nrHe7Y',
  authDomain: 'servicesma-a9c76.firebaseapp.com',
  databaseURL: 'https://servicesma-a9c76.firebaseio.com',
  projectId: 'servicesma-a9c76',
  storageBucket: 'servicesma-a9c76.appspot.com',
  messagingSenderId: '383043078298',
  appId: '1:383043078298:web:9a38502d9170e1640d3723',
  measurementId: 'G-TYS7R8E3TF'
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);
// firebase.analytics();
export const f = firebase;
export const db = firebase.database();
export const auth = firebase.auth();
export const storage = firebase.storage();
export const fr = firebase.firestore();
