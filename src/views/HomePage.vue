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
import { FirebaseAuthentication } from "@capacitor-firebase/authentication";
// FirebaseAuthentication.addListener("authStateChange", (change) => {
//   console.log("AuthStateChanged fired Early Itteration");
//   console.log("authStateChange result", change);
// });
import {
  getAuth,
  GoogleAuthProvider,
  signInWithCredential,
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
    function parseJwt(token) {
      var base64Url = token.split(".")[1];
      var base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
      var jsonPayload = decodeURIComponent(
        atob(base64)
          .split("")
          .map(function (c) {
            return "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2);
          })
          .join("")
      );

      return JSON.parse(jsonPayload);
    }

    const signInWithGoogle = async () => {
      FirebaseAuthentication.addListener("authStateChange", (change) => {
        console.log("AuthStateChanged fired Early signInWithGoogle");
        console.log("authStateChange result", change);
      });
      FirebaseAuthentication.getCurrentUser();
      const result = await FirebaseAuthentication.signInWithGoogle();
      if (platform) {
        console.log("Native Platform detected");
        userEmail.value = result.user.displayName;
        // const result2 = await FirebaseAuthentication.getIdToken();
        // console.log("result2", result2.claims);
        console.log("result", result.credential.idToken);
        console.log("jwt", parseJwt(result.credential.idToken));
      } else {
        console.log("Non native platform");
        // 2. Sign in on the web layer using the id token
        const credential = GoogleAuthProvider.credential(
          result.credential?.idToken
        );
        const result2 = await FirebaseAuthentication.getIdToken();
        console.log("result2", result2);
        const auth = getAuth();
        const user = await signInWithCredential(auth, credential);
        const FBuser = await auth.currentUser.getIdTokenResult();
        console.log("claims", FBuser.claims);
        console.log(user.user.email);
        // userEmail.value = user.user.email;
      }
    };
    const signOut = async () => {
      await FirebaseAuthentication.signOut();
      await FirebaseAuthentication.removeAllListeners();
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
