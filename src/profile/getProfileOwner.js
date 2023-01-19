import { ref, onValue } from "firebase/database";
import { useState } from "react";
import { db } from "../firebaseConfig";

export default async function GetProfileOwner(uid) {
  const ownerRef = ref(db, "users/" + uid);

  return ownerRef;
}
