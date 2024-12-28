import React, { createContext, useState } from "react";
const userContext = createContext();

const UserState = (props) => {
  let [userDetails, setUserDetails] = useState(null);

  if (!userDetails) {
    let user = JSON.parse(localStorage.getItem("user"));
    setUserDetails(user);
  }

  let updateUserDetails = (obj) => {
    setUserDetails(obj);
    localStorage.setItem("user", JSON.stringify(obj));
  };

  return (
    <userContext.Provider value={{ userDetails, updateUserDetails }}>
      {props.children}
    </userContext.Provider>
  );
};

export { UserState, userContext };
