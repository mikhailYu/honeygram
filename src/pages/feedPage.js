import "../styles/feed.css";
import { FeedContent } from "../feed/feedContent";
import { FeedSuggestions } from "../feed/feedSuggestions";

import { useEffect, useState, useSyncExternalStore } from "react";
import { ref } from "firebase/database";
import { Auth } from "../firebaseConfig";
import { onAuthStateChanged } from "firebase/auth";
import { Link } from "react-router-dom";
import { db } from "../firebaseConfig";
import { onValue } from "firebase/database";
import { ContentComment } from "../contentPage/contentComment";
import "../styles/Content.css";
import RetrieveImg from "../general/retrieveImage";
import { ContentDesc } from "../contentPage/contentDesc";
import { useNavigate } from "react-router-dom";
import uniqid from "uniqid";
import { FeedSuggestsUser } from "../feed/feedSuggestsUser";

export function Feed(props) {
  const [userData, setUserData] = useState(null);
  const [userUsername, setUserUsername] = useState(null);
  const [userDisplayName, setUserDisplayName] = useState(null);
  const [userProfPic, setUserProfPic] = useState(null);
  const [update, setUpdate] = useState(false);
  const [suggestsCont, setSuggestsCont] = useState(null);
  const [currentUid, setCurrentUid] = useState(null);

  useEffect(() => {
    onAuthStateChanged(Auth, (user) => {
      if (user) {
        setUpdate(true);
        if (currentUid == null) {
          setCurrentUid(user.uid);
        }
        console.log("Got user");
      }
    });
  }, []);

  useEffect(() => {
    if (update) {
      getUserInfo();
      setUpdate(false);
    }
  }, [update]);

  useEffect(() => {
    if (userData === null) {
      return;
    }
    if (userUsername === null || userDisplayName === null) {
      setUserUsername("@" + userData.username);
      setUserDisplayName(userData.displayName);
      RetrieveImg("profileImages", userData.uid, userData.profilePic).then(
        (val) => {
          setUserProfPic(val);
        }
      );

      if (suggestsCont !== null) {
        return;
      } else {
        setSuggestsCont(
          <FeedSuggestions
            passUpdateFollowsMain={passUpdateFollowsMain}
            currentUserUid={currentUid}
          />
        );
      }
    }
  }, [userData]);

  function getUserInfo() {
    const userUid = Auth.currentUser.uid;
    const userRef = ref(db, "users/" + userUid);

    onValue(userRef, (snapshot) => {
      setUserData(snapshot.val());
    });
  }
  function passUpdateFollowsMain(
    newFollowingArr,
    newFollowersArr,
    userRef,
    ownerRef
  ) {
    props.updateFollows(newFollowingArr, newFollowersArr, userRef, ownerRef);
  }
  return (
    <div className="feedCont">
      <div className="feedLPad"></div>
      <div className="feedPostsCont">
        <div className="feedProfileHeaderCont">
          <div
            className="feedProfileHeaderUserPic"
            style={{
              backgroundImage: "url(" + userProfPic + ")",
            }}
          ></div>
          <div className="feedProfileHeaderUserNames">
            <p>{userUsername}</p>
            <p>{userDisplayName}</p>
          </div>
          <div className="feedProfileHeaderGap"></div>
          <div
            onClick={() => {
              props.logout();
            }}
          >
            Log Out
          </div>
        </div>
        <FeedContent />
        <FeedContent />
      </div>

      {suggestsCont}

      <div className="feedRPad"></div>
    </div>
  );
}