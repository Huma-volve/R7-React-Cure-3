import * as React from "react"
import axios from "axios"
import { useDispatch } from "react-redux"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"
import { searchDoctors } from "@/redux/searchSlice"
import type { AppDispatch } from "@/redux/store"

interface SpecialtiesSliderProps {
  isSidebarOpen?: boolean
}

const SpecialtiesSlider: React.FC<SpecialtiesSliderProps> = ({ }) => {
  const [specialties, setSpecialties] = React.useState<any[]>([])
  const [selectedId, setSelectedId] = React.useState<number | null>(null)
  const [loading, setLoading] = React.useState(true)

  const [api, setApi] = React.useState<any>()
  const [canScrollPrev, setCanScrollPrev] = React.useState(false)
  const [, setCanScrollNext] = React.useState(false)

  const dispatch = useDispatch<AppDispatch>()
  const token = "s9iLbmOm7YfR82m1Uw5m7y8RfXoEXXtrJVaV1ChCabb64743"

  // ✅ Fetch Specialties from API
  React.useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get(
          "https://round7-cure.huma-volve.com/api/specialties",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        )

        setSpecialties(res.data?.specialties || [])
      } catch (error) {
        console.error("Error fetching specialties:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  // ✅ Check scroll position
  React.useEffect(() => {
    if (!api) return

    const checkScroll = () => {
      setCanScrollPrev(api.canScrollPrev())
      setCanScrollNext(api.canScrollNext())
    }

    checkScroll()
    api.on("select", checkScroll)
  }, [api])

  if (loading) return <p className="text-center text-gray-500">Loading specialties...</p>

  return (
    <div className="w-full relative mb-7 overflow-hidden transition-all duration-300">
      <Carousel setApi={setApi} opts={{ align: "start", loop: false }} className="w-full">
        <CarouselContent className="flex items-center ml-0">
          {specialties.map((item) => {
            const isActive = selectedId === item.id

            return (
              <CarouselItem key={item.id} className="basis-auto px-2">
                <div
                  onClick={() => {
                    setSelectedId(item.id)
                    dispatch(searchDoctors(item.name))
                  }}
                  className={`flex items-center gap-2 cursor-pointer border rounded-lg transition px-4 py-2 whitespace-nowrap w-fit
                    ${isActive
                      ? "bg-[#145DB8] border-[#145DB8] text-white shadow-md"
                      : "bg-white border-[#ced5d4] text-[#6D7379] hover:bg-blue-50 shadow-sm"}`}
                >
                  <img
                    src={item.image || "icon_spe.png"}
                    alt={item.name}
                    className="w-5 h-5 object-contain"
                  />

                  <span className={`text-[15px] font-medium ${isActive ? "text-white" : ""}`}>
                    {item.name}
                  </span>
                </div>
              </CarouselItem>
            )
          })}
        </CarouselContent>

        {/* ✅ السهم الشمال يظهر فقط لما ينفع نرجع */}
        {canScrollPrev && (
          <CarouselPrevious className="left-[5px] bg-white border shadow-sm hover:bg-gray-50" />
        )}

        {/* ✅ السهم اليمين ثابت */}
        <CarouselNext className="right-[5px] bg-white border shadow-sm hover:bg-gray-50" />

      </Carousel>
    </div>
  )
}

export default SpecialtiesSlider
