export function ProfileDefaultPic(props) {
  return (
    <div
      className="profileDefaultPic"
      style={{
        backgroundImage:
          "url(" + require("../images/testImages/testPolar.jpg") + ")",
      }}
    ></div>
  );
}
