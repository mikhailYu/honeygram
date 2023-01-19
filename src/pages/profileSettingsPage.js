import { useEffect, useState, useSyncExternalStore } from "react";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { Storage } from "../firebaseConfig";
import "../styles/settings.css";
import { ProfileDefaultPic } from "../profile/profileDefaultPics";
import uniqid from "uniqid";
export function ProfileSettings(props) {
  const [bioLength, setBioLength] = useState("0/150");
  const [userInfo, setUserInfo] = useState(null);
  const [usernameInput, setUsernameInput] = useState("");
  const [displayNameInput, setDisplayNameInput] = useState("");
  const [genderInput, setGenderInput] = useState("");
  const [bioInput, setBioInput] = useState("");
  const [userUid, setUserUid] = useState("");
  const [imageUpload, setImageUpload] = useState(null);
  const [customPicDisplay, setCustomPicDisplay] = useState(null);
  const [profilePicName, setProfilePicName] = useState(null);

  useEffect(() => {
    props.getUserInfo().then((val) => {
      if (val !== null) {
        setUserInfo(val);
        setUsernameInput(val.username);
        setDisplayNameInput(val.displayName);
        setGenderInput(val.gender);
        setBioInput(val.bio);
        setUserUid(val.uid);
        getCustomPic(val.profilePic, val.uid);
      }
    });
  }, [props.userInfo]);

  useEffect(() => {
    handleImageUpload().then(() => {
      updateCustomPic();
    });
  }, [imageUpload]);

  function getCustomPic(profilePic, uid) {
    if (profilePic !== null) {
      const pathRef = ref(Storage, "profileImages/" + uid + "/" + profilePic);

      getDownloadURL(pathRef).then((url) => {
        const urlString = url.toString();
        setCustomPicDisplay(urlString);
      });
    }
  }

  function updateCustomPic() {
    if (imageUpload !== null) {
      setCustomPicDisplay(URL.createObjectURL(imageUpload));
    }
  }

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

  async function handleImageUpload() {
    if (imageUpload == null) {
      return;
    }
    const imageName = uniqid();
    setProfilePicName(imageName);
    const imageRef = ref(Storage, "profileImages/" + userUid + "/" + imageName);

    uploadBytes(imageRef, imageUpload).then(() => {
      console.log("Image Sent");
    });
  }

  function confirmSettings() {
    props.overWriteProfileSettings(
      usernameInput,
      displayNameInput,
      genderInput,
      bioInput,
      profilePicName
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
              <input
                className="inputProfilePic"
                type="file"
                onChange={(event) => {
                  setImageUpload(event.target.files[0]);
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
