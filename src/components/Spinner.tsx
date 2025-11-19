// export default function Spinner() {
//   return (
//     <div className="flex items-center justify-center w-full h-full py-10">
//       <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-blue-600"></div>
//     </div>
//   );
// }
import { Loader2 } from "lucide-react";

export default function Spinner() {
  return (
    <div className="flex items-center justify-center w-full h-full py-10">
      <Loader2 className="animate-spin text-blue-600" size={40} />
    </div>
  );
}
