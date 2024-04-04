import { toast } from "react-toastify";
import { auth, db } from "../config/firebase.config";
import {
  collection,
  doc,
  onSnapshot,
  orderBy,
  query,
  setDoc,
} from "firebase/firestore";

export const getUserDetail = () => {
  return new Promise((resolve, reject) => {
    const unsubscribe = auth.onAuthStateChanged((userCred) => {
      if (userCred) {
        // User is authenticated; resolve the Promise with user data
        const userData = userCred.providerData[0];

        const unsubscribe = onSnapshot(
          doc(db, "users", userData?.uid),
          (_doc) => {
            if (_doc.exists()) {
              resolve(_doc.data());
            } else {
              setDoc(doc(db, "users", userData?.uid), userData).then(() => {
                resolve(userData);
              });
            }
          }
        );

        return unsubscribe;
      } else {
        // User is not authenticated; reject the Promise with an error
        reject(new Error("User is not authenticated"));
      }
      // Make sure to unsubscribe from the listener to prevent memory leaks
      unsubscribe();
    });
  });
};

export const getTemplates = () => {
  return new Promise((resolve, reject) => {
    const templateQuery = query(
      collection(db, "templates"),
      orderBy("timeStamp", "asc")
    );

    const unsubscribe = onSnapshot(templateQuery, (querySnap) => {
      const templates = querySnap.docs.map((doc) => doc.data());
      resolve(templates);
    });

    return unsubscribe; // Clean up the listener when unsubscribed
  });
};

export const getTemplateDetail = (id) => {
  return new Promise((resolve, reject) => {
    const unsubscribe = onSnapshot(doc(db, "templates", id), (doc) => {
      resolve(doc.data());
    });

    return unsubscribe;
  });
};

export const getTemplateDetailEditByUser = (uid, id) => {
  return new Promise((resolve, reject) => {
    const unsubscribe = onSnapshot(
      doc(db, "users", uid, "resumes", id),
      (doc) => {
        resolve(doc.data());
      }
    );

    return unsubscribe;
  });
};

export const getSavedResumes = (uid) => {
  return new Promise((resolve, reject) => {
    const templateQuery = query(
      collection(db, "users", uid, "resumes"),
      orderBy("timeStamp", "asc")
    );

    const unsubscribe = onSnapshot(templateQuery, (querySnap) => {
      const templates = querySnap.docs.map((doc) => doc.data());
      resolve(templates);
    });

    return unsubscribe; // Clean up the listener when unsubscribed
  });
};
