export function ContentComment() {
  return (
    <div className="contentCommentCont">
      <div
        className="contentCommentIcon"
        style={{
          backgroundImage:
            "url(" + require("../images/testImages/testPolar.jpg") + ")",
        }}
      ></div>
      <div className="contentCommentText">
        <div className="contentCommentTop">
          <p>Test user</p>
          <p>Hello this is a comment</p>
        </div>
        <div className="contentCommentBottom">
          <p>12-22-2022</p>
          <p>2 likes</p>
        </div>
      </div>
      <p>🧡</p>
    </div>
  );
}
