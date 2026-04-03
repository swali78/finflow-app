import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.finflow.app',
  appName: 'FinFlow',
  webDir: 'out',
  server: {
    // 🚩 REPLACE_URL: Use your hosted web address here (e.g. https://finflow.vercel.app)
    url: 'http://localhost:7331', 
    cleartext: true, // 🚨 SET TO FALSE for production HTTPS
    androidScheme: 'https'
  },
  plugins: {
    SplashScreen: {
      launchShowDuration: 2000,
      launchAutoHide: true,
      backgroundColor: "#000000",
      androidScaleType: "CENTER_CROP",
      showSpinner: false,
      splashFullScreen: true,
      splashImmersive: true
    }
  }
};

export default config;
