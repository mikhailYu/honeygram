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
      <Link to="/profile">profile</Link>
      <Link to="/content">content</Link>
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
    </nav>
  );
}
