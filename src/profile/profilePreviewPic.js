export function ProfilePreviewPic() {
  return (
    <div
      className="profilePrevPic"
      style={{
        backgroundImage:
          "url(" + require("../images/testImages/testPolar.jpg") + ")",
      }}
    ></div>
  );
}
// when hovered, show amount of likes
