import React, { useState } from "react";
import { Link } from "react-router-dom";
import InputField from "../Components/InputField";
import { useNavigate } from 'react-router-dom';
import API_URL from '../config';


const Register = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [message , setMessage] = useState("");

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if(!firstName.trim())
        {
            setMessage("First Name Required")
            return;
        }
    
        if(!lastName.trim())
        {
            setMessage("Last Name Required")
            return;
        }

    if(!username.trim())
        {
            setMessage("Username Required")
            return;
        }

    if(!email.trim())
    {
        setMessage("Email Required")
        return;
    }

    if(!password.trim())
    {
        setMessage("Password Required")
        return;
    }

        
    if(password.length < 8)
    {
        setMessage("Password need to have at least 8 characters")
        return;
    }

    const userData = {
        firstName,
        lastName,
        username,
        email,
        password,
    };

    console.log("Sending data:", userData);

    try {
        const response = await fetch(`${API_URL}/user/register`, 
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(userData),
        });

        const data = await response.json();
        console.log("Response:", data);

        if (response.ok) {
            setMessage("User created successfully");
            navigate('/login');
        } else {
            setMessage(data.message);
        }
    } catch (error) {
        console.error("Error:", error);
        alert("Error connecting to the server");
    }

    
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-800 to-green-700 text-white p-6">
      <div className="bg-white bg-opacity-10 p-8 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-bold mb-4 text-center text-black">Register</h2>
        <form onSubmit={handleSubmit}>
          <InputField label="Name" type="text" value={firstName} onChange={(e) => setFirstName(e.target.value)} placeholder="First Name" />
          <InputField label="LastName" type="text" value={lastName} onChange={(e) => setLastName(e.target.value)} placeholder="Last Name" />
          <InputField label="Username" type="text" value={username} onChange={(e) => setUsername(e.target.value)} placeholder="Username" />
          <InputField label="Email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" />
          <InputField label="Password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="******" />
          <p className="text-black">{message}</p>
          <button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg transition-all mt-4">
            Register
          </button>
        </form>
        <p className="mt-4 text-center text-sm text-black">
        Already have an account? <Link to="/login" className="text-blue-300 hover:underline">Login here</Link>
        </p>
      </div>
    </div>
  );
};

export default Register;