import React, { useEffect, useRef } from 'react';
import styled from '@emotion/styled';
import L from 'leaflet';
import type { IBusRoute, IBusRouteDetail, PositionLatLon } from 'react-app-env';

const Map = styled.div`
  width: 100%;
`;

interface LeafletProps {
  polyLine: Array<PositionLatLon>;
  busRoute: IBusRouteDetail
}

const Leaflet: React.FC<LeafletProps> = ({ polyLine, busRoute }) => {
  const mapRef = useRef(null);
  const mapInstanceRef = useRef<L.Map>();

  const redIcon = new L.Icon({
    iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41],
  });

  useEffect(() => {
    mapInstanceRef.current = L.map(mapRef.current as unknown as HTMLDivElement)
      .setView([25.0480075, 121.5170613], 16);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 18,
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    }).addTo(mapInstanceRef.current);

    const taipeiStationMarker = L.marker([25.0480075, 121.5170613], {
      draggable: true,
      icon: redIcon,
    }).bindPopup('hello').addTo(mapInstanceRef.current);

    taipeiStationMarker.openPopup();

    return () => { if (mapInstanceRef.current) { mapInstanceRef.current.remove(); } };
  }, []);

  useEffect(() => {
    if (polyLine?.length && mapInstanceRef.current) {
      const bounds = [polyLine[0], polyLine[polyLine.length - 1]];

      L.polyline(polyLine).addTo(mapInstanceRef.current);
      mapInstanceRef.current.fitBounds(bounds);
    }
  }, [polyLine]);

  useEffect(() => {
    const { Stops: stops } = busRoute;

    stops?.forEach((stop) => {
      const { PositionLat, PositionLon } = stop.StopPosition;
      const { Zh_tw: stopName } = stop.StopName;

      if (mapInstanceRef.current) {
        L.marker([PositionLat, PositionLon], {
          draggable: false,
          icon: redIcon,
        }).bindTooltip(stopName, {
          permanent: true,
          direction: 'right',
        }).addTo(mapInstanceRef.current);
      }
    });
  }, [busRoute]);

  return <Map ref={mapRef} />;
};

export default Leaflet;
