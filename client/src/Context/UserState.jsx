import React, { createContext, useState } from "react";
const userContext = createContext();

const UserState = (props) => {
  let [userDetails, setUserDetails] = useState({
    userId: "",
    username: "",
  });

  let updateUserDetails = (obj) => {
    setUserDetails(obj);
  };

  return (
    <userContext.Provider value={{ userDetails, updateUserDetails }}>
      {props.children}
    </userContext.Provider>
  );
};

export { UserState, userContext };
