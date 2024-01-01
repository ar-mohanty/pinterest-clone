import { jwtDecode } from "jwt-decode";

export const fetchUser = () => {
  const userString = localStorage.getItem("user");

  if (!userString) {
    return null;
  }
  try {
    const userInfo = jwtDecode(JSON.parse(userString));
    return userInfo;
  } catch (error) {
    console.error("Error decoding user token:", error);
    localStorage.clear();
    return null;
  }
};
