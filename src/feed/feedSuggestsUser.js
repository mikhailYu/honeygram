export function FeedSuggestsUser() {
  return (
    <div className="feedSuggestsUserCont">
      <div
        className="feedSuggestsUserImg"
        style={{
          backgroundImage:
            "url(" + require("../images/testImages/testPolar.jpg") + ")",
        }}
      ></div>
      <p>Test User</p>
      <div className="feedSuggestsGap"></div>
      <button type="button">Follow</button>
    </div>
  );
}
