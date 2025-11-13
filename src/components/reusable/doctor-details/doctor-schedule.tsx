import { useState, useEffect } from "react";
import { useGetAvailableSlots } from "@/hooks/useGetAvailableSlots";
import PageSkeleton from "../PageSkeleton";
import moment from "moment";

interface DoctorScheduleProps {
  doctorId: number;
  selectedDay: string | null;
  onSelectTimeSlot: (time: string) => void;
  selectedTimeSlot: string;
}

export default function DoctorSchedule({
  doctorId,
  selectedDay,
  onSelectTimeSlot,
  selectedTimeSlot,
}: DoctorScheduleProps) {
  const { data: availability, isLoading, isError } = useGetAvailableSlots(doctorId);
  const [currentSelectedDay, setCurrentSelectedDay] = useState<string | null>(null);

  // Update current selected day when prop changes
  useEffect(() => {
    if (selectedDay) {
      setCurrentSelectedDay(selectedDay);
    }
  }, [selectedDay]);

  if (isLoading) return <PageSkeleton />;
  if (isError) return <p>Failed to load available slots.</p>;
  if (!availability) return <p>No slots found.</p>;

  if (!selectedDay)
    return <p className="text-center text-muted-foreground py-4">Please select a date from the calendar.</p>;

  // Generate all 7 days of the week for the selected day
  const startOfWeek = moment(selectedDay).startOf('week');
  const allWeekDays = Array.from({ length: 7 }, (_, i) => {
    return startOfWeek.clone().add(i, 'days').format('YYYY-MM-DD');
  });

  // Get the selected day's data for time slots
  const selectedDayData = currentSelectedDay && availability[currentSelectedDay]
    ? { date: currentSelectedDay, info: availability[currentSelectedDay] }
    : null;

  return (
    <div className="text-center flex flex-col gap-4">
      {/* Display all 7 days of the week */}
      <div className="mb-6">
        <h4 className="text-sm text-muted-foreground mb-3">Week of {moment(selectedDay).format('MMM DD, YYYY')}:</h4>
        <ul className="grid grid-cols-7 gap-2">
          {allWeekDays.map((day) => {
            const dayName = moment(day).format('ddd');
            const dayNumber = moment(day).format('DD');
            const isSelected = currentSelectedDay === day;
            const hasAvailability = availability[day];
            const isClickable = hasAvailability;
            
            return (
              <li
                key={day}
                onClick={() => {
                  if (isClickable) {
                    setCurrentSelectedDay(day);
                    onSelectTimeSlot('');
                  }
                }}
                className={`text-sm p-3 rounded-xl font-semibold transition-all
                  ${isSelected 
                    ? 'bg-primary-600 text-white shadow-md' 
                    : hasAvailability
                      ? 'bg-neutral-50 hover:bg-primary-100 cursor-pointer'
                      : 'bg-gray-100 text-gray-400 cursor-not-allowed opacity-50'
                  }`
                }
              >
                <div className="flex flex-col gap-1">
                  <span className="text-xs opacity-80">{dayName}</span>
                  <span>{dayNumber}</span>
                </div>
              </li>
            );
          })}
        </ul>
      </div>

      {selectedDayData ? (
        <div>
          <h4 className="text-sm text-muted-foreground mb-3">
            Available times for {moment(currentSelectedDay).format('MMM DD, YYYY')}:
          </h4>
          <div className="grid gap-4 grid-cols-2 sm:grid-cols-4 lg:grid-cols-5">
            {selectedDayData.info.times.map((time: string) => {
              const isSelected = selectedTimeSlot === time;
              return (
                <button
                  key={time}
                  onClick={() => onSelectTimeSlot(time)}
                  className={`${
                    isSelected 
                      ? 'bg-primary-600 text-white shadow-md' 
                      : 'bg-neutral-50 hover:bg-primary-50'
                  }
                    cursor-pointer hover:bg-primary-400 hover:text-white transition-all p-4 rounded-xl
                    text-center font-medium`
                  }
                >
                  {time}
                </button>
              );
            })}
          </div>
        </div>
      ) : (
        <p className="text-center text-muted-foreground py-4">
          No available slots.
        </p>
      )}
    </div>
  );
}