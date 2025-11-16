import { useState } from "react";
import { useNavigate } from "react-router-dom";
// icons
import { MapPin, StarIcon } from "lucide-react";
import ClockIcon from "@/assets/icons/clock.png";
import LocationIcon from '@/assets/icons/location.png'
import { FaSearch, FaSearchMinus } from "react-icons/fa";
// Components
import { Card, CardContent } from "@/components/ui/card";
import MapComponent, { type LocationProps } from "@/components/reusable/MapComponent";
import { useGetNearestDoctors } from "@/hooks/useGetNearestDoctors";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

interface Doctor {
    id: number;
    specialty: string;
    license_number: string;
    clinic_address: string;
    location: {
        lat: number;
        lng: number;
    };
    session_price: number;
    average_rating: number;
    reviews_count: number;
    availability: Record<string, Record<string, string>>;
    consultation: string;
    user: {
        id: number;
        name: string;
        email: string;
        mobile: string;
        profile_photo: string | null;
        gender: string | null;
    };
}

export default function Map() {
    const navigate = useNavigate()
    const [location, setLocation] = useState<LocationProps>({lat: 30.01511, lng: 31.17477});
    const [address, setAddress] = useState('');
    const [specialty, setSpecialty] = useState<string>('Dermatology');
    const [hasSearched, setHasSearched] = useState(false);

    const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number) => {
        const R = 6371; // Radius of Earth in km
        const dLat = (lat2 - lat1) * Math.PI / 180;
        const dLon = (lon2 - lon1) * Math.PI / 180;
        const a = 
            Math.sin(dLat/2) * Math.sin(dLat/2) +
            Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
            Math.sin(dLon/2) * Math.sin(dLon/2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
        return R * c;
    };
    
    const { mutate, data, isPending, isError, error } = useGetNearestDoctors({
        search_query: specialty,
        lat: location.lat,
        lng: location.lng,
    });

    const doctors: Doctor[] = data?.data || [];
    
    const handleLocationChange = async (newLocation: LocationProps) => {
        setLocation(newLocation);
        
        const geocoder = new google.maps.Geocoder();
        const response = await geocoder.geocode({ location: newLocation });
        
        if (response.results[0]) {
            setAddress(response.results[0].formatted_address);
        } else {
            setAddress('Address not found');
        }
    }

    const handleSearch = () => {
        setHasSearched(true)
        mutate({
            search_query: specialty,
            lat: location.lat,
            lng: location.lng
        });
    };

    // Helper function to get available time slots
    const getAvailabilityText = (availability: Record<string, Record<string, string>>) => {
        const days = Object.keys(availability);
        if (days.length === 0) return 'No availability';
        
        const firstDay = availability[days[0]];
        const times = Object.entries(firstDay);
        if (times.length === 0) return 'No availability';
        
        const [start, end] = times[0];
        return `${start} - ${end}`;
    };

    return (
        <main className="grid grid-cols-1 lg:grid-cols-4 gap-4 px-3 xl:-mb-30 *:mt-10 overflow-x-hidden">
            <section className="order-2 lg:order-1 flex flex-col gap-5 mb-10 lg:mb-0">
                <div className="flex items-center justify-between">
                    <h2 className="text-2xl font-semibold text-center lg:text-left">
                        {doctors.length} {doctors.length === 1 ? 'Result' : 'Results'}
                    </h2>
                </div>

                {/* Loading State */}
                {isPending && (
                    <div className="flex items-center justify-center p-8">
                        <div className="text-center">
                            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500 mb-2"></div>
                            <p className="text-neutral-600">Finding nearby doctors...</p>
                        </div>
                    </div>
                )}

                {/* Error State */}
                {isError && (
                    <div className="flex items-center justify-center p-8">
                        <div className="text-center">
                            <div className="text-destructive text-4xl mb-2">⚠️</div>
                            <p className="text-destructive font-medium">Failed to load doctors</p>
                            <p className="text-neutral-500 text-sm mt-1">
                                {error instanceof Error ? error.message : 'Please try again'}
                            </p>
                        </div>
                    </div>
                )}

                {/* Empty State */}
                {!isPending && !isError && doctors.length === 0 && (
                    <div
                        className={`flex items-center justify-center p-12 rounded-lg border ${
                        hasSearched
                            ? 'bg-neutral-50 border-neutral-200'
                            : 'bg-gradient-to-br from-primary-50 to-blue-50 border-2 border-dashed border-primary-200'
                        }`}
                    >
                        <div className="text-center">
                        {hasSearched ? (
                            <FaSearchMinus className="mx-auto text-6xl mb-4 text-primary-700" />
                        ) : (
                            <MapPin className="text-primary-500 mx-auto w-16 h-16 text-6xl mb-4" />
                        )}
                        
                        <p className="text-neutral-700 font-semibold text-lg mb-2">
                            {hasSearched ? 'No doctors found' : 'Ready to Find Doctors'}
                        </p>
                        
                        <p className="text-neutral-500 text-sm max-w-xs mx-auto mb-4">
                            {hasSearched
                            ? 'Try adjusting your location or selecting a different specialty'
                            : 'Select a specialty above, adjust the map location, then click "Search This Area"'}
                        </p>
                        
                        {hasSearched && (
                            <Button
                            onClick={handleSearch}
                            variant="outline"
                            size="sm"
                            className="text-primary-700 border-primary-700"
                            >
                            Search Again
                            </Button>
                        )}
                        </div>
                    </div>
                )}

                {/* Doctors List */}
                {!isPending && doctors.map((doctor) => {
                    const distance = calculateDistance(
                        location.lat,
                        location.lng,
                        doctor.location.lat,
                        doctor.location.lng
                    );

                    return <Card
                        key={doctor.id}
                        onClick={() => navigate(`/doctor/${doctor.id}`)}
                        className="bg-background shadow-md border-none flex flex-row gap-3 items-center p-2 hover:shadow-lg transition-shadow cursor-pointer"
                    >
                        <img
                            src={doctor.user.profile_photo || '/doctor.jpg'}
                            alt={`${doctor.user.name}`}
                            className="h-16 w-16 rounded-md object-cover"
                        />

                        <CardContent className="flex-1 flex gap-2.5 flex-col p-0">
                            <div className="flex items-center justify-between">
                                <h2 className="text-md font-medium">{doctor.user.name}</h2>
                                <Tooltip>
                                    <TooltipTrigger>
                                        <span className="text-xs bg-primary-50 text-primary-700 px-2 py-1 rounded-full font-medium whitespace-nowrap ml-2">
                                            {distance.toFixed(1)} km
                                        </span>
                                    </TooltipTrigger>
                                    <TooltipContent>
                                        Distance from your selected location to this doctor.
                                    </TooltipContent>
                                </Tooltip>
                            </div>

                            <div className="text-sm text-neutral-600 flex items-center gap-1.5">
                                <span>{doctor.specialty}</span>
                                {doctor.clinic_address && (
                                    <>
                                        {' '} | {' '}
                                        <span className="truncate inline-block">
                                            {doctor.clinic_address.split('\n')[0]}
                                        </span>
                                    </>
                                )}
                            </div>

                            <div className="flex gap-4 items-center flex-wrap text-xs">
                                <div className="flex items-center gap-1">
                                    <StarIcon 
                                        size={14}
                                        color="#F9E000" 
                                        style={{ fill: doctor.average_rating > 0 ? '#F9E000' : 'none' }} 
                                    />
                                    <span>
                                        {doctor.average_rating > 0 
                                            ? `${doctor.average_rating.toFixed(1)} (${doctor.reviews_count})`
                                            : 'No reviews'
                                        }
                                    </span>
                                </div>

                                <div className="flex items-center gap-1">
                                    <img src={ClockIcon} alt="Clock Icon" className="w-4 h-4" />
                                    <span>{getAvailabilityText(doctor.availability)}</span>
                                </div>

                                {/* <div className="flex items-center gap-1">
                                    <span className="font-medium text-primary-600">
                                        ${doctor.session_price.toFixed(2)}
                                    </span>
                                </div> */}
                            </div>

                            {/* {doctor.consultation && (
                                <div className="mt-1">
                                    <span className="text-xs bg-primary-100 text-primary-700 px-2 py-1 rounded-full">
                                        {doctor.consultation === 'home' ? '🏠 Home Visit' : '🏥 Clinic'}
                                    </span>
                                </div>
                            )} */}
                        </CardContent>
                    </Card>
                })}
            </section>

            <section className="lg:col-span-3 order-1 min-h-screen lg:order-2">
                <div className="flex flex-col mb-8">
                    <h1 className="text-2xl font-semibold mb-6">Choose Specialty</h1>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
                        <Button variant='outline' className={`${specialty === 'Dermatology' ? 'bg-primary-500 text-white hover:bg-primary-700 hover:text-white' : 'bg-background border-primary-700 text-primary-700 border'} rounded-3xl text-sm md:text-lg`} onClick={() => setSpecialty('Dermatology')}>Dermatology</Button>
                        <Button variant='outline' className={`${specialty === 'Dentist' ? 'bg-primary-500 text-white hover:bg-primary-700 hover:text-white' : 'bg-background border-primary-700 text-primary-700 border'} rounded-3xl text-sm md:text-lg`} onClick={() => setSpecialty('Dentist')}>Dentist</Button>
                        <Button variant='outline' className={`${specialty === 'ENT' ? 'bg-primary-500 text-white hover:bg-primary-700 hover:text-white' : 'bg-background border-primary-700 text-primary-700 border'} rounded-3xl text-sm md:text-lg`} onClick={() => setSpecialty('ENT')}>ENT</Button>
                        <Button variant='outline' className={`${specialty === 'Neurologist' ? 'bg-primary-500 text-white hover:bg-primary-700 hover:text-white' : 'bg-background border-primary-700 text-primary-700 border'} rounded-3xl text-sm md:text-lg`} onClick={() => setSpecialty('Neurologist')}>Neurologist</Button>
                        <Button variant='outline' className={`${specialty === 'Cardiologist' ? 'bg-primary-500 text-white hover:bg-primary-700 hover:text-white' : 'bg-background border-primary-700 text-primary-700 border'} rounded-3xl text-sm md:text-lg`} onClick={() => setSpecialty('Cardiologist')}>Cardiologist</Button>
                        <Button variant='outline' className={`${specialty === 'Ophthalmologist' ? 'bg-primary-500 text-white hover:bg-primary-700 hover:text-white' : 'bg-background border-primary-700 text-primary-700 border'} rounded-3xl text-sm md:text-lg`} onClick={() => setSpecialty('Ophthalmologist')}>Ophthalmologist</Button>
                    </div>
                </div>
                <div className="relative h-[70%] rounded-b-2xl overflow-hidden">
                    {/* Search button */}
                    <Button
                        onClick={handleSearch}
                        disabled={isPending}
                        className="rounded-none rounded-t-2xl w-full h-14 text-base font-semibold shadow-lg hover:shadow-xl transition-all relative overflow-hidden group"
                    >
                        <span className="relative z-10 flex items-center justify-center gap-2">
                            {isPending ? (
                                <>
                                    <span className="inline-block w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                                    Searching for {specialty} doctors...
                                </>
                            ) : (
                                <>
                                    <FaSearch className="w-4 h-4" />
                                    Search This Area for {specialty}
                                </>
                            )}
                        </span>
                        {!isPending && (
                            <span className="absolute inset-0 bg-primary-600 transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left"></span>
                        )}
                    </Button>

                    <MapComponent 
                        location={location}
                        addReturnButton={false}
                        onLocationChange={handleLocationChange}
                    />
                    {/* Location Display */}
                    <div className="absolute bg-background rounded-md shadow-lg px-3 py-2 left-2 bottom-7 z-30 flex items-center gap-2 max-w-md">
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
    );
}