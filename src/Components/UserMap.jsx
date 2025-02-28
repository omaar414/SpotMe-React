import {MapContainer, TileLayer, Marker, Popup} from 'react-leaflet';
import "leaflet/dist/leaflet.css";

const puertoRicoCenter = [18.2208, -66.5901]; // Coordenadas del centro de PR

const UserMap = ({friends}) => {
    

    return (
        <MapContainer center={puertoRicoCenter} zoom={10} style={{ height: "100%", width: "100%" }}>
              {/* Capa base del mapa usando OpenStreetMap */}
              <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

              {/* Marcador en la ubicación actual */}
              {/* Iteramos sobre todas las ubicaciones y creamos un `Marker` para cada usuario */}
              {friends.map((friend, index) => (
                <Marker key={index} position={[friend.latitude, friend.longitude]}>
                    <Popup>
                        <b className='text-center text-cyan-800'>{friend.firstName +" "+ friend.lastName}</b><br/>
                        <b className='items-center text-end'>{friend.username}</b>
                    </Popup>
              </Marker>
              ))}
                
            </MapContainer>
    );
};

export default UserMap;