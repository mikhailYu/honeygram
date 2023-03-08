import "../styles/about.css";
export function About() {
  return (
    <div className="aboutCont">
      <img
        className="aboutHoneyGramLogo"
        src={require("../images/assets/honeyGramLogo.png")}
      ></img>
      <div className="aboutTextBox">
        <p>
          {
            'Honeygram is an Instagram style website... but with bears, created by Mikhail Y. Feel free to sign up and post anything bear related and check out some dev accounts. The password is the same as the usernames and so is the email, just add "@gmail.com" to the end.'
          }
        </p>

        <p>
          {
            "Bear in mind that this is a demo site, intended as a portfolio piece. Please do not share any personal information or post inappropriate content. Cheers!"
          }
        </p>
        <a href="https://github.com/mikhailYu" target={"blank"}>
          <img src={require("../images/assets/github-mark.png")}></img>
        </a>
      </div>
    </div>
  );
}
