import { useEffect, useState } from "react";
import "../styles/createPost.css";

export default function CreatePostPage(props) {
  const [descLength, setDescLength] = useState("0/200");
  const [postPreview, setPostPreview] = useState("");
  const [postPreviewActive, setPostPreviewActive] = useState(false);
  const [descInput, setDescInput] = useState("");
  const [previewImage, setPreviewImage] = useState(null);
  const [removePreviewBtn, setRemovePreviewBtn] = useState(null);
  const [imageUpload, setImageUpload] = useState(null);

  useEffect(() => {
    if (postPreviewActive) {
      const newPreviewDiv = (
        <div className="newPostPreview">
          <img src={previewImage}></img>
        </div>
      );

      const removeBtn = (
        <button
          className="removePreviewPost"
          onClick={() => {
            setPostPreviewActive(false);
            setPreviewImage(null);
            setImageUpload(null);
          }}
        >
          Remove
        </button>
      );
      setRemovePreviewBtn(removeBtn);
      setPostPreview(newPreviewDiv);
    } else {
      const newPreviewDiv = (
        <button
          className="newPostUploadButtonCont"
          onClick={() => {
            document.getElementById("newPostInput").click();
          }}
        >
          <p>+ Upload an image</p>
        </button>
      );
      setRemovePreviewBtn(null);
      setPostPreview(newPreviewDiv);
    }
  }, [postPreviewActive]);

  function updatePreviewImage(image) {
    if (image !== null) {
      setPreviewImage(URL.createObjectURL(image));
      setImageUpload(image);
      setPostPreviewActive(!postPreviewActive);
    }
  }

  function handleDesc(e) {
    setDescLength(e.target.value.length + "/200");
    setDescInput(e.target.value);
  }

  function handleNewPost() {
    if (previewImage == null) {
      alert("Please upload an image");
    } else if (descInput.length < 1) {
      alert("Please enter a description");
      return;
    }
    props.uploadPost(imageUpload, descInput);
  }

  return (
    <div className="createPostCont">
      <input
        type={"file"}
        style={{ display: "none" }}
        id={"newPostInput"}
        accept={"image/png, image/jpg, image/jpeg, image/svg, image/tiff"}
        onChange={(event) => {
          updatePreviewImage(event.target.files[0]);
          event.target.value = null;
        }}
      ></input>
      {postPreview}
      {removePreviewBtn}
      <textarea
        className="createPostDescInput"
        maxLength={"200"}
        placeholder="Write a description for your post."
        onChange={handleDesc}
      ></textarea>
      <div className="createPostDescLength">{descLength}</div>

      <button className="createPostSubmitBtn" onClick={handleNewPost}>
        Create new post
      </button>
    </div>
  );
}
