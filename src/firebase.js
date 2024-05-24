import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';
import 'firebase/compat/storage';
import { doc, setDoc, updateDoc, deleteDoc, addDoc, collection, getDoc } from 'firebase/firestore';
import { ref, getStorage, deleteObject, uploadBytes } from 'firebase/storage';

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
export var storage = firebase.storage();

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
    .then(async (userCredential) => {
      const user = userCredential.user;
      const userDoc = await getDoc(doc(db, "login", "users" ));

      if (userDoc.exists()) {
        const userData = userDoc.data()[user.uid];
        if (userCredential.user.emailVerified || userData.privilege === 'admin') {
          console.log('User signed in:', user.email);
          return { user, userData };
        } else {
          firebase.auth().signOut();
          console.error('Email address not verified.');
          throw new Error('Email address not verified.');
        }
      } else {
        throw new Error('User data not found in Firestore.'); 
      }
    })
    .catch((error) => {
      console.error('Sign-in error:', error.message);
      throw error;
    });
};


export const signUp = (email, password) => {
  return firebase.auth().createUserWithEmailAndPassword(email, password)
    .then(async (userCredential) => {
      const user = userCredential.user;
      const loginRef = doc(db, "login", "users");

      await setDoc(doc(db, "login", "users"), { [user.uid]: { email: user.email, privilege: 'client'  } });

      firebase.auth().signOut();
      console.log('User signed up:', user.email);
      return userCredential;
    })
    .catch((error) => {
      console.error('Sign-up error:', error.message);
      throw error;
    });
};

export const updateHotel = async (hotelId, updatedHotel, imageFile) => {
  try {
    const hotelRef = doc(db, "hotels", hotelId);
    const hotelDoc = await getDoc(hotelRef);

    if (!hotelDoc.exists()) {
      throw new Error(`Hotel with ID ${hotelId} does not exist.`);
    }

    const storageRef = ref(storage, `hotel_images/${hotelId}`);
    await deleteObject(storageRef);

    const newImageRef = ref(storage, `hotel_images/${hotelId}`);
    await newImageRef.put(imageFile);

    const imageUrl = await newImageRef.getDownloadURL();

    await updateDoc(hotelRef, { ...updatedHotel, imageUrl });

    console.log("Hotel updated with image:", hotelId);
  } catch (error) {
    console.error("Error updating hotel with image:", error);
    throw error;
  }
};

export const deleteHotel = async (hotelId) => {
  try {
    // Delete the 1.jpg file from the hotel's folder in Firebase Storage
    const storage = getStorage();
    const hotelImageRef = ref(storage, `images/${hotelId}/1.jpg`);
    await deleteObject(hotelImageRef);
    console.log(`Image 1.jpg in folder images/${hotelId} deleted from Firebase Storage`);

    // Wait for a short delay to allow Firebase Storage to synchronize
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Delete hotel document from Firestore
    const hotelRef = doc(db, 'hotels', hotelId);
    await deleteDoc(hotelRef);

    console.log("Hotel deleted:", hotelId);
  } catch (error) {
    console.error("Error deleting hotel:", error);
    throw error;
  }
};

export const addHotel = async (hotelData) => {
  try {
    const hotelRef = await addDoc(collection(db, "hotels"), newHotel);
    const hotelId = hotelRef.id;

    const storageRef = ref(storage, `hotel_images/${hotelId}`);
    await storageRef.put(imageFile);

    const imageUrl = await storageRef.getDownloadURL();

    await updateDoc(hotelRef, { imageUrl });

    console.log("Hotel added with image:", hotelId);
  } catch (error) {
    console.error("Error adding hotel with image:", error);
    throw error;
  }
};

export const uploadHotelImage = async (hotelId, imageFile) => {
  try {
    const storage = getStorage();
    const hotelImageRef = ref(storage, `images/${hotelId}/1.jpg`);
    await uploadBytes(hotelImageRef, imageFile);
    console.log(`Uploaded image file to folder: images/${hotelId}/1.jpg`);
  } catch (error) {
    console.error('Error uploading image:', error);
    throw error;
  }
};

export const uploadHotelImage = async (hotelId, imageFile) => {
  try {
    const storage = getStorage();
    const hotelImageRef = ref(storage, `images/${hotelId}/1.jpg`);
    await uploadBytes(hotelImageRef, imageFile);
    console.log(`Uploaded image file to folder: images/${hotelId}/1.jpg`);
  } catch (error) {
    console.error('Error uploading image:', error);
    throw error;
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