import SuccessIcon from '@/assets/icons/appointment-success.svg'
import { Button } from '@/components/ui/button'
import { useNavigate } from 'react-router-dom'

export default function PaymentSuccessModel({closeDialog, doctorName, doctorId, day, time}:
    {closeDialog: () => void, doctorName: string, doctorId: number, day: string | null, time: string}) {
    const navigate = useNavigate()

    return <div className='flex flex-col text-center items-center justify-center'>
        <img alt="sucess" src={SuccessIcon} />
        
        {/* Text */}
        <div className='flex flex-col gap-2 my-7'>
            <p className='font-medium'>Congratulations</p>
            <p className='text-neutral-700'>Your appointment with Dr. {doctorName} is confirmed for {day}, at {time}.</p>
        </div>
        
        <Button onClick={() => {
            closeDialog();
            navigate(`/doctor/${doctorId}`)
        }} className='rounded-2xl bg-black w-[70%]'>Done</Button>
        <Button variant='link' className='text-neutral-700' onClick={() => navigate('/booking')}>Edit your appointment</Button>
    </div>
}
