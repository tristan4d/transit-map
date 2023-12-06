import { useMapEvents } from "react-leaflet";

export default function ChangeCenter({ setCenter }) {
  const map = useMapEvents({
    click: (e) => {
      setCenter(Object.values(e.latlng));
    },
  });
}
