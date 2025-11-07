import React, { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ChevronDownIcon } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import { format , parse} from "date-fns";
import { useNavigate } from "react-router-dom";
import { Dialog, DialogTrigger, DialogContent } from "@/components/ui/dialog";
import AddReviewDialog from "@/components/reusable/doctor-details/add-review";
import axios from "axios";
import "./Appointment.css"
import {  useSelector } from "react-redux";
import { type RootState } from "@/redux/store"; 


interface DoctorUser {
  name?: string;
  profile_photo?: string | null;
}

interface Doctor {
  id?: number;
  specialty?: string;
  clinic_address?: string;
  user?: DoctorUser;
}

interface ApiAppointment {
  id: number;
  booking_id?: number;
  date_time: string;
  date_time_formatted: string;
  status_label: string;
  doctor?: Doctor;
}


interface DoctorUser {
  name?: string;
  profile_photo?: string | null;
}

interface Doctor {
  id?: number;
  specialty?: string;
  clinic_address?: string;
  user?: DoctorUser;
}

interface ApiAppointment {
  id: number;
  booking_id?: number;
  date_time: string;
  date_time_formatted: string;
  status_label: string;
  doctor?: Doctor;
}

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

const API_URL = "https://round7-cure.huma-volve.com/api";

const Appointments: React.FC = () => {
  const navigate = useNavigate();
  const [openDialog, setOpenDialog] = useState(false);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [filter, setFilter] = useState<"All" | "Upcoming" | "Completed" | "Canceled" | "Pending">("All");
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [modalAppt, setModalAppt] = useState<Appointment | null>(null);
  const [rescheduleModal, setRescheduleModal] = useState<Appointment | null>(null);
  const [selectedRescheduleDate, setSelectedRescheduleDate] = useState<Date | undefined>();
  const [selectedTime, setSelectedTime] = useState<string>("");
  const [loading, setLoading] = useState(true);

const token = useSelector((state: RootState) => state.auth.token);


  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const res = await axios.get(`${API_URL}/patient/bookings`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        const apiData: ApiAppointment[] = res.data.data.data;

        const formattedAppointments: Appointment[] = apiData.map((item) => {
  const parsedDate = parse(item.date_time, "yyyy-MM-dd HH:mm:ss", new Date());

  return {
    id: item.id,
    date: format(parsedDate, "yyyy-MM-dd"),
    time: format(parsedDate, "HH:mm  "),
    doctor: item.doctor?.user?.name || "Unknown Doctor",
    specialty: item.doctor?.specialty || "Unknown Specialty",
    address: item.doctor?.clinic_address || "No address available",
    status:
      item.status_label === "معلق"
        ? "Pending"
        : item.status_label === "ملغي"
        ? "Canceled"
        : item.status_label === "مكتملة"
        ? "Completed"
        : "Upcoming",
    imageSrc: item.doctor?.user?.profile_photo || "/doctor.jpg",
    doctorId: item.doctor?.id || 0,
  };
});


        setAppointments(formattedAppointments);
      } catch (error) {
        console.error("Error fetching appointments:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchAppointments();
  }, [token]);

 
  const handleConfirmCancel = async () => {
    if (!modalAppt) return;
    try {
      await axios.delete(`${API_URL}/patient/bookings/${modalAppt.id}/cancel`, {
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      setAppointments((prev) =>
        prev.map((a) => (a.id === modalAppt.id ? { ...a, status: "Canceled" } : a))
      );
      alert("Appointment canceled successfully.");
    } catch (error) {
      console.error("Error canceling appointment:", error);
      alert("Failed to cancel appointment. Please try again.");
    } finally {
      setModalAppt(null);
    }
  };

  const handleSubmitReschedule = async () => {
    if (!rescheduleModal || !selectedRescheduleDate || !selectedTime) return;

    const newDateTime = `${format(selectedRescheduleDate, "yyyy-MM-dd")} ${selectedTime}:00`;

    try {
      await axios.put(
        `${API_URL}/patient/bookings/${rescheduleModal.id}/reschedule`,
        { date_time: newDateTime }, 
        {
          headers: {
            Accept: "application/json",
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      alert("Appointment rescheduled successfully!");
      setAppointments((prev) =>
        prev.map((a) =>
          a.id === rescheduleModal.id
            ? { ...a, date: format(selectedRescheduleDate, "yyyy-MM-dd"), time: selectedTime, status: "Upcoming" }
            : a
        )
      );
    } catch (error) {
      console.error("Error rescheduling appointment:", error);
      alert("Failed to reschedule appointment. Please try again.");
    } finally {
      setRescheduleModal(null);
    }
  };

  const filteredAppointments = appointments.filter((appt) => {
    const statusMatch = filter === "All" || appt.status === filter;
    const dateMatch = appt.date === format(selectedDate, "yyyy-MM-dd");
    return statusMatch && dateMatch;
  });

  if (loading) return <p className="text-center mt-10">Loading appointments...</p>;

  return (
    <div className="py-6 sm:px-8 lg:px-[72px] relative">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-6 gap-6">
        <div>
          <h2 className="text-xl font-semibold capitalize mb-3">Your appointments</h2>
          <Tabs defaultValue="All" onValueChange={(v: string) => setFilter(v as Appointment["status"])}>
            <TabsList className="flex flex-wrap gap-2 bg-background mb-6 justify-center sm:justify-start">
              {["All", "Upcoming", "Pending", "Completed", "Canceled"].map((tab) => (
                <TabsTrigger
                  key={tab}
                  value={tab}
                  className="cursor-pointer hover:bg-neutral-50 transition-colors px-4 sm:px-6 text-sm sm:text-base text-[#6D7379] font-medium rounded-lg data-[state=active]:bg-primary-600 data-[state=active]:text-white py-3"
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
                  <span>{format(selectedDate, "EEEE, MMMM d")}</span>
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
                 onSelect={(date) => date && setSelectedDate(date)}
                 className="bg-white w-[320px] sm:w-[374px] rounded-md"
               />
           </PopoverContent>
            
          </Popover>
        </div>
      </div>

      {/* Appointment Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2  lg:grid-cols-3 gap-6 ">
        {filteredAppointments.length > 0 ? (
          filteredAppointments.map((appt) => (
            <Card key={appt.id} className="pt-1 pb-5 bg-background hover:bg-[#F3F4F6] w-full sm:w-[380px] rounded-xl">
              <CardContent>
                <div className="flex justify-between items-center border-b mb-4">
                  <p className="flex gap-2 items-center text-sm text-[#6D7379] font-medium">
                    <img src="/calendar-02.png" alt="Calendar" />
                        {format(new Date(appt.date), `dd-MM-yyyy HH:mm`)}
                  </p>
                  <span
                    className={`text-xs font-medium px-2 py-1 rounded-full ${
                      appt.status === "Upcoming"
                        ? "text-blue-700"
                        : appt.status === "Completed"
                        ? "text-green-700"
                        : appt.status === "Pending"
                        ? "text-yellow-600"
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

                <div className="text-sm text-gray-600 flex gap-1 mb-4">
                  <img src="/Location.svg" alt="location" className="mt-0.5" />
                  <p>{appt.address}</p>
                </div>

                {/* Buttons */}
                <div className="flex flex-wrap gap-3 justify-center">
                  {appt.status === "Upcoming" && (
                    <>
                      <Button
                        variant="outline"
                        className="border-gray-500 text-gray-500 hover:text-gray-700 hover:border-gray-700 canceling-button w-[140px]"
                        onClick={() => setModalAppt(appt)}
                      >
                        Cancel
                      </Button>
                      <Button
                        className="bg-primary-600 text-white w-[140px]"
                        onClick={() => setRescheduleModal(appt)}
                      >
                        Reschedule
                      </Button>
                    </>
                  )}

                  {appt.status === "Pending" && (
                    <>
                      <Button
                        variant="outline"
                        className="canceling-button w-[140px]"
                        onClick={() => setModalAppt(appt)}
                      >
                        Cancel
                      </Button>
                      <Button
                        className="bg-primary-600 reschedule-button text-white w-[140px]"
                        onClick={() => navigate(`/payment/${appt.id}`)}
                      >
                        Pay Now
                      </Button>
                    </>
                  )}

                  {appt.status === "Completed" && (
                    <>
                      <Button
                        variant="outline"
                        className="text-primary-400 canceling-button border-primary-400 w-[140px] sm:w-40"
                        onClick={() => navigate(`/doctor-details/${appt.doctorId}`)}
                      >
                        Book again
                      </Button>
                      <Dialog open={openDialog} onOpenChange={setOpenDialog}>
                        <DialogTrigger asChild>
                          <Button
                            className="w-[140px] reschedule-button bg-primary-600 text-white"
                            onClick={() => setOpenDialog(true)}
                          >
                            Feedback
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <AddReviewDialog doctorId={appt.doctorId} closeDialog={() => setOpenDialog(false)} />
                        </DialogContent>
                      </Dialog>
                    </>
                  )}

                  {appt.status === "Canceled" && (
                    <>
                      <Button
                        variant="outline"
                        className=" canceling-button  w-[140px] sm:w-40"
                        onClick={() => navigate(`/doctor-details/${appt.doctorId}`)}
                      >
                        Book again
                      </Button>

                      <Button className="bg-primary-600 reschedule-button text-white w-[140px]" onClick={() => navigate(`/chat`)}>
                        Support
                      </Button>
                    </>
                  )}
                </div>
              </CardContent>
            </Card>
          ))
        ) : (
          <p className="text-gray-500 col-span-full text-center py-8">No appointments found.</p>
        )}
      </div>

      {/* Cancel Modal */}
      {modalAppt && (
        <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-[30px] w-full max-w-[400px] text-center">
            <div className="bg-[#FFF6E9] w-20 h-20 mx-auto rounded-full flex items-center justify-center mb-4">
              <img src="/alert-02.svg" alt="alert" className="w-10 h-10" />
            </div>
            <h2 className="text-[#FFA726] text-[26px] font-semibold mb-2">Warning!</h2>
            <p className="text-md text-gray-600 mb-4">Cancellation must be made 24 hours in advance.</p>
            <p className="text-md text-gray-600 mb-4">Are you sure?</p>
            <div className="flex flex-col gap-2">
              <Button className="bg-[#05162C] text-white" onClick={handleConfirmCancel}>
                Yes, Cancel
              </Button>
              <Button variant="outline" className="text-[#05162C] border-[#05162C] hover:bg-[#05162C] hover:text-white" onClick={() => setModalAppt(null)}>
                No
              </Button>
            </div>
          </div>
        </div>
      )}

      {rescheduleModal && (
        <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-[30px] w-full max-w-[400px] text-center">
            <h2 className="text-primary-600 text-xl font-semibold mb-4">Reschedule Appointment</h2>

            <Calendar
              mode="single"
              title="Select Date"
              selected={selectedRescheduleDate}
              onSelect={(date) => date && setSelectedRescheduleDate(date)}
              className="bg-white mx-auto mb-4"
            />

            <input
            title="Select Time"
              type="time"
              value={selectedTime}
              onChange={(e) => setSelectedTime(e.target.value)}
              className="border border-gray-300 rounded-lg px-3 py-2 w-full mb-4"
            />

            <div className="flex flex-col gap-2">
              <Button className="bg-[#05162C] hover:bg-[#05162C]   text-white" onClick={handleSubmitReschedule}>
                Confirm
              </Button>
              <Button variant="outline" className="text-[#05162C]   border-[#05162C] hover:bg-[#05162C] hover:text-white hover:cursor-pointer" onClick={() => setRescheduleModal(null)}>
                Cancel
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Appointments;
