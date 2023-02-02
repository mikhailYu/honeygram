import { useEffect, useState } from "react";

export function ContentDesc(props) {
  const [displayName, setDisplayName] = useState(null);
  const [profilePic, setProfilePic] = useState(null);
  const [desc, setDesc] = useState(null);

  useEffect(() => {
    setDisplayName(props.ownerName);
    setProfilePic(props.profilePic);
    setDesc(props.desc);
  }, []);
  return (
    <div className="contentCommentCont">
      <div
        className="contentCommentIcon"
        style={{
          backgroundImage: "url(" + profilePic + ")",
        }}
      ></div>
      <div className="contentCommentText">
        <div className="contentCommentTop">
          <p>{displayName}</p>
          <p>{desc}</p>
        </div>
      </div>
    </div>
  );
}
