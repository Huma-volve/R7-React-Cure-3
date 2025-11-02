interface NotificationProps {
  id: number
  type: 'upcoming' | 'completed' | 'cancelled'
  text: string
  time: string
  color: string
}

export const dummyNotifications: NotificationProps[] = [
    {
        id: 0,
        type: 'upcoming',
        text: 'Reminder: You have an appointment with...',
        time: '1h',
        color: '#E8EFF8'
    },
    {
        id: 1,
        type: 'completed',
        text: 'You have successfully booked your appointment with Dr. Emily Walker.',
        time: '3h',
        color: '#EDF7EE'
    },
    {
        id: 2,
        type: 'cancelled',
        text: 'You have successfully cancelled your appointment with Dr. David Patel.',
        time: '4h',
        color: '#FFEDED'
    },
    {
        id: 3,
        type: 'upcoming',
        text: 'Reminder: You have an appointment with...',
        time: '1d',
        color: '#E8EFF8'
    },
]
