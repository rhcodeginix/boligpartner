import React, { useEffect, useState } from "react";
import { GoogleMap, Marker } from "@react-google-maps/api";
import proj4 from "proj4";

proj4.defs("EPSG:25833", "+proj=utm +zone=33 +datum=WGS84 +units=m +no_defs");
const GoogleMapNearByComponent: React.FC<{ coordinates: any }> = ({
  coordinates,
}) => {
  const [isApiLoaded, setIsApiLoaded] = useState(false);

  const containerStyle = {
    width: "100%",
    height: "100%",
  };
  const utmCoords = coordinates;
  const [lng, lat] = proj4("EPSG:25833", "EPSG:4326", utmCoords);

  const bounds = coordinates?.length
    ? coordinates.reduce(
        (acc: any) => {
          acc.north = Math.max(acc.north, lat);
          acc.south = Math.min(acc.south, lat);
          acc.east = Math.max(acc.east, lng);
          acc.west = Math.min(acc.west, lng);
          return acc;
        },
        {
          north: lat,
          south: lat,
          east: lng,
          west: lng,
        }
      )
    : null;

  const mapOptions = {
    mapTypeId: "satellite",
    mapTypeControl: false,
    streetViewControl: false,
    fullscreenControl: false,
    zoomControl: false,
    disableDefaultUI: true,
    draggable: false,
    scrollwheel: false,
    disableDoubleClickZoom: true,
    styles: [
      {
        featureType: "all",
        elementType: "labels",
        stylers: [{ visibility: "off" }],
      },
    ],
  };

  const center = bounds
    ? {
        lat: (bounds.north + bounds.south) / 2,
        lng: (bounds.east + bounds.west) / 2,
      }
    : { lat: 0, lng: 0 };

  useEffect(() => {
    if (window.google && window.google.maps) {
      setIsApiLoaded(true);
    } else {
      const script = document.createElement("script");
      script.src = `https://maps.googleapis.com/maps/api/js?key=${process.env.REACT_APP_GOOGLE_MAPS_API_KEY}&v=weekly`;
      script.async = true;
      script.onload = () => setIsApiLoaded(true);
      script.onerror = () => console.error("Failed to load Google Maps API");
      document.head.appendChild(script);
    }

    return () => {
      const scripts = document.querySelectorAll(
        "script[src*='maps.googleapis.com']"
      );
      scripts.forEach((script) => script.remove());
    };
  }, []);

  return isApiLoaded ? (
    <GoogleMap
      mapContainerStyle={containerStyle}
      center={center}
      zoom={18}
      options={mapOptions}
    >
      <Marker position={{ lat, lng }} />
    </GoogleMap>
  ) : (
    <div>Loading...</div>
  );
};

export default GoogleMapNearByComponent;
