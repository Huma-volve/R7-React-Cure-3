import { useState } from "react";
import type React from "react";
// components
import { DoctorStats } from "./doctor-stats";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
// icons
import UserIcon from '@/assets/icons/profile-user.png'
import StartPngIcon from '@/assets/icons/star.png'
import ExperienceIcon from '@/assets/icons/medal.png'
import MessagesIcon from '@/assets/icons/messages.png'
import VerifiedIcon from '@/assets/icons/verified.png'
import LocationIcon from '@/assets/icons/location.png'
import { HeartIcon } from "lucide-react";
import MapComponent from "../MapComponent";
import { useToggleFavourite } from "@/hooks/useToggleFavourite";

export interface DoctorProps {
  id: number;
  name: string;
  specialty: string;
  location: {
    lat: number,
    lng: number
  }
  sessionPrice: number;
  avgRating: number;
  reviewsCount: string;
  clinicAddress: string;
  image: string;
  isFavorite?: boolean;
  onToggleFavorite?: (id: number) => void;
  experience: number;
  patientCount: number;
  aboutMe: string
}

export const onCardHoverStyle = 'transition-all duration-500 ease-in-out hover:shadow-lg hover:border-primary-600/80';

const DoctorDetailsCard: React.FC<DoctorProps> = ({
    id, name, specialty, avgRating, aboutMe, experience, patientCount, reviewsCount, location, clinicAddress, image
}) => {

    const [expandAboutSection, setExpandAboutSection] = useState(false);
    const maxLength: number = 200;
    const [isFavorite, setIsFavorite] = useState<boolean>();
    const aboutText = aboutMe ?? '';
    const isLong = aboutText.length > maxLength;
    const previewAboutText = isLong && !expandAboutSection ? aboutText.slice(0, maxLength) + "..." : aboutText;
    const { mutate: toggleFavourite, isPending } = useToggleFavourite();

    return <Card className={`bg-card pt-8 pb-6 h-fit border-none shadow-none lg:col-span-1 hover:bg-neutral-50/80 ${onCardHoverStyle}`}>
        <CardHeader className="flex relative flex-col items-center justify-center text-center gap-2">
          {/* Img + Basic Info */}
          <div className="relative">
            <img
              src={image ?? '/avatar.PNG'}
              className="h-28 w-28 rounded-full object-cover"
              alt="Doctor Picture"
            />
            <img
              className="absolute right-1.5 bottom-0.5"
              src={VerifiedIcon}
              alt="Verified Icon"
            />
          </div>

          <CardTitle className="text-2xl font-bold text-foreground">
            {name}
          </CardTitle>
          <p className="text-neutral-700">{specialty}</p>
          
          <button onClick={() =>
              toggleFavourite(id, {
                onSuccess: (data) => {
                  setIsFavorite(data.data.status === "added");
                },
              })}
              disabled={isPending}
              className="bg-background p-2.5 rounded-full absolute right-6 top-2">
            <HeartIcon
                className={`${
                isFavorite ? 'fill-red-500 text-red-500' : 'text-gray-400'
              } transition-colors duration-300`}
            />
          </button>
        </CardHeader>

{
  /**
   * {
    "status": true,
    "message": "success",
    "data": {
        "status": "added",
        "message": "Favorite added successfully",
        "doctor_id": 3
    },
    "errors": null
}
   */
}
        <CardContent className="flex justify-center gap-5">
          <DoctorStats icon={UserIcon} amount={patientCount} label="Patients" />
          <DoctorStats icon={ExperienceIcon} amount={experience} label="Years Exp." />
          <DoctorStats icon={StartPngIcon} amount={avgRating} label="Rating" />
          <DoctorStats icon={MessagesIcon} amount={reviewsCount} label="Reviews" />
        </CardContent>

        {/* About Section */}
        <CardDescription className="px-4">
          <h3 className="text-xl font-semibold mb-3 text-foreground font-serif">About Me</h3>

          <div
            className={`leading-relaxed text-neutral-700 transition-all duration-500 ease-in-out ${
              expandAboutSection ? 'max-h-[500px]' : 'max-h-[100px]'
            }`}>{previewAboutText ? previewAboutText : 'No information available.'}</div>

        {isLong && (
          <div
            onClick={() => setExpandAboutSection(!expandAboutSection)}
            className="cursor-pointer hover:text-primary-600 text-primary-400 p-0 font-medium hover:underline mt-2 inline-block"
          >
            {expandAboutSection ? "Read Less" : "Read More"}
          </div>
        )}
        </CardDescription>

        {/* Location */}
        <CardFooter className="flex flex-col gap-3 px-4">
          <div className="self-start font-serif font-semibold text-xl">Location</div>
          <div className="relative w-full h-[220px] sm:h-[270px] rounded-2xl overflow-hidden">
            <MapComponent location={location} addReturnButton />
            
            <div className="absolute bg-background rounded-md shadow px-2.5 py-1 left-2 bottom-2 z-3 flex items-center gap-2">
              <img src={LocationIcon} className="h-5"/>
              <span className="text-sm">{clinicAddress}</span>
            </div>
          </div>
        </CardFooter>
      </Card>
}

export default DoctorDetailsCard