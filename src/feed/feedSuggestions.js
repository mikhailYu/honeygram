import { useEffect, useState, useSyncExternalStore } from "react";
import { get, ref } from "firebase/database";
import { db } from "../firebaseConfig";
import { onValue, update } from "firebase/database";
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
      setUpdate(false);
      checkIfHasSuggestions();
    }
  }, [update]);

  useEffect(() => {
    setIsloaded(true);
  }, [suggestsArr]);

  function checkIfHasSuggestions() {
    const currentUserRef = ref(db, "users/" + props.currentUserUid);
    get(currentUserRef).then((snapshot) => {
      if (snapshot.val().suggestedUsers) {
        displayUserSuggests();
      }
    });
  }
  function displayUserSuggests() {
    const userRef = ref(db, "users/" + props.currentUserUid);
    const generatedArr = [];

    get(userRef).then((snapshot) => {
      const usersArr = snapshot.val().suggestedUsers;
      const followers = snapshot.val().followers;
      const newSuggest = usersArr.map((user) => {
        return (
          <FeedSuggestsUser
            key={uniqid()}
            userInfo={user}
            followers={followers}
            currentUserUid={props.currentUserUid}
            passUpdateFollows={passUpdateFollows}
          />
        );
      });

      setSuggestsArr(newSuggest);
    });
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

  return (
    <div className="feedSuggestsCont">
      <p>Suggestions For You</p>

      <div className="feedSuggestsList">{suggestsArr}</div>
    </div>
  );
}
