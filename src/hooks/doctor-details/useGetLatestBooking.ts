// export const useGetLatestBooking = (patientId: number, doctorId: number) => {

// return useQuery({

// queryKey: ["bookings", patientId, doctorId],

// queryFn: async () => {

// const res = await api.get/appointments?patient_id=${patientId}&doctor_id=${doctorId});

// return res.data;

// },

// });

// };

// const { data: bookings } = useGetLatestBooking(patientId, doctorId);

// // const bookingId = bookings?.find(b => b.status === "completed")?.id;

// const bookingId = bookings?.[bookings.length - 1]?.id;