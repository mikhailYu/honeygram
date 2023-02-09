import { useEffect, useState } from "react";
import { ref, get, onValue } from "firebase/database";
import { db } from "../firebaseConfig";
import { useNavigate } from "react-router-dom";
import { Auth } from "../firebaseConfig";
import RetrieveImg from "../general/retrieveImage";
import { ToggleCommentLike } from "../general/postInteractions";

export function ContentComment(props) {
  const [profilePic, setProfilePic] = useState(null);
  const [displayName, setDisplayName] = useState(null);
  const [commentVal, setCommentVal] = useState(null);
  const [date, setDate] = useState(null);
  const [deleteIcon, setDeleteIcon] = useState(null);
  const [styleDisplay, setStyleDisplay] = useState({ display: "flex" });
  const [commentData, setCommentData] = useState("");
  const [likes, setLikes] = useState(null);
  const [likesDisplay, setLikesDisplay] = useState("");
  const [update, setUpdate] = useState(true);
  const [loadedComment, setLoadedComment] = useState("");
  const [hasComments, setHasComments] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (update && loadedComment !== props.info.commentID) {
      setDate(props.info.date);
      setCommentVal(props.info.commentVal);

      const commenterRef = ref(db, "users/" + props.info.commenter);

      onValue(commenterRef, (snapshot) => {
        setDisplayName(snapshot.val().displayName);

        RetrieveImg(
          "profileImages",
          snapshot.val().uid,
          snapshot.val().profilePic
        ).then((val) => {
          setProfilePic(val);
        });
      });

      toggleDeleteBtn();

      setLoadedComment(props.info.commentID);
      updateData();
    } else if (update) {
      updateData();
    }
    setUpdate(false);
  }, [update]);

  useEffect(() => {
    console.log(commentData.likes);
    if (commentData.likes) {
      setLikes(commentData.likes);
    } else {
      setLikes([]);
    }
    console.log(commentData);
  }, [commentData]);

  useEffect(() => {
    if (likes === null || likes === [] || !likes.length) {
      setLikesDisplay("0 likes");
      return;
    } else if (likes.length === 1) {
      setLikesDisplay("1 like");
    } else {
      setLikesDisplay(likes.length + " likes");
    }
  }, [likes]);

  function updateData() {
    checkHasComments();
    if (hasComments) {
      const commentsRef = ref(db, "posts/" + props.postID + "/comments/");

      onValue(commentsRef, (snapshot) => {
        const commentsArr = snapshot.val();

        const isComment = (element) =>
          element.commentID === props.info.commentID;
        const commentIndex = commentsArr.findIndex(isComment);

        setCommentData(snapshot.val()[commentIndex]);
      });
    } else {
      setCommentData([]);
    }
  }

  function checkHasComments() {
    const commentRef = ref(db, "posts/" + props.postID);

    onValue(commentRef, (snapshot) => {
      if (snapshot.val().comments) {
        setHasComments(true);
      } else {
        setHasComments(false);
      }
    });
  }

  function toggleDeleteBtn() {
    if (Auth.currentUser.uid === props.info.commenter) {
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
    props.deleteComment(props.info.commentID);
  }

  function handleLike() {
    let newLikesArr = [];
    const currentUserUid = Auth.currentUser.uid;

    if (!commentData.likes) {
      newLikesArr = [currentUserUid];
    } else if (commentData.likes.includes(currentUserUid)) {
      newLikesArr = commentData.likes.filter((user) => {
        return user !== currentUserUid;
      });
    } else {
      let arr = commentData.likes;
      newLikesArr = arr.concat(currentUserUid);
    }

    props.updateLikesSort(newLikesArr, props.info.commentID);
    setUpdate(true);
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
