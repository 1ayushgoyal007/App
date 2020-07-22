import React from 'react';
import firebase from 'firebase';

var firebaseConfig = {
  apiKey: "AIzaSyAkzHfwsQ-dxJqPrbrulZ-rI7ryUk1GooY",
  authDomain: "lexical-bit-271004.firebaseapp.com",
  databaseURL: "https://lexical-bit-271004.firebaseio.com",
  projectId: "lexical-bit-271004",
  storageBucket: "lexical-bit-271004.appspot.com",
  messagingSenderId: "562012531195",
  appId: "1:562012531195:web:b1365acd1b836d1046035e",
  measurementId: "G-5SDV4SJ27G"
};


if (!firebase.apps.length) {
  console.log("hi")
  firebase.initializeApp(firebaseConfig);
  console.log("done");
}


export default firebase;