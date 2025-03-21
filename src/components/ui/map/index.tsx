import React, { useState, useEffect } from "react";
import { GoogleMap, useJsApiLoader, Polygon } from "@react-google-maps/api";

const GoogleMapComponent: React.FC<{ coordinates: any }> = ({
  coordinates,
}) => {
  const [map, setMap] = useState<any | null>(null);

  const containerStyle = {
    width: "100%",
    height: "100%",
  };

  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY!,
  });

  const bounds = coordinates?.length
    ? coordinates.reduce(
        (acc: any, coord: any) => {
          acc.north = Math.max(acc.north, coord.latitude);
          acc.south = Math.min(acc.south, coord.latitude);
          acc.east = Math.max(acc.east, coord.longitude);
          acc.west = Math.min(acc.west, coord.longitude);
          return acc;
        },
        {
          north: coordinates[0].latitude,
          south: coordinates[0].latitude,
          east: coordinates[0].longitude,
          west: coordinates[0].longitude,
        }
      )
    : null;

  const center = bounds
    ? {
        lat: (bounds.north + bounds.south) / 2,
        lng: (bounds.east + bounds.west) / 2,
      }
    : { lat: 0, lng: 0 };

  const onLoad = (map: any) => {
    setMap(map);
  };

  const onUnmount = () => {
    setMap(null);
  };

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

  const polygonOptions = {
    fillColor: "transparent",
    fillOpacity: 0.3,
    strokeColor: "#FF0000",
    strokeOpacity: 1,
    strokeWeight: 2,
    draggable: false,
    editable: false,
    visible: true,
    zIndex: 1,
  };

  const getClosedPath = () => {
    if (!coordinates || coordinates.length === 0) return [];

    const path = coordinates.map((coord: any) => ({
      lat: coord.latitude,
      lng: coord.longitude,
    }));

    const firstPoint = path[0];
    const lastPoint = path[path.length - 1];

    if (firstPoint.lat !== lastPoint.lat || firstPoint.lng !== lastPoint.lng) {
      path.push(firstPoint);
    }

    return path;
  };

  const handleMapClick = (e: any) => {
    const clickedLatLng = e.latLng;
    if (!clickedLatLng) return;

    const lat = clickedLatLng.lat();
    const lng = clickedLatLng.lng();

    const googleMapsUrl = `https://www.google.com/maps?q=${lat},${lng}`;
    window.open(googleMapsUrl, "_blank");

    if (map) {
      map.panTo(clickedLatLng);
      map.setZoom(12);
    }
  };

  useEffect(() => {
    if (map && bounds) {
      const googleBounds = new google.maps.LatLngBounds(
        { lat: bounds.south, lng: bounds.west },
        { lat: bounds.north, lng: bounds.east }
      );

      window.setTimeout(() => {
        map.fitBounds(googleBounds);
      }, 500);
    }
  }, [map, bounds]);
  if (!isLoaded) return <div>Loading Map...</div>;

  return (
    <GoogleMap
      mapContainerStyle={containerStyle}
      center={center}
      onLoad={onLoad}
      onUnmount={onUnmount}
      options={mapOptions}
    >
      {coordinates && coordinates.length > 0 && (
        <Polygon
          paths={getClosedPath()}
          options={polygonOptions}
          onClick={handleMapClick}
        />
      )}
    </GoogleMap>
  );
};

export default GoogleMapComponent;
