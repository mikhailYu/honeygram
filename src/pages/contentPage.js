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
import { useNavigate } from "react-router-dom";
import uniqid from "uniqid";
import { GetProfilePic } from "../general/getProfilePic";
import { TogglePostLike } from "../general/postInteractions";

export function Content(props) {
  const navigate = useNavigate();
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
  const [update, setUpdate] = useState(true);
  const [loadedOwner, setLoadedOwner] = useState("");
  const [likesDisplay, setLikesDisplay] = useState("");
  const [likesCount, setLikesCount] = useState(null);

  useEffect(() => {
    if (update) {
      getPostInfo();
      setUpdate(false);
    }
  }, [update]);

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
    if (owner !== null && owner.uid !== loadedOwner) {
      const uid = owner.uid;
      const imgID = postInfo.postID;
      setLoadedOwner(uid);

      setOwnerUsername(owner.displayName);
      deleteIconCheck();
      loadComments();

      RetrieveImg("postImages", uid, imgID).then((val) => {
        console.log("Image Loaded");
        setPostImg(val);
      });

      GetProfilePic(owner.uid).then((val) => {
        setProfilePic(val);
      });

      if (postInfo.date) {
        setDate(postInfo.date);
      }
      setContentDesc(
        <ContentDesc
          key={uniqid()}
          ownerName={owner.displayName}
          desc={postInfo.postDesc}
          ownerUid={owner.uid}
        />
      );
      getLikes();
    } else if (owner !== null) {
      getLikes();
    }
  }, [owner]);

  useEffect(() => {
    if (likesCount === null) {
      setLikesDisplay("");
    } else if (likesCount === 1) {
      setLikesDisplay("1 like");
    } else {
      setLikesDisplay(likesCount + " likes");
    }
  }, [likesCount]);

  function getPostInfo() {
    const url = window.location.href;

    const postID = url.split("post/")[1];
    const postRef = ref(db, "posts/" + postID);

    onValue(postRef, (snapshot) => {
      setPostInfo(snapshot.val());
    });
  }

  function deleteCommentRetrieveData(commentID) {
    props.deleteComment(postInfo.postID, commentID);
  }

  function loadComments() {
    if (postInfo.comments) {
      let commentsArr = postInfo.comments.map((info) => {
        return (
          <ContentComment
            key={uniqid()}
            info={info}
            postID={postInfo.postID}
            deleteComment={deleteCommentRetrieveData}
            updateLikesSort={updateLikesSort}
            local={false}
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
            props.deletePost(postInfo, true);
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
    const uid = Auth.currentUser.uid;
    const newCommentID = uniqid();
    let newCommentInfo = {
      commentID: newCommentID,
      commentVal: commentInput,
      commenter: uid,
      date: "Now",
    };

    props.postComment(postInfo.postID, commentInput, newCommentID);

    document.getElementById("commentInputPost").value = null;
    setCommentInput(null);
    setUpdate(true);
    postLocally(newCommentInfo);
  }

  function postLocally(newCommentInfo) {
    let newComment = (
      <ContentComment
        key={uniqid()}
        info={newCommentInfo}
        postID={postInfo.postID}
        deleteComment={deleteCommentRetrieveData}
        updateLikesSort={updateLikesSort}
        local={true}
      />
    );

    if (commentSection) {
      setCommentSection([newComment, ...commentSection]);
    } else {
      setCommentSection([newComment]);
    }
  }

  function getLikes() {
    if (!postInfo.likes || postInfo.likes[0] === "") {
      setLikesCount(0);
      return;
    }

    const likeCount = postInfo.likes.length;
    setLikesCount(likeCount);
  }

  function handleLikePost() {
    TogglePostLike(postInfo, postInfo.postID);
    setUpdate(true);
  }

  function updateLikesSort(likesArr, targetID) {
    const isID = (comment) => comment.commentID === targetID;
    const commentsArr = getUpdatedCommentsArr();
    const index = commentsArr.findIndex(isID);

    props.updateCommentLikes(postInfo.postID, likesArr, index);
  }

  function getUpdatedCommentsArr() {
    const url = window.location.href;
    const postID = url.split("post/")[1];
    const postRef = ref(db, "posts/" + postID);
    let returnVal = "";

    onValue(postRef, (snapshot) => {
      returnVal = snapshot.val().comments;
    });
    return returnVal;
  }

  function toProfile() {
    navigate("/profile/" + owner.uid, {
      state: { ownerUid: owner.uid },
    });
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
            onClick={toProfile}
            style={{
              backgroundImage: "url(" + profilePic + ")",
            }}
          ></div>
          <p onClick={toProfile}> {ownerUsername}</p>
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
          <p>{likesDisplay}</p>
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
