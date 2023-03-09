import { Routes, Route, useNavigate, useLoaderData } from "react-router-dom";
import { Feed } from "./pages/feedPage";
import { db, Storage } from "./firebaseConfig";
import { SignUpPage } from "./pages/signUpPage";
import { LoginPage } from "./pages/loginPage";
import { Content } from "./pages/contentPage";
import { ProfilePage } from "./pages/profilePage";
import { ProfileSettings } from "./pages/profileSettingsPage";
import { Nav } from "./nav/nav";
import { About } from "./pages/about";
import { signInWithEmailAndPassword } from "firebase/auth";
import "./styles/App.css";
import { useEffect, useState } from "react";
import { Auth } from "./firebaseConfig";
import { set, ref, onValue, update, get, remove } from "firebase/database";
import uniqid from "uniqid";
import CreatePostPage from "./pages/createPostPage";
import { GetCurrentDate } from "./general/getCurrentDate";
import { useLocation } from "react-router-dom";
import { uploadBytes, ref as sRef, deleteObject } from "firebase/storage";

import { onAuthStateChanged, signOut } from "firebase/auth";

function App() {
  const [user, setUser] = useState(null);
  const [userInfo, setUserInfo] = useState(null);
  const [passedInfo, setPassedInfo] = useState(null);
  const [enableSignUp, setEnableSignup] = useState(false);

  const [style, setStyle] = useState({
    navStyle: { display: "none" },
    bodyStyle: { width: "100%" },
  });

  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (location.pathname === "/") {
      navigate("/login");
    }
    if (location.pathname === "/signUp") {
      setEnableSignup(true);
    } else {
      setEnableSignup(false);
    }
    if (location.pathname == "/login" || location.pathname == "/signUp") {
      setStyle({ navStyle: { display: "none" }, bodyStyle: { width: "100%" } });
    } else {
      setStyle({ navStyle: { display: "flex" }, bodyStyle: { width: "85%" } });
    }
  }, [location]);

  useEffect(() => {
    let unsubscribe = onAuthStateChanged(Auth, (gotUser) => {
      if (user === null && gotUser !== null) {
        setUser(gotUser);

        console.log("Currently signed in: " + gotUser.email);
      } else if (!gotUser) {
        console.log("not signed in");
      }
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    updateUserInfo();
  }, [user]);

  useEffect(() => {
    if (passedInfo === null) {
      setPassedInfo(userInfo);
    }
  }, [userInfo]);

  useEffect(() => {
    if (passedInfo === null) {
    }
  }, [passedInfo]);

  async function getUser() {
    return user;
  }

  async function getUserInfo() {
    return userInfo;
  }

  async function updateUserInfo() {
    if (user !== null) {
      const userRef = ref(db, "users/" + user.uid);

      get(userRef).then((snapshot) => {
        generateSuggestions();
        generateFeedPosts();
        setUserInfo(snapshot.val());
      });
    }
  }

  async function createNewUser(username) {
    set(ref(db, "users/" + Auth.currentUser.uid), {
      uid: Auth.currentUser.uid,
      displayName: "",
      email: Auth.currentUser.email,
      username: username,
      profilePic: null,
      gender: "",
      bio: "",
    }).then(() => {
      setEnableSignup(false);
      navigate("/settings");
    });
  }

  function generateFeedPosts() {
    const postsRef = ref(db, "posts/");
    const currentUserUid = Auth.currentUser.uid;
    const currentUserRef = ref(db, "users/" + currentUserUid);
    let postsArr = [];
    let usersUidArr = [];
    let postFromFollows = [];
    let fillerPosts = [];

    get(postsRef).then((snapshot) => {
      snapshot.forEach((post) => {
        if (post.val().date) {
          postsArr.unshift(post.val().postID);
          usersUidArr.unshift(post.val().ownerUid);
        }
      });

      get(currentUserRef).then((userSnap) => {
        for (let i = 0; i < postsArr.length; i++) {
          if (postFromFollows.length + fillerPosts.length >= 15) {
            break;
          }

          if (currentUserUid == usersUidArr[i]) {
            postFromFollows.push(postsArr[i]);
          } else if (!userSnap.val().following) {
            fillerPosts.push(postsArr[i]);
          } else if (userSnap.val().following.includes(usersUidArr[i])) {
            postFromFollows.push(postsArr[i]);
          } else {
            fillerPosts.push(postsArr[i]);
          }
        }

        const finalArr = [...postFromFollows, ...fillerPosts];

        update(currentUserRef, {
          feedPosts: finalArr,
        });
      });
    });
  }

  function generateSuggestions() {
    const usersRef = ref(db, "users/");
    const currentUserUid = Auth.currentUser.uid;
    let chosenUsers = [];
    let usersArr = [];

    get(usersRef).then((snapshot) => {
      snapshot.forEach((user) => {
        usersArr.push(user.val());
      });

      const numOfUsers = usersArr.length;

      for (let safetySwitch = 0; safetySwitch < 20; safetySwitch++) {
        if (chosenUsers.length >= numOfUsers - 1 || chosenUsers.length >= 5) {
          break;
        }

        const randomNum = Math.floor(Math.random() * numOfUsers);
        if (
          usersArr[randomNum].uid !== currentUserUid &&
          !arrayIncludes(usersArr[randomNum].uid)
        ) {
          chosenUsers.push(usersArr[randomNum].uid);
        }
      }

      function arrayIncludes(userUid) {
        if (chosenUsers.includes(userUid)) {
          return true;
        } else {
          return false;
        }
      }
      handleSuggestsUpdate();
    });

    function handleSuggestsUpdate() {
      const currentUserRef = ref(db, "users/" + currentUserUid);
      const suggestedUsers = Object.assign({}, chosenUsers);
      update(currentUserRef, {
        suggestedUsers: suggestedUsers,
      });
    }
  }

  async function login(loginEmail, loginPassword) {
    try {
      await signInWithEmailAndPassword(Auth, loginEmail, loginPassword).then(
        () => {
          updateUserInfo();
          navigate("/home");
        }
      );
    } catch (error) {
      alert("Incorrect login details");
    }
  }

  async function logout() {
    await signOut(Auth);
    setUser(null);
    setPassedInfo(null);
    navigate("/login");
  }

  function overWriteProfileSettings(
    username,
    displayName,
    gender,
    bio,
    profilePicName,
    imageUpload,
    imageChanged,
    chosenDefaultPic
  ) {
    if (imageChanged) {
      const imageRef = sRef(
        Storage,
        "profileImages/" + user.uid + "/" + profilePicName
      );

      uploadBytes(imageRef, imageUpload)
        .then(() => {
          console.log("Image Sent");
          update(ref(db, "users/" + user.uid), {
            displayName: displayName,
            email: user.email,
            username: username,
            profilePic: profilePicName,
            gender: gender,
            bio: bio,
            defaultPic: null,
          }).then(() => {
            const userUid = user.uid;
            updateUserInfo();
            navigate("/profile/" + userUid, { state: { ownerUid: userUid } });
          });
        })
        .catch((err) => {
          console.log(err);
        });
    } else if (chosenDefaultPic == null) {
      update(ref(db, "users/" + user.uid), {
        displayName: displayName,
        email: user.email,
        username: username,
        gender: gender,
        bio: bio,
        defaultPic: null,
      }).then(() => {
        const userUid = user.uid;
        updateUserInfo();
        navigate("/profile/" + userUid, { state: { ownerUid: userUid } });
      });
    } else {
      update(ref(db, "users/" + user.uid), {
        displayName: displayName,
        email: user.email,
        username: username,
        gender: gender,
        bio: bio,
        profilePic: null,
        defaultPic: chosenDefaultPic,
      }).then(() => {
        const userUid = user.uid;
        updateUserInfo();
        navigate("/profile/" + userUid, { state: { ownerUid: userUid } });
      });
    }
  }

  function uploadPost(image, desc) {
    if (image == null) {
      return;
    }

    let postsArr = [];

    if (userInfo.posts) {
      postsArr = userInfo.posts;
    }

    const postID = uniqid();
    const userUid = user.uid;
    let date = GetCurrentDate();
    const newPost = {
      postID: postID,
    };
    const imageRef = sRef(Storage, "postImages/" + userUid + "/" + postID);

    postsArr.push(newPost);
    if (postsArr[0] === "") {
      postsArr = postsArr.slice(1);
    }
    uploadBytes(imageRef, image)
      .then(() => {
        console.log("Image Sent");
        update(ref(db, "users/" + user.uid), {
          posts: postsArr,
        }).then(() => {
          set(ref(db, "posts/" + postID), {
            postID: postID,
            postDesc: desc,
            ownerUid: userUid,

            date: date,
          }).then(() => {
            updateUserInfo();
            navigate("/profile/" + userUid, { state: { ownerUid: userUid } });
          });
        });
      })
      .catch((err) => {
        console.log(err);
      });
  }

  function deletePost(postInfo, goToProfile) {
    const postID = postInfo.postID;
    const ownerUid = postInfo.ownerUid;
    const ownerRef = ref(db, "users/" + ownerUid);
    let ownerInfo;
    let ownerPosts = [];
    let newPostsArr = [];

    get(ownerRef).then((snapshot) => {
      ownerInfo = snapshot.val();
      ownerPosts = ownerInfo.posts;
      delFromOwnerArr();
    });

    function delFromOwnerArr() {
      ownerPosts.forEach((post) => {
        if (post.postID !== postID) {
          newPostsArr.push(post);
        }
      });

      if (newPostsArr.length === 0) {
        newPostsArr = [""];
      }

      update(ref(db, "users/" + ownerUid), {
        posts: newPostsArr,
      }).then(() => {
        delFromDB();
      });

      function delFromDB() {
        const postRef = ref(db, "posts/" + postID);

        remove(postRef).then(() => {
          delFromStorage();
        });
      }

      function delFromStorage() {
        const imageRef = sRef(Storage, "postImages/" + ownerUid + "/" + postID);
        deleteObject(imageRef)
          .then(() => {
            console.log("post deleted");
            if (goToProfile) {
              navigate("/profile/" + ownerUid, {
                state: { ownerUid: ownerUid },
              });
            }
          })
          .catch((err) => {
            console.log(err);
          });
      }
    }
  }

  function updateCommentLikes(postID, likesArr, index) {
    const commentRef = ref(db, "posts/" + postID + "/comments/" + index);

    update(commentRef, {
      likes: likesArr,
    });
  }
  function updateFollows(newFollowingArr, newFollowersArr, userRef, ownerRef) {
    update(userRef, {
      following: newFollowingArr,
    });
    update(ownerRef, {
      followers: newFollowersArr,
    });
  }

  function postComment(postID, commentVal, commentID) {
    const postRef = ref(db, "posts/" + postID);

    get(postRef).then((snapshot) => {
      let commentsArr = [];
      let date = GetCurrentDate();
      if (snapshot.val().comments) {
        commentsArr = snapshot.val().comments;
      }

      const newComment = {
        commenter: userInfo.uid,
        commentVal: commentVal,
        date: date,
        commentID: commentID,
      };

      commentsArr = [newComment, ...commentsArr];

      update(postRef, {
        comments: commentsArr,
      });
    });
  }

  function deleteComment(postID, commentID) {
    const postRef = ref(db, "posts/" + postID);

    let newCommentsArr = [];

    get(postRef).then((snapshot) => {
      newCommentsArr = snapshot.val().comments.filter((comment) => {
        return comment.commentID !== commentID;
      });

      update(postRef, {
        comments: newCommentsArr,
      });
    });
  }

  return (
    <div className="App">
      <div className="nav" style={style.navStyle}>
        <Nav getUser={getUser} logout={logout} />
      </div>
      <div className="body" style={style.bodyStyle}>
        <Routes>
          <Route
            exact
            path="/home"
            element={
              <Feed
                updateFollows={updateFollows}
                getUser={getUser}
                logout={logout}
                passedInfo={passedInfo}
                updateCommentLikes={updateCommentLikes}
                postComment={postComment}
              />
            }
          />

          <Route
            path="/login"
            element={<LoginPage login={login} logout={logout} />}
          />
          <Route
            path="/signUp"
            element={<SignUpPage createNewUser={createNewUser} />}
          />
          <Route
            path="/newPost"
            element={<CreatePostPage uploadPost={uploadPost} />}
          ></Route>
          <Route
            exact
            path="/profile/:uid"
            element={<ProfilePage getUser={getUser} />}
          />

          <Route
            exact
            path="/post/:ID"
            element={
              <Content
                deletePost={deletePost}
                postComment={postComment}
                deleteComment={deleteComment}
                updateCommentLikes={updateCommentLikes}
              />
            }
          />

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
