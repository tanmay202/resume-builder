import React from "react";
import "./AuthButtonProvider.css";
import { GoogleAuthProvider, GithubAuthProvider, signInWithRedirect } from "firebase/auth";
import { auth } from "../config/firebase.config";

const AuthButtonProvider = ({ Icon, label, provider }) => {
  const googleAuthProvider = new GoogleAuthProvider();
  const gitAuthProvider = new GithubAuthProvider();
  const handleClick = async () => {
    switch (provider) {
      case "GoogleAuthProvider":
        await signInWithRedirect(auth, googleAuthProvider).then((result) => {
          console.log(result);
        })
          .catch((err) => {
            console.log(`Error:${err.Message}`);
          });
        
        break;
      case "GithubAuthProvider":
        await signInWithRedirect(auth, gitAuthProvider).then((result) => {
          console.log(result);
        })
          .catch((err) => {
            console.log(`Error:${err.Message}`);
          });
        break;
      default:
        await signInWithRedirect(auth, googleAuthProvider).then((result) => {
          console.log(result);
        })
          .catch((err) => {
            console.log(`Error:${err.Message}`);
          });
        break;
    }
  };

  return (
    <div
      onClick={handleClick}
      className="w-full px-4 py-3 rounded-md flex items-center justify-center"
    >
      {/* Customize UI based on provider */}
      {provider === "GoogleAuthProvider" && (
        <div className="googlebtn flex">
          {/* Google icon */}
          <Icon
            className="mr-2"
            style={{ fontSize: "18px", marginTop: "3px" }}
          />
          {/* Customize Google authentication UI here */}
          <button className="">{label}</button>
        </div>
      )}
      {provider === "GithubAuthProvider" && (
        <div className="githubtn flex">
          {/* GitHub icon */}
          <Icon
            className="mr-2"
            style={{ fontSize: "21px", marginTop: "1px" }}
          />
          {/* Customize GitHub authentication UI here */}
          <button className="">{label}</button>
        </div>
      )}
    </div>
  );
};

export default AuthButtonProvider;
