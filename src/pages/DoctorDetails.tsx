// #region imports
import { useState } from "react"
import { Link, useParams } from "react-router-dom"
import { addMonths, subMonths } from "date-fns";
import moment from "moment";
// Reusable (custom) components
import AddReviewDialog from "@/components/reusable/doctor-details/AddReviewButton"
import AppointmentButton from "@/components/reusable/doctor-details/appoint-button"
import PageSkeleton from "@/components/reusable/PageSkeleton";
import DoctorDetailsCard, { onCardHoverStyle } from "@/components/reusable/doctor-details/doctor-details-card";

// Shadcn Components
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardFooter,
  CardTitle,
} from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"

// Icons
import GoBackArrow from '@/assets/icons/left-arrow.png'
import CalenderIcon from '@/assets/icons/calender.png'
import BlackCalenderIcon from '@/assets/icons/black-calendar.png'
import { StarIcon } from "lucide-react"
import { IoIosArrowUp, IoIosArrowDown } from "react-icons/io";
// hooks
import { useGetDoctorDetails } from "@/hooks/doctor-details/useGetDoctorDetails";
// #endregion imports
import DoctorSchedule from './../components/reusable/doctor-details/doctor-schedule';
import ReviewCard, { type ReviewProps } from "@/components/reusable/doctor-details/review-card";

export const starColor = '#F9E000';
function renderStars(rating: number) {
  const stars = []
  for (let i = 1; i <= 5; i++) {
    if (rating >= i) {
      stars.push(<StarIcon key={i} style={{color: starColor, fill: starColor}} />)
    } else if (rating >= i - 0.5) {
      stars.push(
        <StarIcon
          key={i}
          style={{ color: starColor, fill: "url(#half-gradient)" }}
        />
      )
    } else {
      stars.push(<StarIcon key={i} className="text-muted-foreground" />)
    }
  }
  return stars
}

export default function DoctorDetails() {
  const { id } = useParams();
  const doctorId = id ? parseInt(id) : -1;
  
  const { data: docDetails, isLoading: isDocLoading, isError: isDocError } = useGetDoctorDetails(doctorId);
  
  const [showAllReviews, setShowAllReviews] = useState(false)

  const [selectedDay, setSelectedDay] = useState<string | null>(null);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedTimeSlot, setSelectedTimeSlot] = useState('');

  if (isDocLoading) return <PageSkeleton />;
  if (isDocError) return (
    <div className="flex items-center justify-center h-[60vh]">
      <div className="bg-red-50 text-red-600 border border-red-200 px-6 py-4 rounded-lg shadow-md text-center">
        <p className="text-lg font-semibold">Failed to load doctor details.</p>
        <p className="text-sm mt-1">Please try refreshing the page or check your connection.</p>
      </div>
    </div>
  );
  
  if (!docDetails || !docDetails.doctor!) return (
    <div className="flex items-center justify-center h-[60vh]">
        <div className="bg-neutral-50 text-primary-700 border border-primary-300 px-6 py-4 rounded-lg shadow-md text-center">
          <p className="text-lg font-semibold">Doctor not found!</p>
          <p className="text-sm mt-1">The doctor you're looking for might have been removed or does not exist.</p>
        </div>
      </div>
  );
  document.title = docDetails.doctor.user.name;

  return (
    <main className="grid mb-10 grid-cols-1 lg:grid-cols-3 gap-8 *:mt-15 px-4 md:px-6 overflow-x-hidden">
      
      {/* Left side */}
      <section className="flex flex-col gap-10 lg:col-span-2">
        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-center md:justify-start gap-3 mb-3">
            <Link to='/doctors'>
              <img alt="go back" src={GoBackArrow} />
            </Link>
            <span className="font-serif">Make an appointment</span>
          </div>

          <Card className={`group px-3 text-muted-foreground bg-background hover:scale-101 ${onCardHoverStyle}`}>
            <CardTitle className="flex justify-between flex-col md:flex-row gap-3 md:gap-0 font-normal items-center">
              <p className="group-hover:text-primary-600">Choose date and time</p>
              <div className="flex items-center gap-2.5">
                <Popover>
                  <PopoverTrigger asChild>
                    <div className="flex items-center gap-2 cursor-pointer">
                      <img alt="back" src={BlackCalenderIcon} />
                      <p>
                        {selectedDay
                          ? currentMonth.toLocaleDateString("en-US", { month: "long", year: "numeric" })
                          : "Please select a date first"}
                      </p>
                    </div>
                  </PopoverTrigger>

                  <PopoverContent
                    className="w-auto ml-3 sm:ml-0 p-0 shadow-md rounded-lg"
                  >
                    <Calendar
                      mode="single"
                      month={currentMonth}
                      onMonthChange={setCurrentMonth}
                      selected={selectedDay ? new Date(selectedDay) : undefined}
                      onSelect={(date: Date | undefined) => {
                        if (date) {
                          const formatted = moment(date).format("YYYY-MM-DD");
                          setSelectedDay(formatted);
                          setSelectedTimeSlot("");
                        }
                      }}
                      disabled={(date) => {
                        const today = new Date();
                        today.setHours(0, 0, 0, 0);
                        return date < today;
                      }}
                      className="bg-white w-[320px] sm:w-[374px] rounded-md"
                      initialFocus
                      required={false}
                    />
                  </PopoverContent>
                </Popover>

                <div className={`flex flex-col items-center gap-1 justify-center *:cursor-pointer ${selectedDay ? '*:hover:opacity-70' : 'opacity-40 pointer-events-none'}`}>
                    <IoIosArrowUp
                      onClick={() => selectedDay && setCurrentMonth(addMonths(currentMonth, 1))}/>

                    <IoIosArrowDown
                      onClick={() => selectedDay && setCurrentMonth(subMonths(currentMonth, 1))}
                    />
                </div>
              </div>
            </CardTitle>

            <Separator className="transition-all group-hover:bg-primary-600 -mt-4" />

            <CardContent className="pt-6">
              <DoctorSchedule doctorId={docDetails.doctor.id}
                selectedDay={selectedDay}
                selectedTimeSlot={selectedTimeSlot}
                onSelectTimeSlot={(time) => setSelectedTimeSlot(time)}
              />

            </CardContent>
            
            <CardFooter className="flex justify-between flex-col md:flex-row gap-3 md:gap-0">
              <div className="flex items-center gap-2">
                <img alt="go back" src={CalenderIcon} />
                  {selectedDay ? (
                    <div className="capitalize">
                      {selectedDay}, {selectedTimeSlot ? selectedTimeSlot : 'Choose a time.'}
                    </div>
                  ) : (
                    <p className="text-muted-foreground">Please select a date first</p>
                  )}
              </div>

              <AppointmentButton doctor={docDetails} timeSlot={selectedTimeSlot} day={selectedDay} month={currentMonth} />
            </CardFooter>
          </Card>
        </div>

        {/* Reviews section */}
        <div className="flex items-center justify-between mt-10">
          <h3 className="text-xl font-semibold font-serif">Reviews & Ratings</h3>
            <AddReviewDialog doctorId={docDetails.doctor.id} />
        </div>

        {/* Reviewers number with stars */}
        {
          docDetails.reviews.length !== 0 && (
            <div className="flex items-center justify-between gap-4">
              <span className="text-3xl font-semibold font-serif">
                {docDetails.doctor.average_rating!} / 5
              </span>

              <div className="flex flex-col items-center">
                <div className="flex items-center gap-1 relative">
                  {/* Half-star gradient definition */}
                  <svg width="0" height="0">
                    <defs>
                      <linearGradient id="half-gradient">
                        <stop offset="50%" stopColor="#F9E000" />
                        <stop offset="50%" stopColor="transparent" />
                      </linearGradient>
                    </defs>
                  </svg>

                  {renderStars(docDetails.doctor.average_rating!)}
                </div>

                <span className="text-muted-foreground">
                  {docDetails.reviews_count === 0 ? `${docDetails.reviews_count} + reviews` : 'No reviews yet!'}
                </span>
              </div>
            </div>
          )
        }

        {/* Reviews Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-2">
          {docDetails.reviews && docDetails.reviews.length > 0 ? (
            <>
              {
                (showAllReviews ?
                  docDetails.reviews :
                  docDetails.reviews.slice(0, 2)
                ).map((rev: ReviewProps) => {
                    return <ReviewCard currentReview={rev} doctorId={docDetails.doctor.id} />
                  })
              }
            </>
          ) : (
            <div className="col-span-2 flex flex-col items-center justify-center py-12 px-4">
              <div className="bg-neutral-100 rounded-full p-6 mb-4">
                <StarIcon className="w-12 h-12" style={{color: starColor, fill: starColor}} />
              </div>
              <h3 className="text-lg font-semibold text-neutral-900 mb-2">No Reviews Yet</h3>
              <p className="text-center text-neutral-600 max-w-sm">
                This doctor hasn't received any reviews yet. Be the first to share your experience!
              </p>
            </div>
          )}
        </div>

        {docDetails.reviews.length > 0 && (
          <div className="flex items-center justify-center">
            {docDetails.reviews.length > 2 && (
              <Button
                variant='outline'
                className="border-primary-600 text-primary-600"
                onClick={() => setShowAllReviews(prev => !prev)}>
                {showAllReviews ? 'Show less' : 'Show all reviews'}
              </Button>
            )}
          </div>
        )}

      </section>

      {/* Right Side - Doctor Info */}
      <DoctorDetailsCard
        id={docDetails.doctor.id}
        name={docDetails.doctor.user.name}
        doctorId ={docDetails.doctor.user.id}
        specialty={docDetails.doctor.specialty}
        location={{ lat: docDetails.doctor.location.lat, lng: docDetails.doctor.location.lng}}
        image={docDetails.doctor.user.profile_photo}
        clinicAddress={docDetails.doctor.clinic_address}
        sessionPrice={docDetails.doctor.session_price}
        avgRating={docDetails.doctor.average_rating}
        reviewsCount={docDetails.doctor.reviews_count}
        experience={docDetails.experience}
        patientCount={docDetails.patient_count}
        aboutMe={docDetails.about_me}
      />

    </main>
  )
}