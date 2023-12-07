import { useState, useEffect } from "react";
import { Marker, Tooltip } from "react-leaflet";
import { haversine_distance } from "./utils";

const ModoCarshare = ({ icon, center }) => {
  const [stations, setStations] = useState([]);
  const [cars, setCars] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
    const fetchModoStations = async () => {
      try {
        const response = await fetch(
          `https://bookit.modo.coop/api/v2/nearby?lat=${center[0]}&long=${center[1]}&distance=500`
        );
        const data = await response.json();

        if (data && data.Status === "Success") {
          setStations(data.Response.Locations);
        } else {
          setError("Invalid response from the API");
        }
      } catch (error) {
        setError("Error fetching Modo Carshare data");
      } finally {
        setLoading(false);
      }
    };

    fetchModoStations();
  }, [center]);

  useEffect(() => {
    setLoading(true);
    const fetchModoCars = async () => {
      try {
        const response = await fetch(
          "https://bookit.modo.coop/api/v2/car_list?"
        );
        const data = await response.json();

        if (data && data.Status === "Success") {
          setCars(Object.values(data.Response.Cars));
        } else {
          setError("Invalid response from the API");
        }
      } catch (error) {
        setError("Error fetching Modo Carshare data");
      } finally {
        setLoading(false);
      }
    };

    fetchModoCars();
  }, []);

  if (loading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p>Error: {error}</p>;
  }

  return (
    <div>
      {stations.map((station) => (
        <Marker
          key={station.LocationID}
          position={[station.Latitude, station.Longitude]}
          icon={icon}
        >
          <Tooltip direction="top" offset={[0, -36]}>
            <p className="font-bold">Modo CarShare</p>
            {cars.map((car) => {
              return car.Location.map((location) => {
                if (location.LocationID === station.LocationID) {
                  return (
                    <p id={car.ID}>
                      {car.Make} {car.Model}
                    </p>
                  );
                }
              });
            })}
          </Tooltip>
        </Marker>
      ))}
    </div>
  );
};

export default ModoCarshare;
