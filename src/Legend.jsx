export default function Legend() {
  return (
    <div className="bg-white p-4 rounded shadow-md h-1/5 flex flex-col">
      <div>
        Click on the map to select the closest transit station. Nearby points of
        interest will populate accordingly.
      </div>
      <div className="flex flex-row">
        <div className="basis-1/3">
          <h2 className="text-lg font-semibold mb-2">Transit</h2>
          <div className="flex items-center mb-2">
            <div
              className="w-4 h-4 mr-2"
              style={{ backgroundColor: "#00E5E8" }}
            ></div>
            <p className="text-sm">Current Station</p>
          </div>
          <div className="flex items-center">
            <div className="w-4 h-1 bg-black mr-2"></div>
            <p className="text-sm">Routes</p>
          </div>
        </div>
        <div className="basis-1/3">
          <h2 className="text-lg font-semibold mb-2">Alternate Mobility</h2>
          <div className="flex items-center mb-2">
            <div
              className="w-4 h-4 mr-2"
              style={{ backgroundColor: "#007C77" }}
            ></div>
            <p className="text-sm">Available Bikes</p>
          </div>
          <div className="flex items-center">
            <div
              className="w-4 h-4 mr-2"
              style={{ backgroundColor: "#4C1A57" }}
            ></div>
            <p className="text-sm">Modo CarShare</p>
          </div>
        </div>
        <div className="basis-1/3">
          <h2 className="text-lg font-semibold mb-2">Points of Interest</h2>
          <div className="flex items-center mb-2">
            <div
              className="w-4 h-4 mr-2"
              style={{ backgroundColor: "#FF3CC7" }}
            ></div>
            <p className="text-sm">Indigenous Businesses</p>
          </div>
          <div className="flex items-center">
            <div
              className="w-4 h-4 mr-2"
              style={{ backgroundColor: "#F0F600" }}
            ></div>
            <p className="text-sm">Walk-In Clinics</p>
          </div>
        </div>
      </div>
    </div>
  );
}
