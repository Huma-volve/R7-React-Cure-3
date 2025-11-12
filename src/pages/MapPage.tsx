import { StarIcon } from "lucide-react";
import ClockIcon from "@/assets/icons/clock.png";
import LocationIcon from '@/assets/icons/location.png'
import { Card, CardContent } from "@/components/ui/card";
import MapComponent, { type LocationProps } from "@/components/reusable/MapComponent";
import { useState } from "react";

export default function Map() {

    const [location, setLocation] = useState<LocationProps>({lat: 30.01511, lng: 31.17477});
    const [address, setAddress] = useState('')

    const handleLocationChange = async (newLocation: LocationProps) => {
        setLocation(newLocation);
        
        // get the address
        try {
            const geocoder = new google.maps.Geocoder();
            const response = await geocoder.geocode({ location: newLocation });
            
            if (response.results[0]) {
                setAddress(response.results[0].formatted_address);
            } else {
                setAddress('Address not found');
            }
        } catch (error) {
            console.error('Geocoding error:', error);
            setAddress('Unable to get address');
        }
    }

    return <main className="grid grid-cols-1 lg:grid-cols-4 gap-4 px-3 xl:-mb-30 *:mt-10 overflow-x-hidden">
        <section className="order-2 lg:order-1 flex flex-col gap-5">
            <h2 className="text-2xl font-semibold text-center lg:text-left">0 Results</h2>
            <Card
                className="bg-background shadow-md border-none flex flex-row gap-2 items-center p-2"
            >
                <img
                    src='/public/doctors/doctor1.png'
                    alt={`Doctor Image`}
                    className="h-16 w-16 rounded-md object-cover"
                />

                <CardContent className="flex-1 gap-2 flex-col p-0">
                    <h2 className="text-md font-medium">hi</h2>

                    <div className="text-md text-neutral-600">
                        <span>speciality</span>
                        {' '} | {' '}
                        <span>hospital</span>
                    </div>

                    <div className="flex gap-4 items-center">
                        <div className="flex items-center gap-1">
                            <StarIcon color="#F9E000" style={{ fill: '#F9E000' }} />
                            <span>Doctor rating</span>
                        </div>

                        <div className="flex items-center gap-1">
                            <img src={ClockIcon} alt="Clock Icon" className="w-4 h-4" />
                            <span>9:30am - 8:00pm</span>
                        </div>
                    </div>
                </CardContent>
            </Card>

        </section>
        <section className="lg:col-span-3 order-1 min-h-screen lg:order-2 -mb-40 xl:mb-0">
            <div className="relative h-[80%] rounded-2xl overflow-hidden">
                <MapComponent 
                    location={location} 
                    addReturnButton={false}
                    onLocationChange={handleLocationChange}
                />

                {/* text of location should be here */}
                <div className="absolute bg-background rounded-md shadow px-3 py-2 left-2 bottom-7 z-30 flex items-center gap-2 max-w-md">
                    <img src={LocationIcon} className="h-5" />
                    <div className="flex flex-col">
                        <span className="text-sm font-medium">
                            {address || 'Select a location'}
                        </span>
                        <span className="text-xs text-neutral-700">
                            {location.lat.toFixed(5)}, {location.lng.toFixed(5)}
                        </span>
                    </div>
                </div>
            </div>
        </section>
    </main>
}