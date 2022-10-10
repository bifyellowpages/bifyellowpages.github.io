import { init } from 'next-firebase-auth'

const initAuth = () => {
  init({
    authPageURL: '/auth',
    appPageURL: '/api/upload',
    loginAPIEndpoint: '/api/login', // required
    logoutAPIEndpoint: '/api/logout', // required
    onLoginRequestError: (err) => {
      console.error(err)
    },
    onLogoutRequestError: (err) => {
      console.error(err)
    },
    // firebaseAuthEmulatorHost: 'localhost:9099',
    firebaseAdminInitConfig: {
      credential: {
        projectId: 'bifyellowpages-website',
        clientEmail: 'firebase-adminsdk-dsqdy@bifyellowpages-website.iam.gserviceaccount.com'        ,
        // The private key must not be accessible on the client side.
        // privateKey: process.env.FIREBASE_PRIVATE_KEY,
      },
      databaseURL: "bifyellowpages-website.firebaseapp.com",
    },
    // Use application default credentials (takes precedence over firebaseAdminInitConfig if set)
    // useFirebaseAdminDefaultCredential: true,
    firebaseClientInitConfig: {
        apiKey: "AIzaSyB1fgZoQxuOlrakM_HDnSBFXsXcuJyeJ9E",
        authDomain: "bifyellowpages-website.firebaseapp.com",
        projectId: "bifyellowpages-website",
        storageBucket: "bifyellowpages-website.appspot.com",
        messagingSenderId: "971157057889",
        appId: "1:971157057889:web:7a9f0cb88fb7e803f05520",
        measurementId: "G-GNCPCMKHZS"
    },
    cookies: {
      name: 'bifyellowpages-website', // required
      // Keys are required unless you set `signed` to `false`.
      // The keys cannot be accessible on the client side.
      keys: [
        process.env.COOKIE_SECRET_CURRENT,
        process.env.COOKIE_SECRET_PREVIOUS,
      ],
      httpOnly: true,
      maxAge: 12 * 60 * 60 * 24 * 1000, // twelve days
      overwrite: true,
      path: '/',
      sameSite: 'strict',
      secure: false, // set this to false in local (non-HTTPS) development
      signed: false,
    },
    onVerifyTokenError: (err) => {
      console.error(err)
    },
    onTokenRefreshError: (err) => {
      console.error(err)
    },
  })
}

export default initAuth