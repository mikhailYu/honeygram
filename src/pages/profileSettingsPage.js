import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "../styles/settings.css";
import { ProfileDefaultPic } from "../profile/profileDefaultPics";
export function ProfileSettings(props) {
  const [bioLength, setBioLength] = useState("0/150");
  const [userInfo, setUserInfo] = useState(null);
  const [usernameInput, setUsernameInput] = useState("");
  const [displayNameInput, setDisplayNameInput] = useState("");
  const [genderInput, setGenderInput] = useState("");
  const [bioInput, setBioInput] = useState("");

  useEffect(() => {
    props.getUserInfo().then((val) => {
      if (val !== null) {
        setUserInfo(val);
        setUsernameInput(val.username);
        setDisplayNameInput(val.displayName);
        setGenderInput(val.gender);
        setBioInput(val.bio);
      }
    });
  }, [props.userInfo]);

  function handleUsername(e) {
    setUsernameInput(e.target.value);
  }
  function handleDisplayName(e) {
    setDisplayNameInput(e.target.value);
  }
  function handleGender(e) {
    setGenderInput(e.target.value);
  }
  function handleBio(e) {
    setBioLength(e.target.value.length + "/150");
    setBioInput(e.target.value);
  }

  function confirmSettings() {
    props.overWriteProfileSettings(
      usernameInput,
      displayNameInput,
      genderInput,
      bioInput
    );
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
              defaultValue={usernameInput}
              placeholder={"Username"}
              onChange={handleUsername}
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
              defaultValue={displayNameInput}
              placeholder="Display Name"
              onChange={handleDisplayName}
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
              <select
                className="settingsGender"
                onChange={handleGender}
                value={genderInput}
              >
                <option value="">Choose an option</option>
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
              defaultValue={bioInput}
            ></textarea>
            <div className="bioLength">{bioLength}</div>
          </div>
        </div>
        <button onClick={confirmSettings}>Confirm</button>
      </div>
    </div>
  );
}
