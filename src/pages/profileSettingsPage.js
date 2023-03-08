import { useEffect, useState, useSyncExternalStore } from "react";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { Storage } from "../firebaseConfig";
import "../styles/settings.css";
import { ProfileDefaultPic } from "../profile/profileDefaultPics";
import RetrieveImg from "../general/retrieveImage";
import uniqid from "uniqid";
export function ProfileSettings(props) {
  const [bioLength, setBioLength] = useState("0/150");
  const [userInfo, setUserInfo] = useState(null);
  const [usernameInput, setUsernameInput] = useState("");
  const [usernameDisplay, setUsernameDisplay] = useState("");
  const [displayNameInput, setDisplayNameInput] = useState("");
  const [genderInput, setGenderInput] = useState("");
  const [bioInput, setBioInput] = useState("");
  const [userUid, setUserUid] = useState("");
  const [imageUpload, setImageUpload] = useState(null);
  const [customPicDisplay, setCustomPicDisplay] = useState(null);
  const [profilePicName, setProfilePicName] = useState(null);
  const [imageChanged, setImageChanged] = useState(false);
  const [disableConfirm, setDisableConfirm] = useState(true);
  const [cursorStyle, setCursorStyle] = useState("pointer");
  const [defaultPics, setDefaultPics] = useState(null);
  const [chosenDefaultPic, setChosenDefaultPic] = useState(null);
  const [existingDefault, setExistingDefault] = useState(null);

  useEffect(() => {
    if (defaultPics === null) {
      initDefaultPics();
    }
    props.getUserInfo().then((val) => {
      if (val !== null) {
        setUserInfo(val);
        setUsernameInput(val.username);
        setDisplayNameInput(val.displayName);
        setGenderInput(val.gender);
        setBioInput(val.bio);
        setUserUid(val.uid);
        getPic(val.profilePic, val.uid, val.defaultPic);
        setDisableConfirm(false);
      }
    });
  }, [props.userInfo]);

  useEffect(() => {
    if (!usernameInput) {
      return;
    }
    setUsernameDisplay("@" + usernameInput);
  }, [usernameInput]);

  useEffect(() => {
    handleImageUpload().then(() => {
      updateCustomPic();
    });
  }, [imageUpload]);

  useEffect(() => {
    if (existingDefault) {
      document.querySelector(".defaultPic" + existingDefault).style.border =
        "3px solid var(--mainBorderColour)";
      resetDefaultStyles(existingDefault);
    }
  }, [defaultPics]);

  function initDefaultPics() {
    let pics = [];
    for (let i = 1; i < 8; i++) {
      let newPic = (
        <div
          key={uniqid()}
          className={"profileDefaultPic defaultPic" + i}
          onClick={() => {
            handleDefaultProfilePic(i);
          }}
          style={{
            backgroundImage:
              "url(" +
              require("../images/defaultProfileIcons/defaultIcon_0" +
                i +
                ".png") +
              ")",
          }}
        ></div>
      );
      pics.push(newPic);
    }
    setDefaultPics(pics);
  }

  function getPic(profilePic, uid, defaultPic) {
    if (profilePic == null || !profilePic) {
      if (defaultPic == null || !defaultPic) {
        return;
      } else {
        setChosenDefaultPic(defaultPic);
        setExistingDefault(defaultPic);
      }
      return;
    }
    setProfilePicName(profilePic);
    RetrieveImg("profileImages", uid, profilePic).then((val) => {
      setCustomPicDisplay(val);
    });
  }

  function updateCustomPic() {
    if (imageUpload !== null) {
      setCustomPicDisplay(URL.createObjectURL(imageUpload));
    }
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

  async function handleImageUpload() {
    if (imageUpload == null) {
      return;
    }
    const imageName = uniqid();
    setProfilePicName(imageName);
    setImageChanged(true);
  }

  function confirmSettings() {
    let defaultPic;
    if (!displayNameInput || !genderInput || !bioInput) {
      alert("Please fill in all of the info");
      return;
    }

    if (disableConfirm) {
      return;
    }

    if (!profilePicName && chosenDefaultPic === null) {
      defaultPic = 1;
    } else {
      defaultPic = chosenDefaultPic;
    }

    setDisableConfirm(true);

    props.overWriteProfileSettings(
      usernameInput,
      displayNameInput,
      genderInput,
      bioInput,
      profilePicName,
      imageUpload,
      imageChanged,
      defaultPic
    );
  }

  function handleDefaultProfilePic(picNum) {
    setChosenDefaultPic(picNum);

    document.querySelector(".defaultPic" + picNum).style.border =
      "3px solid var(--mainBorderColour)";
    resetDefaultStyles(picNum);
  }

  function resetDefaultStyles(exemption) {
    for (let i = 1; i < 8; i++) {
      if (i !== exemption) {
        document.querySelector(".defaultPic" + i).style.border = "";
      }
    }
    if (exemption !== "custom") {
      document.querySelector(".customPic").style.border = "";
    }
  }

  return (
    <div className="settingsPageCont">
      <div className="settingsBox">
        <div className="settingsInputCont">
          <div className="settingsLabelBox">
            <label>Username:</label>
          </div>
          <div className="settingsInputBox">
            <input
              className="settingsUsernameInput"
              type="text"
              defaultValue={usernameDisplay}
              readOnly
            />
          </div>
        </div>

        <div className="settingsInputCont">
          <div className="settingsLabelBox">
            <label>Display Name:</label>
          </div>
          <div className="settingsInputBox">
            <input
              className="settingsNameInput settingsInput"
              type="text"
              defaultValue={displayNameInput}
              placeholder="Display Name"
              onChange={handleDisplayName}
            />
          </div>
        </div>

        <div className="settingsInputCont">
          <div className="settingsLabelBox ">
            <label>Profile Picture:</label>
          </div>
          <div className="settingsInputBox">
            <div className="settingsPicChooseCont">
              {defaultPics}

              <input
                className="inputProfilePic"
                type="file"
                accept={
                  "image/png, image/jpg, image/jpeg, image/svg, image/tiff"
                }
                onChange={(event) => {
                  setImageUpload(event.target.files[0]);
                  event.target.value = null;
                  setChosenDefaultPic(null);
                  resetDefaultStyles("custom");
                  document.querySelector(".customPic").style.border =
                    "3px solid var(--mainBorderColour)";
                }}
              />
              <button
                className="customPic"
                onClick={() => {
                  document.querySelector(".inputProfilePic").click();
                }}
                style={{
                  backgroundImage: "url(" + customPicDisplay + ")",
                }}
              >
                +
              </button>
            </div>
          </div>
        </div>

        <div className="settingsInputCont">
          <div className="settingsLabelBox">
            <label>Gender:</label>
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
            <label>Bio:</label>
          </div>
          <div className="settingsInputBox bio">
            <textarea
              placeholder="Bio"
              className="settingsBio settingsInput"
              maxLength={"150"}
              onChange={handleBio}
              defaultValue={bioInput}
            ></textarea>
            <div className="bioLength">{bioLength}</div>
          </div>
        </div>
        <button
          style={{ cursor: cursorStyle }}
          onMouseOver={() => {
            if (disableConfirm) {
              setCursorStyle("wait");
            } else {
              setCursorStyle("pointer");
            }
          }}
          className="settingsConfirmButton interactiveButton"
          onClick={confirmSettings}
        >
          Confirm
        </button>
      </div>
    </div>
  );
}
