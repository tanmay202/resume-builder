import React, { useEffect } from "react";
import { Footer } from "../containers";
import { AuthButtonProvider, MainSpinner } from "../components";
import { FaGoogle, FaGithub } from "react-icons/fa6";
import useUser from "../hooks/useUser";
import { useNavigate } from "react-router-dom";

const Authentication = () => {
  const { data, isLoading, isError } = useUser();

  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoading && data) {
      navigate("/", { replace: true });
    }
  }, [isLoading, data, navigate]);
  if (isLoading) {
    return <MainSpinner />;
  }

  return (
    <div className="auth-sec">
      {/* Top section */}
      <div
        style={{
          color: "red",
          fontWeight: "bold",
          fontSize: "24px",
          cursor: "pointer",
        }}
      >
        MyResume<span style={{ color: "black" }}>Builder</span>
      </div>
      {/* main content */}
      <div className="w-full flex flex-1 flex-col items-center justify-center gap-6 ">
        {/* Left div with typewriter animation */}
        <div className=" text-3xl lg:text-4xl ">
          <Typewriter
            text="Crafting your professional story, 
          Seamlessly."
          />
        </div>
        <h2 className=" text-2xl text-blue-500">Authenticate</h2>

        <div className=" w-full lg:w-96 rounded-md p-5 flex flex-col items-center justify-start gap-6 ">
          {/* Google authentication button */}
          <AuthButtonProvider
            Icon={FaGoogle}
            label={"Sign In with Google"}
            provider={"GoogleAuthProvider"}
          />
          {/* GitHub authentication button */}
          <AuthButtonProvider
            Icon={FaGithub}
            label={"Sign In with GitHub"}
            provider={"GithubAuthProvider"}
          />
        </div>
      </div>

      {/*footer*/}
      <Footer />
    </div>
  );
};

// Typewriter component with animation effect
const Typewriter = ({ text }) => {
  const [index, setIndex] = React.useState(0);
  const [direction, setDirection] = React.useState(1); // 1: forward, -1: backward

  React.useEffect(() => {
    const intervalId = setInterval(() => {
      setIndex((prevIndex) => {
        if (direction === 1) {
          if (prevIndex === text.length - 1) {
            clearInterval(intervalId); // Clear interval to pause before reversing
            setTimeout(() => setDirection(-1), 1200); // Wait for 1000ms before reversing
          }
        } else {
          if (prevIndex === 0) {
            setDirection(1); // Reset direction to forward
          }
        }
        return prevIndex + direction;
      });
    }, 100); // Adjust speed as needed

    return () => clearInterval(intervalId);
  }, [text, direction]);

  return <div>{text.slice(0, index + 1)}</div>;
};

export default Authentication;
