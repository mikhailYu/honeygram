// this is positioned over the screen
import { ContentComment } from "../contentPage/contentComment";
import "../styles/Content.css";
export function Content() {
  return (
    <div className="contentPageCont">
      <div
        className="contentPageImg"
        style={{
          backgroundImage:
            "url(" + require("../images/testImages/testPolar.jpg") + ")",
        }}
      >
        {" "}
      </div>
      <div className="contentPageSideCont">
        <div className="contentPageSideTopCont">
          <div
            className="contentPageUserPic"
            style={{
              backgroundImage:
                "url(" + require("../images/testImages/testPolar.jpg") + ")",
            }}
          ></div>
          <p>Test User</p>
          <div></div>
          <p>X</p>
        </div>
        <div className="contentPageCommentSection">
          <ContentComment />
          <ContentComment />
          <ContentComment />
          <ContentComment />
          <ContentComment />
          <ContentComment />
          <ContentComment />
          <ContentComment />
          <ContentComment />
          <ContentComment />
          <ContentComment />
          <ContentComment />
          <ContentComment />
          <ContentComment />
          <ContentComment />
          <ContentComment />
          <ContentComment />
          <ContentComment />
        </div>
        <div className="contentPageBottomCont">
          <div className="contentPageIconsCont">
            <p>🧡</p>
            <p>🗨️</p>
            <p>📩</p>
            <div></div>
            <p>📖</p>
          </div>
          <p>94 likes</p>
          <p>12-22-2022</p>
          <div className="contentPageAddCommentCont">
            <input type="text" placeholder="Add a comment" />
            <button type="button">Post</button>
          </div>
        </div>
      </div>
    </div>
  );
}
