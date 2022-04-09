<template>
  <ion-page>
    <ion-header :translucent="true">
      <ion-toolbar>
        <ion-title>Blank</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content :fullscreen="true">
      <ion-header collapse="condense">
        <ion-toolbar>
          <ion-title size="large">Blank</ion-title>
        </ion-toolbar>
      </ion-header>

      <div id="container">
        <ion-button @click="signInWithGoogle" expand="block"
          >Sign In with Google</ion-button
        >
        <strong v-if="loggedInUser">{{ loggedInUser.displayName }}</strong>
        <p>
          Start with Ionic
          <a
            target="_blank"
            rel="noopener noreferrer"
            href="https://ionicframework.com/docs/components"
            >UI Components</a
          >
        </p>
        <ion-button @click="signOut" expand="block">Sign out</ion-button>
      </div>
    </ion-content>
  </ion-page>
</template>

<script>
import {
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
  IonButton,
} from "@ionic/vue";
import { defineComponent } from "vue";
import { ref } from "vue";
// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCIMp93ApXrejda5-SQovAv7fQeOWEPs_0",
  authDomain: "dgsa-test.firebaseapp.com",
  projectId: "dgsa-test",
  storageBucket: "dgsa-test.appspot.com",
  messagingSenderId: "317590560542",
  appId: "1:317590560542:web:e5bc5316ab890dab86f30f",
  measurementId: "G-QMWNNRVPRP",
};
initializeApp(firebaseConfig);

import { getAuth, onAuthStateChanged } from "firebase/auth";

const auth = getAuth();

// Initialize Firebase

import { FirebaseAuthentication } from "@capacitor-firebase/authentication";

export default defineComponent({
  name: "HomePage",
  components: {
    IonContent,
    IonHeader,
    IonPage,
    IonTitle,
    IonToolbar,
    IonButton,
  },
  setup() {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        // User is signed in, see docs for a list of available properties
        // https://firebase.google.com/docs/reference/js/firebase.User
        const uid = user.uid;
        console.log("User is signed in", uid);
        loggedInUser.value = user;
        // ...
      } else {
        // User is signed out
        // ...
      }
    });
    const loggedInUser = ref(null);
    const getCurrentUser = async () => {
      const result = await FirebaseAuthentication.getCurrentUser();
      return result.user;
    };

    const getIdToken = async () => {
      const result = await FirebaseAuthentication.getIdToken();
      return result.token;
    };
    const signInWithGoogle = async () => {
      await FirebaseAuthentication.signInWithGoogle();
    };
    const signOut = async () => {
      await FirebaseAuthentication.signOut();
      loggedInUser.value = null;
    };
    return {
      loggedInUser,
      getCurrentUser,
      getIdToken,
      signInWithGoogle,
      signOut,
    };
  },
});
</script>

<style scoped>
#container {
  text-align: center;

  position: absolute;
  left: 0;
  right: 0;
  top: 50%;
  transform: translateY(-50%);
}

#container strong {
  font-size: 20px;
  line-height: 26px;
}

#container p {
  font-size: 16px;
  line-height: 22px;

  color: #8c8c8c;

  margin: 0;
}

#container a {
  text-decoration: none;
}
</style>
