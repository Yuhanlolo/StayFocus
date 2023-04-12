import {
  getAuth,
  onAuthStateChanged,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  updateProfile,
  signOut,
} from 'firebase/auth';

import {app} from './firebase';
import {
  getSessionsFromFirestore,
  getUserInfoFromFirestore,
  saveUserToFirestore,
} from './firestore';
import {saveUserInfo, resetUserInfo, saveSessions} from './store';

const auth = getAuth(app);

onAuthStateChanged(auth, user => {
  if (user) {
    // User is signed in, see docs for a list of available properties
    // https://firebase.google.com/docs/reference/js/firebase.User
    console.log('$$', user.uid);
  } else {
    // User is logged out, reset user states in AppStore
    resetUserInfo();
  }
});

export async function createUser(
  email: string,
  username: string,
  password: string,
) {
  try {
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      email,
      password,
    );
    const user = userCredential.user;
    updateProfile(user, {displayName: username});
    // updateProfile does not trigger auth state change, so these method calls
    // cannot be done in the onAuthStateChanged observer, so we put them here
    saveUserInfo({uid: user.uid, username: username, dateCreated: new Date()});
    saveUserToFirestore(user.uid, username);
  } catch (error) {
    console.log(error.code);
  }
}

export async function loginUser(
  email: string,
  password: string,
): Promise<[true] | [false, string]> {
  try {
    const userCredential = await signInWithEmailAndPassword(
      auth,
      email,
      password,
    );
    const user = userCredential.user;
    // Restore user info in local store
    const userInfo = await getUserInfoFromFirestore(user.uid);
    const sessionsData = await getSessionsFromFirestore(user.uid);
    saveUserInfo(userInfo);
    saveSessions(sessionsData);
    return [true];
  } catch (error) {
    console.log(error);
    const errorMsg = errorCodeToMessage(error.code);
    return [false, errorMsg];
  }
}

export function logoutUser() {
  signOut(auth).catch(error => {
    console.log(error.code);
  });
}

const dict = {
  'auth/user-not-found': 'User not found',
  'auth/wrong-password': 'Wrong password',
  'auth/invalid-email': 'Invalid email',
};
function errorCodeToMessage(code: keyof typeof dict) {
  return dict[code] || `Authentication error: ${code}`;
}