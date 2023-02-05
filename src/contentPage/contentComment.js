import { useEffect, useState } from "react";
import { ref, get, onValue } from "firebase/database";
import { db } from "../firebaseConfig";
import { useNavigate } from "react-router-dom";
import { Auth } from "../firebaseConfig";
import RetrieveImg from "../general/retrieveImage";

export function ContentComment(props) {
  const [profilePic, setProfilePic] = useState(null);
  const [displayName, setDisplayName] = useState(null);
  const [commentVal, setCommentVal] = useState(null);
  const [date, setDate] = useState(null);
  const [likes, setLikes] = useState(null);
  const [deleteIcon, setDeleteIcon] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
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

    getLikes();

    toggleDeleteBtn();
  }, [props.info]);

  function toggleDeleteBtn() {
    if (Auth.currentUser.uid === props.info.commenter) {
      const deleteIcon = (
        <p
          className="commentDeleteIcon"
          onClick={() => {
            props.deleteComment(props.info.commentID);
          }}
        >
          X
        </p>
      );
      setDeleteIcon(deleteIcon);
    } else {
      setDeleteIcon(null);
    }
  }

  function getLikes() {
    if (!props.info.likes || props.info.likes[0] === "") {
      setLikes("0 likes");
      return;
    }

    const likeCount = props.info.likes.length;
    setLikes(likeCount + " likes");
  }

  function handleLike() {
    let newLikesArr = [];
    const currentUserUid = Auth.currentUser.uid;

    if (!props.info.likes || props.info.likes[0] === "") {
      newLikesArr = [currentUserUid];
    } else if (props.info.likes.includes(currentUserUid)) {
      newLikesArr = props.info.likes.filter((user) => {
        return user !== currentUserUid;
      });
    } else {
      let arr = props.info.likes;
      newLikesArr = arr.concat(currentUserUid);
    }

    props.updateLikesSort(newLikesArr, props.info.commentID);
  }

  function toProfile() {
    navigate("/profile/" + props.info.commenter, {
      state: { ownerUid: props.info.commenter },
    });
  }

  return (
    <div className="contentCommentCont">
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
          <p>{likes}</p>
          {deleteIcon}
        </div>
      </div>
      <p onClick={handleLike}>🧡</p>
    </div>
  );
}
