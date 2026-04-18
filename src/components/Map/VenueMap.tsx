import React, { useMemo } from 'react';
import { GoogleMap, useLoadScript, Marker, InfoWindow } from '@react-google-maps/api';
import type { Stadium, Gate, Amenity } from '../../types';

interface VenueMapProps {
  stadium: Stadium;
  highContrast: boolean;
  highlightedSection?: string;
}

const mapContainerStyle = {
  width: '100%',
  height: '500px',
  borderRadius: '20px'
};

const defaultOptions = {
  disableDefaultUI: true,
  zoomControl: true,
  mapTypeControl: false,
  streetViewControl: false,
  fullscreenControl: true,
};

// Dark theme map style
const darkMapStyle = [
  { elementType: 'geometry', stylers: [{ color: '#242f3e' }] },
  { elementType: 'labels.text.stroke', stylers: [{ color: '#242f3e' }] },
  { elementType: 'labels.text.fill', stylers: [{ color: '#746855' }] },
  {
    featureType: 'administrative.locality',
    elementType: 'labels.text.fill',
    stylers: [{ color: '#d59563' }]
  },
  {
    featureType: 'road',
    elementType: 'geometry',
    stylers: [{ color: '#38414e' }]
  },
  {
    featureType: 'road',
    elementType: 'geometry.stroke',
    stylers: [{ color: '#212a37' }]
  },
  {
    featureType: 'water',
    elementType: 'geometry',
    stylers: [{ color: '#17263c' }]
  }
];

// High contrast map style
const highContrastStyle = [
  { elementType: 'geometry', stylers: [{ color: '#000000' }] },
  { elementType: 'labels.icon', stylers: [{ visibility: 'off' }] },
  { elementType: 'labels.text.fill', stylers: [{ color: '#ffffff' }] },
  { elementType: 'labels.text.stroke', stylers: [{ color: '#000000', weight: 2 }] },
  { featureType: 'road', elementType: 'geometry', stylers: [{ color: '#ffffff' }] },
  { featureType: 'water', elementType: 'geometry', stylers: [{ color: '#000000' }] },
];

export const VenueMap: React.FC<VenueMapProps> = ({ stadium, highContrast, highlightedSection }) => {
  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY || '',
  });

  const [activeMarker, setActiveMarker] = React.useState<Gate | Amenity | null>(null);

  const options = useMemo(() => ({
    ...defaultOptions,
    styles: highContrast ? highContrastStyle : darkMapStyle
  }), [highContrast]);

  if (loadError) {
    return <div className="glass-card" style={{ padding: '2rem', textAlign: 'center' }}>Error loading maps. Please check API Key.</div>;
  }

  if (!isLoaded) {
    return <div className="glass-card" style={{ padding: '2rem', textAlign: 'center' }}>Loading interactive map...</div>;
  }

  return (
    <div style={{ position: 'relative' }}>
      <GoogleMap
        mapContainerStyle={mapContainerStyle}
        zoom={stadium.zoom}
        center={stadium.location}
        options={options}
      >
        {stadium.gates.map((gate) => (
          <Marker
            key={gate.id}
            position={{ lat: gate.lat, lng: gate.lng }}
            onClick={() => setActiveMarker(gate)}
            icon={{
              url: 'https://maps.google.com/mapfiles/ms/icons/blue-dot.png'
            }}
          />
        ))}

        {stadium.amenities.map((amenity) => (
          <Marker
            key={amenity.id}
            position={{ lat: amenity.lat, lng: amenity.lng }}
            onClick={() => setActiveMarker(amenity)}
             icon={{
              url: 'https://maps.google.com/mapfiles/ms/icons/green-dot.png'
            }}
          />
        ))}

        {activeMarker && (
          <InfoWindow
            position={{ lat: activeMarker.lat, lng: activeMarker.lng }}
            onCloseClick={() => setActiveMarker(null)}
          >
            <div style={{ color: '#000' }}>
              <h3>{activeMarker.name}</h3>
              {'type' in activeMarker ? (
                <p>Wait time: {activeMarker.wait_time_mins} mins</p>
              ) : (
                <p>Closest sections: {activeMarker.closestSections.join(', ')}</p>
              )}
            </div>
          </InfoWindow>
        )}
      </GoogleMap>
      
      {highlightedSection && (
        <div style={{
          position: 'absolute',
          top: 10,
          left: '50%',
          transform: 'translateX(-50%)',
          background: 'var(--accent-primary)',
          color: 'white',
          padding: '8px 16px',
          borderRadius: '20px',
          fontWeight: 'bold',
          boxShadow: '0 4px 6px rgba(0,0,0,0.3)'
        }}>
          Directing to section: {highlightedSection}
        </div>
      )}
    </div>
  );
};
