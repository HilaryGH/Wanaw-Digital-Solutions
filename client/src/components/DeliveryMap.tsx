// src/components/DeliveryMap.tsx
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

// Fix Leaflet marker icon path
import iconUrl from "leaflet/dist/images/marker-icon.png";
import iconShadowUrl from "leaflet/dist/images/marker-shadow.png";

const DefaultIcon = L.icon({ iconUrl, shadowUrl: iconShadowUrl });
L.Marker.prototype.options.icon = DefaultIcon;

const DeliveryMap = () => {
  const addisCoords: [number, number] = [9.03, 38.74];

  return (
    <div className="h-[500px] rounded-lg overflow-hidden shadow">
      <MapContainer center={addisCoords} zoom={12} style={{ height: "100%", width: "100%" }}>
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution="&copy; OpenStreetMap contributors"
        />
        <Marker position={addisCoords}>
          <Popup>Wanaw delivers in Addis Ababa!</Popup>
        </Marker>
      </MapContainer>
    </div>
  );
};

export default DeliveryMap;

