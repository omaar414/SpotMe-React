import { useState, useEffect } from "react";
import API_URL from '../config';
import { FaSignOutAlt, FaUserFriends, FaUser, FaSearch, FaBars, FaArrowLeft, FaCheck, FaTimes, FaUserPlus } from "react-icons/fa";
import { useNavigate } from 'react-router-dom';
import UserMap from "../Components/UserMap";
import UserCards from "../Components/UserCards";
import InputField from "../Components/InputField";


const Dashboard = () => {
    const [activeSection, setActiveSection] = useState("map");
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const navigate = useNavigate();
    const token = localStorage.getItem("token");
    const [userInfo, setUserInfo] = useState(null);
    const [userFriendsCount, setUserFriendsCount] = useState([]);
    const [userNotifications, setUserNotifications] = useState([]);
    const [userFriendList, setUserFriendList] = useState([]);
    const [mapFriends, setMapFriends] = useState([]);
    const [location, setLocation] = useState(null);
    const [search, setSearch] = useState("");
    const [searchResults, setSearchResults] = useState([]);



    const handleLogout = () => {
        localStorage.removeItem('token');
        navigate('/');
    };

    const handleSectionChange = (section) => {
        if(!token) return;
        setActiveSection(section);
        setIsSidebarOpen(false); // Cierra el sidebar en móviles al seleccionar
    };

    const handleProfileInfo = async () => {
        if(!token) return;

        try {
            const [userInfoRes, userFriendscountRes, userNotificationsRes] = await Promise.all([
                fetch(`${API_URL}/user/info`, { headers: {Authorization: `Bearer ${token}`}}),
                fetch(`${API_URL}/friendship/friends`, { headers: {Authorization: `Bearer ${token}`}}),
                fetch(`${API_URL}/friendship/friend-requests`, { headers: {Authorization: `Bearer ${token}`}}),
            ]);
            
            const [userInfoData, userFriendscountData, userNotificationsData] = await Promise.all([
                userInfoRes.json(),
                userFriendscountRes.json(),
                userNotificationsRes.json(),
            ]);

            setUserInfo(userInfoData);
            setUserFriendsCount(userFriendscountData);
            setUserNotifications(userNotificationsData);
            
        } catch (error) {
            console.error("Error:", error);
            alert(data.message);
        }
    };

    useEffect(() => {
        handleProfileInfo();

        const interval = setInterval(() => {
            handleProfileInfo();
        }, 30000);

        return () => clearInterval(interval);
    }, []);

    const handleFriendInfo = async () => {
        if(!token) return; 

        try {
            const response = await fetch(`${API_URL}/friendship/friends`, { headers: {Authorization: `Bearer ${token}`}})
            const data = await response.json();
            setUserFriendList(data);
        } catch (error){
            console.error("Error:", error);
        }
    };

    useEffect(() => {
        handleFriendInfo();

        const interval = setInterval(() => {
            handleFriendInfo();
        }, 30000);

        return () => clearInterval(interval);
    }, []);

    const handleMapFriends = async () => {
        if(!token) return;
        try {
            const response = await fetch(`${API_URL}/map/location/friends`, { headers: {Authorization: `Bearer ${token}`}})
            const data = await response.json();
            setMapFriends(data);
        } catch (error) {
            console.error("Error:", error);
        }
    }

    useEffect(() => {
        handleMapFriends();

        const interval = setInterval(() => {
            handleMapFriends();
        }, 30000);

        return () => clearInterval(interval);
    }, []);

    //  Obtener la ubicación del usuario al entrar
  useEffect(() => {
    if (!navigator.geolocation) {
      console.error("Geolocation not supported");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLocation({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        });
      },
      (error) => console.error("Error getting location", error)
    );
  }, []);

  //  Actualizar la ubicación en `setLocation` cada 30s
  useEffect(() => {
    if (!navigator.geolocation) return;

    const updateLocation = () => {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocation({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          });
        },
        (error) => console.error("Error updating location", error)
      );
    };

    const interval = setInterval(updateLocation, 30000); // Cada 30s
    return () => clearInterval(interval);
  }, []);

  //  Enviar la ubicación al backend (cuando entra y cada 30s)
  useEffect(() => {
    if (!token || !location) return;

    const sendLocation = async () => {
      try {
        await fetch(`${API_URL}/map/location/update`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(location),
        });
      } catch (error) {
        console.error("Error sending location:", error);
      }
    };

    sendLocation(); // Enviar al abrir `Dashboard`
    const interval = setInterval(sendLocation, 30000); // Luego cada 30s
    return () => clearInterval(interval);
  }, [location, token]); // Se ejecuta cuando cambia `location`

  const handleSearch = async (e) => {
    if (!token) return;
    e.preventDefault();
    if(search == null || search == ""){setSearchResults(""); return} 
    try {
        const response = await fetch(`${API_URL}/friendship/search-user/${search}`, {
            method: "GET",
            headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        });
        console.log("Response: " + response);
        const data = await response.json();
        console.log("Data: " + data);
        setSearchResults(data);
        setSearch(null);
    } catch (error) {
        console.error("Error searching:", error);
    }
  }

  const handleAcceptRequest = async (friendRequestId) => {
    if (!token) return;
    try {
        const response = await fetch(`${API_URL}/friendship/accept-request/${friendRequestId}`, {
            method: "POST",
            headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        });
        console.log("Response: " + response);
        if(!response.ok) {console.error("Error in the request"); return}

        const data = await response.json();
        console.log("Data: " + data);
        setUserNotifications(prev => prev.filter(notification => notification.friendRequestId !== friendRequestId))

    } catch (error) {
        console.error("Error accepting request:", error);
    }
  }

  const handleDenyRequest = async (friendRequestId) => {
    if (!token) return;
    try {
        const response = await fetch(`${API_URL}/friendship/deny-request/${friendRequestId}`, {
            method: "POST",
            headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        });
        console.log("Response: " + response);
        if(!response.ok) {console.error("Error in the request"); return}

        const data = await response.json();
        console.log("Data: " + data);
        setUserNotifications(prev => prev.filter(notification => notification.friendRequestId !== friendRequestId))

    } catch (error) {
        console.error("Error accepting request:", error);
    }
  }

  const handleDeleteFriend = async (username) => {
    if (!token) return;
    try {
        const response = await fetch(`${API_URL}/friendship/delete-friend/${username}`, {
            method: "DELETE",
            headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        });
        console.log("Response: " + response);
        if(!response.ok) {console.error("Error in the request"); return}

        const data = await response.json();
        console.log("Data: " + data);
        setUserFriendList(prev => prev.filter(friend => friend.username !== username))

    } catch (error) {
        console.error("Error accepting request:", error);
    }
}

const handleSendFriendRequest = async (username) => {
    if (!token) return;
    try {
        try {
            const response = await fetch(`${API_URL}/friendship/send-request`, {
                method: "POST",
                headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
                body: JSON.stringify({username}),
            });
            console.log("Response: " + response);
            if(!response.ok) {console.error("Error in the request"); return}
    
            const data = await response.json();
            console.log("Data: " + data);
            setSearchResults(prev => prev.filter(result => result.username !== username))
    
        } catch (error) {
            console.error("Error accepting request:", error);
        }

    } catch (error) {
    }
}

 


    
    


    return (
        <div className="h-screen flex bg-gradient-to-br from-blue-800 to-green-700 text-white relative">
            {/* Botón para abrir el sidebar en móviles */}
            {!isSidebarOpen && activeSection === "map" && (
                <button 
                    className="md:hidden fixed top-4 left-4 bg-gray-600 text-white p-2 rounded z-50"
                    onClick={() => setIsSidebarOpen(true)}
                >
                    <FaBars size={24} />
                </button>
            )}

            {/* Sidebar Izquierdo */}
            <div className={`fixed inset-0 w-full h-full bg-gradient-to-br from-blue-800 to-green-700 p-5 shadow-2xl border-r border-white/30 transition-transform duration-300 ease-in-out
                ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"} md:translate-x-0 md:relative md:w-72 md:h-auto`}
            >
                {/* Botón para cerrar el sidebar en móviles */}
                <button 
                    className="md:hidden absolute top-4 right-4 text-white text-2xl"
                    onClick={() => setIsSidebarOpen(false)}
                >
                    ✕
                </button>

                {/* Logo y usuario */}
                <div className="flex items-center space-x-2 mb-7">
                    <h2 className="text-4xl font-extrabold">SpotMe</h2>
                </div>

                {/* Navegación */}
                <nav className="space-y-4">

                    <button onClick={() => { 
                        handleSectionChange("profile"); 
                        handleProfileInfo();
                        }} 
                        className="flex items-center space-x-2 w-full text-left text-lg font-semibold p-2 rounded hover:bg-white/10"
                    >
                        <FaUser />
                        <span>Profile</span>
                    </button>

                    <button onClick={() => handleSectionChange("friends")} className="flex items-center space-x-2 w-full text-left text-lg font-semibold p-2 rounded hover:bg-white/10">
                        <FaUserFriends />
                        <span>Friends</span>
                    </button>
                    <button onClick={() => handleSectionChange("search")} className="flex items-center space-x-2 w-full text-left text-lg font-semibold p-2 rounded hover:bg-white/10">
                        <FaSearch />
                        <span>Search Friends</span>
                    </button>
                </nav>

                {/* Log Out */}
                <button className="absolute bottom-6 left-4 flex items-center space-x-2 text-2xl font-semibold text-red-500 hover:text-red-400" onClick={handleLogout}>
                    <FaSignOutAlt />
                    <span>Log Out</span>
                </button>
            </div>

            {/* Contenido Central - Mapa */}
            <div className={`flex-1 flex items-center justify-center transition-opacity duration-300 md:block  shadow-lg 
                ${activeSection === "map" ? "block" : "hidden"}`}
            >
                
                <div className="w-full h-[100vh] bg-opacity-40 shadow-inner">
                    <UserMap friends={mapFriends}/>
                </div>
                <div className="w-full bg-gradient-to-br from-blue-800 to-green-700">
                </div>

            </div>

            {/* Sidebar Derecho en PC | Sección Completa en Móviles */}
            <div className={`absolute inset-0 w-full h-full bg-white/10 backdrop-blur-lg shadow-xl p-5 transition-transform duration-300 ease-in-out
                ${activeSection !== "map" ? "block" : "hidden"} md:w-80 md:block md:relative md:border-l md:border-white/30`}
            >
                {/* Botón de Volver en móviles */}
                {activeSection !== "map" && (
                    <button 
                        className="md:hidden flex items-center space-x-2 text-lg font-semibold text-gray-800 hover:text-gray-600 mb-4"
                        onClick={() => setActiveSection("map")}
                    >
                        <FaArrowLeft />
                    </button>
                )}

                {activeSection === "profile" && 
                    <div className="flex bg-white-600/50 shadow-gray-800 shadow-xl  border border-gray-700 shadow-green rounded-xl flex-col items-center ">
                        <h3 className="text-4xl px-15 pt-5 pb-2 font-bold text-white-800 mb-4">Profile</h3>
                        
                        <p className="font-bold text-lg text-cyan-200">{userInfo ? userInfo.firstName + " " + userInfo.lastName : "loading..."}</p>
                        <p className="font-bold text-lg text-cyan-200">{userInfo ? userInfo.username : "loading..."}</p>
                        <p className="font-bold text-lg text-cyan-200 mb-9">Friends: {userFriendsCount?.length > 0 ? userFriendsCount.length : "0"}</p>

                        <p className="font-bold border-b-2 text-lg px-15 pt-5 pb-1 mt-1 mb-3 text-white ">Friend Requests</p>
                        <ul className="mb-6 text-center">
                            {userNotifications?.length > 0 ? (userNotifications.map((notification) =>
                                <li key={notification.friendRequestId} className="text-white-800 shadow-md mb-2 flex items-center gap-2 shadow-black rounded-lg bg-gray-800 border-gray-800  px-4 py-2">
                                    <div>
                                        <button onClick={ () => handleAcceptRequest(notification.friendRequestId)} className=" text-center border-none text-blue-400 rounded-lg mr-2 px-2 cursor-pointer hover:text-blue-700 active:text-white">
                                            <FaCheck />
                                        </button>
                                        <button onClick={ () => handleDenyRequest(notification.friendRequestId)} className=" text-center text-lg border-none text-red-500 rounded-lg pr-2  cursor-pointer hover:text-red-800 active:text-white">
                                            <FaTimes/>
                                        </button>
                                    </div>
                                    
                                    <div>
                                        <p>{notification.senderUsername}</p>
                                        <p className="text-yellow-200 text-sm ml-2">{ new Date(notification.dateSent).toLocaleString()}</p>
                                    </div>
                                    
                                </li>
                            )): (<p>No notifications</p>)}
                            
                        </ul>


                    </div>
                    
                }

                {activeSection === "friends" && 
                    <div className="flex bg-white-600/50 shadow-gray-800 shadow-xl  border border-gray-700 shadow-green rounded-xl flex-col items-center">
                        <h3 className="text-4xl px-15 pt-5 pb-2  font-bold text-white-800 mb-4">Friends</h3>
                        <ul className="mb-6 text-center flex flex-col items-center">
                            {userFriendList?.length > 0 ? (userFriendList.map((user) => 
                                <li key={user.userId} className="mb-3"> 
                                {console.log("UserId: " + user.userId)}
                                {console.log("FirstName: " + user.firstName)}
                                    <UserCards user={user} handleDeleteFriend={handleDeleteFriend}/>
                                </li>)) : ("No Friends") 
                            }
                        </ul>
                    </div>
                }

                {activeSection === "search" && 
                    <div className="flex bg-white-600/50 shadow-gray-800 shadow-xl  border border-gray-700 shadow-green rounded-xl flex-col justify-center items-center">
                        <h3 className="text-4xl px-15 pt-5 pb-2 font-bold text-white-800 mb-1">Search</h3>

                        <form onSubmit={handleSearch} className="flex flex-col items-center">
                        <input type="text" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Username..." className="w-full p-2 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 text-gray-700 mb-2"/>
                        <button className=" bg-blue-500 hover:bg-blue-700 text-white font-semibold py-2 px-3 rounded-lg transition-all mb-2">Search</button>
                        </form>
                        <ul className="mb-6 text-center">
                            {searchResults?.length > 0 ? (searchResults.map((result, index) =>
                                <li key={index} className="text-white-800 shadow-md mb-2 shadow-black flex rounded-lg bg-gray-800 border-gray-800  px-4 py-2">
                                    
                                    <div>
                                        <button onClick={() => handleSendFriendRequest(result.username)} className=" text-center text-lg text-blue-400 mr-2 px-2 cursor-pointer hover:text-blue-600 active:text-white">
                                            <FaUserPlus/>
                                        </button>
                                    </div>

                                    <div>
                                        <p>{result.username}</p>
                                    </div>
                                    
                                </li>
                            )): (<p></p>)}
                        </ul>


                    </div>
                }
            </div>
        </div>
    );
};

export default Dashboard;

