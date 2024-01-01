import React, { useState, useEffect } from "react";
import { MdDownloadForOffline } from "react-icons/md";
import { Link, useParams } from "react-router-dom";
import { v4 as uuidv4 } from "uuid";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { client, urlFor } from "../client";
import MasonaryLayout from "./MasonryLayout";
import { pinDetailMorePinQuery, pinDetailQuery } from "../utils/data";
import Spinner from "./Spinner";

const PinDetail = ({ user }) => {
  const [pins, setPins] = useState(null);
  const [pinDetail, setPinDetail] = useState(null);
  const [comment, setComment] = useState("");
  const [addingComment, setAddingComment] = useState(false);
  const { pinId } = useParams();

  const commentPostedSuccess = (message) => {
    toast.success(message, {
      position: "top-center",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "dark",
      toastId: "commentPostedSuccessToast",
    });
  };

  const fetchPinDetails = () => {
    const query = pinDetailQuery(pinId);

    if (query) {
      client.fetch(query).then((data) => {
        setPinDetail(data[0]);
        if (data[0]) {
          const query = pinDetailMorePinQuery(data[0]);

          client.fetch(query).then((res) => {
            setPins(res);
          });
        }
      });
    }
  };

  const addComment = () => {
    if (comment) {
      setAddingComment(true);

      client
        .patch(pinId)
        .setIfMissing({ comments: [] })
        .insert("after", "comments[-1]", [
          {
            comment,
            _key: uuidv4(),
            postedBy: {
              _type: "postedBy",
              _ref: user._id,
            },
          },
        ])
        .commit()
        .then(() => {
          fetchPinDetails();
          setComment("");
          setAddingComment(false);
          commentPostedSuccess("Comment added successfully! 🎉");
        });
    }
  };

  useEffect(() => {
    fetchPinDetails();
  }, [pinDetail]);

  if (!pinDetail) return <Spinner message="Loading pin" />;
  return (
    <>
      <div
        className="flex xl:flex-row flex-col m-auto bg-white mt-10 shadow-2xl shadow-red-200"
        style={{ maxWidth: "1500px", borderRadius: "32px" }}
      >
        <div className="flex justify-center items-center md:items-start flex-initial">
          <img
            src={pinDetail?.image && urlFor(pinDetail.image).url()}
            alt="user-post"
            className="lg:rounded-br-none lg:rounded-tr-none sm:rounded-br-3xl sm:rounded-tr-3xl lg:rounded-tl-3xl lg:rounded-bl-3xl h-full object-cover"
          />
        </div>
        <div className="w-full p-5 flex-1 xl:min-w-620 justify-start">
          <div className="flex items-center justify-between">
            <div className="flex gap-2 items-center">
              <a
                href={`${pinDetail.image?.asset?.url}?dl=`}
                download
                onClick={(e) => e.stopPropagation()}
                className="bg-white w-9 h-9 rounded-full flex items-center justify-center text-dark text-xl opacity-75 hover:opacity-100 hover:shadow-md outline-none"
              >
                <MdDownloadForOffline />
              </a>
            </div>
            <a href={pinDetail.destination} target="_blank" rel="noreferrer">
              {pinDetail.destination}
            </a>
          </div>
          <div>
            <h1 className="text-left text-4xl font-bold break-words mt-3">
              {pinDetail.title}
            </h1>
            <p className="mt-3 text-left">{pinDetail.about}</p>
          </div>
          <Link
            to={`/user-profile/${pinDetail.postedBy?._id}`}
            className="flex gap-2 mt-5 items-center bg-white rounded-lg"
          >
            <img
              src={pinDetail.postedBy?.image}
              alt="profile-image"
              className="w-8 h-8 rounded-full object-cover border border-red-500"
            />
            <p className="text-xs font-semibold lowercase text-gray-500">
              {pinDetail.postedBy?.username}
            </p>
          </Link>
          <h2 className="mt-5 text-2xl text-left">Comments</h2>
          <div className="max-h-370 overflow-y-auto text-left">
            {pinDetail?.comments?.map((comment, i) => (
              <div
                className="flex gap-2 mt-5 items-center bg-white rounded-lg"
                key={i}
              >
                <img
                  src={comment.postedBy.image}
                  alt="user-profile"
                  className="w-10 h-10 rounded-full cursor-pointer border border-red-500"
                />
                <div className="flex flex-col">
                  <p className="font-bold">{comment.postedBy.username}</p>
                  <p className="">{comment.comment}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="flex flex-wrap mt-6 gap-5">
            <Link
              to={`/user-profile/${pinDetail.postedBy?._id}`}
              className="flex gap-2 mt-5 items-center bg-white rounded-lg"
            >
              <img
                src={pinDetail.postedBy?.image}
                alt="profile-image"
                className="w-8 h-8 rounded-full object-cover border border-red-500"
              />
            </Link>
            <input
              className="flex-1 border-gray-100 outline-none border-2 p-2 rounded-2xl focus:border-gray-200 mt-5"
              type="text"
              placeholder="Add a comment!"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
            />
            <button
              type="button"
              onClick={addComment}
              className="bg-red-500 hover:bg-red-600 text-white text-sm font-semibold px-6 mt-5 rounded-full outline-none hover:shadow-md hover:shadow-red-400"
            >
              {addingComment ? "posting your comment...." : "Post"}
            </button>
          </div>
        </div>
        <ToastContainer />
      </div>
      {pins?.length > 0 ? (
        <>
          <h2 className="text-center font-bold text-2xl mt-28 mb-4">
            More like this!
          </h2>
          <MasonaryLayout pins={pins} />
        </>
      ) : (
        <>
          <h2 className="text-center font-bold text-2xl mt-16 mb-4">
            No more pins are available like this!
          </h2>
        </>
      )}
    </>
  );
};

export default PinDetail;
