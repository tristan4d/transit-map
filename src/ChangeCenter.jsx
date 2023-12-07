import { useMapEvents } from "react-leaflet";
import { haversine_distance } from "./utils";

export default function ChangeCenter({ setCenter, setStop_idx, stops }) {
  const map = useMapEvents({
    click: (e) => {
      let distance = Infinity;
      let stop_idx = null;
      let center = null;
      const latlng = Object.values(e.latlng);

      stops.map((row, idx) => {
        const stopCenter = [row.stop_lat, row.stop_lon];
        const tempDist = haversine_distance(latlng, stopCenter);
        if (tempDist < distance) {
          distance = tempDist;
          stop_idx = idx;
          center = stopCenter;
        }
      });

      setCenter(center);
      setStop_idx(stop_idx);
    },
  });
}
