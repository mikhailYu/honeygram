import { ref, update, get, onValue } from "firebase/database";
import { Auth } from "../firebaseConfig";
import { useEffect, useState, useSyncExternalStore } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { db } from "../firebaseConfig";
import { FeedContentComment } from "./feedContentComment";
import RetrieveImg from "../general/retrieveImage";
import { TogglePostLike } from "../general/postInteractions";
import { GetProfilePic } from "../general/getProfilePic";
import uniqid from "uniqid";

export function FeedContent(props) {
  const [isUpdate, setIsUpdate] = useState(true);
  const [postData, setPostData] = useState(null);
  const [displayName, setDisplayName] = useState(null);
  const [date, setDate] = useState(null);
  const [profilePic, setProfilePic] = useState(null);
  const [ownerUid, setOwnerUid] = useState(null);
  const [postImg, setPostImg] = useState(null);
  const [updateLikes, setUpdateLikes] = useState(true);
  const [likes, setLikes] = useState(null);
  const [likesDisplay, setLikesDisplay] = useState(null);
  const [postDesc, setpostDesc] = useState(null);
  const [commentInput, setCommentInput] = useState("");
  const [commentsArr, setCommentsArr] = useState([]);
  const [followBtn, setFollowBtn] = useState("");
  const [heartIcon, setHeartIcon] = useState(null);

  const navigate = useNavigate();
  useEffect(() => {
    if (isUpdate) {
      updatePostData();

      setIsUpdate(false);
    }
  }, [isUpdate]);

  useEffect(() => {
    if (postData == null) {
      return;
    }
    const userRef = ref(db, "users/" + postData.ownerUid);

    setOwnerUid(postData.ownerUid);
    get(userRef).then((snapshot) => {
      getLikes();

      if (displayName === null) {
        loadComments();

        setDisplayName(snapshot.val().displayName);
        GetProfilePic(snapshot.val().uid).then((val) => {
          setProfilePic(val);
        });

        RetrieveImg("postImages", postData.ownerUid, props.postID).then(
          (val) => {
            setPostImg(val);
          }
        );

        const desc = (
          <div className="feedContentDescCont">
            <p
              onClick={() => {
                navigate("/profile/" + snapshot.val().uid, {
                  state: { ownerUid: snapshot.val().uid },
                });
              }}
            >
              {snapshot.val().displayName}{" "}
            </p>
            <p>{postData.postDesc}</p>
          </div>
        );
        setpostDesc(desc);
      }
    });

    setDate(postData.date);
    toggleFollow();
  }, [postData]);

  useEffect(() => {
    if (commentsArr === [] || commentsArr === null) {
      setCommentsArr("No comments");
    }
  }, [commentsArr]);

  useEffect(() => {
    if (likes === null) {
      heartInactive();
      setLikesDisplay("0 likes");
    } else if (likes.length === 1) {
      handleHeartActive();
      setLikesDisplay("1 like");
    } else {
      handleHeartActive();
      setLikesDisplay(likes.length + " likes");
    }
  }, [likes]);

  function getLikes() {
    const postRef = ref(db, "posts/" + props.postID);

    get(postRef).then((snapshot) => {
      if (!updateLikes) {
        return;
      }
      if (!snapshot.val().likes) {
        setLikes([]);
        setUpdateLikes(false);
        return;
      }

      setLikes(snapshot.val().likes);
      setUpdateLikes(false);
    });
  }

  function goToProfile() {
    if (ownerUid == null) {
      return;
    }
    navigate("/profile/" + ownerUid, {
      state: { ownerUid: ownerUid },
    });
  }

  function loadComments() {
    const postRef = ref(db, "posts/" + props.postID);

    get(postRef).then((snapshot) => {
      if (!snapshot.val().comments) {
        setCommentsArr(null);

        return;
      }

      let commentsArr = snapshot.val().comments.map((info) => {
        return (
          <FeedContentComment
            key={uniqid()}
            info={info}
            postID={postData.postID}
            updateLikesSort={updateLikesSort}
          />
        );
      });

      setCommentsArr(commentsArr);
    });
  }

  function updateLikesSort(likesArr, targetID) {
    const isID = (comment) => comment.commentID === targetID;
    const commentsArr = getUpdatedCommentsArr();
    const index = commentsArr.findIndex(isID);

    props.passCommentLikes(postData.postID, likesArr, index);
  }

  function getUpdatedCommentsArr() {
    const postRef = ref(db, "posts/" + postData.postID);
    let returnVal = "";

    onValue(postRef, (snapshot) => {
      returnVal = snapshot.val().comments;
    });
    return returnVal;
  }

  function updatePostData() {
    const postRef = ref(db, "posts/" + props.postID);

    onValue(postRef, (snapshot) => {
      setPostData(snapshot.val());
    });
  }

  function handleLike() {
    TogglePostLike(postData, postData.postID);
    setUpdateLikes(true);
    setIsUpdate(true);
  }

  function handleHeartActive() {
    if (!postData.likes) {
      heartInactive();
      return;
    }
    if (postData.likes.includes(Auth.currentUser.uid)) {
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

  function goToPost() {
    if (props.postID == null) {
      return;
    }
    navigate("/post/" + props.postID);
  }

  function handlePostComment() {
    if (commentInput === "") {
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

    props.passPostComment(postData.postID, commentInput, newCommentID);

    setIsUpdate(true);
    postLocally(newCommentInfo);
    setCommentInput("");
  }

  function postLocally(newCommentInfo) {
    let newComment = (
      <FeedContentComment
        key={uniqid()}
        local={true}
        info={newCommentInfo}
        postID={postData.postID}
        updateLikesSort={updateLikesSort}
      />
    );

    if (commentsArr) {
      setCommentsArr([newComment, ...commentsArr]);
    } else {
      setCommentsArr([newComment]);
    }
  }

  function toggleFollow() {
    const userUid = Auth.currentUser.uid;
    const userRef = ref(db, "users/" + userUid);
    get(userRef).then((snapshot) => {
      checkIsFollow(snapshot.val()).then((val) =>
        setFollowBtn(
          <button className="profilePageFollowBtn" onClick={handleFollow}>
            {val}
          </button>
        )
      );
    });
  }

  async function checkIsFollow(snapshot) {
    if (snapshot.uid == postData.ownerUid) {
      return;
    } else if (!snapshot.following) {
      return "Follow";
    } else if (snapshot.following.includes(postData.ownerUid)) {
      return "Unfollow";
    } else if (snapshot.uid === postData.ownerUid) {
      return;
    } else {
      return "Follow";
    }
  }

  function handleFollow() {
    const currentUser = Auth.currentUser;

    const userRef = ref(db, "users/" + currentUser.uid);
    const ownerRef = ref(db, "users/" + postData.ownerUid);

    let newFollowersArr = [];
    let newFollowingArr = [];
    get(ownerRef).then((ownerSnap) => {
      let owner = ownerSnap.val();
      get(userRef).then((snapshot) => {
        if (!owner.followers) {
          newFollowersArr = [currentUser.uid];
        } else if (owner.followers.includes(currentUser.uid)) {
          newFollowersArr = owner.followers.filter((user) => {
            return user !== currentUser.uid;
          });
        } else {
          let arr = owner.followers;

          newFollowersArr = arr.concat(currentUser.uid);
        }

        if (!snapshot.val().following) {
          newFollowingArr = [owner.uid];
        } else if (snapshot.val().following.includes(owner.uid)) {
          newFollowingArr = snapshot.val().following.filter((user) => {
            return user !== owner.uid;
          });
        } else {
          let arr = snapshot.val().following;
          newFollowingArr = arr.concat(owner.uid);
        }

        update(ownerRef, {
          followers: newFollowersArr,
        });
        update(userRef, {
          following: newFollowingArr,
        }).then(() => {
          toggleFollow();
        });
      });
    });
  }
  return (
    <div className="feedContentCont">
      <div className="feedContentUpperCont">
        <div
          onClick={goToProfile}
          className="feedContentUpperProfPic"
          style={{
            backgroundImage: "url(" + profilePic + ")",
          }}
        ></div>
        <div>
          <p onClick={goToProfile}>{displayName}</p>
        </div>
        {followBtn}
      </div>
      <div
        onClick={goToPost}
        className="feedContentPic"
        style={{
          backgroundImage: "url(" + postImg + ")",
        }}
      ></div>
      <div className="feedContentLikesImgDisplay">
        <div className="feedContentIconsCont">
          <p
            className="feedContentHeart interactiveButton"
            style={{
              backgroundImage: "url(" + heartIcon + ")",
            }}
            onClick={handleLike}
          ></p>
        </div>
        <div className="feedContentLikesCont">
          <p>{likesDisplay}</p>
        </div>
      </div>
      {postDesc}
      <div className="feedContentCommentsCont">{commentsArr}</div>
      <p className="feedContentDate">{date}</p>
      <form className="feedContentAddCommentCont">
        <input
          id="feedCommentInputPost"
          type="text"
          placeholder="Add a comment"
          value={commentInput}
          onChange={(e) => {
            setCommentInput(e.target.value);
          }}
        />
        <button type="submit" onClick={handlePostComment}>
          Post
        </button>
      </form>
    </div>
  );
}
