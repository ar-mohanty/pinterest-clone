import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { IoMdAdd, IoMdSearch } from "react-icons/io";
import { googleLogout } from "@react-oauth/google";
import { AiOutlineLogout } from "react-icons/ai";

const Navbar = ({ searchTerm, setSearchTerm, user }) => {
  const navigate = useNavigate();

  const logout = () => {
    googleLogout();
    localStorage.clear();
    navigate("/login");
  };

  if (!user) return null;
  return (
    <>
      <div className="flex gap-2 md-gap-5 w-full mt-5 justify-between rounded-full">
        <div className="flex gap-2 w-4/5 justify-center items-center rounded-full">
          <Link
            to="#"
            className="hidden md:flex hover:bg-black hover:text-white rounded-full justify-center items-center px-5 py-2 border border-red-600 hover:border-none ease-in-out duration-75"
          >
            Explore
          </Link>
          <Link
            to={`/user-profile/${user._id}`}
            className="hidden hover:bg-black hover:text-white rounded-full md:flex justify-center items-center px-5 py-2 border border-red-600 hover:border-none ease-in-out duration-75"
          >
            Saved
          </Link>
          <div className="flex justify-center items-center w-full px-2 rounded-full bg-[#e9e9e9] border outline-none focus-within:shadow-sm gap-2">
            <IoMdSearch fontSize={21} className="ml-1" />
            <input
              placeholder="Search"
              type="text"
              onChange={(e) => setSearchTerm(e.target.value)}
              value={searchTerm}
              onFocus={() => navigate("/search")}
              className="p-2 w-full bg-[#e9e9e9] rounded-full focus:outline-none"
            />
          </div>
        </div>

        <div className="flex gap-4 justify-center items-center">
          <Link
            to="/create-pin"
            className="bg-black rounded-full text-white w-10 h-10 flex justify-center items-center"
          >
            <IoMdAdd />
          </Link>
          <Link to={`user-profile/${user?._id}`} className="hidden md:block">
            <img
              src={user.image}
              alt="profile-image"
              className="w-10 h-10 rounded-full border border-red-600"
            />
          </Link>
          {user._id && (
            <button
              type="button"
              className=" bg-white p-2 rounded-full cursor-pointer outline-none shadow-md hover:bg-red-600 hover:text-white"
              onClick={logout}
            >
              <AiOutlineLogout
                fontSize={21}
                className="text-red-600 hover:text-white"
              />
            </button>
          )}
        </div>
      </div>
    </>
  );
};

export default Navbar;
