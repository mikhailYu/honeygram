import { useEffect, useState, useSyncExternalStore } from "react";
import { ref } from "firebase/database";
import { Auth } from "../firebaseConfig";
import GetProfileOwner from "../profile/getProfileOwner";
import { db } from "../firebaseConfig";
import { onValue } from "firebase/database";
import { ContentComment } from "../contentPage/contentComment";
import "../styles/Content.css";
import RetrieveImg from "../general/retrieveImage";
import { ContentDesc } from "../contentPage/contentDesc";

import uniqid from "uniqid";
export function Content(props) {
  const [profilePic, setProfilePic] = useState(null);
  const [postImg, setPostImg] = useState(null);
  const [postInfo, setPostInfo] = useState(null);
  const [owner, setOwner] = useState(null);
  const [ownerUsername, setOwnerUsername] = useState(null);
  const [contentDesc, setContentDesc] = useState(null);
  const [deleteIcon, setDeleteIcon] = useState(null);
  const [date, setDate] = useState(null);
  const [commentInput, setCommentInput] = useState(null);
  const [commentSection, setCommentSection] = useState(null);
  const [likes, setLikes] = useState(null);
  useEffect(() => {
    const url = window.location.href;

    const postID = url.split("post/")[1];
    const postRef = ref(db, "posts/" + postID);

    onValue(postRef, (snapshot) => {
      setPostInfo(snapshot.val());
    });
  }, []);

  useEffect(() => {
    if (postInfo !== null) {
      GetProfileOwner(postInfo.ownerUid)
        .then((val) => {
          onValue(val, (snapshot) => {
            setOwner(snapshot.val());
          });
        })
        .catch((err) => {
          console.log(err);
        });
    }
  }, [postInfo]);

  useEffect(() => {
    if (owner !== null) {
      const uid = owner.uid;
      const imgID = postInfo.postID;

      setOwnerUsername(owner.displayName);
      deleteIconCheck();
      loadComments();

      RetrieveImg("postImages", uid, imgID).then((val) => {
        console.log("Image Loaded");
        setPostImg(val);
      });

      RetrieveImg("profileImages", owner.uid, owner.profilePic).then((val) => {
        setProfilePic(val);
        setContentDesc(
          <ContentDesc
            profilePic={val}
            ownerName={owner.displayName}
            desc={postInfo.postDesc}
          />
        );
      });

      if (postInfo.date) {
        setDate(postInfo.date);
      }

      getLikes();
    }
  }, [owner]);

  function deleteCommentRetrieveData(commentID) {
    props.deleteComment(postInfo.postID, commentID);
  }

  function loadComments() {
    if (postInfo.comments) {
      let commentsArr = postInfo.comments.reverse().map((post) => {
        return (
          <ContentComment
            key={uniqid()}
            info={post}
            deleteComment={deleteCommentRetrieveData}
            updateLikesSort={updateLikesSort}
          />
        );
      });

      setCommentSection(commentsArr);
    } else {
      setCommentSection(null);
    }
  }

  function deleteIconCheck() {
    if (Auth.currentUser.uid === owner.uid) {
      const deleteIcon = (
        <p
          className="contentDeleteIcon"
          onClick={() => {
            props.deletePost(postInfo);
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

  function handlePostComment() {
    if (!commentInput || commentInput.length < 1) {
      alert("Please input a comment");
      return;
    }
    props.postComment(postInfo.postID, commentInput);

    document.getElementById("commentInputPost").value = null;
    setCommentInput(null);
  }

  function getLikes() {
    if (!postInfo.likes || postInfo.likes[0] === "") {
      setLikes("0 likes");
      return;
    }

    const likeCount = postInfo.likes.length;
    setLikes(likeCount + " likes");
  }

  function handleLikePost() {
    let newLikesArr = [];
    const currentUserUid = Auth.currentUser.uid;

    if (!postInfo.likes || postInfo.likes[0] === "") {
      newLikesArr = [currentUserUid];
    } else if (postInfo.likes.includes(currentUserUid)) {
      newLikesArr = postInfo.likes.filter((user) => {
        return user !== currentUserUid;
      });
    } else {
      let arr = postInfo.likes;
      newLikesArr = arr.concat(currentUserUid);
    }

    props.updatePostLikes(postInfo.postID, newLikesArr);
  }

  function updateLikesSort(likesArr, targetID) {
    const isID = (comment) => comment.commentID === targetID;
    const commentsArr = postInfo.comments;
    const index = commentsArr.reverse().findIndex(isID);

    props.updateCommentLikes(postInfo.postID, likesArr, index);
  }

  return (
    <div className="contentPageCont">
      <div
        className="contentPageImg"
        style={{
          backgroundImage: "url(" + postImg + ")",
        }}
      ></div>
      <div className="contentPageSideCont">
        <div className="contentPageSideTopCont">
          <div
            className="contentPageUserPic"
            style={{
              backgroundImage: "url(" + profilePic + ")",
            }}
          ></div>
          <p>{ownerUsername}</p>
          <div></div>
          {deleteIcon}
        </div>
        <div className="contentPageCommentSection">
          {contentDesc}
          {commentSection}
        </div>
        <div className="contentPageBottomCont">
          <div className="contentPageIconsCont">
            <p onClick={handleLikePost}>🧡</p>
          </div>
          <p>{likes}</p>
          <p>{date}</p>
          <div className="contentPageAddCommentCont">
            <input
              type="text"
              placeholder="Add a comment"
              id="commentInputPost"
              onChange={(e) => {
                setCommentInput(e.target.value);
              }}
            />
            <button type="button" onClick={handlePostComment}>
              Post
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
