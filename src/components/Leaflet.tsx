import React, { useEffect, useRef } from 'react';
import styled from '@emotion/styled';
import L from 'leaflet';
import type { IBusRouteDetail, ShapeOfBusRoute } from 'react-app-env';

const Map = styled.div`
  width: 100%;
`;

interface LeafletProps {
  busRoute: IBusRouteDetail;
  shapeOfBusRoute: ShapeOfBusRoute[0];
}

const Leaflet: React.FC<LeafletProps> = ({ busRoute, shapeOfBusRoute }) => {
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
    const createMap = () => {
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
    };

    createMap();
    return () => { if (mapInstanceRef.current) { mapInstanceRef.current.remove(); } };
  }, []);

  const routeShapeLine = useRef<L.Polyline>();

  useEffect(() => {
    const removeRouteShapeLine = () => {
      if (routeShapeLine.current === undefined) return;
      mapInstanceRef.current?.removeLayer(routeShapeLine.current);
    };

    removeRouteShapeLine();

    const renderRouteShapeLine = () => {
      if (shapeOfBusRoute?.length && mapInstanceRef.current) {
        const firstLatLon = shapeOfBusRoute[0];
        const middleIdx = Math.ceil(shapeOfBusRoute.length / 2);
        const middleLatLon = shapeOfBusRoute[middleIdx];
        const lastLatLon = shapeOfBusRoute[shapeOfBusRoute.length - 1];
        const bounds = [firstLatLon, middleLatLon, lastLatLon];

        routeShapeLine.current = L.polyline(shapeOfBusRoute).addTo(mapInstanceRef.current);
        mapInstanceRef.current.fitBounds(bounds);
      }
    };

    renderRouteShapeLine();
  }, [shapeOfBusRoute]);

  const markers = useRef<Array<L.Marker>>([]);

  useEffect(() => {
    const removeMarkers = () => {
      markers.current.forEach((markerInstance) => {
        mapInstanceRef.current?.removeLayer(markerInstance);
      });
      markers.current = [];
    };

    removeMarkers();

    const renderMarkers = () => {
      const { Stops: stops } = busRoute;

      stops?.forEach((stop) => {
        const { PositionLat, PositionLon } = stop.StopPosition;
        const { Zh_tw: stopName } = stop.StopName;

        if (mapInstanceRef.current) {
          const marker = L.marker([PositionLat, PositionLon], {
            draggable: false,
            icon: redIcon,
          }).bindTooltip(stopName, {
            permanent: true,
            direction: 'right',
          }).addTo(mapInstanceRef.current);
          markers.current.push(marker);
        }
      });
    };

    renderMarkers();
  }, [busRoute]);

  return <Map ref={mapRef} />;
};

export default Leaflet;
