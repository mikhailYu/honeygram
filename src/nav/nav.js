import { useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import "../styles/nav.css";

export function Nav(props) {
  const [user, setUser] = useState(props.getUser());
  return (
    <nav>
      <Link to="/">
        <h1>HONEYGRAM</h1>
      </Link>
      <Link state={{ ownerUid: user.uid }} to="/">
        Home
      </Link>

      <Link to="/newPost">New Post</Link>

      <Link to="/settings">settings</Link>
      <Link to="/about">about</Link>
      <p
        onClick={() => {
          props.logout();
        }}
      >
        Log Out
      </p>
    </nav>
  );
}
