import { createSlice, type PayloadAction } from '@reduxjs/toolkit'

interface PatientReview {
  id: number
  name: string
  imgSrc: string
  rating: string
  time: string
  text: string
}

export interface DoctorProps {
  id: number
  name: string
  specialization: string
  imgSrc: string
  location: string
  about: string
  patientsNum: number
  patientsReviews: PatientReview[]
  experience: number
  price: number
  favourite: boolean
  numberOfReviews: number
  rating: number
  hospital: string
  availability: {
    day: string
    timeSlots: string[]
  }[]
}

export const initialState: DoctorProps[] = [
  {
    id: 0,
    name: 'Mohamed Ahmed',
    specialization: 'Orthopedic',
    imgSrc: '/doctors/doctor1.png',
    about: 'Dr. Jessica Turner, a board-certified Pulmonologist with over 8 years of experience in diagnosing and treating complex respiratory conditions, is dedicated to helping patients improve their lung health through personalized care and advanced medical approaches.',
    location: '129, El-Nasr Street, Cairo',
    hospital: 'El-Nasr Hospital',
    patientsNum: 2000,
    experience: 10,
    rating: 4.5,
    numberOfReviews: 1872,
    price: 350,
    favourite: false,
    availability: [
      {
        day: '25/10/2025',
        timeSlots: ['9:00AM', '10:30AM', '1:00PM', '3:00PM', '5:30PM'],
      },
      {
        day: '26/10/2025',
        timeSlots: ['8:30AM', '11:00AM', '12:30PM', '2:00PM', '4:00PM', '7:00PM'],
      },
      {
        day: '27/10/2025',
        timeSlots: ['9:00AM', '10:00AM', '11:30AM', '1:30PM', '3:30PM', '6:00PM'],
      },
      {
        day: '28/10/2025',
        timeSlots: ['8:00AM', '9:30AM', '11:00AM', '12:30PM', '2:30PM', '4:30PM', '6:30PM'],
      },
      {
        day: '12/11/2025',
        timeSlots: ['10:00AM', '11:00AM', '1:00PM', '2:30PM', '5:00PM', '8:00PM'],
      },
    ],
    patientsReviews: [
      {
        id: 1,
        name: 'Nabila Reyna',
        imgSrc: '/patients/patient1.png',
        rating: '4.5',
        time: '30 min ago',
        text: 'Excellent service! Dr. Jessica Turner was attentive and thorough. The clinic was clean, and the staff were friendly. Highly recommend for in-person care!',
      },
      {
        id: 2,
        name: 'Ahmed',
        imgSrc: '/patients/patient2.png',
        rating: '4.5',
        time: '30 min ago',
        text: 'Quick and easy appointment! Dr. Jessica Turner was professional, and the staff made me feel comfortable. Highly recommend!"',
      },
    ],
  },
  {
    id: 1,
    name: 'Jessica Turner',
    specialization: 'Pulmonologist',
    imgSrc: '/doctors/doctor1.png',
    about: 'Dr. Jessica Turner, a board-certified Pulmonologist...',
    location: '129, El-Nasr Street, Cairo',
    hospital: 'El-Nasr Hospital',
    patientsNum: 2000,
    experience: 10,
    rating: 4.5,
    numberOfReviews: 1872,
    price: 350,
    favourite: true,
    availability: [
      {
        day: '25/10/2025',
        timeSlots: ['9:00AM', '10:30AM', '1:00PM', '3:00PM', '5:30PM'],
      },
      {
        day: '26/10/2025',
        timeSlots: ['8:30AM', '11:00AM', '12:30PM', '2:00PM', '4:00PM', '7:00PM'],
      },
      {
        day: '27/10/2025',
        timeSlots: ['9:00AM', '10:00AM', '11:30AM', '1:30PM', '3:30PM', '6:00PM'],
      },
      {
        day: '28/10/2025',
        timeSlots: ['8:00AM', '9:30AM', '11:00AM', '12:30PM', '2:30PM', '4:30PM', '6:30PM'],
      },
      {
        day: '12/11/2025',
        timeSlots: ['10:00AM', '11:00AM', '1:00PM', '2:30PM', '5:00PM', '8:00PM'],
      },
    ],
    patientsReviews: [
      {
        id: 1,
        name: 'Nabila Reyna',
        imgSrc: '/patients/patient1.png',
        rating: '4.5',
        time: '30 min ago',
        text: 'Excellent service! Dr. Jessica Turner was attentive and thorough. The clinic was clean, and the staff were friendly. Highly recommend for in-person care!',
      },
      {
        id: 2,
        name: 'Ahmed',
        imgSrc: '/patients/patient2.png',
        rating: '4.5',
        time: '30 min ago',
        text: 'Quick and easy appointment! Dr. Jessica Turner was professional, and the staff made me feel comfortable. Highly recommend!"',
      },
    ],
  },
  {
    id: 2,
    name: 'Mohamed',
    specialization: 'Pulmonologist',
    imgSrc: '/doctors/doctor1.png',
    about: 'Dr. Jessica Turner, a board-certified Pulmonologist with over 8 years of experience...',
    location: '129, El-Nasr Street, Cairo',
    hospital: 'Misr International Hospital',
    patientsNum: 2000,
    experience: 10,
    rating: 4.5,
    numberOfReviews: 1872,
    price: 350,
    favourite: false,
    availability: [
      {
        day: '25/10/2025',
        timeSlots: ['9:00AM', '10:30AM', '1:00PM', '3:00PM', '5:30PM'],
      },
      {
        day: '26/10/2025',
        timeSlots: ['8:30AM', '11:00AM', '12:30PM', '2:00PM', '4:00PM', '7:00PM'],
      },
      {
        day: '27/10/2025',
        timeSlots: ['9:00AM', '10:00AM', '11:30AM', '1:30PM', '3:30PM', '6:00PM'],
      },
      {
        day: '28/10/2025',
        timeSlots: ['8:00AM', '9:30AM', '11:00AM', '12:30PM', '2:30PM', '4:30PM', '6:30PM'],
      },
      {
        day: '12/11/2025',
        timeSlots: ['10:00AM', '11:00AM', '1:00PM', '2:30PM', '5:00PM', '8:00PM'],
      },
    ],
    patientsReviews: [
      {
        id: 1,
        name: 'Nabila Reyna',
        imgSrc: '/patients/patient1.png',
        rating: '4.5',
        time: '30 min ago',
        text: 'Excellent service! Dr. Jessica Turner was attentive and thorough. The clinic was clean, and the staff were friendly. Highly recommend for in-person care!',
      },
      {
        id: 2,
        name: 'Ahmed',
        imgSrc: '/patients/patient2.png',
        rating: '4.5',
        time: '30 min ago',
        text: 'Quick and easy appointment! Dr. Jessica Turner was professional, and the staff made me feel comfortable. Highly recommend!"',
      },
    ],
  },
  {
    id: 3,
    name: 'Jessica Turner',
    specialization: 'Pulmonologist',
    imgSrc: '/doctors/doctor1.png',
    about: 'Dr. Jessica Turner, a board-certified Pulmonologist...',
    location: '129, El-Nasr Street, Cairo',
    hospital: 'Cairo University Hospital',
    patientsNum: 2000,
    experience: 10,
    rating: 4.5,
    numberOfReviews: 1872,
    price: 350,
    favourite: true,
    availability: [
      {
        day: '25/10/2025',
        timeSlots: ['9:00AM', '10:30AM', '1:00PM', '3:00PM', '5:30PM'],
      },
      {
        day: '26/10/2025',
        timeSlots: ['8:30AM', '11:00AM', '12:30PM', '2:00PM', '4:00PM', '7:00PM'],
      },
      {
        day: '27/10/2025',
        timeSlots: ['9:00AM', '10:00AM', '11:30AM', '1:30PM', '3:30PM', '6:00PM'],
      },
      {
        day: '28/10/2025',
        timeSlots: ['8:00AM', '9:30AM', '11:00AM', '12:30PM', '2:30PM', '4:30PM', '6:30PM'],
      },
      {
        day: '12/11/2025',
        timeSlots: ['10:00AM', '11:00AM', '1:00PM', '2:30PM', '5:00PM', '8:00PM'],
      },
    ],
    patientsReviews: [
      {
        id: 1,
        name: 'Nabila Reyna',
        imgSrc: '/patients/patient1.png',
        rating: '4.5',
        time: '30 min ago',
        text: 'Excellent service! Dr. Jessica Turner was attentive and thorough. The clinic was clean, and the staff were friendly. Highly recommend for in-person care!',
      },
      {
        id: 2,
        name: 'Ahmed',
        imgSrc: '/patients/patient2.png',
        rating: '4.5',
        time: '30 min ago',
        text: 'Quick and easy appointment! Dr. Jessica Turner was professional, and the staff made me feel comfortable. Highly recommend!"',
      },
    ],
  },
  {
    id: 4,
    name: 'Mohamed',
    specialization: 'Pulmonologist',
    imgSrc: '/doctors/doctor1.png',
    about: 'Dr. Jessica Turner, a board-certified Pulmonologist with over 8 years of experience...',
    location: '129, El-Nasr Street, Cairo',
    hospital: 'Nasr City Hospital',
    patientsNum: 2000,
    experience: 10,
    rating: 4.5,
    numberOfReviews: 1872,
    price: 350,
    favourite: false,
    availability: [
      {
        day: '25/10/2025',
        timeSlots: ['9:00AM', '10:30AM', '1:00PM', '3:00PM', '5:30PM'],
      },
      {
        day: '26/10/2025',
        timeSlots: ['8:30AM', '11:00AM', '12:30PM', '2:00PM', '4:00PM', '7:00PM'],
      },
      {
        day: '27/10/2025',
        timeSlots: ['9:00AM', '10:00AM', '11:30AM', '1:30PM', '3:30PM', '6:00PM'],
      },
      {
        day: '28/10/2025',
        timeSlots: ['8:00AM', '9:30AM', '11:00AM', '12:30PM', '2:30PM', '4:30PM', '6:30PM'],
      },
      {
        day: '12/11/2025',
        timeSlots: ['10:00AM', '11:00AM', '1:00PM', '2:30PM', '5:00PM', '8:00PM'],
      },
    ],
    patientsReviews: [
      {
        id: 1,
        name: 'Nabila Reyna',
        imgSrc: '/patients/patient1.png',
        rating: '4.5',
        time: '30 min ago',
        text: 'Excellent service! Dr. Jessica Turner was attentive and thorough. The clinic was clean, and the staff were friendly. Highly recommend for in-person care!',
      },
      {
        id: 2,
        name: 'Ahmed',
        imgSrc: '/patients/patient2.png',
        rating: '4.5',
        time: '30 min ago',
        text: 'Quick and easy appointment! Dr. Jessica Turner was professional, and the staff made me feel comfortable. Highly recommend!"',
      },
    ],
  },
  {
    id: 5,
    name: 'Jessica Turner',
    specialization: 'Pulmonologist',
    imgSrc: '/doctors/doctor1.png',
    about: 'Dr. Jessica Turner, a board-certified Pulmonologist...',
    location: '129, El-Nasr Street, Cairo',
    hospital: 'Dar El Fouad Hospital',
    patientsNum: 2000,
    experience: 10,
    rating: 4.5,
    numberOfReviews: 1872,
    price: 350,
    favourite: true,
    availability: [
      {
        day: '25/10/2025',
        timeSlots: ['9:00AM', '10:30AM', '1:00PM', '3:00PM', '5:30PM'],
      },
      {
        day: '26/10/2025',
        timeSlots: ['8:30AM', '11:00AM', '12:30PM', '2:00PM', '4:00PM', '7:00PM'],
      },
      {
        day: '27/10/2025',
        timeSlots: ['9:00AM', '10:00AM', '11:30AM', '1:30PM', '3:30PM', '6:00PM'],
      },
      {
        day: '28/10/2025',
        timeSlots: ['8:00AM', '9:30AM', '11:00AM', '12:30PM', '2:30PM', '4:30PM', '6:30PM'],
      },
      {
        day: '12/11/2025',
        timeSlots: ['10:00AM', '11:00AM', '1:00PM', '2:30PM', '5:00PM', '8:00PM'],
      },
    ],
    patientsReviews: [
      {
        id: 1,
        name: 'Nabila Reyna',
        imgSrc: '/patients/patient1.png',
        rating: '4.5',
        time: '30 min ago',
        text: 'Excellent service! Dr. Jessica Turner was attentive and thorough. The clinic was clean, and the staff were friendly. Highly recommend for in-person care!',
      },
      {
        id: 2,
        name: 'Ahmed',
        imgSrc: '/patients/patient2.png',
        rating: '4.5',
        time: '30 min ago',
        text: 'Quick and easy appointment! Dr. Jessica Turner was professional, and the staff made me feel comfortable. Highly recommend!"',
      },
    ],
  },
  {
    id: 6,
    name: 'Jessica Turner',
    specialization: 'Pulmonologist',
    imgSrc: '/doctors/doctor1.png',
    about: 'Dr. Jessica Turner, a board-certified Pulmonologist...',
    location: '129, El-Nasr Street, Cairo',
    hospital: 'Dar El Fouad Hospital',
    patientsNum: 2000,
    experience: 10,
    rating: 4.5,
    numberOfReviews: 1872,
    price: 350,
    favourite: true,
    availability: [
      {
        day: '25/10/2025',
        timeSlots: ['9:00AM', '10:30AM', '1:00PM', '3:00PM', '5:30PM'],
      },
      {
        day: '26/10/2025',
        timeSlots: ['8:30AM', '11:00AM', '12:30PM', '2:00PM', '4:00PM', '7:00PM'],
      },
      {
        day: '27/10/2025',
        timeSlots: ['9:00AM', '10:00AM', '11:30AM', '1:30PM', '3:30PM', '6:00PM'],
      },
      {
        day: '28/10/2025',
        timeSlots: ['8:00AM', '9:30AM', '11:00AM', '12:30PM', '2:30PM', '4:30PM', '6:30PM'],
      },
      {
        day: '12/11/2025',
        timeSlots: ['10:00AM', '11:00AM', '1:00PM', '2:30PM', '5:00PM', '8:00PM'],
      },
    ],
    patientsReviews: [
      {
        id: 1,
        name: 'Nabila Reyna',
        imgSrc: '/patients/patient1.png',
        rating: '4.5',
        time: '30 min ago',
        text: 'Excellent service! Dr. Jessica Turner was attentive and thorough. The clinic was clean, and the staff were friendly. Highly recommend for in-person care!',
      },
      {
        id: 2,
        name: 'Ahmed',
        imgSrc: '/patients/patient2.png',
        rating: '4.5',
        time: '30 min ago',
        text: 'Quick and easy appointment! Dr. Jessica Turner was professional, and the staff made me feel comfortable. Highly recommend!"',
      },
    ],
  },
]

const doctorsSlice = createSlice({
  name: 'doctors',
  initialState,
  reducers: {
    toggleFavourite: (state, action: PayloadAction<string>) => {
      const doctor = state.find(d => d.name === action.payload)
      if (doctor) {
        doctor.favourite = !doctor.favourite
      }
    },
    addReview: (
      state,
      action: PayloadAction<{
        doctorId: number
        userId: number
        name: string
        imgSrc: string
        rating: number
        text: string
      }>
    ) => {
      const { doctorId, name, imgSrc, rating, text } = action.payload
      const doctor = state.find(d => d.id === doctorId)
      if (doctor) {
        const newReview = {
          id: Date.now(),
          name,
          imgSrc,
          rating: rating.toString(),
          time: 'Just now',
          text,
        }
        doctor.patientsReviews.unshift(newReview)
        doctor.numberOfReviews += 1
        const avg =
          doctor.patientsReviews.reduce((sum, r) => sum + parseFloat(r.rating), 0) /
          doctor.patientsReviews.length
        doctor.rating = parseFloat(avg.toFixed(1))
      }
    },
  },
})

export const { toggleFavourite, addReview } = doctorsSlice.actions
export default doctorsSlice.reducer
