export function FeedProfileHeader() {
  return (
    <div className="feedProfileHeaderCont">
      <div
        className="feedProfileHeaderUserPic"
        style={{
          backgroundImage:
            "url(" + require("../images/testImages/testPolar.jpg") + ")",
        }}
      ></div>
      <div className="feedProfileHeaderUserNames">
        <p>Test Username</p>
        <p>Test User Nickname</p>
      </div>
      <div className="feedProfileHeaderGap"></div>
      <div>Log Out</div>
    </div>
  );
}
