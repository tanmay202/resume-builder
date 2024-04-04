import React, { useState } from "react";
import useUser from "../hooks/useUser";
import { Link } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { PuffLoader } from "react-spinners";
import "./Button.css";
import { HiLogout } from "react-icons/hi";
import { slideUpDownMenu } from "../animations";
import { auth } from "../config/firebase.config";
import { useQueryClient } from "react-query";
import { adminIds } from "../utlis/helper";

const Header = () => {
  const { data, isLoading, isError } = useUser();
  const [isMenu, setIsMenu] = useState(false);

  const queryClient = useQueryClient();
  const signOutUser = async () => {
    await auth.signOut().then(() => {
      queryClient.setQueryData("user", null);
    });
  };

  return (
    <header className=" w-full h-10 flex items-center justify-between px-4 py-3 lg:px-8 border-b border-gray-300 z-50 gap-12 top-0 sticky ">
      {/*logo*/}
      <div
        style={{
          color: "red",
          fontWeight: "bold",
          fontSize: "24px",
          cursor: "pointer",
          //  marginLeft:"-25px",
        }}
      >
        MyResume<span style={{ color: "black" }}>Builder</span>
      </div>

      {/*input*/}

      <div className=" flex-1 border border-gray-300 px-4 py-1 rounded-md flex items-center justify-between bg-gray-200 ">
        <input
          type="text"
          placeholder="Search here...."
          className=" flex-1 h-7 bg-transparent text-base font-semibold outline-none border-none"
        />
      </div>

      {/*profile*/}

      <AnimatePresence>
        {isLoading ? (
          <PuffLoader color="rgba(177, 25, 25, 1)" size={40} />
        ) : (
          <React.Fragment>
            {data ? (
              <motion.div
                className="relative"
                onClick={() => setIsMenu(!isMenu)}
              >
                {data?.photoURL ? (
                  <div className="  w-12 h-10 rounded-md relative flex items-center justify-center cursor-pointer">
                    <img
                      src={data?.photoURL}
                      referrerPolicy="no-referrer"
                      className=" w-full h-full object-cover rounded-md"
                      alt=""
                    />
                  </div>
                ) : (
                  <div className="  w-12 h-12 rounded-md relative flex items-center justify-center bg-blue-700 cursor-pointer">
                    <p className=" text-3xl text-white">{data?.email[0]}</p>
                  </div>
                )}

                {/*drop down menu*/}
                <AnimatePresence>
                  {" "}
                  {isMenu && (
                    <motion.div
                      {...slideUpDownMenu}
                      className=" absolute px-4 py-3 rounded-md bg-gray-500 right-0 top-11 flex flex-col items-center justify-start gap-3 w-64 pt-12"
                      onMouseLeave={() => setIsMenu(false)}
                    >
                      {data?.photoURL ? (
                        <div className="  w-20 h-20 rounded-full relative flex items-center flex-col justify-center cursor-pointer">
                          <img
                            src={data?.photoURL}
                            referrerPolicy="no-referrer"
                            className=" w-full h-full object-cover rounded-full"
                            alt=""
                          />
                        </div>
                      ) : (
                        <div className="  w-20 h-20 rounded-full relative flex items-center justify-center bg-blue-700 cursor-pointer">
                          <p className=" text-3xl text-white">
                            {data?.displayName[0]}
                          </p>
                        </div>
                      )}

                      {data?.photoURL && (
                        <p className=" text-lg text-txtDark">
                          {data?.displayName}
                        </p>
                      )}

                      {/*menu opion*/}

                      <div className=" w-full flex-col items-start flex gap-8 pt-6 cursor-pointer">
                        <Link
                          className=" text-white hover:text-black text-base whitespace-nowrap"
                          to={"/profile"}
                        >
                          My Account
                        </Link>
                        {adminIds.includes(data?.uid) && (
                          <Link
                            className=" text-white hover:text-black text-base whitespace-nowrap"
                            to={"/template/create"}
                          >
                            Add New Templates
                          </Link>
                        )}

                        <div
                          className=" w-full px-2 py-2 border-t border-gray-300 flex items-center justify-between group cursor-pointer"
                          onClick={signOutUser}
                        >
                          <p className=" group-hover:text-black text-white">
                            Sign Out
                          </p>
                          <HiLogout className=" group-hover:text-black text-white" />
                        </div>
                      </div>
                    </motion.div>
                  )}{" "}
                </AnimatePresence>
              </motion.div>
            ) : (
              <Link to={"/auth"}>
                <motion.button type="button">Login</motion.button>
              </Link>
            )}
          </React.Fragment>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Header;
