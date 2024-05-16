import firebase from 'firebase/compat/app';
import 'firebase/compat/auth'; // If you are using auth
import 'firebase/compat/firestore'; // If you are using firestore

const firebaseConfig = {
  apiKey: "AIzaSyA62NnVI_Hfq-ET3JZUSXo8h6uLFPZv010",
  authDomain: "rhein-ruhr-hotel.firebaseapp.com",
  databaseURL: "https://rhein-ruhr-hotel-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "rhein-ruhr-hotel",
  storageBucket: "rhein-ruhr-hotel.appspot.com",
  messagingSenderId: "5527838590",
  appId: "1:5527838590:web:45f19869d81567cf8ddd2f",
  measurementId: "G-2TSWV6LGPE"
};
const app = firebase.initializeApp(firebaseConfig); 
var db = firebase.firestore();

export const getAllHotels = () => {
  const colRef = db.collection("hotels");

  var hotels = [];
  return colRef.get().then((querySnapshot) => {
      querySnapshot.forEach((doc) => {
          hotels.push( doc.data() );
      });
      return hotels;
  }).catch((error) => {
      console.log("Error getting documents:", error);
      return [];
  });
};

export const getHotelDetails = (hotelId) => {
  // Your code for fetching details of a hotel
};

export const signIn = (email, password) => {
  // Your code for signing in
};

