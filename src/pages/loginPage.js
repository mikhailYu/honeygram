import { Link } from "react-router-dom";
import "../styles/loginPage.css";
export function LoginPage(props) {
  return (
    <div className="loginPageCont">
      <div className="loginBox">
        <div className="loginInfoCont">
          <div className="loginPadding"></div>
          <input placeholder="Email" type={"email"} />
          <input placeholder="Password" type={"password"} />
          <button type="button">Login</button>
        </div>
        <div className="loginSignUpCont">
          <p>Not a member?</p>
          <Link to="/signUp">Sign Up Here</Link>
        </div>
      </div>
    </div>
  );
}
