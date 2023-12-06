import shapes from "../public/gtfs/shapes_sorted.txt";
import routes from "../public/gtfs/routes.txt";
import trips from "../public/gtfs/trips.txt";
import clinics from "../public/hlbc_walkinclinics.txt";
import indigenous_businesses from "../public/bcindigenousbusinesslistings.txt";

const processCSV = (str, delim = ",") => {
  const headers = str.slice(0, str.indexOf("\n")).split(delim);
  const rows = str.slice(str.indexOf("\n") + 1).split(/\r\n|\n/);

  const newArray = rows.map((row) => {
    const values = row.split(delim);
    const eachObject = headers.reduce((obj, header, i) => {
      obj[header] = values[i];
      return obj;
    }, {});
    return eachObject;
  });

  return newArray;
};

const groupByShapeID = (array) => {
  return array.reduce(function (r, a) {
    const { shape_id, ...rest } = a;
    r[shape_id] = r[shape_id] || [];
    r[a.shape_id].push(rest);
    return r;
  }, Object.create(null));
};

export const readFile = async () => {
  const files = {
    shapes: shapes,
    routes: routes,
    trips: trips,
    clinics: clinics,
    indigenous_businesses: indigenous_businesses,
  };
  const filesObject = {};

  for (let file in files) {
    try {
      // Fetch the CSV file
      const response = await fetch(files[file]);

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      // Get the CSV text content
      const csvText = await response.text();

      const rawData = processCSV(csvText);
      if (file === "shapes") {
        filesObject[file] = groupByShapeID(rawData);
      } else {
        filesObject[file] = rawData;
      }
    } catch (error) {
      console.error("Error fetching CSV:", error.message);
    }
  }

  return filesObject;
};

function toRadians(degrees) {
  const pi = Math.PI;
  return degrees * (pi / 180);
}

export function haversine_distance(origin, destination) {
  const [lat1, lon1] = origin;
  const [lat2, lon2] = destination;
  const radius = 6371; // earth radius in km

  const dlat = toRadians(lat2 - lat1);
  const dlon = toRadians(lon2 - lon1);
  const a =
    Math.sin(dlat / 2) * Math.sin(dlat / 2) +
    Math.cos(toRadians(lat1)) *
      Math.cos(toRadians(lat2)) *
      Math.sin(dlon / 2) *
      Math.sin(dlon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const d = radius * c;

  return d;
}
