// import { createSlice, type PayloadAction } from '@reduxjs/toolkit'

// interface PatientReview {
//   id: number
//   name: string
//   imgSrc: string
//   rating: string
//   time: string
//   text: string
// }

// export interface DoctorProps {
//   id: number
//   name: string
//   specialization: string
//   imgSrc: string
//   location: string
//   about: string
//   patientsNum: number
//   patientsReviews: PatientReview[]
//   experience: number
//   price: number
//   favourite: boolean
//   numberOfReviews: number
//   rating: number
//   hospital: string
//   availability: {
//     day: string
//     timeSlots: string[]
//   }[]
// }

// export const initialState: DoctorProps[] = [
//   {
//     id: 0,
//     name: 'Mohamed Ahmed',
//     specialization: 'Orthopedic Surgeon',
//     imgSrc: '/doctors/doctor1.png',
//     about:
//       'Dr. Mohamed Ahmed is a highly respected orthopedic surgeon with over a decade of experience in treating joint injuries, fractures, and sports-related conditions. He combines advanced surgical techniques with patient-centered rehabilitation programs to ensure faster recovery and long-term mobility. His commitment to continuous learning and innovation has made him a trusted name among both athletes and everyday patients seeking quality orthopedic care.',
//     location: '129, El-Nasr Street, Cairo',
//     hospital: 'El-Nasr Hospital',
//     patientsNum: 1800,
//     experience: 11,
//     rating: 4.6,
//     numberOfReviews: 1920,
//     price: 400,
//     favourite: false,
//     availability: [
//       { day: '25/10/2025', timeSlots: ['9:00AM', '10:30AM', '1:00PM', '3:00PM', '5:30PM'] },
//       { day: '26/10/2025', timeSlots: ['8:30AM', '11:00AM', '12:30PM', '2:00PM', '4:00PM', '7:00PM'] },
//       { day: '27/10/2025', timeSlots: ['9:00AM', '10:00AM', '11:30AM', '1:30PM', '3:30PM', '6:00PM'] },
//     ],
//     patientsReviews: [
//       {
//         id: 1,
//         name: 'Omar Nasser',
//         imgSrc: '/patients/patient1.png',
//         rating: '5.0',
//         time: '1 hour ago',
//         text: 'Had a knee surgery with Dr. Mohamed and couldn’t be happier. He explained every step clearly and ensured I was comfortable. Now I’m back to jogging after 3 months!',
//       },
//       {
//         id: 2,
//         name: 'Laila Hassan',
//         imgSrc: '/patients/patient2.png',
//         rating: '4.8',
//         time: '2 days ago',
//         text: 'Professional, kind, and very skilled. The clinic was well-organized and appointments were always on time. I highly recommend Dr. Mohamed for orthopedic consultations.',
//       },
//       {
//         id: 3,
//         name: 'Ahmed Rashed',
//         imgSrc: '/patients/patient2.png',
//         rating: '4.5',
//         time: '5 days ago',
//         text: 'I had a shoulder injury from gym training and Dr. Mohamed’s treatment plan helped me recover without surgery. Great doctor with a personal touch.',
//       },
//     ],
//   },
//   {
//     id: 1,
//     name: 'Jessica Turner',
//     specialization: 'Pulmonologist',
//     imgSrc: '/doctors/doctor1.png',
//     about:
//       'Dr. Jessica Turner is a board-certified pulmonologist specializing in respiratory disorders, asthma management, and sleep-related breathing conditions. With over 9 years of clinical experience, she is known for her empathetic approach and precise diagnostics. Dr. Turner focuses on long-term patient education and preventive care to improve overall lung health, working closely with her patients to develop lifestyle-based treatment plans that complement modern medicine.',
//     location: '9, Tahrir Street, Cairo',
//     hospital: 'Cairo Medical Center',
//     patientsNum: 2200,
//     experience: 9,
//     rating: 4.7,
//     numberOfReviews: 2050,
//     price: 450,
//     favourite: true,
//     availability: [
//       { day: '25/10/2025', timeSlots: ['10:00AM', '11:30AM', '1:00PM', '4:00PM', '6:30PM'] },
//       { day: '26/10/2025', timeSlots: ['9:30AM', '11:00AM', '12:30PM', '3:00PM', '5:00PM'] },
//       { day: '27/10/2025', timeSlots: ['8:30AM', '10:00AM', '2:00PM', '5:30PM', '7:00PM'] },
//       { day: '28/10/2025', timeSlots: ['8:30AM', '10:00AM', '2:00PM', '5:30PM', '7:00PM'] },
//       { day: '29/10/2025', timeSlots: ['10:00AM', '11:30AM', '1:00PM', '4:00PM', '6:30PM'] },
//     ],
//     patientsReviews: [
//       {
//         id: 1,
//         name: 'Sara Khaled',
//         imgSrc: '/patients/patient1.png',
//         rating: '5.0',
//         time: '1 day ago',
//         text: 'Dr. Turner helped me control my chronic asthma after years of struggling. She took time to understand my triggers and explained everything in detail.',
//       },
//       {
//         id: 2,
//         name: 'Mina George',
//         imgSrc: '/patients/patient2.png',
//         rating: '4.6',
//         time: '3 days ago',
//         text: 'The consultation was thorough and informative. I appreciated her calm approach and the staff were friendly as well.',
//       },
//     ],
//   },
//   {
//     id: 2,
//     name: 'Omar Saleh',
//     specialization: 'Cardiologist',
//     imgSrc: '/doctors/doctor1.png',
//     about:
//       'Dr. Omar Saleh, a consultant cardiologist with 12 years of practice, is renowned for his expertise in diagnosing and managing complex cardiovascular diseases. He utilizes advanced imaging and stress tests to create personalized treatment plans, focusing on prevention and long-term care. Dr. Saleh also conducts awareness programs about heart health and advocates for early screening and lifestyle modification as the foundation of a healthy heart.',
//     location: '45, Abbas El-Akkad Street, Nasr City',
//     hospital: 'Nasr City Heart Center',
//     patientsNum: 3100,
//     experience: 12,
//     rating: 4.9,
//     numberOfReviews: 2870,
//     price: 600,
//     favourite: false,
//     availability: [
//       { day: '25/10/2025', timeSlots: ['8:00AM', '9:30AM', '11:00AM', '2:00PM', '5:00PM'] },
//       { day: '26/10/2025', timeSlots: ['10:00AM', '12:30PM', '3:00PM', '6:30PM'] },
//       { day: '27/10/2025', timeSlots: ['8:30AM', '10:00AM', '2:00PM', '5:30PM', '7:00PM'] },
//       { day: '28/10/2025', timeSlots: ['8:30AM', '10:00AM', '2:00PM', '5:30PM', '7:00PM'] },
//       { day: '29/10/2025', timeSlots: ['10:00AM', '11:30AM', '1:00PM', '4:00PM', '6:30PM'] },
//     ],
//     patientsReviews: [
//       {
//         id: 1,
//         name: 'Karim Mounir',
//         imgSrc: '/patients/patient2.png',
//         rating: '5.0',
//         time: '4 hours ago',
//         text: 'Best cardiologist I’ve visited. He detected an early heart issue that previous doctors missed. Saved me a lot of trouble down the road.',
//       },
//       {
//         id: 2,
//         name: 'Hend Ayman',
//         imgSrc: '/patients/patient1.png',
//         rating: '4.8',
//         time: '1 week ago',
//         text: 'Dr. Omar has a great way of explaining complicated medical details. I felt reassured and confident throughout my treatment.',
//       },
//       {
//         id: 3,
//         name: 'Youssef Magdy',
//         imgSrc: '/patients/patient2.png',
//         rating: '4.9',
//         time: '2 weeks ago',
//         text: 'His clinic is well-equipped and organized. The staff is efficient and kind. Dr. Omar truly cares about his patients’ well-being.',
//       },
//     ],
//   },
//   {
//     id: 3,
//     name: 'Nourhan Elsayed',
//     specialization: 'Dermatologist',
//     imgSrc: '/doctors/doctor1.png',
//     about:
//       'Dr. Nourhan Elsayed is a dermatologist with more than 7 years of experience specializing in acne management, skin rejuvenation, and cosmetic dermatology. She takes pride in using evidence-based treatments and the latest technologies to help patients achieve clear and healthy skin. Her caring nature and eye for detail make her especially popular among young adults seeking both aesthetic and medical skin care solutions.',
//     location: '47, Dokki Street, Giza',
//     hospital: 'DermaGlow Clinic',
//     patientsNum: 2500,
//     experience: 7,
//     rating: 4.4,
//     numberOfReviews: 1740,
//     price: 300,
//     favourite: true,
//     availability: [
//       { day: '25/10/2025', timeSlots: ['11:00AM', '12:30PM', '3:00PM', '4:30PM', '6:00PM'] },
//       { day: '26/10/2025', timeSlots: ['9:00AM', '10:00AM', '1:30PM', '5:30PM'] },
//       { day: '27/10/2025', timeSlots: ['8:30AM', '10:00AM', '2:00PM', '5:30PM', '7:00PM'] },
//       { day: '28/10/2025', timeSlots: ['8:30AM', '10:00AM', '2:00PM', '5:30PM', '7:00PM'] },
//       { day: '29/10/2025', timeSlots: ['10:00AM', '11:30AM', '1:00PM', '4:00PM', '6:30PM'] },
//     ],
//     patientsReviews: [
//       {
//         id: 1,
//         name: 'Hager Ibrahim',
//         imgSrc: '/patients/patient1.png',
//         rating: '4.6',
//         time: '2 days ago',
//         text: 'Dr. Nourhan was so patient with all my skin concerns. The products she recommended changed my routine completely. Highly recommended!',
//       },
//       {
//         id: 2,
//         name: 'Nada Youssef',
//         imgSrc: '/patients/patient1.png',
//         rating: '4.5',
//         time: '5 days ago',
//         text: 'Professional and kind. The laser treatment results were amazing after just two sessions.',
//       },
//     ],
//   },
// ];


// const doctorsSlice = createSlice({
//   name: 'doctors',
//   initialState,
//   reducers: {
//     toggleFavourite: (state, action: PayloadAction<string>) => {
//       const doctor = state.find(d => d.name === action.payload)
//       if (doctor) {
//         doctor.favourite = !doctor.favourite
//       }
//     },
//     addReview: (
//       state,
//       action: PayloadAction<{
//         doctorId: number
//         userId: number
//         name: string
//         imgSrc: string
//         rating: number
//         text: string
//       }>
//     ) => {
//       const { doctorId, name, imgSrc, rating, text } = action.payload
//       const doctor = state.find(d => d.id === doctorId)
//       if (doctor) {
//         const newReview = {
//           id: Date.now(),
//           name,
//           imgSrc,
//           rating: rating.toString(),
//           time: 'Just now',
//           text,
//         }
//         doctor.patientsReviews.unshift(newReview)
//         doctor.numberOfReviews += 1
//         const avg =
//           doctor.patientsReviews.reduce((sum, r) => sum + parseFloat(r.rating), 0) /
//           doctor.patientsReviews.length
//         doctor.rating = parseFloat(avg.toFixed(1))
//       }
//     },
//   },
// })

// export const { toggleFavourite, addReview } = doctorsSlice.actions
// export default doctorsSlice.reducer
