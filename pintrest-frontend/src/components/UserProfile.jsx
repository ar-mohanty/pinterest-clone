import React, { useEffect, useState } from "react";
import { AiOutlineLogout } from "react-icons/ai";
import { useParams, useNavigate } from "react-router-dom";
import { googleLogout } from "@react-oauth/google";

import {
  userCreatedPinsQuery,
  userQuery,
  userSavedPinsQuery,
} from "../utils/data";
import { client } from "../client";
import MasonryLayout from "./MasonryLayout";
import Spinner from "./Spinner";

const randomImage = "https://source.unsplash.com/1600x900/?quotes";
const activeBtnStyles =
  "bg-red-500 text-white font-bold p-2 rounded-full outline-none w-20";
const notActiveBtnStyles =
  "bg-primary mr-4 text-black font-bold p-2 rounded-full outline-none w-20";

const UserProfile = () => {
  const [user, setUser] = useState(null);
  const [pins, setPins] = useState(null);
  const [text, setText] = useState("created");
  const [activeBtn, setActiveBtn] = useState("created");

  const navigate = useNavigate();
  const { userId } = useParams();

  useEffect(() => {
    const query = userQuery(userId);

    client.fetch(query).then((data) => {
      setUser(data[0]);
    });
  }, []);

  useEffect(() => {
    if (text === "created") {
      const createdPinsQuery = userCreatedPinsQuery(userId);

      client.fetch(createdPinsQuery).then((data) => {
        setPins(data);
        console.log("created data", data);
      });
    } else {
      if (text === "saved") {
        const savedPinsQuery = userSavedPinsQuery(userId);

        client.fetch(savedPinsQuery).then((data) => {
          setPins(data);
          console.log("saved data", data);
        });
      }
    }
  }, [text, userId]);

  if (!user) {
    return <Spinner message="loading profile..." />;
  }

  const logout = () => {
    googleLogout();
    localStorage.clear();
    navigate("/login");
  };

  return (
    <>
      <div className="relative pb-2 h-full justify-center">
        <div className="flex flex-col pb-5">
          <div className="relative flex flex-col mb-7">
            <div className="flex flex-col justify-center items-center">
              <img
                src={randomImage}
                alt="banner-image"
                className="w-full h-56 xl:h-340 shadow-lg object-cover bg-top"
              />
              <img
                src={user.image}
                alt="user-profile"
                className="rounded-full w-20 h-20 shadow-lg -mt-10 object-cover"
              />
              <h1 className="font-bold text-3xl text-center mt-3">
                {user.username}
              </h1>
              <div className="absolute top-0 z-1 right-0 p-2">
                {userId === user._id && (
                  <button
                    type="button"
                    className=" bg-white p-2 rounded-full cursor-pointer outline-none shadow-md"
                    onClick={logout}
                  >
                    <AiOutlineLogout color="red" fontSize={21} />
                  </button>
                )}
              </div>
            </div>
            <div className="text-center mb-7 mt-3">
              <button
                type="button"
                onClick={() => {
                  setText("created");
                  setActiveBtn("created");
                }}
                className={`${
                  activeBtn === "created" ? activeBtnStyles : notActiveBtnStyles
                }`}
              >
                Created
              </button>
              <button
                type="button"
                onClick={() => {
                  setText("saved");
                  setActiveBtn("saved");
                  console.log("saved posted called");
                }}
                className={`${
                  activeBtn === "saved" ? activeBtnStyles : notActiveBtnStyles
                }`}
              >
                Saved
              </button>
            </div>
            {pins?.length ? (
              <div className="px-2">
                <MasonryLayout pins={pins} />
              </div>
            ) : (
              <div className="flex justify-center items-center font-bold text-xl mt-2 w-full">
                No pins found!
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default UserProfile;
