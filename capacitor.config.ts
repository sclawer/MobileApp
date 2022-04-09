import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
   plugins: {
    FirebaseAuthentication: {
      skipNativeAuth: false,
      providers: ["apple.com", "google.com","facebook.com", "twitter.com", "github.com", "password"],
    },
  },
  appId: 'live.dgsa.app',
  appName: 'DGSA',
  webDir: 'dist',
  bundledWebRuntime: false
};

export default config;
