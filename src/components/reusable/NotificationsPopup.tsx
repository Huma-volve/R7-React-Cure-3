import { useState } from 'react';
import { useNotifications } from "@/hooks/doctor-details/useNotifications";
import type { RootState } from '@/redux/store';
import { useSelector } from 'react-redux';
// Icons
import UpcomingNotificationIcon from '@/assets/icons/upcoming-notification.png';
import CompletedNotificationIcon from '@/assets/icons/completed-notification.png';
import CancelledNotificationIcon from '@/assets/icons/cancelled-notification.png';
import ChatNotificationIcon from '@/assets/icons/chat-notification.svg';
import SystemNotificationIcon from '@/assets/icons/system-notification.svg';
import moment from 'moment';
import { Button } from '../ui/button';

export default function NotificationsPopup() {
    const [currentPage, setCurrentPage] = useState(1);
    const patientId = useSelector((state: RootState) => state.auth.user?.id);
    const { data: notifications, isLoading, isError } = useNotifications(patientId);

    if (isLoading) return (
        <div className="flex items-center justify-center p-8">
            <div className="text-center">
                <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500 mb-2"></div>
                <p className="text-neutral-600">Loading notifications...</p>
            </div>
        </div>
    );
    
    if (isError) return (
        <div className="flex items-center justify-center p-8">
            <div className="text-center">
                <div className="text-destructive text-4xl mb-2">⚠️</div>
                <p className="text-destructive font-medium">Failed to load notifications</p>
                <p className="text-neutral-500 text-sm mt-1">Please try again later</p>
            </div>
        </div>
    );

    // Pagination logic
    const itemsPerPage = 4;
    const totalPages = Math.ceil(notifications!.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const currentNotifications = notifications!.slice(startIndex, endIndex);

    const handlePrevious = () => {
        setCurrentPage(prev => Math.max(prev - 1, 1));
    };

    const handleNext = () => {
        setCurrentPage(prev => Math.min(prev + 1, totalPages));
    };

    const handlePageClick = (page: number) => {
        setCurrentPage(page);
    };

    return (
        <div className='max-w-[280px] sm:max-w-md lg:max-w-lg bg-background'>
            <h3 className="text-lg font-semibold text-center bg-neutral-50 py-3">Your Notifications</h3>
            <ul>
                {currentNotifications.map((notif) => {
                    return (
                        <li key={notif.id} className={`flex items-center p-3 hover:bg-neutral-50 justify-between gap-4`}>
                            <div className={`p-3 rounded-full ${
                                notif.type === 'booking' ? 'bg-blue-50' :
                                notif.type === 'payment' ? 'bg-green-50' :
                                notif.type === 'system' ? 'bg-yellow-50' :
                                notif.type === 'chat' ? 'bg-purple-50' :
                                'bg-red-50'
                            }`}>
                                <img
                                    src={
                                        notif.type === 'booking' ? UpcomingNotificationIcon :
                                        notif.type === 'chat' ? ChatNotificationIcon :
                                        notif.type === 'system' ? SystemNotificationIcon :
                                        notif.type === 'payment' || notif.type === 'review' ? CompletedNotificationIcon :
                                        CancelledNotificationIcon
                                    }
                                />
                            </div>
                            <div>
                                <strong className="font-medium text-base">{notif.title}</strong>
                                <p className="text-sm text-neutral-700">
                                    {notif.body}
                                </p>
                            </div>
                            <span className="text-xs">{moment(notif.created_at).startOf('day').fromNow()}</span>
                        </li>
                    );
                })}
            </ul>

            {/* Pagination Controls */}
            {totalPages > 1 && (
                <div className="flex items-center justify-center gap-2 p-4 border-t">
                    <Button
                        variant='ghost'
                        className='border hover:text-primary-700 hover:bg-background text-primary-500'
                        onClick={handlePrevious}
                        disabled={currentPage === 1}
                    >
                        Previous
                    </Button>
                    
                    <div className="flex gap-1">
                        {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                            <Button
                                variant='ghost'
                                key={page}
                                onClick={() => handlePageClick(page)}
                                className={`px-3 py-1 rounded ${
                                    currentPage === page
                                        ? 'bg-primary-500 text-white'
                                        : 'border hover:bg-neutral-50'
                                }`}
                            >
                                {page}
                            </Button>
                        ))}
                    </div>

                    <Button
                        variant='ghost'
                        className='border hover:text-primary-700 hover:bg-background text-primary-500'
                        onClick={handleNext}
                        disabled={currentPage === totalPages}
                    >
                        Next
                    </Button>
                </div>
            )}
        </div>
    );
}