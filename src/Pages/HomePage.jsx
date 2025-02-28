import React from "react";
import { useNavigate } from "react-router-dom";

const HomePage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-800 to-green-700 text-white p-6">
      <div className="text-center max-w-2xl">
        <h1 className="text-5xl font-bold mb-4 drop-shadow-lg">Welcome to SpotMe</h1>
        <p className="text-lg mb-6 opacity-90">
          Capture the Moment. Share the Journey.
        </p>

        {/* Botones de acción */}
        <div className="flex justify-center gap-4 mt-6">
          <button
            onClick={() => navigate("/login")}
            className="px-6 py-3 bg-white text-blue-600 font-semibold rounded-lg shadow-lg hover:bg-blue-200 hover:text-blue-900 cursor-pointer transition-all"
          > Login </button>

          <button
            onClick={() => navigate("/register")}
            className="px-6 py-3 bg-blue-700 text-white font-semibold rounded-lg shadow-lg hover:bg-blue-800 cursor-pointer transition-all"
          > Register </button>

        </div>
      </div>
    </div>
  );
};

export default HomePage;