import { useState, useEffect } from "react";
import { Marker, Tooltip } from "react-leaflet";
import { haversine_distance } from "./utils";

const CityBike = ({ icon, center }) => {
  const [stations, setStations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBikeStations = async () => {
      try {
        const response = await fetch(
          "https://api.citybik.es/v2/networks/mobibikes"
        );
        const data = await response.json();

        if (data && data.network && data.network.stations) {
          setStations(data.network.stations);
        } else {
          setError("Invalid response from the API");
        }
      } catch (error) {
        setError("Error fetching bike stations data");
      } finally {
        setLoading(false);
      }
    };

    fetchBikeStations();
  }, []);

  if (loading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p>Error: {error}</p>;
  }

  return (
    <div>
      {stations.map((station) => {
        const latlng = [station.latitude, station.longitude];

        if (haversine_distance(latlng, center) < 0.5) {
          return (
            <Marker
              key={station.id}
              position={[station.latitude, station.longitude]}
              icon={icon}
            >
              <Tooltip direction="top" offset={[0, -36]}>
                <p className="font-bold">{station.name}</p>
                <p>Free Bikes: {station.free_bikes}</p>
                <p>Empty Slots: {station.empty_slots}</p>
                <p>Last Update: {station.timestamp}</p>
              </Tooltip>
            </Marker>
          );
        }
      })}
    </div>
  );
};

export default CityBike;
