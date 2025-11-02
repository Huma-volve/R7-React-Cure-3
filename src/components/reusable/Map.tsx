import { initialState as doctors } from "@/redux/doctorsSlice";
import { StarIcon } from "lucide-react";
import ClockIcon from "@/assets/icons/clock.png";
import LocationIcon from '@/assets/icons/location.png'
import { Card, CardContent } from "@/components/ui/card";

export default function Map() {
    return <div className="grid grid-cols-1 lg:grid-cols-4 gap-5 mt-10 px-6 overflow-x-hidden">
        <section className="flex flex-col gap-5 lg:col-span-1">
            {doctors.map((doc) => (
                <Card
                    key={doc.id}
                    className="bg-background shadow-md border-none flex flex-row gap-2 items-center p-2"
                >
                    <img
                        src={doc.imgSrc}
                        alt={`Doctor ${doc.name} Image`}
                        className="h-16 w-16 rounded-md object-cover"
                    />


                    <CardContent className="flex-1 gap-2 flex-col p-0">
                        <h2 className="text-md font-medium">{doc.name}</h2>

                        <div className="text-md text-neutral-600">
                            <span>{doc.specialization}</span>
                            {' '} | {' '}
                            <span>{doc.hospital}</span>
                        </div>

                        <div className="flex gap-4 items-center">
                            <div className="flex items-center gap-1">
                                <StarIcon color="#F9E000" style={{ fill: '#F9E000' }} />
                                <span>{doc.rating}</span>
                            </div>

                            <div className="flex items-center gap-1">
                                <img src={ClockIcon} alt="Clock Icon" className="w-4 h-4" />
                                <span>9:30am - 8:00pm</span>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            ))}

        </section>
        <section className="lg:col-span-3">
            <div className="relative">
                <img src="/map-in-map-page.png" className="cursor-grab w-full rounded-3xl" />
                <div className="absolute bg-background rounded-md shadow px-3 py-1 left-3 bottom-10 z-30 flex items-center gap-2">
                    <img src={LocationIcon} className="h-5" />
                    {doctors[0].location}
                </div>
            </div>
        </section>

    </div>
}