import "../styles/profile.css";
import { ProfilePreviewPic } from "../profile/profilePreviewPic";
import { Link, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import GetProfileOwner from "../profile/getProfileOwner";
import { onValue } from "firebase/database";
import RetrieveImg from "../general/retrieveImage";
import { ref, update, get } from "firebase/database";
import { db, Auth } from "../firebaseConfig";
import uniqid from "uniqid";

export function ProfilePage(props) {
  const location = useLocation();
  const [username, setUsername] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [bio, setBio] = useState("");
  const [owner, setOwner] = useState(null);
  const [upperButton, setUpperButton] = useState(null);
  const [profilePic, setProfilePic] = useState(null);
  const [profileContent, setProfileContent] = useState(null);

  const [postCount, setPostCount] = useState("");
  const [followerCount, setFollowerCount] = useState("");
  const [followingCount, setFollowingCount] = useState("");

  useEffect(() => {
    if (location.state !== null) {
      const { ownerUid } = location.state;
      GetProfileOwner(ownerUid).then((val) => {
        onValue(val, (snapshot) => {
          setOwner(snapshot.val());
        });
      });
    } else {
      const url = window.location.href;
      const urlUid = url.split("profile/")[1];
      GetProfileOwner(urlUid).then((val) => {
        onValue(val, (snapshot) => {
          setOwner(snapshot.val());
        });
      });
    }
  }, [location.state]);

  useEffect(() => {
    if (owner !== null) {
      setUsername(owner.username);
      setDisplayName(owner.displayName);
      setBio(owner.bio);
      getProfilePic(owner.profilePic);
      setUpStats();

      loadPosts();
      toggleUpperButtons();
      console.log("Profile info set to user: " + owner.username);
    }
  }, [owner]);

  async function checkIsFollow() {
    const userUid = Auth.currentUser.uid;
    if (!owner.followers) {
      return "Follow";
    } else if (owner.followers.includes(userUid)) {
      return "Unfollow";
    } else {
      return "Follow";
    }
  }

  function loadPosts() {
    if (!owner.posts || owner.posts.length <= 0 || owner.posts[0] === "") {
      const noPostsDiv = <p>User has no posts</p>;
      setProfileContent(noPostsDiv);
    } else {
      const postsArr = owner.posts.reverse().map((postInfo) => {
        return (
          <ProfilePreviewPic
            key={uniqid()}
            postInfo={postInfo}
            uid={owner.uid}
          />
        );
      });

      setProfileContent(postsArr);
    }
  }

  function setUpStats() {
    let numOfPosts = "";
    let numOfFollowers = "";
    let numOfFollowing = "";
    const currentUser = Auth.currentUser;

    if (!owner.posts) {
      numOfPosts = "0 posts";
    } else if (owner.posts.length === 1) {
      numOfPosts = "1 post";
    } else {
      numOfPosts = owner.posts.length + " posts";
    }

    if (!owner.followers) {
      numOfFollowers = "0 followers";
    } else if (owner.followers.length === 1) {
      numOfFollowers = "1 follower";
    } else {
      numOfFollowers = owner.followers.length + " followers";
    }

    if (!owner.following) {
      numOfFollowing = "0 following";
    } else {
      numOfFollowing = owner.following.length + " following";
    }

    setPostCount(numOfPosts);
    setFollowerCount(numOfFollowers);
    setFollowingCount(numOfFollowing);
  }

  function getProfilePic(picName) {
    if (owner !== null) {
      RetrieveImg("profileImages", owner.uid, picName).then((val) => {
        setProfilePic(val);
      });
    }
  }

  function toggleUpperButtons() {
    props.getUser().then((val) => {
      if (val !== null) {
        if (val.uid === owner.uid) {
          setUpperButton(
            <Link className="profilePageEditBtn" to={"/settings"}>
              Edit
            </Link>
          );
        } else {
          checkIsFollow().then((val) =>
            setUpperButton(
              <button className="profilePageFollowBtn" onClick={handleFollow}>
                {val}
              </button>
            )
          );
        }
      }
    });
  }

  function handleFollow() {
    const currentUser = Auth.currentUser;

    const userRef = ref(db, "users/" + currentUser.uid);
    const ownerRef = ref(db, "users/" + owner.uid);

    let newFollowersArr = [];
    let newFollowingArr = [];

    get(userRef).then((snapshot) => {
      if (!owner.followers) {
        newFollowersArr = [currentUser.uid];
      } else if (owner.followers.includes(currentUser.uid)) {
        newFollowersArr = owner.followers.filter((user) => {
          return user !== currentUser.uid;
        });
      } else {
        let arr = owner.followers;
        newFollowersArr = arr.concat(currentUser.uid);
      }

      if (!snapshot.val().following) {
        newFollowingArr = [owner.uid];
      } else if (snapshot.val().following.includes(owner.uid)) {
        newFollowingArr = snapshot.val().following.filter((user) => {
          return user !== owner.uid;
        });
      } else {
        let arr = snapshot.val().following;
        newFollowingArr = arr.concat(owner.uid);
      }

      update(userRef, {
        following: newFollowingArr,
      });
      update(ownerRef, {
        followers: newFollowersArr,
      });
    });
  }

  return (
    <div className="profileCont">
      <div className="profileInfoCont">
        <div className="profileInfoPicCont">
          <div
            className="profileInfoPic"
            style={{
              backgroundImage: "url(" + profilePic + ")",
            }}
          ></div>
        </div>
        <div className="profileTextCont">
          <div className="profileNameCont">
            <p>{username}</p>
            {upperButton}
          </div>
          <div className="profileStatsCont">
            <p>{postCount}</p>
            <p>{followerCount}</p>
            <p>{followingCount}</p>
          </div>
          <div className="profileDescCont">
            <div className="profileDescTitles">
              <p>{"@" + username}</p>
              <p>{displayName}</p>
            </div>
            <p className="profileDescText">{bio}</p>
          </div>
        </div>
      </div>

      <div className="profileContentCont">{profileContent}</div>
    </div>
  );
}
