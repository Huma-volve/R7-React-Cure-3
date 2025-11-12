// #region

// import { useQuery } from "@tanstack/react-query";
// import api from "@/lib/axios";
// import { useSelector } from "react-redux";

// import { type RootState } from "@/redux/store";
// export const useReviews = (doctorId: number) => {
  //     const token = useSelector((state: RootState) => state.auth.token);
  //     return useQuery({
    //         queryKey: ["reviews", doctorId],
    //         queryFn: async () => {
      //             const response = await api.get("/reviews", {
        //                 headers: {
          //                     Authorization: `Bearer ${token}`,
          //                 },
//             });
//             const reviews = response.data.data.reviews;

//             return reviews.filter((review) => review.doctor_id === doctorId);
//         },
//         enabled: !!doctorId,
//     });
// };

// const response = await api.post("/reviews", { text: "Great doctor!" }, {
  //     headers: {
    //         Authorization: `Bearer ${token}`,
    //     },
    // })
    
    // // abdallah13@gmail.com
    // // Ab@123456789
    
    // const response = await api.post("/reviews", { text: "Great doctor!" }, {
      //     headers: {
        //         Authorization: `Bearer ${token}`,
        //     },
        // })git 
        
        // // abdallah13@gmail.com
        // // Ab@123456789
// #endregion
        
import { useMutation } from "@tanstack/react-query";
import api from "@/lib/axios";
import { useSelector } from "react-redux";
import { type RootState } from "@/redux/store";

export const useAddReview = () => {
  const token = useSelector((state: RootState) => state.auth.token);

  return useMutation({
    mutationFn: async (newReview: { doctor_id: number; booking_id: number; patient_id: number | undefined; rating: number; comment: string }) => {
      console.log("Sending review:", newReview);
      console.log("Token:", token); // Add this
      const response = await api.post("/reviews", newReview, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    },
  });
};

// {
//   "booking_id": 1,
//   "patient_id": 10,
//   "doctor_id": 4,
//   "rating": 5,
//   "comment": "good review"
// }