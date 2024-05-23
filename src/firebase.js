import firebase from 'firebase/compat/app';
import 'firebase/compat/auth'; 
import 'firebase/compat/firestore';
import 'firebase/compat/storage'; // Import Firebase Storage
import { doc, updateDoc, deleteDoc, addDoc, collection } from 'firebase/firestore';
import { ref, getStorage, deleteObject } from 'firebase/storage'; // Import Firebase Storage methods

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
export var storage = firebase.storage(); // Define storage variable

export const getAllHotels = async () => {
  const colRef = db.collection("hotels");

  var hotels = [];
  try {
    const querySnapshot = await colRef.get();
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      const hotelId = doc.id;
      const hotel = { id: hotelId, ...data };
      hotels.push(hotel);
    });
    return hotels;
  } catch (error) {
    console.error("Error getting documents:", error);
    return [];
  }
};

export const signIn = (email, password) => {
  return firebase.auth().signInWithEmailAndPassword(email, password)
  .then((userCredential) => {
      if (userCredential.user.emailVerified || userCredential.user.email.endsWith('@admin.com')) {
        const user = userCredential.user;
        console.log('User signed in:', user.email);
        return userCredential; // Return userCredential to be used in the component
      } else {
        firebase.auth().signOut();
        console.error('Email address not verified.');
        throw new Error('Email address not verified.');
      }
    })
    .catch((error) => {
      console.error('Sign-in error:', error.message);
      throw error;
    });
};

export const signUp = (email, password) => {
  return firebase.auth().createUserWithEmailAndPassword(email, password)
  .then((userCredential) => {
      firebase.auth().signOut();
      const user = userCredential.user;
      console.log('User signed up:', user.email);
      return userCredential; // Return userCredential to be used in the component
    })
    .catch((error) => {
      console.error('Sign-up error:', error.message);
      throw error;
    });
};

export const updateHotel = async (hotelId, updatedData) => {
  const hotelRef = doc(db, 'hotels', hotelId);
  try {
    await updateDoc(hotelRef, updatedData);
    console.log('Hotel updated successfully!');
  } catch (error) {
    console.error('Error updating hotel:', error);
    throw error;
  }
};

export const deleteHotel = async (hotelId) => {
  try {
    // Delete hotel folder and its contents from Firebase Storage
    const hotelFolderRef = ref(storage, `images/${hotelId}`);
    console.log(`Hotel folder path: ${hotelFolderRef}`)
    await deleteObject(hotelFolderRef);
    console.log(`Hotel folder ${hotelId} deleted from Firebase Storage`);

    // Wait for a short delay to allow Firebase Storage to synchronize
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Delete hotel document from Firestore
    const hotelRef = doc(db, 'hotels', hotelId);
    await deleteDoc(hotelRef);
    console.log(`Hotel with ID ${hotelId} deleted from Firestore`);
  } catch (error) {
    console.error('Error deleting hotel:', error);
    throw error;
  }
};


export const addHotel = async (hotelData) => {
  try {
    const docRef = await addDoc(collection(db, 'hotels'), hotelData);
    return docRef;
  } catch (e) {
    console.error('Error adding document: ', e);
    throw e;
  }
};

export const signOut = () => {
  return firebase.auth().signOut()
    .then(() => {
      console.log('User signed out');
    })
    .catch((error) => {
      console.error('Sign-out error:', error.message);
      throw error;
    });
};

export const auth = firebase.auth();
