import { useEffect, useState, useSyncExternalStore } from "react";
import { db, Auth } from "../firebaseConfig";
import { onValue } from "firebase/database";
import "../styles/Content.css";
import RetrieveImg from "../general/retrieveImage";
import { ref, update, get } from "firebase/database";
import { useNavigate } from "react-router-dom";

export function FeedSuggestsUser(props) {
  const navigate = useNavigate();
  const [reUpdate, setReUpdate] = useState(true);
  const [username, setUsername] = useState(null);
  const [displayName, setDisplayName] = useState(null);
  const [profPic, setProfPic] = useState(null);
  const [followButton, setFollowButton] = useState(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    if (reUpdate && !loaded) {
      getFollowers();
      initUser();
      setReUpdate(false);
    }
  }, [reUpdate]);

  function initUser() {
    if (username == null) {
      setUsername("@" + props.userInfo.username);
      setDisplayName(props.userInfo.displayName);
      RetrieveImg(
        "profileImages",
        props.userInfo.uid,
        props.userInfo.profilePic
      ).then((val) => {
        setProfPic(val);
        setLoaded(true);
      });
    }
  }

  function getFollowers() {
    const currentUser = Auth.currentUser;
    const userRef = ref(db, "users/" + currentUser.uid);

    onValue(userRef, (snapshot) => {
      const currentUser = Auth.currentUser;
      const userRef = ref(db, "users/" + currentUser.uid);

      if (!snapshot.val().following) {
        setFollowButton("Follow");
      } else if (snapshot.val().following.includes(props.userInfo.uid)) {
        setFollowButton("Unfollow");
      } else {
        setFollowButton("Follow");
      }
    });
  }

  function handleFollow() {
    const currentUser = Auth.currentUser;

    const userRef = ref(db, "users/" + currentUser.uid);
    const ownerRef = ref(db, "users/" + props.userInfo.uid);

    let newFollowersArr = [];
    let newFollowingArr = [];

    let followers = [];

    get(ownerRef).then((snapshot) => {
      if (snapshot.val().followers) {
        followers = snapshot.val().followers;
      }
    });

    get(userRef).then((snapshot) => {
      if (!followers) {
        newFollowersArr = [currentUser.uid];
      } else if (followers.includes(currentUser.uid)) {
        newFollowersArr = followers.filter((user) => {
          return user !== currentUser.uid;
        });
      } else {
        let arr = followers;

        newFollowersArr = arr.concat(currentUser.uid);
      }

      if (!snapshot.val().following) {
        newFollowingArr = [props.userInfo.uid];
      } else if (snapshot.val().following.includes(props.userInfo.uid)) {
        newFollowingArr = snapshot.val().following.filter((user) => {
          return user !== props.userInfo.uid;
        });
      } else {
        let arr = snapshot.val().following;
        newFollowingArr = arr.concat(props.userInfo.uid);
      }

      props.passUpdateFollows(
        newFollowingArr,
        newFollowersArr,
        userRef,
        ownerRef
      );

      setReUpdate(true);
    });
  }
  function toProfile() {
    navigate("/profile/" + props.userInfo.uid, {
      state: { ownerUid: props.userInfo.uid },
    });
  }
  return (
    <div className="feedSuggestsUserCont">
      <div
        onClick={toProfile}
        className="feedSuggestsUserImg"
        style={{
          backgroundImage: "url(" + profPic + ")",
        }}
      ></div>

      <div className="feedSuggestsNamesCont">
        <p onClick={toProfile}>{displayName}</p>
        <p onClick={toProfile}>{username}</p>
      </div>

      <button
        className="feedSuggestsButton"
        type="button"
        onClick={handleFollow}
      >
        {followButton}
      </button>
    </div>
  );
}
