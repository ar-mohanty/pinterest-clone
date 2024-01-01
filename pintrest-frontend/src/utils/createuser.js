import axios from "axios";
import { jwtDecode } from "jwt-decode";
import { client } from "../client";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";

export const createOrGetUser = (response) => {
  const navigate = useNavigate();
  const { name, sub, picture } = jwtDecode(response.credential);

  const doc = {
    _id: sub,
    _type: "user",
    userName: name,
    image: picture,
  };

  client.createIfNotExists(doc).then(() => {
    navigate("/", { replace: true });
  });
};
