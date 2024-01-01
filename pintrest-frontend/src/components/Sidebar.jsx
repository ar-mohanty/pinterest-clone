import React from "react";
import { NavLink, Link } from "react-router-dom";
import { RiHomeFill } from "react-icons/ri";
import { IoIosArrowForward } from "react-icons/io";
import logo from "../assets/pinterest-full.png";
import { categories } from "../utils/data";

const isNotActiveStyle =
  "flex items-center gap-3 text-gray-500 hover:text-black transition-all duration-200 ease-in-out capitalize";

const isActiveStyle =
  "flex items-center gap-3 font-medium text-white bg-red-600 py-2 px-5 rounded-lg border-black transition-all duration-200 ease-in-out capitalize shadow-xl";

const Sidebar = ({ user, closeToggle }) => {
  const handleCloseSidebar = () => {
    if (closeToggle) closeToggle(false);
  };
  return (
    <>
      <div className="flex flex-col justify-between bg-white h-full overflow-y-scroll min-w-210 hide-scrollbar px-5 shadow-2xl">
        <div className="flex flex-col">
          <Link
            to="/"
            className="flex gap-6 my-6 pb-6 w-190 flex-col"
            onClick={handleCloseSidebar}
          >
            <img src={logo} alt="logo" className="w-28 md:w-36" />
          </Link>
          <div className="flex flex-col gap-5 mb-10">
            <NavLink
              to="/"
              className={({ isActive }) =>
                isActive ? isActiveStyle : isNotActiveStyle
              }
              onClick={handleCloseSidebar}
            >
              <RiHomeFill />
              Home
            </NavLink>
            <h3 className="mt-2 text-base 2xl:text-xl text-left">
              Discover Categories
            </h3>
            {categories.slice(0, categories.length - 1).map((category) => (
              <NavLink
                to={`/category/${category.name}`}
                className={({ isActive }) =>
                  isActive ? isActiveStyle : isNotActiveStyle
                }
                onClick={handleCloseSidebar}
                key={category.name}
              >
                <img
                  src={category.image}
                  alt="category-image"
                  className="w-8 h-8 rounded-full shadow-md"
                />
                {category.name}
              </NavLink>
            ))}
          </div>
        </div>
        {user && (
          <Link
            to={`user-profile/${user._id}`}
            className="flex mb-4 gap-2 items-center bg-[#e9e9e9] rounded-full shadow-lg px-2 py-1"
          >
            <img src={user.image} className="w-8 h-8 rounded-full" />
            <h3 className="text-md text-gray-600 flex-grow text-left pl-3">
              {user.username}
            </h3>
            <IoIosArrowForward fontSize={20} className="text-gray-600" />
          </Link>
        )}
      </div>
    </>
  );
};

export default Sidebar;
