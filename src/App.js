import { Routes, Route, useNavigate } from "react-router-dom";
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
import CreatePostPage from "./pages/createPostPage";

import { onAuthStateChanged, signOut } from "firebase/auth";

function App() {
  const [user, setUser] = useState(null);
  const [userInfo, setUserInfo] = useState(null);

  const navigate = useNavigate();

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
          profilePic: null,
          gender: "",
          bio: "",
          followers: [""],
          following: [""],
          posts: [""],
        }).then(() => {
          window.location.href = "/settings";
        });
      }
    });
  }

  async function logout() {
    await signOut(Auth);
    setUser(null);
  }

  function overWriteProfileSettings(
    username,
    displayName,
    gender,
    bio,
    profilePicName
  ) {
    update(ref(db, "users/" + user.uid), {
      displayName: displayName,
      email: user.email,
      username: username,
      profilePic: profilePicName,
      gender: gender,
      bio: bio,
    })
      .then(() => {
        const userUid = user.uid;
        updateUserInfo();
        navigate("/profile/" + userUid, { state: { ownerUid: userUid } });
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
          <Route exact path="/" element={<Feed />} />
          <Route path="/login" element={<LoginPage logout={logout} />} />
          <Route
            path="/signUp"
            element={<SignUpPage createNewUser={createNewUser} />}
          />
          <Route path="/newPost" element={<CreatePostPage />}></Route>
          <Route
            exact
            path="/profile"
            element={<ProfilePage getUser={getUser} />}
          />
          <Route
            path="/profile/:uid"
            element={<ProfilePage getUser={getUser} />}
          />
          <Route path="/post" element={<Content />} />
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
