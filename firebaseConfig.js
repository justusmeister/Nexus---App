import { initializeApp } from "firebase/app";
import { initializeAuth, getReactNativePersistence } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import ReactNativeAsyncStorage from "@react-native-async-storage/async-storage";

const firebaseConfig = {
    apiKey: "AIzaSyAE96blBsHKAbr74zuKJsGFzY144vgOy-w",
    authDomain: "nexus-3c6c3.firebaseapp.com",
    projectId: "nexus-3c6c3",
    storageBucket: "nexus-3c6c3.firebasestorage.app",
    messagingSenderId: "148853647647",
    appId: "1:148853647647:web:08adfe800bf6e2f14fa82a",
    measurementId: "G-9SEQYRL9SF",
};

export const firebaseApp = initializeApp(firebaseConfig);
export const firebaseAuth = initializeAuth(firebaseApp, {
    persistence: getReactNativePersistence(ReactNativeAsyncStorage),
});
export const firestoreDB = getFirestore(firebaseApp);