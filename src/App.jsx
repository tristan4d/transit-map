import { useEffect, useState } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  Tooltip,
  Polyline,
  ScaleControl,
  useMapEvents,
} from "react-leaflet";
import * as L from "leaflet";
import ChangeCenter from "./ChangeCenter";
import { haversine_distance, readFile } from "./utils";

import "./App.css";
import "leaflet/dist/leaflet.css";
// import jsonData from "../public/gtfs/route_shapes.json";
// const route_shapes_data = JSON.parse(JSON.stringify(jsonData));
// const route_shapes = Object.values(route_shapes_data["shapes"]).flat();

const pathOptions = {
  0: { color: "lime" },
  1: { color: "darkorange" },
  2: { color: "purple" },
  3: { color: "blue" },
  4: { color: "green" },
  5: { color: "red" },
  6: { color: "yellow" },
};

function App() {
  const [map, setMap] = useState(null);
  const [polylines, setPolylines] = useState([]);
  const [files, setFiles] = useState(null);
  const [trip_idx, setTrip_idx] = useState([]);
  const [route_idx, setRoute_idx] = useState([]);
  const [curr_idx, setCurr_idx] = useState({});
  const [clinics, setClinics] = useState([]);
  const [businesses, setBusinesses] = useState([]);
  // const [center, setCenter] = useState([49.285707, -123.112084]);
  const [center, setCenter] = useState([49.274503, -123.122183]);

  //  Create the Icon
  const LeafIcon = L.Icon.extend({
    options: {},
  });

  const blueIcon = new LeafIcon({
      iconUrl:
        "https://chart.apis.google.com/chart?chst=d_map_pin_letter&chld=%E2%80%A2|00E5E8&chf=a,s,ee00FFFF",
    }),
    yellowIcon = new LeafIcon({
      iconUrl:
        "https://chart.apis.google.com/chart?chst=d_map_pin_letter&chld=%E2%80%A2|F0F600&chf=a,s,ee00FFFF",
    }),
    pinkIcon = new LeafIcon({
      iconUrl:
        "https://chart.apis.google.com/chart?chst=d_map_pin_letter&chld=%E2%80%A2|FF3CC7&chf=a,s,ee00FFFF",
    });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await readFile();
        setFiles(result);
        setTrip_idx(result["trips"].map((row) => row.shape_id));
        setRoute_idx(result["routes"].map((row) => row.route_id));
      } catch (error) {
        console.error("Error reading file:", error);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    if (map && files) {
      const newLines = [];
      const tripIdx = [];
      const routeIdx = [];
      const newClinics = [];
      const clinicInfo = [];
      const newBusinesses = [];
      const businessInfo = [];

      Object.values(files["clinics"]).map((row) => {
        const lat = parseFloat(row.LATITUDE);
        const lon = parseFloat(row["LONGITUDE\r"]);

        if (haversine_distance([lat, lon], center) < 1) {
          newClinics.push([lat, lon]);
          clinicInfo.push({
            name: row.RG_NAME,
            phone: row.PHONE_NUMBER,
            accessible: row.WHEELCHAIR_ACCESSIBLE,
          });
        }
      });

      Object.values(files["indigenous_businesses"]).map((row) => {
        const lat = parseFloat(row.Latitude);
        const lon = parseFloat(row["Longitude\r"]);

        if (haversine_distance([lat, lon], center) < 1) {
          newBusinesses.push([lat, lon]);
          businessInfo.push({
            name: row["Business Name"],
            phone: row.Phone,
          });
        }
      });

      for (let shape in files["shapes"]) {
        let closeToCenter = false;

        const newLine = files["shapes"][shape].map((row) => {
          const lat =
            parseFloat(row.shape_pt_lat) *
            (1 + (Math.random() - 0.5) / 2000000);
          const lon =
            parseFloat(row.shape_pt_lon) *
            (1 + (Math.random() - 0.5) / 2000000);

          if (!closeToCenter) {
            closeToCenter = haversine_distance([lat, lon], center) < 0.2;
          }
          return [lat, lon];
        });

        if (closeToCenter) {
          const newId = trip_idx.indexOf(shape);
          const routeId = files["trips"][newId].route_id;
          routeIdx.push(route_idx.indexOf(routeId));
          tripIdx.push(newId);
          newLines.push(newLine);
        }
      }

      setCurr_idx({ headsign: tripIdx, route: routeIdx });
      setPolylines(newLines);
      setClinics({ location: newClinics, info: clinicInfo });
      setBusinesses({ location: newBusinesses, info: businessInfo });
    }
  }, [map, files, center]);

  return (
    <div className="h-full">
      <MapContainer
        style={{ height: "100vh" }}
        center={center}
        zoom={13}
        scrollWheelZoom={true}
        zoomControl={false}
        ref={setMap}
      >
        <ChangeCenter setCenter={setCenter} />
        <ScaleControl position="topleft" />
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <Marker position={center} icon={blueIcon}>
          <Tooltip direction="right" offset={[20, 10]}>
            Test Center
          </Tooltip>
        </Marker>
        {clinics.location &&
          clinics.location.map((clinic, idx) => (
            <Marker position={clinic} key={idx} icon={yellowIcon}>
              <Tooltip direction="right" offset={[20, 10]}>
                <p className="font-bold">{clinics.info[idx].name}</p>
                <p>{clinics.info[idx].phone}</p>
              </Tooltip>
            </Marker>
          ))}
        {businesses.location &&
          businesses.location.map((business, idx) => (
            <Marker position={business} key={idx} icon={pinkIcon}>
              <Tooltip direction="right" offset={[20, 10]}>
                <p className="font-bold">{businesses.info[idx].name}</p>
                <p>{businesses.info[idx].phone}</p>
              </Tooltip>
            </Marker>
          ))}
        {polylines.map((polyline, idx) => (
          <Polyline
            key={idx}
            positions={polyline}
            pathOptions={
              pathOptions[files["routes"][curr_idx.route[idx]].route_type]
            }
          >
            <Tooltip sticky>
              <p className="font-bold">
                {files["trips"][curr_idx.headsign[idx]].trip_headsign}
              </p>
            </Tooltip>
          </Polyline>
        ))}
      </MapContainer>
    </div>
  );
}

export default App;
