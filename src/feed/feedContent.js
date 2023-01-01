import { FeedContentComment } from "./feedContentComment";
// adjust image height with js once the image is downloaded to get the
// measurements

export function FeedContent() {
  return (
    <div className="feedContentCont">
      <div className="feedContentUpperCont">
        <div
          className="feedContentUpperProfPic"
          style={{
            backgroundImage:
              "url(" + require("../images/testImages/testPolar.jpg") + ")",
          }}
        ></div>
        <div>
          <p>Test User</p>
        </div>

        <p>X</p>
      </div>
      <div
        className="feedContentPic"
        style={{
          backgroundImage:
            "url(" + require("../images/testImages/testPolar.jpg") + ")",
        }}
      ></div>
      <div className="feedContentIconsCont">
        <p>🧡</p>
        <p>🗨️</p>
        <p>📩</p>
        <div></div>
        <p>📖</p>
      </div>
      <div className="feedContentLikesCont">
        <p>Liked by 20 bears</p>
      </div>
      <div className="feedContentDescCont">
        <p>Test User</p>
        <p>Me waving at you #whatsup</p>
      </div>
      <div className="feedContentCommentsCont">
        <FeedContentComment />
        <FeedContentComment />
        <p>See 11 more comments.</p>
      </div>
      <p className="feedContentDate">21-10-2022</p>
      <div className="feedContentAddCommentCont">
        <input type="text" placeholder="Add a comment" />
        <button type="button">Post</button>
      </div>
    </div>
  );
}
