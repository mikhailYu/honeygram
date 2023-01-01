import "../styles/profile.css";

import { ProfilePreviewPic } from "../profile/profilePreviewPic";

export function ProfilePage() {
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
            <p>User Name</p>
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
              <p>Test User</p>
              <p>Polar Bear</p>
            </div>
            <p className="profileDescText">Hi, how's it going?</p>
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
