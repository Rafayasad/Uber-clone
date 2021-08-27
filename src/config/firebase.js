import firebase from 'firebase/app'
// import * as firebase from 'firebase';

// Optionally import the services that you want to use
import "firebase/auth";
// import "firebase/database";
import "firebase/firestore";
import "firebase/functions";
import "firebase/storage";

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
// firebase.initializeApp(Expo.Constants.manifest.extra.firebase);

const db = firebase.firestore()

function storeLocation(userId="PQRTGpIElkUmPuNCnNbn3Oj0EDC3",location){
  return db.collection('users').doc(userId).update({
    ...location
  })
}

function storeDriverLocation(driverId,location) {
  return db.collection('driver').doc(driverId).update({
      ...location
  })
}

function getNearestDrivers(b) {
  return db.collection('driver')
  .orderBy('geohash')
  .startAt(b[0])
  .endAt(b[1]);
}

function requestDriver (driverId, {userId, lat, lng}) {
  return db.collection('driver').doc(driverId).update({
      currentRequest: {
          userId, lat, lng
      }
  })
}
function rejectRequest (driverId) {
  return db.collection('driver').doc(driverId).update({
      currentRequest: null
  })
}

function fBUser (fbUserId,userinfo){
  return db.collection('FbUser').add(userinfo)
}


export{
  storeLocation,
  storeDriverLocation,
  getNearestDrivers,
  requestDriver,
  rejectRequest,
  fBUser
}

export default db;