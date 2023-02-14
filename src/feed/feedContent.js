import { FeedContentComment } from "./feedContentComment";

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

        <div></div>
      </div>
      <div className="feedContentLikesCont">
        <p>20 likes</p>
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
