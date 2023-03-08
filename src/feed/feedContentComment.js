import { useEffect, useState } from "react";
import { ref, get, onValue, val } from "firebase/database";
import { db } from "../firebaseConfig";
import { useNavigate } from "react-router-dom";
import { Auth } from "../firebaseConfig";

export function FeedContentComment(props) {
  const [commentID, setCommentID] = useState("");
  const [displayName, setDisplayName] = useState(null);
  const [commentVal, setCommentVal] = useState(null);

  const [update, setUpdate] = useState(true);
  const [commentData, setCommentData] = useState(null);
  const [likes, setLikes] = useState("");
  const [likesDisplay, setLikesDisplay] = useState("");
  const [heartIcon, setHeartIcon] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    if (update) {
      getCommentData();
      setUpdate(false);
    }
  }, [update]);

  useEffect(() => {
    if (commentData === null) {
      return;
    }

    if (displayName == null) {
      loadUserData();
    }

    if (commentVal == null) {
      setCommentVal(commentData.commentVal);

      setLikes(commentData.likes);
    }
    handleHeartActive();
  }, [commentData]);

  useEffect(() => {
    if (likes === "" || !likes || likes === undefined) {
      setLikesDisplay("0");
      return;
    }

    if (likes.length == 0 || likes.length > 1) {
      setLikesDisplay(likes.length);
    } else {
      setLikesDisplay("1");
    }
  }, [likes]);

  function getCommentData() {
    setCommentID(props.info.commentID);

    let commentIndex;
    const commentRef = ref(db, "posts/" + props.postID);
    onValue(commentRef, (snapshot) => {
      if (snapshot.val() === null) {
        return;
      }

      if (!snapshot.val().comments) {
        return;
      }
      const arr = snapshot.val().comments;
      const isCommentByID = (obj) => obj.commentID === props.info.commentID;
      commentIndex = arr.findIndex(isCommentByID);

      setCommentID(commentIndex);
      setCommentData(snapshot.val().comments[commentIndex]);
    });
  }

  function loadUserData() {
    const userRef = ref(db, "users/" + commentData.commenter);

    onValue(userRef, (snapshot) => {
      setDisplayName(snapshot.val().displayName);
    });
  }

  function handleLike() {
    let newLikesArr = [];
    const currentUserUid = Auth.currentUser.uid;

    if (!commentData.likes || commentData.likes[0] === "") {
      newLikesArr = [currentUserUid];
    } else if (commentData.likes.includes(currentUserUid)) {
      newLikesArr = commentData.likes.filter((user) => {
        return user !== currentUserUid;
      });
    } else {
      let arr = commentData.likes;
      newLikesArr = arr.concat(currentUserUid);
    }
    props.updateLikesSort(newLikesArr, commentData.commentID);
    setLikes(newLikesArr);
    setUpdate(true);
  }

  function handleHeartActive() {
    if (!commentData.likes) {
      heartInactive();
      return;
    }
    if (commentData.likes.includes(Auth.currentUser.uid)) {
      heartActive();
    } else {
      heartInactive();
    }
  }

  function heartActive() {
    setHeartIcon(require("../images/assets/likeIcon_active.png"));
  }

  function heartInactive() {
    setHeartIcon(require("../images/assets/likeIcon_inactive.png"));
  }

  function toProfile() {
    navigate("/profile/" + props.info.commenter, {
      state: { ownerUid: props.info.commenter },
    });
  }
  return (
    <div className="feedContentComment">
      <div className="feedContentCommentTop">
        <p className="feedContentCommentName" onClick={toProfile}>
          {displayName}
        </p>
        <div className="feedContentCommentLikes">
          <p className="feedContentCommentLikesDisplay">{likesDisplay}</p>
          <p
            className="feedContentCommentHeart interactiveButton"
            style={{
              backgroundImage: "url(" + heartIcon + ")",
            }}
            onClick={handleLike}
          ></p>
        </div>
      </div>

      <p className="feedContentCommentVal">{commentVal}</p>
    </div>
  );
}
