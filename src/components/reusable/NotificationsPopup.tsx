import { dummyNotifications } from "@/redux/notifications";
// Icons
import UpcomingNotificationIcon from '@/assets/icons/upcoming-notification.png';
import CompletedNotificationIcon from '@/assets/icons/completed-notification.png';
import CancelledNotificationIcon from '@/assets/icons/cancelled-notification.png';

export default function NotificationsPopup() {
  return (
    <>
        <h3 className="text-lg font-semibold text-center bg-neutral-50 py-3">Your Notifications</h3>

        {dummyNotifications.map((n) => (
            <div
                key={n.id}
                className="rounded-lg cursor-pointer border-border flex flex-col sm:flex-row sm:items-center sm:justify-between"
            >
                <div className={`flex items-center p-3 hover:bg-neutral-50 ${n.type === 'completed' && 'bg-neutral-50'} justify-between gap-4`}>
                    <div className='p-3 rounded-full'
                        style={{backgroundColor: n.color}}>
                        <img
                            src={
                                n.type === 'upcoming' ? UpcomingNotificationIcon :
                                n.type === 'completed' ? CompletedNotificationIcon :
                                CancelledNotificationIcon
                            }
                        />
                    </div>
                    <div className="flex flex-col gap-1">
                        <span className='capitalize font-medium'>
                            {n.type} Appointment
                        </span>
                        <p className="text-sm text-neutral-700">{n.text}</p>
                    </div>
                    <span className="text-xs text-neutral-700 whitespace-nowrap sm:ml-4 self-start sm:self-center">
                        {n.time}
                    </span>
                </div>
            </div>
        ))}
    </>
  )
}
