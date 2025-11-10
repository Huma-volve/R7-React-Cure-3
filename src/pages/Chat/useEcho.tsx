// // import { useSelector } from "react-redux";
// // import { type RootState } from "@/redux/store";
// // import { useMemo } from "react";
// // import { createEcho } from "@/lib/echo";

// // export function useEcho() {
// //   const token = useSelector((state: RootState) => state.auth.token);

// //   const echo = useMemo(() => {
// //     if (!token) return null;
// //     return createEcho(token);
// //   }, [token]);

// //   return echo;
// // }
// // import Echo from "laravel-echo";
// // import Pusher from "pusher-js";

// // window.Pusher = Pusher;

// // console.log("🔑 Loaded Reverb key:", import.meta.env.VITE_REVERB_APP_KEY);

// // const echo = new Echo({
// //   broadcaster: "reverb",
// //   key: import.meta.env.VITE_REVERB_APP_KEY, // must not be undefined
// //   wsHost: import.meta.env.VITE_REVERB_HOST || "127.0.0.1",
// //   wsPort: Number(import.meta.env.VITE_REVERB_PORT) || 6001,
// //   forceTLS: false,
// //   disableStats: true,
// //   enabledTransports: ["ws", "wss"],
// // });

// // export default echo;
// import Echo from "laravel-echo";
// import Pusher from "pusher-js";

// declare global {
//   interface Window {
//     Pusher: any;
//   }
// }

// window.Pusher = Pusher;

// const echo = new Echo({
//   broadcaster: "reverb", // tells Echo to use Laravel Reverb
//   key: "cvrgkwh0byhzaogmffdv", // your app key
//   wsHost: import.meta.env.VITE_REVERB_HOST || "127.0.0.1",
//   wsPort: Number(import.meta.env.VITE_REVERB_PORT) || 6001,
//   forceTLS: false,
//   disableStats: true,
//   enabledTransports: ["ws", "wss"],
// });

// export default echo;
