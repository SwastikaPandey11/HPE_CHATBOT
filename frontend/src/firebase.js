import firebase from "firebase";
const firebaseConfig = {
    apiKey: "AIzaSyA3Ja5o7O4-QOqijjgu7XNEdmJJkgRVCuE",
    authDomain: "hpe-chatbot.firebaseapp.com",
    projectId: "hpe-chatbot",
    storageBucket: "hpe-chatbot.appspot.com",
    messagingSenderId: "876998877288",
    appId: "1:876998877288:web:32f814c816d87521fadbdd",
    measurementId: "G-EE5NT5YF86"
  };
// const firebaseApp = firebase.initializeApp(fireba)
const firebaseApp = firebase.initializeApp(firebaseConfig);
const db = firebaseApp.firestore();
const auth = firebase.auth();
const provider = new firebase.auth.GoogleAuthProvider();
const storage = firebase.storage();
const perf = firebase.performance();
export { auth, provider, storage,perf };
export default db;