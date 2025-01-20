import React, { createContext, useState, useEffect } from "react";
const userContext = createContext();

const UserState = (props) => {
  let [userDetails, setUserDetails] = useState(null);
  const serverUrl = "http://localhost:8080";

  useEffect(() => {
    if (!userDetails) {
      let user = JSON.parse(localStorage.getItem("user"));
      if (user) {
        setUserDetails(user);
      }
    }
  }, []);

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
