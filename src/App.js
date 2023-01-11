import { Routes, Route, useFetcher } from "react-router-dom";
import { Feed } from "./pages/feedPage";
import { db } from "./firebaseConfig";
import { SignUpPage } from "./pages/signUpPage";
import { LoginPage } from "./pages/loginPage";
import { Content } from "./pages/contentPage";
import { ProfilePage } from "./pages/profilePage";
import { ProfileSettings } from "./pages/profileSettingsPage";
import { Nav } from "./nav/nav";
import { About } from "./pages/about";
import "./styles/App.css";
import { useEffect, useState } from "react";
import { Auth } from "./firebaseConfig";
import { set, ref, onValue, update } from "firebase/database";

import { onAuthStateChanged, signOut } from "firebase/auth";

function App() {
  const [user, setUser] = useState(null);
  const [userInfo, setUserInfo] = useState(null);

  useEffect(() => {
    onAuthStateChanged(Auth, (user) => {
      if (user) {
        setUser(user);

        console.log("Currently signed in: " + user.email);
      } else {
        console.log("not signed in");
      }
    });
  }, []);

  useEffect(() => {
    if (user !== null) {
      updateUserInfo();
    }
  }, [user]);

  async function getUser() {
    return user;
  }

  async function getUserInfo() {
    return userInfo;
  }

  async function updateUserInfo() {
    if (user !== null) {
      const userRef = ref(db, "users/" + user.uid);

      onValue(userRef, (snapshot) => {
        setUserInfo(snapshot.val());
      });
    }
  }

  async function createNewUser(username) {
    onAuthStateChanged(Auth, (user) => {
      if (user) {
        set(ref(db, "users/" + user.uid), {
          uid: user.uid,
          displayName: "",
          email: user.email,
          username: username,
          profilePic: "",
          gender: "",
          bio: "",
          followers: [""],
          following: [""],
          posts: [""],
        });
      }
    });
  }

  async function logout() {
    await signOut(Auth);
    setUser(null);
  }

  function overWriteProfileSettings(username, displayName, gender, bio) {
    update(ref(db, "users/" + user.uid), {
      displayName: displayName,
      email: user.email,
      username: username,
      profilePic: "",
      gender: gender,
      bio: bio,
    })
      .then(() => {
        updateUserInfo();
        window.location.href = "/profile";
      })
      .catch((err) => {
        console.log(err);
      });
  }

  return (
    <div className="App">
      <div className="nav">
        <Nav logout={logout} />
      </div>
      <div className="body">
        <Routes>
          <Route path="/" element={<Feed />} />
          <Route path="/login" element={<LoginPage logout={logout} />} />
          <Route
            path="/signUp"
            element={<SignUpPage createNewUser={createNewUser} />}
          />
          <Route
            path="/profile"
            element={
              <ProfilePage
                getUser={getUser}
                getUserInfo={getUserInfo}
                userInfo={userInfo}
              />
            }
          />
          <Route path="/content" element={<Content />} />
          <Route
            path="/settings"
            element={
              <ProfileSettings
                getUser={getUser}
                getUserInfo={getUserInfo}
                userInfo={userInfo}
                user={user}
                overWriteProfileSettings={overWriteProfileSettings}
              />
            }
          />
          <Route path="/about" element={<About />} />
        </Routes>
      </div>
    </div>
  );
}

export default App;
