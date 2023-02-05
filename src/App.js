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

  function deletePost(postInfo) {
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
            navigate("/profile/" + ownerUid, { state: { ownerUid: ownerUid } });
          })
          .catch((err) => {
            console.log(err);
          });
      }
    }
  }

  function updatePostLikes(postID, likesArr) {
    const postRef = ref(db, "posts/" + postID);

    update(postRef, {
      likes: likesArr,
    });
  }

  function updateCommentLikes(postID, likesArr, index) {
    const commentRef = ref(db, "posts/" + postID + "/comments/" + index);

    update(commentRef, {
      likes: likesArr,
    });
  }

  function postComment(postID, commentVal) {
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
        commentID: uniqid(),
      };

      commentsArr.push(newComment);

      update(postRef, {
        comments: commentsArr,
      });
    });
  }

  function postCommentAsReply() {
    // replies to a comment
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
                updatePostLikes={updatePostLikes}
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
