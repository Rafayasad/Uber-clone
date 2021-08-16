import firebase from 'firebase/app'

// Optionally import the services that you want to use
import "firebase/auth";
// import "firebase/database";
import "firebase/firestore";
import "firebase/functions";
//import "firebase/storage";

// Initialize Firebase


const firebaseConfig = {
  apiKey: "AIzaSyBgtS5VOYhsc4RG7oq3Yc6pZvR2sHJr44k",
  authDomain: "authentication-8dc57.firebaseapp.com",
  projectId: "authentication-8dc57",
  storageBucket: "authentication-8dc57.appspot.com",
  messagingSenderId: "202512515482",
  appId: "1:202512515482:web:a8e0b8c91c0cee64503a23"
};
firebase.initializeApp(firebaseConfig);

const db = firebase.firestore()

function storeLoction (userId="PQRTGpIElkUmPuNCnNbn3Oj0EDC3",location){
  return db.collection('users').doc(userId).update({
    location
  })
}


export{
  storeLoction
}