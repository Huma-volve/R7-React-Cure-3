import React, { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ChevronDownIcon } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import { format } from "date-fns";
import { useNavigate } from "react-router-dom";
import { Dialog, DialogTrigger, DialogContent } from "@/components/ui/dialog";
import AddReviewDialog from "@/components/reusable/doctor-details/add-review";
// import axios from "axios";


interface Appointment {
  id: number;
  date: string;
  time: string;
  doctor: string;
  specialty: string;
  address: string;
  status: "Upcoming" | "Completed" | "Canceled" | "Pending";
  imageSrc: string;
  doctorId: number;
}

const todayString = format(new Date(), "yyyy-MM-dd");

const appointmentsData: Appointment[] = [
  {
    id: 1,
    date: todayString,
    time: "09:00 AM",
    doctor: "Dr. Jennifer Miller",
    specialty: "Psychiatrist",
    address: "12 St. Nasr Street, Cairo, Egypt",
    status: "Upcoming",
        doctorId:5,

    imageSrc: "/Ellipse 1538 (1).png",
  },
  {
    id: 2,
    date: todayString,
    time: "01:00 PM",
    doctor: "Dr. Alex Carter",
    specialty: "Dermatologist",
    address: "15 Giza Road, Cairo, Egypt",
    status: "Completed",    
    doctorId:0,
    imageSrc: "/Ellipse 1538 (1).png",
  },
  {
    id: 3,
    date: todayString,
    time: "05:00 PM",
    doctor: "Dr. Sarah Ibrahim",
    specialty: "Dentist",
    address: "22 Dokki Street, Giza, Egypt",
    status: "Canceled",
        doctorId:4,
    imageSrc: "/Ellipse 1538 (1).png",
  },
  {
    id: 4,
    date: todayString,
    time: "10:30 AM",
    doctorId:5,
    doctor: "Dr. Omar Khaled",
    specialty: "Cardiologist",
    address: "45 Zamalek Street, Cairo, Egypt",
    status: "Upcoming",
    imageSrc: "/Ellipse 1538 (1).png",
  },
];

const STORAGE_KEY = "appointmentsData";

const Appointments: React.FC = () => {
  const navigate = useNavigate();
  const [openDialog, setOpenDialog] = React.useState(false);
  const [appointments, setAppointments] = useState<Appointment[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : appointmentsData;
  });

  const [filter, setFilter] = useState<"All" | "Upcoming" | "Completed" | "Canceled">("All");
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [modalAppt, setModalAppt] = useState<Appointment | null>(null);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(appointments));
  }, [appointments]);

  const filteredAppointments = appointments.filter((appt) => {
    const statusMatch = filter === "All" || appt.status === filter;
    const dateMatch = appt.date === format(selectedDate, "yyyy-MM-dd");
    return statusMatch && dateMatch;
  });
// interface Appointment {
//   id: number;
//   date: string;
//   time: string;
//   doctor: string;
//   specialty: string;
//   address: string;
//   status: "Upcoming" | "Completed" | "Canceled" | "Pending";
//   imageSrc: string;
//   doctorId: number;
// }

// const API_URL = `https://round7-cure.huma-volve.com/api`;

// const Appointments: React.FC = () => {
//   const navigate = useNavigate();
//   const [openDialog, setOpenDialog] = useState(false);
//   const [appointments, setAppointments] = useState<Appointment[]>([]);
//   const [filter, setFilter] = useState<"All" | "Upcoming" | "Completed" | "Canceled">("All");
//   const [selectedDate, setSelectedDate] = useState<Date>(new Date());
//   const [modalAppt, setModalAppt] = useState<Appointment | null>(null);
//   const [loading, setLoading] = useState(true);

//  useEffect(() => {
//   const fetchAppointments = async () => {
//     try {
//       const token: string = "yxeMlPYTcDnotsyHFndsOh6wsqjTRfAhCDZDR8yX61ecfbf1";
//       const res = await axios.get(`${API_URL}/patient/bookings`, {
//         headers: {
//           Authorization: `Bearer ${token}`,
//         },
//       });
//       setAppointments(res.data.data);
//       console.log(res.data);
//     } catch (error) {
//       console.error("Error fetching appointments:", error);
//     } finally {
//       setLoading(false);
//     }
//   };
//   fetchAppointments();
// }, []);

// const filteredAppointments = Array.isArray(appointments)
//   ? appointments.filter((appt) => {
//       const statusMatch = filter === "All" || appt.status === filter;
//       const dateMatch = appt.date === format(selectedDate, "yyyy-MM-dd");
//       return statusMatch && dateMatch;
//     })
//   : [];


//   const handleConfirmCancel = async () => {
//     if (!modalAppt) return;
//     try {
//       await axios.put(`${API_URL}/${modalAppt.id}`, { status: "Canceled" });
//       setAppointments((prev) =>
//         prev.map((a) => (a.id === modalAppt.id ? { ...a, status: "Canceled" } : a))
//       );
//     } catch (error) {
//       console.error("Error canceling appointment:", error);
//     } finally {
//       setModalAppt(null);
//     }
//   };

//   if (loading) return <p className="text-center mt-10">Loading appointments...</p>;


  return (
    <div className="py-6 sm:px-8 lg:px-[72px] relative">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-6 gap-6">
        <div className="flex flex-col gap-3 justify-center md:justify-start items-center md:items-start">
          <h2 className="text-xl font-semibold capitalize">Your appointments</h2>

          <Tabs
            defaultValue="All"
            onValueChange={(v: string) =>
              setFilter(v as "All" | "Upcoming" | "Completed" | "Canceled")
            }
          >
            <TabsList
              className="
                flex flex-wrap gap-2
                bg-background
                mb-6 md:mb-0
                justify-center sm:justify-start"
            >
              {["All", "Upcoming", "Completed", "Canceled"].map((tab) => (
                <TabsTrigger
                  key={tab}
                  value={tab}
                  className="cursor-pointer hover:bg-neutral-50 transition-colors sm:mb-3 px-4 sm:px-6 text-sm sm:text-base text-[#6D7379] font-medium rounded-lg data-[state=active]:bg-primary-600 data-[state=active]:hover:bg-primary-400 data-[state=active]:text-white data-[state=active]:shadow-sm py-3 lg:py-4"
                >
                  {tab}
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>
        </div>

        <div className="flex justify-center">
          <Popover>
            <PopoverTrigger asChild>
              <Button className="flex w-full sm:w-[396px] bg-background text-foreground hover:bg-primary-50 h-12 border-[#B2B7BE] rounded-xl border justify-between gap-2">
                <div className="flex items-center gap-2">
                  <img src="/calendar-02.png" alt="Calendar Icon" />
                  <span className="truncate">{format(selectedDate, "EEEE, MMMM d")}</span>
                </div>
                <ChevronDownIcon className="w-5 h-5 text-gray-500" />
              </Button>
            </PopoverTrigger>

            <PopoverContent
              className="w-auto p-0 border border-[#B2B7BE] bg-white shadow-md rounded-lg"
              align="end"
            >
              <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={(date: Date | undefined) => {
                  if (date) setSelectedDate(date);
                }}
                className="bg-white w-[320px] sm:w-[374px] rounded-md"
                initialFocus
                required={false}
              />
            </PopoverContent>
          </Popover>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 gap-x-20 justify-items-center">
        {filteredAppointments.length > 0 ? (
          filteredAppointments.map((appt) => (
            <Card
              key={appt.id}
              className="pt-1 me-2 pb-5 bg-background transition-colors hover:bg-neutral-50 w-full sm:w-[380px] md:w-[385px] rounded-xl"
            >
              <CardContent className="w-full">
                <div className="flex justify-between items-center border-b border-[#B2B7BE] mb-4">
                  <p className="flex gap-2 items-center text-sm text-[#6D7379] font-medium flex-wrap">
                    <span>
                      <img src="/calendar-02.png" alt="Calendar Icon" />
                    </span>
                    {format(new Date(appt.date), "EEEE, MMMM d")} - {appt.time}
                  </p>
                  <span
                    className={`text-xs font-medium px-2 py-1 rounded-full ${
                      appt.status === "Upcoming"
                        ? "text-blue-700"
                        : appt.status === "Completed"
                        ? "text-green-700"
                        : "text-[#FC4B4E]"
                    }`}
                  >
                    {appt.status}
                  </span>
                </div>

                <div className="flex justify-between items-center mb-3">
                  <div className="flex items-center gap-2">
                    <img
                      src={appt.imageSrc}
                      alt={appt.doctor}
                      className="w-10 h-10 rounded-full object-cover"
                    />
                    <div>
                      <h3 className="font-semibold mb-1 text-[#33384B] text-sm sm:text-base">
                        {appt.doctor}
                      </h3>
                      <p className="text-[#6D7379] text-sm">{appt.specialty}</p>
                    </div>
                  </div>
                </div>

                <div className="text-sm text-gray-600 flex gap-1 mb-4 items-start">
                  <img src="/Location.svg" alt="location" className="mt-0.5" />
                  <p className="wrap-break-words">{appt.address}</p>
                </div>

                <div className="flex flex-wrap gap-3 w-full justify-center sm:justify-start">
                  {appt.status === "Upcoming" ? (
                    <>
                      <Button
                        variant='outline'
                        className="text-primary-400 border-primary-400 w-[140px] sm:w-40"
                        onClick={() => setModalAppt(appt)}
                      >
                        Cancel
                      </Button>
                      <Button onClick={() => navigate(`/doctors/${appt.doctorId}`)} className="w-[140px] sm:w-40 bg-primary-600">
                        Reschedule
                      </Button>
                    </>
                  ) : appt.status === "Completed" ? (
                    <>
                      <Button variant='outline' className="text-gray-500 border-gray-500 hover:shadow hover:text-gray-600 hover:border-gray-600 w-[140px] sm:w-40">
                        Book again
                      </Button>
                            <Dialog open={openDialog} onOpenChange={setOpenDialog}>
                                <DialogTrigger asChild>
                                  <Button
                                    className="w-[140px] sm:w-40 bg-primary-600"
                                    onClick={() => setOpenDialog(true)}
                                  >
                                    Feedback
                                  </Button>
                                </DialogTrigger>

                                <DialogContent className="max-w-lg">
                                  <AddReviewDialog
                                    doctorId={appt.doctorId}
                                    closeDialog={() => setOpenDialog(false)}
                                  />
                                </DialogContent>
                              </Dialog>

                      {/* <Button className="w-[140px] sm:w-40 bg-primary-600">
                        Feedback
                      </Button> */}
                    </>
                  ) : appt.status === "Canceled" ? (
                    <>
                      <Button variant='outline' className="text-primary-400 border-primary-400 w-[140px] sm:w-40">
                        Book again
                      </Button>
                      <Button onClick={() => navigate(`/chat`)} className="w-[140px] sm:w-40 bg-primary-600">
                        Support
                      </Button>
                    </>
                  ) : (
                    ""
                  )}
                </div>
              </CardContent>
            </Card>
          ))
        ) : (
          <p className="text-gray-500 col-span-full text-center py-8">
            No appointments found for this date.
          </p>
        )}
      </div>

      {modalAppt && (
        <div className="fixed inset-0 bg-black/20 bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white p-6 rounded-[30px] w-full max-w-[400px] flex flex-col items-center text-center">
            <div className="bg-[#FFF6E9] w-20 h-20 flex items-center justify-center rounded-full mb-4">
              <img src="public/alert-02.svg" alt="Warning Icon" className="w-10 h-10" />
            </div>
            <h2 className="text-[#FFA726] text-[26px] font-semibold mb-2">Warning!</h2>
            <p className="text-md text-gray-600 mb-4 px-2">
              Cancellation must be made at least 24 hours in advance to receive a refund.
            </p>
               <p className="text-md text-gray-600 mb-4 px-2">
                 
            </p>
            <p className="text-md text-gray-600 mb-4">Are you sure?</p>

            <div className="flex flex-col w-full gap-2">
              <Button className="bg-[#05162C] w-full text-white" onClick={handleConfirmCancel}>
                Yes, Cancel
              </Button>
              <Button variant="outline" onClick={() => setModalAppt(null)}>
                No
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Appointments;