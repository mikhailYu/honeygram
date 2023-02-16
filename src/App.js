import { Routes, Route, useNavigate } from "react-router-dom";
import { Feed } from "./pages/feedPage";
import { db, Storage } from "./firebaseConfig";
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
import { set, ref, onValue, update, get, remove } from "firebase/database";
import uniqid from "uniqid";
import CreatePostPage from "./pages/createPostPage";
import { GetCurrentDate } from "./general/getCurrentDate";
import { uploadBytes, ref as sRef, deleteObject } from "firebase/storage";

import { onAuthStateChanged, signOut } from "firebase/auth";

function App() {
  const [user, setUser] = useState(null);
  const [userInfo, setUserInfo] = useState(null);
  const [passedInfo, setPassedInfo] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    let unsubscribe = onAuthStateChanged(Auth, (gotUser) => {
      if (gotUser && user === null) {
        setUser(gotUser);
        updateUserInfo();

        console.log("Currently signed in: " + gotUser.email);
      } else {
        console.log("not signed in");
      }
    });
    return () => unsubscribe();
  }, []);

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
        if (!snapshot.val().suggestedUsers) {
          generateSuggestions();
        }
        setUserInfo(snapshot.val());
        if (passedInfo === null) {
          setPassedInfo(snapshot.val());
        }
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
        }).then(() => {
          navigate("/settings");
        });
      }
    });
  }

  function generateSuggestions() {
    const usersRef = ref(db, "users/");
    const currentUserUid = Auth.currentUser.uid;
    let chosenUsers = [];
    let usersArr = [];

    onValue(usersRef, (snapshot) => {
      snapshot.forEach((user) => {
        usersArr.push(user.val());
      });

      const numOfUsers = usersArr.length;

      for (let safetySwitch = 0; safetySwitch < 20; safetySwitch++) {
        if (chosenUsers.length >= numOfUsers - 1 || chosenUsers.length >= 5) {
          handleSuggestsUpdate();
          break;
        }

        const randomNum = Math.floor(Math.random() * numOfUsers);
        if (
          usersArr[randomNum].uid !== currentUserUid &&
          !arrayIncludes(usersArr[randomNum].uid)
        ) {
          chosenUsers.push(usersArr[randomNum].uid);
        }
        console.log("Suggests regened");
      }

      function arrayIncludes(userUid) {
        if (chosenUsers.includes(userUid)) {
          return true;
        } else {
          return false;
        }
      }
    });
    function handleSuggestsUpdate() {
      const currentUserRef = ref(db, "users/" + currentUserUid);
      const suggestedUsers = Object.assign({}, chosenUsers);

      update(currentUserRef, {
        suggestedUsers: suggestedUsers,
      });
    }
  }

  async function logout() {
    await signOut(Auth);
    setUser(null);
    navigate("/login");
  }

  function overWriteProfileSettings(
    username,
    displayName,
    gender,
    bio,
    profilePicName,
    imageUpload
  ) {
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
        }).then(() => {
          const userUid = user.uid;
          updateUserInfo();
          navigate("/profile/" + userUid, { state: { ownerUid: userUid } });
        });
      })
      .catch((err) => {
        console.log(err);
      });
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
      <div className="nav">
        <Nav getUser={getUser} logout={logout} />
      </div>
      <div className="body">
        <Routes>
          <Route
            exact
            path="/"
            element={
              <Feed
                updateFollows={updateFollows}
                getUser={getUser}
                logout={logout}
                passedInfo={passedInfo}
              />
            }
          />
          <Route path="/login" element={<LoginPage logout={logout} />} />
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
