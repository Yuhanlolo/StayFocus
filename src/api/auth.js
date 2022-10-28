import {
  getAuth,
  onAuthStateChanged,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  updateProfile,
} from "firebase/auth";

import { app } from "./firebase";
import { saveUserToFireStore } from "./firestore";
import { saveUserInfo, resetUserInfo } from "./store";

const auth = getAuth(app);

onAuthStateChanged(auth, (user) => {
  if (user) {
    // User is signed in, see docs for a list of available properties
    // https://firebase.google.com/docs/reference/js/firebase.User
    console.log("$$", user.uid);
    saveUserInfo(user.uid, user.displayName);
    saveUserToFireStore(user.uid, user.displayName);
  } else {
    resetUserInfo();
  }
});

export function createUser(email, username, password) {
  createUserWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      // Signed in
      const user = userCredential.user;
      updateProfile(user, { displayName: username });
    })
    .catch((error) => {
      console.log(error);
    });
}

export function loginUser(email, password) {
  signInWithEmailAndPassword(auth, email, password).catch((error) => {
    console.log(error);
  });
}
