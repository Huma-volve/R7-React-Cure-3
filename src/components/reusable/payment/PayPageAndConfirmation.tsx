import { useState, type ReactNode } from "react";
import { useLocation, useNavigate } from "react-router-dom";
// Components
import { Card, CardContent, CardFooter, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import PaymentSuccessModel from "./PaymentSuccessModel";
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
// icons
import { FaCheckCircle, FaRegCircle, FaMoneyBillWave } from "react-icons/fa"
import VerifiedIcon from '@/assets/icons/verified.png'
import VisaIcon from '@/assets/icons/visa.svg'
import PaypalIcon from '@/assets/icons/paypal.svg'
import ApplePayIcon from '@/assets/icons/apple-pay.svg'
import CalenderIcon from '@/assets/icons/calender.png'
import LocationIcon from '@/assets/icons/location.png'
import moment from "moment";

type PaymentMethods = 'Paypal' | 'Credit card' | 'Apple pay' | 'Cash';

interface PaymentProps {
    id: number,
    name: PaymentMethods,
    icon: string | ReactNode
}

const paymentOptionsArray: PaymentProps[] = [
    {
        id: 0,
        name: 'Credit card',
        icon: VisaIcon
    },
    {
        id: 1,
        name: 'Paypal',
        icon: PaypalIcon
    },
    {
        id: 2,
        name: 'Apple pay',
        icon: ApplePayIcon
    },
    {
        id: 3,
        name: 'Cash',
        icon: <FaMoneyBillWave className="text-green-500" />
    },
]

export default function PaymentConfirmation() {
    const navigate = useNavigate()

    const [openDialog, setOpenDialog] = useState(false)
    const [confirmDialog, setConfirmDialog] = useState(false);
    const [loading, setLoading] = useState(false);

    const [paymentMethod, setPaymentMethod] = useState<PaymentMethods>('Credit card')

    // Taking the props that the path (doctors/id) gives
    const { state } = useLocation();
    const { day, timeSlot, month, doctor } = state || {};

    const handleConfirm = () => {
        setLoading(true);

        const timeoutId = setTimeout(() => {
            setLoading(false);
            setConfirmDialog(false);
            setOpenDialog(true);
        }, 1500);

        // Cleanup
        return () => clearTimeout(timeoutId);
    };

    return <Card className="bg-background md:w-[70%] lg:w-[50%] mx-auto border-none shadow-none">
        <CardTitle className="flex relative items-center gap-3 justify-center">
            <div className="relative">
                <img
                    src={doctor.doctor.user.profile_photo ?? '/avatar.PNG'}
                    className="h-28 w-28 rounded-full object-cover"
                    alt="Doctor Picture"
                />
                <img
                    className="absolute right-1.5 bottom-0.5"
                    src={VerifiedIcon}
                    alt="Verified Icon"
                />
          </div>
            <div className="flex flex-col font-normal gap-3">
                <h2 className="font-medium">{doctor.doctor.user.name}</h2>
                <p className="text-neutral-600">{doctor.doctor.specialty}</p>
                <div className="flex items-center gap-1">
                    <img src={LocationIcon} />
                    <p className="text-neutral-600">{doctor.doctor.clinic_address}</p>
                    <span>{moment('9/11/2024').format('dddd')}</span>
                </div>
            </div>
        </CardTitle>

        <div className="flex items-center justify-around">
            <div className="flex items-center gap-2">
                <img src={CalenderIcon} />
                <p className="hover:text-primary-600 transition duration-300 ease-in-out font-medium capitalize">{day} - {month.getMonth()} - {timeSlot}</p>
            </div>
            <Button variant='link' onClick={() => navigate(`/doctor/${doctor.doctor.id}`)}>Reschedule</Button>
        </div>

      {/* Payment Methods */}
        <CardContent>
            <h3 className="font-serif mb-3 text-lg">Payment Method</h3>
            <div className="grid gap-2">
                {paymentOptionsArray.map((option) => {
                    const isSelected = paymentMethod === option.name;
                    return (
                        <Button
                            variant='outline'
                            key={option.id}
                            onClick={() => setPaymentMethod(option.name)}
                            className={`flex items-center hover:bg-primary-50 hover:text-primary-500 cursor-pointer border-none justify-between rounded-md shadow-none transition-all duration-200 w-full
                            ${isSelected && "bg-green-100"}`}
                        >
                            {/* check icon + name */}
                            <div className="flex items-center gap-3">
                                {isSelected ? (
                                    <FaCheckCircle className={`${isSelected ? "text-green-500" : "text-gray-300"} text-lg`} />
                                ) : (
                                    <FaRegCircle className={`${isSelected ? "text-green-500" : "text-gray-300"} text-lg`} />
                                )}
                                <p className={`${isSelected && "text-green-500"}`}>{option.name}</p>
                            </div>

                            {/* payment icon */}
                            {typeof option.icon === "string" ?
                                ( <img src={option.icon} alt={option.name} className="h-6 w-6" /> ) :
                                (<i>{option.icon}</i>)
                            }
                        </Button>
                    );
                })}
            </div>

            <Button onClick={() => navigate('/profile-setting')} className="w-full border-dashed border-primary-500 text-primary-500 mt-3" variant='outline'>
                + Add new card
            </Button>
        </CardContent>

        <CardFooter className="flex flex-col gap-2">
            <div className="flex items-center w-full justify-between">
                <p>
                    <span className="font-semibold text-xl">Price</span>
                    <span className="text-neutral-600 text-sm">\hour</span>
                </p>
                <p className="text-red-500">
                    <span className=" text-xl font-semibold">
                        {doctor.doctor.session_price}
                    </span>
                    <span className="text-green-500">$</span>
                </p>
            </div>

            {/* CTA */}
            <Dialog open={confirmDialog} onOpenChange={setConfirmDialog}>
                <DialogTrigger className="w-full">
                    <Button className="w-full">Pay</Button>
                </DialogTrigger>
                <DialogContent>
                    <p>Are you sure you want to confirm this payment?</p>
                    <div className="flex justify-end gap-2 mt-4">
                        <Button variant="destructive" onClick={() => setConfirmDialog(false)}>
                            Cancel
                        </Button>
                        <Button
                            variant='outline'
                            className="text-primary-600 border-primary-600"
                            onClick={handleConfirm}
                            disabled={loading}
                        >
                            {loading ? (
                                <div className="flex items-center gap-2">
                                    <svg
                                        className="animate-spin h-4 w-4 text-black"
                                        xmlns="http://www.w3.org/2000/svg"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                    >
                                        <circle
                                        className="opacity-25"
                                        cx="12"
                                        cy="12"
                                        r="10"
                                        stroke="currentColor"
                                        strokeWidth="4"
                                        ></circle>
                                        <path
                                        className="opacity-75"
                                        fill="currentColor"
                                        d="M4 12a8 8 0 018-8v4l3-3-3-3v4a8 8 0 00-8 8z"
                                        ></path>
                                    </svg>
                                    Processing...
                                </div>
                            ) : (
                                "Yes, confirm"
                            )}
                        </Button>
                    </div>
                </DialogContent>
            </Dialog>
            <Dialog open={openDialog} onOpenChange={setOpenDialog}>
                <DialogContent
                    showCloseButton={false}
                    onInteractOutside={(e) => e.preventDefault()}
                    onEscapeKeyDown={(e) => e.preventDefault()}
                >
                    <PaymentSuccessModel
                        day={day!}
                        month={month}
                        time={timeSlot!}
                        doctorId={doctor.doctor.id}
                        doctorName={doctor.doctor.user.name}
                        closeDialog={() => setOpenDialog(false)}
                    />
                </DialogContent>
            </Dialog>
        </CardFooter>
    </Card>
}