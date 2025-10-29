import * as React from "react"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
} from "@/components/ui/carousel"

interface SpecialtiesSliderProps {
  isSidebarOpen?: boolean
}

const SpecialtiesSlider: React.FC<SpecialtiesSliderProps> = ({ isSidebarOpen }) => {
  const specialties = [
    { name: "Dentist", img: "./logo.svg" },
    { name: "Cardiologist", img: "./logo.svg" },
    { name: "ENT", img: "./logo.svg" },
    { name: "Neurologist", img: "./logo.svg" },
    { name: "General Practitioner", img: "./logo.svg" },
    { name: "Ophthalmologist", img: "./logo.svg" },
    { name: "Dermatologist", img: "./logo.svg" },
    { name: "Pediatrician", img: "./logo.svg" },
    { name: "Urologist", img: "./logo.svg" },
    { name: "Oncologist", img: "./logo.svg" },
    { name: "Psychiatrist", img: "./logo.svg" },
    { name: "Radiologist", img: "./logo.svg" },
  ]

  return (
    <div
      className={`${
        isSidebarOpen ? "max-w-6xl" : "w-full"
      } relative mb-7 overflow-hidden transition-all duration-300`}
    >
      <Carousel opts={{ align: "start", loop: false }} className="w-full">
        <CarouselContent className="flex items-center ml-0">
          {specialties.map((item, index) => (
            <CarouselItem key={index} className="basis-auto px-2">
              <div className="flex items-center gap-2 cursor-pointer bg-white border border-[#ced5d4] rounded-lg shadow-sm hover:shadow-md hover:bg-blue-50 transition px-4 py-2 whitespace-nowrap w-fit">
                <img
                  src={item.img}
                  alt={item.name}
                  className="w-5 h-5 object-contain"
                />
                <span className="text-[#6D7379] text-[15px] font-medium">
                  {item.name}
                </span>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>

        <CarouselNext className="right-[5px] bg-white border shadow-sm hover:bg-gray-50" />
      </Carousel>
    </div>
  )
}

export default SpecialtiesSlider
