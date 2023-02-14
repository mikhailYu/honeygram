import { useEffect, useState, useSyncExternalStore } from "react";
import { ref } from "firebase/database";
import { db } from "../firebaseConfig";
import { onValue } from "firebase/database";
import "../styles/Content.css";
import uniqid from "uniqid";

import { FeedSuggestsUser } from "./feedSuggestsUser";

export function FeedSuggestions(props) {
  const [suggestsArr, setSuggestsArr] = useState(null);
  const [isLoaded, setIsloaded] = useState(false);
  const [update, setUpdate] = useState(true);

  useEffect(() => {
    if (isLoaded) {
      return;
    } else if (update) {
      generateSuggestions();
      setUpdate(false);
    }
  }, [update]);

  useEffect(() => {
    setIsloaded(true);
  }, [suggestsArr]);

  function generateSuggestions() {
    if (isLoaded) {
      return;
    }

    const usersRef = ref(db, "users/");

    onValue(usersRef, (snapshot) => {
      const currentUserUid = props.currentUserUid;

      const usersArr = [];

      snapshot.forEach((user) => {
        usersArr.push(user.val());
      });

      const numOfUsers = usersArr.length;

      let safetySwitch = 0;
      let chosenUsers = [];

      const generatedArr = [];

      generate();
      function generate() {
        if (isLoaded) {
          return;
        }

        if (safetySwitch >= 50) {
          alert("Maximum calls reached!");
          return;
        }
        const randomNum = Math.floor(Math.random() * numOfUsers);
        if (
          usersArr[randomNum].uid !== currentUserUid &&
          !arrayIncludes(usersArr[randomNum].uid)
        ) {
          const newSuggest = (
            <FeedSuggestsUser
              key={uniqid()}
              userInfo={usersArr[randomNum]}
              currentUserUid={currentUserUid}
              passUpdateFollows={passUpdateFollows}
            />
          );
          chosenUsers.push(usersArr[randomNum].uid);
          generatedArr.push(newSuggest);
        }

        if (
          safetySwitch >= 50 ||
          chosenUsers.length === numOfUsers - 1 ||
          chosenUsers.length >= 5
        ) {
          setSuggestsArr(generatedArr);
          return;
        } else {
          safetySwitch++;
          generate();
        }
      }

      function passUpdateFollows(
        newFollowingArr,
        newFollowersArr,
        userRef,
        ownerRef
      ) {
        props.passUpdateFollowsMain(
          newFollowingArr,
          newFollowersArr,
          userRef,
          ownerRef
        );
      }

      function arrayIncludes(userUid) {
        if (chosenUsers.includes(userUid)) {
          return true;
        } else {
          return false;
        }
      }
    });
  }
  return (
    <div className="feedSuggestsCont">
      <p>Suggestions For You</p>

      <div className="feedSuggestsList">{suggestsArr}</div>
    </div>
  );
}
