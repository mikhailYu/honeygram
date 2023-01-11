import "../styles/profile.css";
import { ProfilePreviewPic } from "../profile/profilePreviewPic";
import { useEffect, useState } from "react";

export function ProfilePage(props) {
  const [username, setUsername] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [bio, setBio] = useState("");

  useEffect(() => {
    props
      .getUserInfo()
      .then((val) => {
        setUsername(val.username);
        setDisplayName(val.displayName);
        setBio(val.bio);
      })
      .catch(() => {
        console.log("Profile Data still retrieving...");
      });
  }, [props.userInfo]);

  return (
    <div className="profileCont">
      <div className="profileInfoCont">
        <div className="profileInfoPicCont">
          <div
            className="profileInfoPic"
            style={{
              backgroundImage:
                "url(" + require("../images/testImages/testPolar.jpg") + ")",
            }}
          ></div>
        </div>
        <div className="profileTextCont">
          <div className="profileNameCont">
            <p>{username}</p>
            <button className="profilePageFollowBtn">Follow</button>
            <button className="profilePageEditBtn">Edit</button>
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

      <div className="profileContentCont">
        <ProfilePreviewPic />
        <ProfilePreviewPic />
        <ProfilePreviewPic />
        <ProfilePreviewPic />
        <ProfilePreviewPic />
        <ProfilePreviewPic />
        <ProfilePreviewPic />
        <ProfilePreviewPic />
      </div>
    </div>
  );
}
