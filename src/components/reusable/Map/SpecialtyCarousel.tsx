import { Button } from "@/components/ui/button";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { useSpecialties } from "@/hooks/map/useSpecialties";

interface SpecialtyCarouselProps {
    specialty: string
    setSpecialty: React.Dispatch<React.SetStateAction<string>>;
}

export default function SpecialtyCarousel({specialty, setSpecialty}: SpecialtyCarouselProps) {
    const { data: specialties, isLoading, isError } = useSpecialties();

    if(isLoading) {
        return <div className="p-6 space-y-4 bg-background animate-pulse">
            <div className="h-8 w-full bg-gray-200 rounded" />
        </div>
    }
    
    if(isError) {
        return <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 *:rounded-3xl *:text-sm">
                <Button variant='outline' className={`${specialty === 'Dermatology' ? 'bg-primary-500 text-white hover:bg-primary-700 hover:text-white' : 'bg-background border-primary-700 text-primary-700 border'}`} onClick={() => setSpecialty('Dermatology')}>Dermatology</Button>
                <Button variant='outline' className={`${specialty === 'Dentist' ? 'bg-primary-500 text-white hover:bg-primary-700 hover:text-white' : 'bg-background border-primary-700 text-primary-700 border'}`} onClick={() => setSpecialty('Dentist')}>Dentist</Button>
                <Button variant='outline' className={`${specialty === 'ENT' ? 'bg-primary-500 text-white hover:bg-primary-700 hover:text-white' : 'bg-background border-primary-700 text-primary-700 border'}`} onClick={() => setSpecialty('ENT')}>ENT</Button>
                <Button variant='outline' className={`${specialty === 'Neurologist' ? 'bg-primary-500 text-white hover:bg-primary-700 hover:text-white' : 'bg-background border-primary-700 text-primary-700 border'}`} onClick={() => setSpecialty('Neurologist')}>Neurologist</Button>
                <Button variant='outline' className={`${specialty === 'Cardiologist' ? 'bg-primary-500 text-white hover:bg-primary-700 hover:text-white' : 'bg-background border-primary-700 text-primary-700 border'}`} onClick={() => setSpecialty('Cardiologist')}>Cardiologist</Button>
                <Button variant='outline' className={`${specialty === 'Ophthalmologist' ? 'bg-primary-500 text-white hover:bg-primary-700 hover:text-white' : 'bg-background border-primary-700 text-primary-700 border'}`} onClick={() => setSpecialty('Ophthalmologist')}>Ophthalmologist</Button>
            </div>
    }

    return <Carousel className="py-4 md:px-6 relative">
        <CarouselContent>
            {specialties?.map((s) => (
                <CarouselItem 
                    key={s.id}
                    className="basis-auto min-w-fit"
                >
                    <Button
                        variant='outline'
                        className={
                            specialty === s.name
                                ? "bg-primary-500 text-white hover:bg-primary-700 hover:text-white"
                                : "bg-background border-primary-700 text-primary-700 border"
                        }
                        onClick={() => setSpecialty(s.name)}
                    >
                        {s.name}
                    </Button>
                </CarouselItem>
            ))}
        </CarouselContent>

        <CarouselPrevious className="hidden md:flex absolute -left-2.5 bg-primary-500 text-white top-1/2" />
        <CarouselNext className="hidden md:flex absolute bg-primary-500 text-white -right-2.5 top-1/2" />
    </Carousel>
}