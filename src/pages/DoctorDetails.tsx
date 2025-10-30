import { Link, useParams } from "react-router-dom"
// Reusable (custom) components
import { DoctorStats } from "@/components/reusable/doctor-details/doctor-stats"

// Shadcn Components
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"

// Icons
import GoBackArrow from '@/assets/icons/left-arrow.png'
import UserIcon from '@/assets/icons/profile-user.png'
import StartPngIcon from '@/assets/icons/star.png'
import ExperienceIcon from '@/assets/icons/medal.png'
import MessagesIcon from '@/assets/icons/messages.png'
import AddReviewIcon from '@/assets/icons/pencil.png'
import VerifiedIcon from '@/assets/icons/verified.png'
import CalenderIcon from '@/assets/icons/calender.png'
import LocationIcon from '@/assets/icons/location.png'
import UpDownArrows from '@/assets/icons/up-down-arrows.png'
import { HeartIcon, StarIcon } from "lucide-react"

// Redux
import { useDispatch, useSelector } from "react-redux"
import { toggleFavourite } from "@/redux/doctorsSlice"
import { type RootState } from "@/redux/store"
import { useState } from "react"
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog"
import AddReviewDialog from "@/components/reusable/doctor-details/add-review"
import AppointmentButton from "@/components/reusable/doctor-details/appoint-button"

const starColor = '#F9E000';
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
  const [openDialog, setOpenDialog] = useState(false);
  const [showAllReviews, setShowAllReviews] = useState(false)

  const [selectedDate, setSelectedDate] = useState<string | null>('');
  const [selectedTimeSlot, setSelectedTimeSlot] = useState('')

  const dispatch = useDispatch();

  const { id } = useParams();
  const doctorId = id ? parseInt(id) : -1;

  const currentDoctor = useSelector(
    (state: RootState) => state.doctors.find((doctor) => doctor.id === doctorId)
  );

  document.title = currentDoctor ? `Dr. ${currentDoctor.name}` : 'Doctor not found';

  if (!currentDoctor) return <div className="text-center py-20">Doctor not found!</div>;

  return (
    <main className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-10 px-6 overflow-x-hidden">
      
      {/* Left side */}
      <section className="flex flex-col gap-10 lg:col-span-2">
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-3 mb-3">
            <Link to='/doctors'>
              <img src={GoBackArrow} />
            </Link>
            <span className="font-serif">Make an appointment</span>
          </div>

          <Card className="px-3 text-muted-foreground">
            <CardTitle className="flex justify-between flex-col md:flex-row gap-3 md:gap-0 font-normal items-center">
              <p>Choose date and time</p>
              <div className="flex items-center gap-2">
                <img src={CalenderIcon} className="cursor-pointer" />
                  <p>{selectedDate ? 'October, 2024' : 'Please select a date first'}</p>
                  <img src={UpDownArrows} className="cursor-pointer" />
              </div>
            </CardTitle>
            <Separator />

            <CardContent>

              {/* Available days */}
              <div className="mb-8 flex gap-3 md:gap-0 justify-center items-center md:justify-between flex-wrap">
                {currentDoctor.availability?.map((item, index) => {
                  const isSelected =
                  selectedDate === item.day

                  return <div
                    key={index}
                    onClick={() =>
                      setSelectedDate(item.day)
                    }
                    className={`${isSelected ? 'bg-primary-600 text-white' : 'bg-card hover:bg-primary-100'} cursor-pointer hover:bg-primary-400 hover:text-white transition-colors flex flex-col items-center justify-center p-4 rounded-xl text-center gap-1`}
                  >
                    <span className="text-sm font-medium">{item.day}</span>
                  </div>
                })}
              </div>
              
              {/* Time slots */}
              <div className="w-full grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
                {currentDoctor.availability
                  ?.filter((item) => item.day === selectedDate)
                  .flatMap((item) =>
                    item.timeSlots.map((slot, index) => {
                      const isSlotSelected = selectedTimeSlot === slot;

                      return (
                        <div
                          key={index}
                          onClick={() => setSelectedTimeSlot(slot)}
                          className={`${
                            isSlotSelected
                              ? 'bg-primary-600 text-white hover:bg-primary-400'
                              : 'bg-card hover:bg-primary-400 hover:text-white'
                          } cursor-pointer flex flex-col p-3 text-center rounded-lg items-center gap-2`}
                        >
                          <span>{slot}</span>
                        </div>
                      );
                    })
                  )}
              </div>
              
            </CardContent>
            
            <CardFooter className="flex justify-between flex-col md:flex-row gap-3 md:gap-0">
              <div className="flex items-center gap-2">
                <img src={CalenderIcon} />
                  {selectedDate ? (
                    <div>
                      {selectedDate}, {selectedTimeSlot ? selectedTimeSlot : 'Choose a time.'}
                    </div>
                  ) : (
                    <p className="text-muted-foreground">Please select a date first</p>
                  )}
              </div>

              <AppointmentButton />
            </CardFooter>
          </Card>
        </div>

        {/* Reviews section */}
        <div className="flex items-center justify-between mt-10">
          <h3 className="text-xl font-semibold font-serif">Reviews & Ratings</h3>

          <Dialog open={openDialog} onOpenChange={setOpenDialog}>
            <DialogTrigger>
              <Button variant='link'>
                <img src={AddReviewIcon} alt="Add Review Icon" className="h-5 w-5" />
                <span className="text-primary-500">add Review</span>
              </Button>
            </DialogTrigger>

            <DialogContent>
              <AddReviewDialog doctorId={currentDoctor.id} closeDialog={() => setOpenDialog(false)} />
            </DialogContent>
          </Dialog>
        </div>

        {/* Reviewers number with stars */}
        <div className="flex items-center justify-between gap-4">
          <span className="text-3xl font-semibold font-serif">
            {currentDoctor.rating} / 5
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

              {renderStars(currentDoctor.rating)}
            </div>

            <span className="text-muted-foreground">
              {currentDoctor.numberOfReviews.toLocaleString()}+ reviews
            </span>
          </div>
        </div>

        <div
          className="grid grid-cols-1 lg:grid-cols-2 gap-3 items-center justify-center"
        >
          <>
            {
            (showAllReviews ?
              currentDoctor.patientsReviews :
              currentDoctor.patientsReviews.slice(0, 2)
            ).map((rev, index) => {
                return <Card key={index} className="p-4 h-full">
                  <CardTitle className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <img
                        src={rev.imgSrc}
                        className="h-[62px] w-[62px] rounded-full object-cover"
                        alt={`Review of ${rev.name}`}
                      />
                      <div className="flex flex-col gap-1">
                        <h3>{rev.name}</h3>
                        <p className="text-muted-foreground text-sm">{rev.time}</p>
                      </div>
                    </div>

                    <div style={{color: starColor, backgroundColor: `${starColor}1A`}} className={`flex gap-1 items-center rounded-lg p-1.5`}>
                      <StarIcon style={{color: starColor, fill: starColor}} /> {rev.rating}
                    </div>
                  </CardTitle>

                  <CardContent className="-px-2 mt-2 text-sm">
                    {rev.text}
                  </CardContent>
                </Card>
              })
            }
          </>
        </div>

        <div className="flex items-center justify-center">
          {currentDoctor.patientsReviews.length > 2 && (
            <Button
              variant='outline'
              className="border-primary-600 text-primary-600"
              onClick={() => setShowAllReviews(prev => !prev)}>
              {showAllReviews ? 'Show less' : 'Show all reviews'}
            </Button>
          )}
        </div>

      </section>

      {/* Right Side - Doctor Info */}
      <Card className="bg-card pt-8 pb-6 h-fit border-none shadow-none lg:col-span-1">
        <CardHeader className="flex relative flex-col items-center justify-center text-center gap-2">
          {/* Img + Basic Info */}
          <div className="relative">
            <img
              src={currentDoctor.imgSrc}
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
            Dr. {currentDoctor.name}
          </CardTitle>
          <p className="text-muted-foreground">{currentDoctor.specialization}</p>
          
          <HeartIcon
            onClick={() => dispatch(toggleFavourite(currentDoctor.name))}
            className={`absolute right-10 top-5 ${currentDoctor.favourite && 'fill-red-500 border-red-500'} cursor-pointer`}
          />
        </CardHeader>

        <CardContent className="flex justify-center gap-5">
          <DoctorStats icon={UserIcon} amount={currentDoctor.patientsNum} label="Patients" />
          <DoctorStats icon={ExperienceIcon} amount={currentDoctor.experience} label="Years Exp." />
          <DoctorStats icon={StartPngIcon} amount={currentDoctor.rating} label="Rating" />
          <DoctorStats icon={MessagesIcon} amount={currentDoctor.numberOfReviews} label="Reviews" />
        </CardContent>

        {/* About Section */}
        <CardDescription className="px-4">
          <h3 className="text-xl font-semibold mb-3 text-foreground font-serif">About Me</h3>
          <p className="leading-relaxed text-muted-foreground max-w-3xl">
            {currentDoctor.about}
          </p>
        </CardDescription>

        {/* Location */}
        <CardFooter className="flex flex-col gap-3 px-4">
          <div className="self-start font-serif font-semibold text-xl">Location</div>
          <div className="relative">
            <img src="/map.png" className="rounded-2xl w-[397px] h-[201px]" />
            <div className="absolute bg-background rounded-md shadow px-3 py-1 left-3 bottom-5 z-3 flex items-center gap-2">
              <img src={LocationIcon} className="h-5"/>
              {currentDoctor.location}
            </div>
          </div>
        </CardFooter>
      </Card>
    </main>
  )
}
