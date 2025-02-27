import React, { createContext, useEffect, useState } from "react";
const userContext = createContext();

const UserState = (props) => {
  let [userDetails, setUserDetails] = useState(
    JSON.parse(localStorage.getItem("user"))
  );
  const serverUrl = "https://chatify-backend-t1a1.onrender.com";

  let updateUserDetails = (obj) => {
    setUserDetails(obj);
    localStorage.setItem("user", JSON.stringify(obj));
  };

  return (
    <userContext.Provider value={{ userDetails, updateUserDetails, serverUrl }}>
      {props.children}
    </userContext.Provider>
  );
};

export { UserState, userContext };
