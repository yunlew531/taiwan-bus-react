import { useRef } from 'react';

interface ICoordinates {
  latitude?: number;
  longitude?: number;
}

const useGeoLocation = () => {
  const position = useRef<ICoordinates>({});

  const getGeoLocation = () => {
    if (!navigator?.geolocation) return;
    const { geolocation } = navigator;

    geolocation.getCurrentPosition((currentPosition) => {
      const { latitude, longitude } = currentPosition.coords;

      position.current = {
        latitude,
        longitude,
      };
    });
  };

  return [
    position.current,
    getGeoLocation,
  ] as const;
};

export default useGeoLocation;
