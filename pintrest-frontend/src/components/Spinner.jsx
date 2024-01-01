import React, { useState } from "react";
import { Circles } from "react-loader-spinner";

const Spinner = ({ message }) => {
  return (
    <>
      <div className="flex flex-col justify-center items-center pt-6 gap-3">
        <Circles
          color="red"
          height="40px"
          width="40px"
          className="m-5"
          ariaLabel="circles-loading"
        />
        <p className="text-lg text-center px-2">{message}</p>
      </div>
    </>
  );
};

export default Spinner;
