import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export function ContentDesc(props) {
  const navigate = useNavigate();
  const [displayName, setDisplayName] = useState(null);
  const [profilePic, setProfilePic] = useState(null);
  const [desc, setDesc] = useState(null);

  useEffect(() => {
    setDisplayName(props.ownerName);
    setProfilePic(props.profilePic);
    setDesc(props.desc);
  }, []);

  function toProfile() {
    navigate("/profile/" + props.ownerUid, {
      state: { ownerUid: props.ownerUid },
    });
  }
  return (
    <div className="contentCommentCont">
      <div
        onClick={toProfile}
        className="contentCommentIcon"
        style={{
          backgroundImage: "url(" + profilePic + ")",
        }}
      ></div>
      <div className="contentCommentText">
        <div className="contentCommentTop">
          <p onClick={toProfile}>{displayName}</p>
          <p>{desc}</p>
        </div>
      </div>
    </div>
  );
}
