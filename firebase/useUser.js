import { useEffect, useState, createContext, useContext } from "react";
import { useRouter } from "next/router";
import firebase from "firebase/app";
import { getAuth } from "firebase/auth";
import initFirebase from "../firebase/initFirebase";
import {
  removeUserCookie,
  setUserCookie,
  getUserFromCookie,
} from "./userCookies";
import { mapUserData } from "./mapUserData";

initFirebase();

const useAuth = () => {
  const [user, setUser] = useState(null);
  const router = useRouter();

  const logout = async () => {
    return getAuth()
      .signOut()
      .then(() => {
        // Sign-out successful.
        router.push("/");
      })
      .catch((e) => {
        console.error(e);
      });
  };

  useEffect(() => {
    // Firebase updates the id token every hour, this
    // makes sure the react state and the cookie are
    // both kept up to date
    const cancelAuthListener = getAuth().onIdTokenChanged((user) => {
      if (user) {
        const userData = mapUserData(user);
        setUserCookie(userData);
        setUser(userData);
      } else {
        removeUserCookie();
        setUser();
      }
    });

    const userFromCookie = getUserFromCookie();
    /*
    if (!userFromCookie) {
      router.push("/");
      return;
    }
    */
    setUser(userFromCookie);

    return () => {
      cancelAuthListener();
    };
  }, []);

  return { user, logout };
};

const AuthUserContext = createContext({
  user: null,
  logout: () => {},
});

const AuthUserProvider = ({ children }) => {
  const auth = useAuth();
  return (
    <AuthUserContext.Provider value={auth}>{children}</AuthUserContext.Provider>
  );
};

export const useUser = () => useContext(AuthUserContext);

export default AuthUserProvider;