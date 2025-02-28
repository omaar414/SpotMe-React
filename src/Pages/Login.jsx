// src/Pages/Login.jsx
import React, { useState } from "react";
import { Link } from "react-router-dom";
import InputField from "../Components/InputField";
import { useNavigate } from 'react-router-dom';
import API_URL from '../config';


const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");


  const navigate = useNavigate();

    // Token state
    const [token, setToken] = useState("");

    //Function that manage the login process
    const handleLogin = async (e) =>
    {
        // Prevent the default form submission behavior
        e.preventDefault();

        //Input Validations
        if(!username.trim())
        {
            setMessage("Username Required")
            return;
        }
        if(!password.trim())
        {
            setMessage("Password Required")
        }


        

        try {
             // Send a POST request with the user input
            const response = await fetch(`${API_URL}/user/login`, 
            {
               // Set the request method and headers
                method: "POST",
                headers: { "Content-Type": "application/json" },

                // Send the user input as JSON
                body: JSON.stringify({username, password}),
            });

            console.log(response);
            // We convert the response to JSON format
            const data = await response.json();
            console.log(data);

            // If the response is successful, we set the token
            if(response.ok)
            {
                setToken(data.token);

                localStorage.setItem("token", data.token);

                navigate('/dashboard');

                setMessage("Login Successful");
            } else {
                setMessage("Invalid username or password");
            }

        } catch (error) {
            setMessage("Error connecting to the server")
        }
    };

  

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-800 to-green-700 text-white p-6">
      <div className="bg-white bg-opacity-10 p-8 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-bold mb-4 text-center text-black">Login</h2>
        <form onSubmit={handleLogin}>
          <InputField label="Email" type="text" value={username} onChange={(e) => setUsername(e.target.value)} placeholder="Username" />
          <InputField label="Contraseña" type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="******" />
          <p className="text-black">{message}</p>
          <button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg transition-all mt-4">
            Login
          </button>
        </form>
        <p className="mt-4 text-center text-sm text-black ">
          Don't have an account? <Link to="/register" className="text-blue-300 hover:underline">Register here </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
