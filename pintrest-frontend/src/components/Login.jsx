import React from "react";
import { useNavigate } from "react-router-dom";
import pinLogo from "../assets/pinterest-full.svg";
import backgroundVideo from "../assets/backdropvid.mp4";
import { GoogleLogin, googleLogout } from "@react-oauth/google";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { jwtDecode } from "jwt-decode";
import { client } from "../client";

const Login = () => {
  const navigate = useNavigate();

  const createOrGetUser = async (response) => {
    localStorage.setItem("user", JSON.stringify(response.credential));
    const { name, sub, picture } = jwtDecode(response.credential);


    const doc = {
      _id: sub,
      _type: "user",
      username: name,
      image: picture,
    };

    client.createIfNotExists(doc).then(() => {
      navigate("/", { replace: true });
    });
  };

  return (
    <>
      <GoogleOAuthProvider clientId={`${import.meta.env.VITE_GOOGLE_CLIENTID}`}>
        <div className="flex justify-center items-center flex-col h-screen w-screen">
          <div className="relative w-full h-full">
            <video
              src={backgroundVideo}
              typeof="video/mp4"
              loop
              controls={false}
              muted
              autoPlay
              className="w-full h-full object-cover"
            ></video>
            <div className="absolute flex flex-col justify-center items-center top-0 right-0 left-0 bottom-0 bg-black w-full h-full bg-blackOverlay">
              <img
                src={pinLogo}
                alt="pinterest logo"
                className="h-12 md:h-16 lg:24"
              />
              <div className="mt-6">
                <GoogleLogin
                  onSuccess={(response) => {
                    createOrGetUser(response);
                  }}
                  onError={() => {
                    console.log("Login Failed");
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      </GoogleOAuthProvider>
    </>
  );
};

export default Login;
