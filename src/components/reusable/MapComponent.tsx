import { GoogleMap, Marker, useJsApiLoader } from '@react-google-maps/api'
import { useEffect, useRef } from 'react'
import { Button } from '../ui/button';
import { AiOutlineMinus, AiOutlinePlus, AiOutlineFullscreen } from 'react-icons/ai';
// import { Input } from '../ui/input';

export interface LocationProps {
    lat: number,
    lng: number
}

export default function MapComponent({ 
    location, 
    style, 
    addReturnButton,
    onLocationChange 
}: {
    location: LocationProps,
    style?: React.CSSProperties,
    addReturnButton: boolean,
    onLocationChange?: (location: LocationProps) => void
}) {
    const { isLoaded } = useJsApiLoader({ 
        googleMapsApiKey: 'AIzaSyBBDtRQ9F2VtrwZtJLHpfXHLD8BwcUtwi4', 
        libraries: ['places'] 
    })

    const inputRef = useRef<HTMLInputElement | null>(null);

    useEffect(() => {
        if (!inputRef.current || !isLoaded) return;
        const autocomplete = new google.maps.places.Autocomplete(inputRef.current);
        autocomplete.addListener('place_changed', () => {
            const place = autocomplete.getPlace();
            if (!place.geometry) return;
            const newLocation = {
                lat: place.geometry.location!.lat(),
                lng: place.geometry.location!.lng()
            };
            mapRef.current?.panTo(newLocation);
            mapRef.current?.setZoom(14);
            
            // Call the callback to update parent state
            if (onLocationChange) {
                onLocationChange(newLocation);
            }
        });
    }, [isLoaded, onLocationChange]);

    const mapRef = useRef<google.maps.Map | null>(null)

    const onLoad = (map: google.maps.Map) => {
        mapRef.current = map
    }

    const handleMapClick = (e: google.maps.MapMouseEvent) => {
        if (e.latLng && onLocationChange) {
            const newLocation = {
                lat: e.latLng.lat(),
                lng: e.latLng.lng()
            };
            onLocationChange(newLocation);
        }
    }

    const handleReturnToLocation = () => {
        if (mapRef.current) {
            mapRef.current.panTo(location)
            mapRef.current.setZoom(14)
        } else {
            // if no location, go to cairo bruh
            mapRef.current!.panTo({lat: 30.0444, lng: 31.2357})
        }
    }

    if (!isLoaded) return <div>Loading map...</div>

    const mapStyle = [
    {
        "featureType": "all",
        "elementType": "labels.text",
        "stylers": [
            {
                "color": "#878787"
            }
        ]
    },
    {
        "featureType": "all",
        "elementType": "labels.text.stroke",
        "stylers": [
            {
                "visibility": "off"
            }
        ]
    },
    {
        "featureType": "landscape",
        "elementType": "all",
        "stylers": [
            {
                "color": "#f9f5ed"
            }
        ]
    },
    {
        "featureType": "road.highway",
        "elementType": "all",
        "stylers": [
            {
                "color": "#f5f5f5"
            }
        ]
    },
    {
        "featureType": "road.highway",
        "elementType": "geometry.stroke",
        "stylers": [
            {
                "color": "#c9c9c9"
            }
        ]
    },
    {
        "featureType": "water",
        "elementType": "all",
        "stylers": [
            {
                "color": "#aee0f4"
            }
        ]
    }
    ]

    return (
        <div style={{ position: 'relative', width: '100%', height: '100%', ...style }}>
            <GoogleMap
                onLoad={onLoad}
                onClick={handleMapClick}
                mapContainerStyle={{
                    width: '100%',
                    height: '100%',
                    borderRadius: 'inherit',
                }}
                center={location}
                zoom={14}
                options={{
                    zoomControl: false,
                    fullscreenControl: false,
                    styles: mapStyle
                }}
            >
                <Marker position={location} />
            </GoogleMap>

            {/* Return button, when its clicked, return to the doctor's location */}
            {addReturnButton && (
                <Button
                onClick={handleReturnToLocation}
                className='absolute top-2 left-2 hover:bg-white/80 text-primary-600 bg-white py-2 px-4 rounded-lg shadow'
                >
                    Return
                </Button>
            )}

            {/* Search bar - only show on map page */}
            {/* {!addReturnButton && (
                <Input
                    ref={inputRef}
                    type="text"
                    placeholder="Search location"
                    className="absolute top-2 bg-white left-1/2 transform -translate-x-1/2 z-20 p-2 rounded-md shadow-md w-64"
                />
            )} */}

            {/* myCustomButtons for the map */}
            <div className={`absolute ${addReturnButton ? 'flex' : 'hidden md:flex'} top-2 right-2 *:text-xl gap-2`}>
                <Button
                    onClick={() => mapRef.current?.setZoom(mapRef.current.getZoom()! + 1)}
                    className="bg-white text-primary-600 shadow rounded-md hover:bg-gray-100"
                    title='Zoom-in'
                    >
                    <AiOutlinePlus />
                </Button>
                <Button
                    onClick={() => mapRef.current?.setZoom(mapRef.current.getZoom()! - 1)}
                    className="bg-white text-primary-600 shadow rounded-md hover:bg-gray-100"
                    title='Zoom-out'
                    >
                    <AiOutlineMinus />
                </Button>
                <Button
                    onClick={() => {
                        const mapDiv = mapRef.current?.getDiv()
                        if (!mapDiv) return
                        
                        if (document.fullscreenElement) {
                            document.exitFullscreen()
                        } else {
                            mapDiv.requestFullscreen()
                        }
                    }}
                    className="bg-white text-primary-600 shadow rounded-md hover:bg-gray-100"
                    title='Go fullscreen'
                >
                    <AiOutlineFullscreen />
                </Button>
            </div>
            
        </div>
    )
}