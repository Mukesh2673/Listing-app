import "./places.scss";
import { useState, useMemo, useContext } from "react";
import { GoogleMap, useLoadScript, Marker } from "@react-google-maps/api";
import usePlacesAutocomplete, {
  getGeocode,
  getLatLng,
} from "use-places-autocomplete";
import { Combobox, ComboboxInput } from "@reach/combobox";
import "@reach/combobox/styles.css";
import { AppContext } from "../../App";
import { GoogleMaps_ApiKey } from "../../config/const";
export default function Places() {
  const { isLoaded } = useLoadScript({
    googleMapsApiKey: GoogleMaps_ApiKey,
    libraries: ["places"],
  });
  if (!isLoaded) return <div>Loading...</div>;
  return <Map />;
}

function Map() {
  const center = useMemo(() => ({ lat: 43.45, lng: -80.49 }), []);
  const [selected, setSelected] = useState(null);
  return (
    <>
      <div className="places-container">
        <PlacesAutocomplete setSelected={setSelected} />
      </div>

      <GoogleMap
        zoom={10}
        center={selected ? selected : center}
        mapContainerClassName="map-container"
      >
        {selected && <Marker position={selected} />}
      </GoogleMap>
    </>
  );
}

const PlacesAutocomplete = ({ setSelected }) => {
  const { setCityLocation } = useContext(AppContext);

  const {
    ready,
    value,
    setValue,
    suggestions: { status, data },
    clearSuggestions,
  } = usePlacesAutocomplete();

  const handleSelect = async (address) => {
    setValue(address, false);
    clearSuggestions();

    const results = await getGeocode({ address });
    const { lat, lng } = await getLatLng(results[0]);
    var mapAddress = {
      city: results[0].address_components[0].long_name,
      map: { lat, lng },
    };
    setCityLocation(mapAddress);

    setSelected({ lat, lng });
  };

  return (
    <Combobox onSelect={handleSelect}>
      <ComboboxInput
        value={value}
        onChange={(e) => setValue(e.target.value)}
        disabled={!ready}
        className="combobox-input form-control"
        placeholder="City"
      />
    </Combobox>
  );
};
