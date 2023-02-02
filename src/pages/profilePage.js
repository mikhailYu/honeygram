import "../styles/profile.css";
import { ProfilePreviewPic } from "../profile/profilePreviewPic";
import { Link, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import GetProfileOwner from "../profile/getProfileOwner";
import { onValue } from "firebase/database";
import RetrieveImg from "../general/retrieveImage";
import uniqid from "uniqid";

export function ProfilePage(props) {
  const location = useLocation();
  const [username, setUsername] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [bio, setBio] = useState("");
  const [owner, setOwner] = useState(null);
  const [upperButton, setUpperButton] = useState(null);
  const [profilePic, setProfilePic] = useState(null);
  const [profileContent, setProfileContent] = useState(null);

  useEffect(() => {
    if (location.state !== null) {
      const { ownerUid } = location.state;
      GetProfileOwner(ownerUid).then((val) => {
        onValue(val, (snapshot) => {
          setOwner(snapshot.val());
        });
      });
    } else {
      const url = window.location.href;
      const urlUid = url.split("profile/")[1];
      GetProfileOwner(urlUid).then((val) => {
        onValue(val, (snapshot) => {
          setOwner(snapshot.val());
        });
      });
    }
  }, [location.state]);

  useEffect(() => {
    if (owner !== null) {
      setUsername(owner.username);
      setDisplayName(owner.displayName);
      setBio(owner.bio);
      getProfilePic(owner.profilePic);
      toggleUpperButtons();
      loadPosts();
      console.log("Profile info set to user: " + owner.username);
    }
  }, [owner]);

  function loadPosts() {
    if (!owner.posts || owner.posts.length <= 0 || owner.posts[0] === "") {
      const noPostsDiv = <p>User has no posts</p>;
      setProfileContent(noPostsDiv);
    } else {
      const postsArr = owner.posts.reverse().map((postInfo) => {
        return (
          <ProfilePreviewPic
            key={uniqid()}
            postInfo={postInfo}
            uid={owner.uid}
          />
        );
      });

      setProfileContent(postsArr);
    }
  }

  function getProfilePic(picName) {
    if (owner !== null) {
      RetrieveImg("profileImages", owner.uid, picName).then((val) => {
        setProfilePic(val);
      });
    }
  }

  async function toggleUpperButtons() {
    props.getUser().then((val) => {
      if (val !== null) {
        if (val.uid === owner.uid) {
          setUpperButton(
            <Link className="profilePageEditBtn" to={"/settings"}>
              Edit
            </Link>
          );
        } else {
          setUpperButton(
            <button className="profilePageFollowBtn">Follow</button>
          );
        }
      }
    });
  }

  return (
    <div className="profileCont">
      <div className="profileInfoCont">
        <div className="profileInfoPicCont">
          <div
            className="profileInfoPic"
            style={{
              backgroundImage: "url(" + profilePic + ")",
            }}
          ></div>
        </div>
        <div className="profileTextCont">
          <div className="profileNameCont">
            <p>{username}</p>
            {upperButton}
          </div>
          <div className="profileStatsCont">
            <p>33 posts</p>
            <p>502 followers</p>
            <p>294 following</p>
          </div>
          <div className="profileDescCont">
            <div className="profileDescTitles">
              <p>{username}</p>
              <p>{displayName}</p>
            </div>
            <p className="profileDescText">{bio}</p>
          </div>
        </div>
      </div>

      <div className="profileContentCont">{profileContent}</div>
    </div>
  );
}
