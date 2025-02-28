import React from "react";
import {FaTimes} from "react-icons/fa";




const UserCards = ({user, handleDeleteFriend}) => {
  return (
        <div className=" w-60 h-23 bg-cyan-800 shadow-md shadow-yellow-200 border-1 backdrop-blur-md rounded-xl flex gap-1 items-center text-center justify-center transform transition duration-300 hover:scale-105 hover:shadow-2xl ">
          <div className="mr-3 ml-2">
                <h2 className=" text-xl font-semibold text-yellow-200">{user.firstName + " " + user.lastName}</h2>
                <p className="font-semibold text-white ">{user.username}</p>
          </div>
          <div>
                <button onClick={() => handleDeleteFriend(user.username)} className=" text-center text-2xl border-none text-gray-400  rounded-lg pr-2 cursor-pointer hover:text-red-400 active:text-white">
                    <FaTimes/>
                </button>
          </div>
        </div>
  );
};

export default UserCards;
