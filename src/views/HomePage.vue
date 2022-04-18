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
        <strong v-else>Not logged in</strong>
        <p>Is native app {{ platform }}</p>
        <p>
          {{ userEmail }}
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
import { isPlatform } from "@ionic/vue";

// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
const firebaseConfig = {
  apiKey: "AIzaSyAu9nBu4JmlDV9bpAt7RMCjQsS2nuyqrvE",
  authDomain: "demofirebase-78ea8.firebaseapp.com",
  projectId: "demofirebase-78ea8",
  storageBucket: "demofirebase-78ea8.appspot.com",
  messagingSenderId: "763418023949",
  appId: "1:763418023949:web:59c65c0f8c42debb85dd44",
  measurementId: "G-MWM8ZXWKHG",
};
initializeApp(firebaseConfig);
// const auth = getAuth();
import { FirebaseAuthentication } from "@capacitor-firebase/authentication";
// fire addListener place 1 - can see in logfile of IOS but not firing on auth state change
// FirebaseAuthentication.addListener("authStateChange", (change) => {
//   console.log("AuthStateChanged fired");
//   console.log("authStateChange result", change);
// });
import {
  getAuth,
  GoogleAuthProvider,
  signInWithCredential,
  // onAuthStateChanged,
} from "firebase/auth";

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
    // onAuthStateChanged(auth, (user) => {
    //   if (user) {
    //     // User is signed in, see docs for a list of available properties
    //     // https://firebase.google.com/docs/reference/js/firebase.User
    //     const uid = user.uid;
    //     console.log("User is signed in", uid);
    //     loggedInUser.value = user;
    //     // ...
    //   } else {
    //     console.log("signout");
    //     // User is signed out
    //     // ...
    //   }
    // });
    // function authChange(user) {
    //   console.log("authChange", user);
    // }
    const platform = isPlatform("capacitor");
    const loggedInUser = ref(null);
    const userEmail = ref("");
    const getCurrentUser = async () => {
      const result = await FirebaseAuthentication.getCurrentUser();
      return result.user;
    };

    const getIdToken = async () => {
      const result = await FirebaseAuthentication.getIdToken();
      return result.token;
    };
    const signInWithGoogle = async () => {
      // fire addListener place 2 - can see in logfile of IOS but not firing on auth state change
      // FirebaseAuthentication.addListener("authStateChange", (change) => {
      //   console.log("AuthStateChanged fired");
      //   console.log("authStateChange result", change);
      // });
      // 1. Create credentials on the native layer
      const result = await FirebaseAuthentication.signInWithGoogle();
      if (platform) {
        console.log("Native Platform detected");
        // fire addListener place 3 - can see in logfile of IOS but not firing on auth state change
        FirebaseAuthentication.addListener("authStateChange", (change) => {
          console.log("AuthStateChanged fired");
          console.log("authStateChange result", change);
        });
        userEmail.value = result.user.displayName;
        const credential = result.credential;
        console.log("credential", credential);
        const auth = getAuth();
        // console.log("currentUser");
        // const credUser = await signInWithCredential(auth, credential);
        // console.log("credUser", credUser);
        const FBuser = auth.currentUser.getIdTokenResult();
        console.log("CurrUser", FBuser);
        // console.log(result.user.displayName);
      } else {
        console.log("Non IOS platform");
        // 2. Sign in on the web layer using the id token
        const credential = GoogleAuthProvider.credential(
          result.credential?.idToken
        );
        const auth = getAuth();
        const user = await signInWithCredential(auth, credential);
        const FBuser = await auth.currentUser.getIdTokenResult();
        console.log("claims", FBuser.claims);
        // console.log(user.user.email);
        userEmail.value = user.user.email;
      }
    };
    const signOut = async () => {
      await FirebaseAuthentication.signOut();
      loggedInUser.value = null;
    };
    return {
      platform,
      loggedInUser,
      userEmail,
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
