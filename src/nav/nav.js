import { Link } from "react-router-dom";
import "../styles/nav.css";

export function Nav(props) {
  return (
    <nav>
      <Link to="/">
        <h1>HONEYGRAM</h1>
      </Link>
      <Link to="/">Home</Link>
      <Link to="/signUp">Sign Up</Link>
      <Link to="/login">login</Link>
      <Link to="/newPost">New Post</Link>
      <Link to="/profile" state={{ ownerUid: "" }}>
        profile
      </Link>
      <Link to="post/:ID">content</Link>
      <Link to="/settings">settings</Link>
      <Link to="/about">about</Link>
      <Link
        to="/login"
        onClick={() => {
          props.logout();
        }}
      >
        Log Out
      </Link>

      <Link
        to="/profile/lAZOOpDUDjOnsObvfU8KCKQNAJG2"
        state={{ ownerUid: "lAZOOpDUDjOnsObvfU8KCKQNAJG2" }}
      >
        Polar Profile
      </Link>
      <Link
        to="/profile/9I8HAunuS6UKrgUuEmhcjrrhnhQ2"
        state={{ ownerUid: "9I8HAunuS6UKrgUuEmhcjrrhnhQ2" }}
      >
        Grizzly Profile
      </Link>
    </nav>
  );
}
