import {
  getAuth,
  onAuthStateChanged,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  updateProfile,
  signOut,
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
  } else {
    resetUserInfo();
  }
});

export function createUser(email, username, password) {
  createUserWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      const user = userCredential.user;
      updateProfile(user, { displayName: username });
      saveUserInfo(user.uid, username);
      saveUserToFireStore(user.uid, username);
    })
    .catch((error) => {
      console.log(error);
    });
}

function errorCodeToMessage(code: string) {
  const dict = {
    "auth/user-not-found": "User not found",
    "auth/wrong-password": "Wrong password",
    "auth/invalid-email": "Invalid email",
  };
  return dict[code] || `Authentication error: ${code}`;
}

export async function loginUser(email, password): Promise<[boolean, string?]> {
  try {
    await signInWithEmailAndPassword(auth, email, password);
    return [true];
  } catch (error) {
    const errorMsg = errorCodeToMessage(error.code);
    return [false, errorMsg];
  }
}

export function logoutUser() {
  signOut(auth).catch((error) => {
    console.log(error.code);
  });
}
