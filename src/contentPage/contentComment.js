import { useEffect, useState } from "react";
import { ref, get, onValue, val } from "firebase/database";
import { db } from "../firebaseConfig";
import { useNavigate } from "react-router-dom";
import { Auth } from "../firebaseConfig";
import { GetProfilePic } from "../general/getProfilePic";

export function ContentComment(props) {
  const [commentID, setCommentID] = useState("");
  const [profilePic, setProfilePic] = useState(null);
  const [displayName, setDisplayName] = useState(null);
  const [commentVal, setCommentVal] = useState(null);
  const [date, setDate] = useState(null);
  const [deleteIcon, setDeleteIcon] = useState(null);
  const [styleDisplay, setStyleDisplay] = useState({ display: "flex" });
  const [update, setUpdate] = useState(true);
  const [commentData, setCommentData] = useState(null);
  const [likes, setLikes] = useState("");
  const [likesDisplay, setLikesDisplay] = useState("");
  const [disableLocal, setDisableLocal] = useState(!props.local);
  const [heartIcon, setHeartIcon] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    if (update) {
      getCommentData();
      setUpdate(false);
    }
  }, [update]);

  useEffect(() => {
    if (commentData === null || !commentData) {
      return;
    }

    if (profilePic == null) {
      loadUserData();
    }

    if (commentVal == null || date == null) {
      setCommentVal(commentData.commentVal);
      setDate(commentData.date);
      setLikes(commentData.likes);
    }
    handleHeartActive();
  }, [commentData]);

  useEffect(() => {
    if (likes === "" || !likes || likes === undefined) {
      heartInactive();
      setLikesDisplay("0 likes");
      return;
    }
    handleHeartActive();
    if (likes.length == 0 || likes.length > 1) {
      setLikesDisplay(likes.length + " likes");
    } else {
      setLikesDisplay("1 like");
    }
  }, [likes]);

  function getCommentData() {
    setCommentID(props.info.commentID);
    if (!props.local || disableLocal) {
      let commentIndex;
      const commentRef = ref(db, "posts/" + props.postID);
      onValue(commentRef, (snapshot) => {
        if (snapshot.val().comments === undefined) {
          return;
        }

        const arr = snapshot.val().comments;
        const isCommentByID = (obj) => obj.commentID === props.info.commentID;
        commentIndex = arr.findIndex(isCommentByID);

        setCommentID(commentIndex);
        setCommentData(snapshot.val().comments[commentIndex]);
      });
    } else {
      setCommentData(props.info);
      setLikes(0);
      setDisableLocal(true);
    }
  }

  function loadUserData() {
    const userRef = ref(db, "users/" + commentData.commenter);

    onValue(userRef, (snapshot) => {
      setDisplayName(snapshot.val().displayName);

      GetProfilePic(commentData.commenter).then((val) => {
        setProfilePic(val);
      });
    });

    toggleDeleteBtn();
  }

  function handleLike() {
    let newLikesArr = [];
    const currentUserUid = Auth.currentUser.uid;
    const postRef = ref(db, "posts/" + props.postID + "/comments");

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

  function toggleDeleteBtn() {
    if (Auth.currentUser.uid === commentData.commenter) {
      const deleteIcon = (
        <p
          style={{
            backgroundImage: "url(" + require("../images/assets/bin.png") + ")",
          }}
          className="commentDeleteIcon interactiveButton"
          onClick={handleDeleteComment}
        ></p>
      );
      setDeleteIcon(deleteIcon);
    } else {
      setDeleteIcon(null);
    }
  }
  function handleDeleteComment() {
    setStyleDisplay({ display: "none" });
    props.deleteComment(commentData.commentID);
  }

  function toProfile() {
    navigate("/profile/" + props.info.commenter, {
      state: { ownerUid: props.info.commenter },
    });
  }

  return (
    <div className="contentCommentCont" style={styleDisplay}>
      <div
        onClick={toProfile}
        className="contentCommentIcon"
        style={{
          backgroundImage: "url(" + profilePic + ")",
        }}
      ></div>
      <div className="contentCommentText">
        <div className="contentCommentTop">
          <p className="contentCommentDisplayName" onClick={toProfile}>
            {displayName}
          </p>
          <p className="contentCommentVal">{commentVal}</p>
        </div>
        <div className="contentCommentBottom">
          <p className="contentCommentDate">{date}</p>
          <p>{likesDisplay}</p>
        </div>
      </div>
      {deleteIcon}
      <div className="contentCommentMidPadding"></div>
      <img
        onClick={handleLike}
        src={heartIcon}
        className="contentCommentHeart interactiveButton"
      ></img>
    </div>
  );
}
