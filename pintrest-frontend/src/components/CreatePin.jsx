import React, { useState } from "react";
import { AiOutlineCloudUpload } from "react-icons/ai";
import { MdDelete } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { client } from "../client";
import Spinner from "./Spinner";
import { categories } from "../utils/data";

const CreatePin = ({ user }) => {
  const [title, setTitle] = useState("");
  const [destination, setDestination] = useState("");
  const [about, setAbout] = useState("");
  const [loading, setLoading] = useState(false);
  const [fields, setFields] = useState(null);
  const [category, setCategory] = useState(null);
  const [imageAsset, setImageAsset] = useState(null);
  const [wrongImageType, setwrongImageType] = useState(false);

  //error messages
  const fieldEmptyError = (message) => {
    toast.error(message, {
      position: "top-right",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "dark",
      toastId: "fieldsToast1",
    });
  };
  const wrongImageTypeError = (message) => {
    toast.error(message, {
      position: "top-right",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "dark",
      toastId: "wrongImageTypeToast",
    });
  };

  const imageUploadSuccessMessage = (message) => {
    toast.success(message, {
      position: "top-right",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "dark",
      toastId: "wrongImageTypeToast",
    });
  };

  const pinCreatedSuccess = (message) => {
    toast.success(message, {
      position: "top-center",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "dark",
      toastId: "wrongImageTypeToast",
    });
  };

  const navigate = useNavigate();

  const uploadImage = (e) => {
    const { type, name } = e.target.files[0];

    if (
      type === "image/png" ||
      type === "image/svg" ||
      type === "image/jpeg" ||
      type === "image/gif" ||
      type === "image/tiff" ||
      type === "image/.gif"
    ) {
      setwrongImageType(false);
      setLoading(true);

      client.assets
        .upload("image", e.target.files[0], {
          contentType: type,
          filename: name,
        })
        .then((document) => {
          setImageAsset(document);
          setLoading(false);
          imageUploadSuccessMessage("Image upload successfull 🎉");
        })
        .catch((err) => {
          console.log("Image upload error!", err);
        });
    } else {
      setwrongImageType(true);
    }
  };

  const savePin = () => {
    if (title && about && destination && imageAsset?._id && category) {
      const doc = {
        _type: "pin",
        title,
        about,
        destination,
        image: {
          _type: "image",
          asset: {
            _type: "reference",
            _ref: imageAsset?._id,
          },
        },
        userId: user._id,
        postedBy: {
          _type: "postedBy",
          _ref: user._id,
        },
        category,
      };

      client.create(doc).then(() => {
        pinCreatedSuccess("Your pin is created 🎉");

        setTimeout(() => {
          navigate("/");
        }, 1000);
      });
    } else {
      setFields(true);
      setTimeout(() => {
        setFields(false);
      }, 2000);
    }
  };

  return (
    <>
      <div className="flex flex-col justify-center items-center mt-5 lg:h-4/5">
        {fields && (
          <>
            {fieldEmptyError("please fill in all the fields")}
            <p className="text-red-500 mb-5 text-xl transition-all duration-150 ease-in">
              Please fill in all the fields
            </p>
          </>
        )}
        <div className="flex lg:flex-row flex-col justify-center items-center bg-white lg:p-5 p-3 lg:w-[90%] w-full shadow-md rounded-md">
          <div className="bg-secondaryColor p-3 flex flex-0.7 w-full rounded-xl">
            <div className="flex justify-center items-center flex-col border-2 border-dotted border-gray-300 p-3 w-full h-510">
              {loading && <Spinner />}
              {wrongImageType && (
                <>{wrongImageTypeError("Invalid image type!")}</>
              )}
              {!imageAsset ? (
                <label>
                  <div className="flex flex-col items-center justify-center">
                    <div className="flex flex-col justify-center items-center">
                      <p className="font-bold text-2xl">
                        <AiOutlineCloudUpload />
                      </p>
                      <p className="text-md">Click to upload</p>
                    </div>
                    <p className="mt-16 text-gray-400">
                      Use high quality .jpeg, .svg, .gif less than 20 MB
                    </p>
                  </div>
                  <input
                    type="file"
                    name="upload-image"
                    onChange={uploadImage}
                    className="w-0 h-0"
                  />
                </label>
              ) : (
                <div className="relative h-full">
                  <img
                    src={imageAsset?.url}
                    alt="uploaded-picture"
                    className="h-full w-full object-cover rounded-xl shadow-md"
                  />
                  <button
                    type="button"
                    className="absolute bottom-3 right-3 p-3 rounded-full bg-white text-xl cursor-pointer outline-none hover:shadow-md transition-all duration-500 ease-in-out"
                    onClick={() => setImageAsset(null)}
                  >
                    <MdDelete />
                  </button>
                </div>
              )}
            </div>
          </div>
          <div className="flex flex-1 flex-col gap-6 lg:pl-5 mt-5 w-full">
            <div className="text-start flex flex-col">
              <label htmlFor="pin-title" className="text-sm text-gray-500">
                Title
              </label>
              <input
                type="text"
                value={title}
                name="pin-title"
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Add a title"
                className="outline-none text-md font-light border-2 border-gray-200 p-2 mt-1 rounded-xl"
              />
              {user && (
                <div className="flex gap-2 my-2 items-center bg-white rounded-lg">
                  <img
                    src={user.image}
                    alt="profile-image"
                    className="w-8 h-8 rounded-full border border-red-500"
                  />
                  <p className="font-normal text-gray-500 text-sm">
                    {user.username}
                  </p>
                </div>
              )}
              <label htmlFor="pin-about" className="text-sm text-gray-500 mt-3">
                Description
              </label>
              <textarea
                rows={8}
                type="text"
                value={about}
                name="pin-about"
                onChange={(e) => setAbout(e.target.value)}
                placeholder="Add a detailed description"
                className="outline-none text-md font-light border-2 border-gray-200 p-2 mt-1 rounded-xl"
              />
              <label
                htmlFor="pin-destination"
                className="text-sm text-gray-500 mt-3"
              >
                Link
              </label>
              <input
                type="text"
                value={destination}
                name="pin-destination"
                onChange={(e) => setDestination(e.target.value)}
                placeholder="Add a destination link"
                className="outline-none text-md font-light border-2 border-gray-200 p-2 mt-1 rounded-xl"
              />
              <div className="flex flex-col mt-4">
                <div>
                  <p className="mb-2 font-semibold text-md sm:text-lg">
                    Choose pin category
                  </p>
                  <select
                    name="pin-category"
                    id="pin-category"
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full text-base outline-none text-md font-light border-2 border-gray-200 p-2 mt-1 rounded-xl text-gray-600"
                  >
                    <option value="other" className="bg-white">
                      Select Category
                    </option>
                    {categories.map((category) => (
                      <option
                        value={category.name}
                        className="text-base border-0 outline-none capitalize bg-white text-gray-500"
                      >
                        {category.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="flex justify-end items-end mt-5">
                  <button
                    type="button"
                    onClick={savePin}
                    className="bg-red-700 text-white font-bold p-2 rounded-full w-28 outline-none hover:shadow-md hover:shadow-red-400"
                  >
                    Save Pin
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
        <ToastContainer />
      </div>
    </>
  );
};

export default CreatePin;
