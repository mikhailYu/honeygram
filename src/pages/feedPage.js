import "../styles/feed.css";
import { FeedContent } from "../feed/feedContent";
import { FeedSuggestions } from "../feed/feedSuggestions";

import { useEffect, useState, useSyncExternalStore } from "react";
import { ref, get } from "firebase/database";
import { db } from "../firebaseConfig";
import "../styles/Content.css";
import { Auth } from "../firebaseConfig";
import { useNavigate } from "react-router-dom";
import uniqid from "uniqid";
import { GetProfilePic } from "../general/getProfilePic";

export function Feed(props) {
  const [userData, setUserData] = useState(null);
  const [userUsername, setUserUsername] = useState(null);
  const [userDisplayName, setUserDisplayName] = useState(null);
  const [userProfPic, setUserProfPic] = useState(null);
  const [update, setUpdate] = useState(false);
  const [suggestsCont, setSuggestsCont] = useState(null);

  const [feedContentArr, setFeedContentArr] = useState([]);

  const navigate = useNavigate();

  useEffect(() => {
    if (props.passedInfo === null) {
      return;
    }

    setUpdate(true);
  }, [props.passedInfo]);

  useEffect(() => {
    if (!Auth.currentUser) {
      setTimeout(() => {
        if (!Auth.currentUser) {
          navigate("/login");
        }
      }, 4000);
    }
  }, [Auth.currentUser]);

  useEffect(() => {
    if (update) {
      setUserData(props.passedInfo);
      setUpdate(false);
      initFeedContent();
    }
  }, [update]);

  useEffect(() => {
    if (userData === null) {
      return;
    }
    if (userUsername === null || userDisplayName === null) {
      setUserUsername("@" + userData.username);
      setUserDisplayName(userData.displayName);

      GetProfilePic(userData.uid).then((val) => {
        setUserProfPic(val);
      });
    }

    setSuggestsCont(
      <FeedSuggestions
        passUpdateFollowsMain={passUpdateFollowsMain}
        updateSuggests={updateSuggests}
        currentUserUid={props.passedInfo.uid}
      />
    );
  }, [userData]);

  function initFeedContent() {
    const currentUserUid = props.passedInfo.uid;
    const userRef = ref(db, "users/" + currentUserUid);
    let postsArr;
    get(userRef).then((snapshot) => {
      if (snapshot.val().feedPosts) {
        postsArr = snapshot.val().feedPosts.map((postID) => {
          return (
            <FeedContent
              passCommentLikes={passCommentLikes}
              passPostComment={passPostComment}
              key={uniqid()}
              postID={postID}
            />
          );
        });
      }
      setFeedContentArr(postsArr);
    });
  }

  function passCommentLikes(postID, likesArr, index) {
    props.updateCommentLikes(postID, likesArr, index);
  }

  function passPostComment(postID, commentInput, newCommentID) {
    props.postComment(postID, commentInput, newCommentID);
  }

  function passUpdateFollowsMain(
    newFollowingArr,
    newFollowersArr,
    userRef,
    ownerRef
  ) {
    props.updateFollows(newFollowingArr, newFollowersArr, userRef, ownerRef);
  }

  function updateSuggests(chosenUsers, uid) {
    props.updateSuggests(chosenUsers, uid);
  }

  function goToProfile() {
    navigate("/profile/" + props.passedInfo.uid, {
      state: { ownerUid: props.passedInfo.uid },
    });
  }
  return (
    <div className="feedCont">
      <div className="feedLPad"></div>
      <div className="feedPostsCont">
        <div className="feedProfileHeaderCont">
          <div
            onClick={goToProfile}
            className="feedProfileHeaderUserPic"
            style={{
              backgroundImage: "url(" + userProfPic + ")",
            }}
          ></div>
          <div className="feedProfileHeaderUserNames">
            <p onClick={goToProfile}>{userUsername}</p>
            <p>{userDisplayName}</p>
          </div>
          <div className="feedProfileHeaderGap"></div>
          <div
            className="feedProfileHeaderLogoutBtn"
            onClick={() => {
              props.logout();
            }}
          >
            Log Out
          </div>
        </div>

        {feedContentArr}
      </div>

      {suggestsCont}

      <div className="feedRPad"></div>
    </div>
  );
}
