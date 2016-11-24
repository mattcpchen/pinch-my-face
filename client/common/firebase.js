import firebase from 'firebase';



const config = {
  apiKey: "AIzaSyDhl_4KQ38zwMe4NbDxfaN5pJ5aJ2uBLPc",
  authDomain: "pinch-my-face-36418.firebaseapp.com",
  databaseURL: "https://pinch-my-face-36418.firebaseio.com",
  storageBucket: "pinch-my-face-36418.appspot.com",
  messagingSenderId: "1015964283586"
};

firebase.initializeApp(config);
const auth = firebase.auth();
const storageRef = firebase.storage().ref();
const database = firebase.database();

auth.signInAnonymously();


export default {
  storageRef,
  database
};


