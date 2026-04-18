import React, { useMemo } from 'react';
import { GoogleMap, useLoadScript, Marker, InfoWindow } from '@react-google-maps/api';
import type { Stadium, Gate, Amenity } from '../../types';
import { defaultOptions, darkMapStyle, highContrastStyle } from '../../utils/mapStyles';

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



/**
 * VenueMap component displaying the stadium layout, gates, and amenities.
 * Integrated with Google Maps for real-time-like navigation feedback.
 */
export const VenueMap: React.FC<VenueMapProps> = ({ stadium, highContrast, highlightedSection }) => {
  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY || '',
  });

  const [activeMarker, setActiveMarker] = React.useState<Gate | Amenity | null>(null);

  /**
   * Memoized map options for theme switching (Dark vs High Contrast).
   */
  const options = useMemo(() => ({
    ...defaultOptions,
    styles: highContrast ? highContrastStyle : darkMapStyle
  }), [highContrast]);

  if (loadError) {
    return <div className="glass-card" style={{ padding: '2rem', textAlign: 'center', color: 'var(--danger)' }}>Error loading maps. Please check connection or API Key.</div>;
  }

  if (!isLoaded) {
    return <div className="glass-card" style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-muted)' }}>Loading interactive map...</div>;
  }

  return (
    <div style={{ position: 'relative' }} role="region" aria-label="Interactive venue map">
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
            title={gate.name}
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
            title={amenity.name}
          />
        ))}

        {activeMarker && (
          <InfoWindow
            position={{ lat: activeMarker.lat, lng: activeMarker.lng }}
            onCloseClick={() => setActiveMarker(null)}
          >
            <div style={{ color: '#000', padding: '0.25rem' }}>
              <h3 style={{ fontSize: '1rem', marginBottom: '0.25rem' }}>{activeMarker.name}</h3>
              {'type' in activeMarker ? (
                <p style={{ margin: 0, fontSize: '0.875rem' }}>Wait time: <strong>{activeMarker.wait_time_mins} mins</strong></p>
              ) : (
                <p style={{ margin: 0, fontSize: '0.875rem' }}>Closest sections: {activeMarker.closestSections.join(', ')}</p>
              )}
            </div>
          </InfoWindow>
        )}
      </GoogleMap>
      
      {highlightedSection && (
        <div 
          aria-live="assertive"
          style={{
            position: 'absolute',
            top: 10,
            left: '50%',
            transform: 'translateX(-50%)',
            background: 'var(--accent-primary)',
            color: 'white',
            padding: '8px 16px',
            borderRadius: '20px',
            fontWeight: 'bold',
            boxShadow: '0 4px 12px rgba(0,0,0,0.5)',
            zIndex: 1
          }}
        >
          Directing to section: {highlightedSection}
        </div>
      )}
    </div>
  );
};
