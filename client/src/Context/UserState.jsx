import React, { createContext, useState } from "react";
const userContext = createContext();

const UserState = (props) => {
  console.log(localStorage.getItem("user"));
  let [userDetails, setUserDetails] = useState(
    JSON.parse(localStorage.getItem("user"))
  );

  const serverUrl = "http://localhost:8080";

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
