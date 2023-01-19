import { useEffect, useState } from "react";
import "../styles/createPost.css";

export default function CreatePostPage() {
  const [postPreview, setPostPreview] = useState("");
  const [postPreviewActive, setPostPreviewActive] = useState(false);

  useEffect(() => {
    console.log(postPreviewActive);
    if (postPreviewActive) {
      const newPreviewDiv = (
        <div className="newPostPreview">
          <img src=""></img>
        </div>
      );
      setPostPreview(newPreviewDiv);
    } else {
      const newPreviewDiv = (
        <div className="newPostUploadButtonCont">
          <p>+ Upload an image</p>
        </div>
      );
      setPostPreview(newPreviewDiv);
    }
  }, [postPreviewActive]);

  return (
    <div className="createPostCont">
      {postPreview}
      <button className="removePreviewPost">Remove</button>
      <textarea
        className="createPostDescInput"
        placeholder="Write a description for your post."
      ></textarea>

      <button className="createPostSubmitBtn">Create new post</button>
      <button
        onClick={() => {
          setPostPreviewActive(!postPreviewActive);
        }}
      >
        test button
      </button>
    </div>
  );
}
