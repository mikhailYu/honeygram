import { useEffect, useState } from "react";
import { ref, get, onValue, val } from "firebase/database";
import { db } from "../firebaseConfig";
import { useNavigate } from "react-router-dom";
import { Auth } from "../firebaseConfig";
import RetrieveImg from "../general/retrieveImage";
import { GetProfilePic } from "../general/getProfilePic";

import { ToggleCommentLike } from "../general/postInteractions";

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

    if (profilePic == null) {
      loadUserData();
    }

    if (commentVal == null || date == null) {
      setCommentVal(commentData.commentVal);
      setDate(commentData.date);
      setLikes(commentData.likes);
    }
  }, [commentData]);

  useEffect(() => {
    if (likes === "" || !likes || likes === undefined) {
      setLikesDisplay("0 likes");
      return;
    }

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

  function toggleDeleteBtn() {
    if (Auth.currentUser.uid === commentData.commenter) {
      const deleteIcon = (
        <p className="commentDeleteIcon" onClick={handleDeleteComment}>
          X
        </p>
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
          <p onClick={toProfile}>{displayName}</p>
          <p>{commentVal}</p>
        </div>
        <div className="contentCommentBottom">
          <p>{date}</p>
          <p>{likesDisplay}</p>
          {deleteIcon}
        </div>
      </div>
      <p onClick={handleLike}>🧡</p>
    </div>
  );
}
