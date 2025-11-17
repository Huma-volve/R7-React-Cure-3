import { MapContainer, TileLayer, Marker, useMap, useMapEvents } from 'react-leaflet';
import { type LatLngExpression } from 'leaflet';
import { useRef, useEffect, useState } from 'react';
import { AiOutlineMinus, AiOutlinePlus, AiOutlineFullscreen } from 'react-icons/ai';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Button } from "@/components/ui/button";

// Fix for default marker icons
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';
import { MapPin } from 'lucide-react';

const DefaultIcon = L.icon({
  iconUrl: icon,
  shadowUrl: iconShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41]
});

L.Marker.prototype.options.icon = DefaultIcon;

export interface LocationProps {
    lat: number,
    lng: number
}

// Component to handle map clicks
function MapClickHandler({ onLocationChange }: { onLocationChange?: (location: LocationProps) => void }) {
    useMapEvents({
        click(e) {
            if (onLocationChange) {
                onLocationChange({
                    lat: e.latlng.lat,
                    lng: e.latlng.lng
                });
            }
        }
    });
    return null;
}

// Component to handle map reference and centering
function MapController({ 
    location, 
    mapRefSetter 
}: { 
    location: LocationProps,
    mapRefSetter: (map: L.Map) => void 
}) {
    const map = useMap();
    
    useEffect(() => {
        mapRefSetter(map);
    }, [map, mapRefSetter]);

    useEffect(() => {
        map.setView([location.lat, location.lng], map.getZoom());
    }, [location, map]);

    return null;
}

// Reverse geocoding function using Nominatim (OpenStreetMap)
async function reverseGeocode(lat: number, lng: number): Promise<string> {
    try {
        const response = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=18&addressdetails=1`,
            {
                headers: {
                    'Accept-Language': 'en'
                }
            }
        );
        
        if (!response.ok) {
            throw new Error('Geocoding failed');
        }
        
        const data = await response.json();
        
        // Build a readable address from the response
        const address = data.address;
        const parts = [];
        
        if (address.road) parts.push(address.road);
        if (address.suburb) parts.push(address.suburb);
        if (address.city) parts.push(address.city);
        if (address.state) parts.push(address.state);
        if (address.country) parts.push(address.country);
        
        return parts.length > 0 ? parts.join(', ') : data.display_name || 'Unknown location';
    } catch (error) {
        console.error('Reverse geocoding error:', error);
        return 'Location not found';
    }
}

export default function MapLeaflet({ 
    location = { lat: 30.0444, lng: 31.2357 }, // Default to Cairo
    style, 
    addReturnButton = false,
    onLocationChange 
}: {
    location?: LocationProps,
    style?: React.CSSProperties,
    addReturnButton?: boolean,
    onLocationChange?: (location: LocationProps) => void
}) {
    const mapRef = useRef<L.Map | null>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const [locationName, setLocationName] = useState<string>('Loading location...');
    const [isLoadingLocation, setIsLoadingLocation] = useState(false);

    const setMapRef = (map: L.Map) => {
        mapRef.current = map;
    };

    // Fetch location name whenever location changes
    useEffect(() => {
        const fetchLocationName = async () => {
            setIsLoadingLocation(true);
            const name = await reverseGeocode(location.lat, location.lng);
            setLocationName(name);
            setIsLoadingLocation(false);
        };

        fetchLocationName();
    }, [location.lat, location.lng]);

    const handleReturnToLocation = () => {
        if (mapRef.current) {
            mapRef.current.setView([location.lat, location.lng], 14);
        }
    };

    const handleZoomIn = () => {
        if (mapRef.current) {
            mapRef.current.setZoom(mapRef.current.getZoom() + 1);
        }
    };

    const handleZoomOut = () => {
        if (mapRef.current) {
            mapRef.current.setZoom(mapRef.current.getZoom() - 1);
        }
    };

    const handleFullscreen = () => {
        if (!containerRef.current) return;
        
        if (document.fullscreenElement) {
            document.exitFullscreen();
        } else {
            containerRef.current.requestFullscreen();
        }
    };

    return (
        <div 
            ref={containerRef}
            style={{ position: 'relative', width: '100%', height: '100%', ...style }}
        >
            <MapContainer 
                center={[location.lat, location.lng] as LatLngExpression}
                zoom={14} 
                style={{ 
                    width: '100%', 
                    height: '100%',
                    borderRadius: 'inherit',
                    position: 'relative',
                    zIndex: 0
                }}
                zoomControl={false}
            >
                <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                />
                <Marker position={[location.lat, location.lng] as LatLngExpression} />
                
                <MapClickHandler onLocationChange={onLocationChange} />
                <MapController location={location} mapRefSetter={setMapRef} />
            </MapContainer>

            {/* Return button */}
            {addReturnButton && (
                <Button
                    onClick={handleReturnToLocation}
                    className='absolute top-2 left-2 hover:bg-white/80 text-primary-600 bg-white py-2 px-4 rounded-lg shadow z-11'
                >
                    Return
                </Button>
            )}

            {/* Custom zoom and fullscreen controls */}
            <div className={`absolute ${addReturnButton ? 'flex' : 'hidden md:flex'} top-2 right-2 *:text-xl gap-2 z-11`}>
                <Button
                    onClick={handleZoomIn}
                    className="bg-white text-primary-600 shadow rounded-md hover:bg-gray-100"
                    title='Zoom-in'
                >
                    <AiOutlinePlus />
                </Button>
                <Button
                    onClick={handleZoomOut}
                    className="bg-white text-primary-600 shadow rounded-md hover:bg-gray-100"
                    title='Zoom-out'
                >
                    <AiOutlineMinus />
                </Button>
                <Button
                    onClick={handleFullscreen}
                    className="bg-white text-primary-600 shadow rounded-md hover:bg-gray-100"
                    title='Go fullscreen'
                >
                    <AiOutlineFullscreen />
                </Button>
            </div>

            {/* Location Display */}
            <div className="absolute bg-background rounded-md shadow-lg px-3 py-2 left-2 bottom-2 z-11 flex items-center gap-2 max-w-md">
                <MapPin className="h-5 w-5 text-primary-600" />
                <div className="flex flex-col">
                    <span className="text-sm font-medium">
                        {isLoadingLocation ? (
                            <span className="flex items-center gap-2">
                                <span className="inline-block w-3 h-3 border-2 border-primary-600 border-t-transparent rounded-full animate-spin"></span>
                                Loading...
                            </span>
                        ) : (
                            locationName
                        )}
                    </span>
                    <span className="text-xs text-neutral-700">
                        {location.lat.toFixed(5)}, {location.lng.toFixed(5)}
                    </span>
                </div>
            </div>
        </div>
    );
}