import Hellowebpart from "./Dashboard";
import * as React from "react";

export const HelloLibrary = (props) => {
  return (
    <Hellowebpart
      context={props.context}
      listName={props.listName}
      Title={props.Title}
    />
  );
};