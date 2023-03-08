import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import RetrieveImg from "../general/retrieveImage";
import { db } from "../firebaseConfig";
import { ref, get } from "firebase/database";

export function ProfilePreviewPic(props) {
  const [previewImage, setPreviewImage] = useState(null);
  const navigate = useNavigate();
  const [hover, setHover] = useState(false);
  const [likeCount, setLikeCount] = useState(null);
  const [commentCount, setCommentCount] = useState(null);
  const [postStatsDisplay, setPostStatsDisplay] = useState(null);

  useEffect(() => {
    const imgID = props.postInfo.postID;
    const uid = props.uid;

    const postRef = ref(db, "posts/" + props.postInfo.postID);

    get(postRef).then((snapshot) => {
      if (!snapshot.val().likes || snapshot.val().likes[0] === "") {
        setLikeCount("0 likes");
      } else {
        setLikeCount(snapshot.val().likes.length + " likes");
      }

      if (!snapshot.val().comments || snapshot.val().comments[0] === "") {
        setCommentCount("0 comments");
      } else {
        setCommentCount(snapshot.val().comments.length + " comments");
      }
    });

    RetrieveImg("postImages", uid, imgID).then((val) => {
      setPreviewImage(val);
    });
  }, []);

  useEffect(() => {
    if (hover) {
      const stats = (
        <div
          className="previewStats"
          onClick={handleClick}
          onMouseOver={() => {
            setHover(true);
          }}
          onMouseLeave={() => {
            setHover(false);
          }}
        >
          <p>{likeCount}</p>
          <p>{commentCount}</p>
        </div>
      );
      setPostStatsDisplay(stats);
    } else {
      setPostStatsDisplay(null);
    }
  }, [hover]);

  function handleClick() {
    const url = "/post/" + props.postInfo.postID;
    navigate(url);
  }

  return (
    <div className="profilePrevPic">
      <div
        onClick={handleClick}
        onMouseOver={() => {
          setHover(true);
        }}
        onMouseLeave={() => {
          setHover(false);
        }}
        style={{
          backgroundImage: "url(" + previewImage + ")",
        }}
        className="profilePrevPicImg"
      >
        {postStatsDisplay}
      </div>
    </div>
  );
}
// when hovered, show amount of likes
