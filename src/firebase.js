import firebase from 'firebase/compat/app';
import 'firebase/compat/auth'; 
import 'firebase/compat/firestore';
import { doc, updateDoc } from 'firebase/firestore';

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

firebase.initializeApp(firebaseConfig); 
export var db = firebase.firestore();

export const getAllHotels = () => {
  const colRef = db.collection("hotels");

  var hotels = [];
  return colRef.get().then((querySnapshot) => {
      var i = 1;
      querySnapshot.forEach((doc) => {
        var data = doc.data();
        data['id'] = i;
        hotels.push( data );
        i++;
      });
      return hotels;
  }).catch((error) => {
      console.log("Error getting documents:", error);
      return [];
  });
};

export const signIn = (email, password) => {
  return firebase.auth().signInWithEmailAndPassword(email, password)
  .then((userCredential) => {
      const user = userCredential.user;
      console.log('User signed in:', user.email);
      // Handle successful sign-in (e.g., redirect to dashboard)
    })
    .catch((error) => {
      console.error('Sign-in error:', error.message);
      throw error; // Re-throw the error to be caught in the component
    });
};

export const signUp = (email, password) => {
  return firebase.auth().createUserWithEmailAndPassword(email, password)
  .then((userCredential) => {
      const user = userCredential.user;
      console.log('User signed up:', user.email);
      // Handle successful sign-up (e.g., redirect to dashboard)
    })
    .catch((error) => {
      console.error('Sign-up error:', error.message);
      throw error; // Re-throw the error to be caught in the component
    });
};

export const updateHotel = async (hotelId, updatedData) => {
  const hotelRef = doc(db, 'hotels', hotelId);
  console.log('Updated Data:', updatedData); // Log the updated data
  await updateDoc(hotelRef, updatedData);
};

export const signOut = () => {
  return firebase.auth().signOut()
    .then(() => {
      console.log('User signed out');
    })
    .catch((error) => {
      console.error('Sign-out error:', error.message);
      throw error; // Re-throw the error to be caught in the component
    });
};

export const sendEmailVerification = () => {
  const user = auth.currentUser;
  if (user) {
    return user.sendEmailVerification()
      .then(() => {
        console.log('Email verification sent to', user.email);
        // Handle successful email verification sending
      })
      .catch((error) => {
        console.error('Email verification error:', error.message);
        throw error; // Re-throw the error to be caught in the component
      });
  } else {
    throw new Error('No user is signed in to send verification to');
  }
};

export const auth = firebase.auth();