import { useEffect, useState, useSyncExternalStore } from "react";
import { db, Auth } from "../firebaseConfig";
import "../styles/Content.css";
import { ref, update, get } from "firebase/database";
import { useNavigate } from "react-router-dom";
import { GetProfilePic } from "../general/getProfilePic";

export function FeedSuggestsUser(props) {
  const navigate = useNavigate();
  const [reUpdate, setReUpdate] = useState(true);
  const [username, setUsername] = useState(null);
  const [displayName, setDisplayName] = useState(null);
  const [profPic, setProfPic] = useState(null);
  const [followButton, setFollowButton] = useState(null);
  const [loaded, setLoaded] = useState(false);
  const [openForUpdate, setOpenForUpdate] = useState(true);

  useEffect(() => {
    if (reUpdate && !loaded) {
      getFollowers();
      initUser();
      setReUpdate(false);
    }
  }, [reUpdate]);

  useEffect(() => {
    const userRef = ref(db, "users/" + props.userInfo);
    get(userRef).then((snapshot) => {
      if (openForUpdate) {
        getFollowers();
      }
    });
  }, [openForUpdate]);

  function initUser() {
    if (username == null) {
      const userRef = ref(db, "users/" + props.userInfo);
      get(userRef).then((snapshot) => {
        setUsername("@" + snapshot.val().username);
        setDisplayName(snapshot.val().displayName);
        GetProfilePic(snapshot.val().uid).then((val) => {
          setProfPic(val);
          setLoaded(true);
        });
      });
    }
  }

  function getFollowers() {
    const currentUser = Auth.currentUser;
    const userRef = ref(db, "users/" + currentUser.uid);

    get(userRef).then((snapshot) => {
      const followingArr = snapshot.val().following;

      if (openForUpdate) {
        if (!followingArr) {
          setOpenForUpdate(false);
          setFollowButton("Follow");
        } else if (followingArr.includes(props.userInfo)) {
          setOpenForUpdate(false);
          setFollowButton("Unfollow");
        } else {
          setOpenForUpdate(false);
          setFollowButton("Follow");
        }
      }
    });
  }

  function handleFollow() {
    const currentUser = Auth.currentUser;

    const userRef = ref(db, "users/" + currentUser.uid);
    const ownerRef = ref(db, "users/" + props.userInfo);

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
        newFollowingArr = [props.userInfo];
      } else if (snapshot.val().following.includes(props.userInfo)) {
        newFollowingArr = snapshot.val().following.filter((user) => {
          return user !== props.userInfo;
        });
      } else {
        let arr = snapshot.val().following;
        newFollowingArr = arr.concat(props.userInfo);
      }

      props.passUpdateFollows(
        newFollowingArr,
        newFollowersArr,
        userRef,
        ownerRef
      );
      setOpenForUpdate(true);
      setReUpdate(true);
    });
  }
  function toProfile() {
    navigate("/profile/" + props.userInfo, {
      state: { ownerUid: props.userInfo },
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
