import { useState } from "react";
import { Link } from "react-router-dom";
import "../styles/settings.css";
import { ProfileDefaultPic } from "../profile/profileDefaultPics";
export function ProfileSettings() {
  const [bioLength, setBioLength] = useState("0/150");

  function handleBio(e) {
    setBioLength(e.target.value.length + "/150");
  }
  return (
    <div className="settingsPageCont">
      <div className="settingsBox">
        <div className="settingsInputCont">
          <div className="settingsLabelBox">
            <label>Username</label>
          </div>
          <div className="settingsInputBox">
            <input
              className="settingsUsernameInput"
              type="text"
              placeholder="Username"
            />
          </div>
        </div>

        <div className="settingsInputCont">
          <div className="settingsLabelBox">
            <label>Display Name</label>
          </div>
          <div className="settingsInputBox">
            <input
              className="settingsNameInput"
              type="text"
              placeholder="Display Name"
            />
          </div>
        </div>

        <div className="settingsInputCont">
          <div className="settingsLabelBox">
            <label>Profile Picture</label>
          </div>
          <div className="settingsInputBox">
            <div className="settingsPicChooseCont">
              <ProfileDefaultPic />
              <ProfileDefaultPic />
              <ProfileDefaultPic />
              <ProfileDefaultPic />
              <ProfileDefaultPic />
              <ProfileDefaultPic />
              <ProfileDefaultPic />
              <div className="customPic">+</div>
            </div>
          </div>
        </div>

        <div className="settingsInputCont">
          <div className="settingsLabelBox">
            <label>Gender</label>
          </div>
          <div className="settingsInputBox">
            <form className="settingsGenderForm">
              <select className="settingsGender">
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
                <option value="None">I'd rather not say</option>
              </select>
            </form>
          </div>
        </div>

        <div className="settingsInputCont">
          <div className="settingsLabelBox">
            <label>Bio</label>
          </div>
          <div className="settingsInputBox bio">
            <textarea
              placeholder="Bio"
              className="settingsBio"
              maxLength={"150"}
              onChange={handleBio}
            ></textarea>
            <div className="bioLength">{bioLength}</div>
          </div>
        </div>
        <Link to={"/profile"}>Confirm</Link>
      </div>
    </div>
  );
}
