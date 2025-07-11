import { useState } from "react";
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import iconUrl from "leaflet/dist/images/marker-icon.png";
import iconShadowUrl from "leaflet/dist/images/marker-shadow.png";

const DefaultIcon = L.icon({ iconUrl, shadowUrl: iconShadowUrl });
L.Marker.prototype.options.icon = DefaultIcon;

const LocationMarker = ({ onSelect }: { onSelect: (coords: [number, number]) => void }) => {
  const [position, setPosition] = useState<[number, number] | null>(null);

  useMapEvents({
    click(e) {
      const coords: [number, number] = [e.latlng.lat, e.latlng.lng];
      setPosition(coords);
      onSelect(coords); // send to parent
    },
  });

  return position ? <Marker position={position} /> : null;
};

const DeliveryLocationPicker = () => {
  const [selectedLocation, setSelectedLocation] = useState<[number, number] | null>(null);
  const addisCoords: [number, number] = [9.03, 38.74];

  return (
    <div className="h-[500px] rounded-lg overflow-hidden shadow mt-6">
      <MapContainer center={addisCoords} zoom={13} style={{ height: "100%", width: "100%" }}>
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution="&copy; OpenStreetMap contributors"
        />
        <LocationMarker onSelect={(coords) => setSelectedLocation(coords)} />
      </MapContainer>

      {selectedLocation && (
        <div className="mt-4 text-center">
          <p className="text-sm text-gray-600">
            Selected Location: <br />
            <span className="font-mono text-green-600">
              Lat: {selectedLocation[0].toFixed(5)}, Lng: {selectedLocation[1].toFixed(5)}
            </span>
          </p>
        </div>
      )}
    </div>
  );
};

export default DeliveryLocationPicker;
