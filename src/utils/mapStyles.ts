/**
 * Default map layout and behavior options.
 */
export const defaultOptions = {
    disableDefaultUI: true,
    zoomControl: true,
    mapTypeControl: false,
    streetViewControl: false,
    fullscreenControl: true,
  };
  
  /**
   * Premium dark theme map style for standard portal usage.
   */
  export const darkMapStyle = [
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
  
  /**
   * High contrast map style for max visibility and WCAG compliance.
   */
  export const highContrastStyle = [
    { elementType: 'geometry', stylers: [{ color: '#000000' }] },
    { elementType: 'labels.icon', stylers: [{ visibility: 'off' }] },
    { elementType: 'labels.text.fill', stylers: [{ color: '#ffffff' }] },
    { elementType: 'labels.text.stroke', stylers: [{ color: '#000000', weight: 2 }] },
    { featureType: 'road', elementType: 'geometry', stylers: [{ color: '#ffffff' }] },
    { featureType: 'water', elementType: 'geometry', stylers: [{ color: '#000000' }] },
  ];
  
