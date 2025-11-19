// Components
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import PaymentSuccessModel from "./PaymentSuccessModel";
import { Card, CardContent, CardFooter, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
// icons
import VerifiedIcon from '@/assets/icons/verified.png'
import VisaIcon from '@/assets/icons/visa.svg'
import PaypalIcon from '@/assets/icons/paypal.svg'
import StripeIcon from '@/assets/icons/stripe.png'
import CashIcon from '@/assets/icons/cash.png'
import CalenderIcon from '@/assets/icons/calender.png'
import LocationIcon from '@/assets/icons/location.png'
import { FaCheckCircle, FaRegCircle } from "react-icons/fa"
// hooks
import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useCreatePaymentIntent, type PaymentMethods } from "@/hooks/doctor-details/payment/useCreatePaymentIntent";
import { useConfirmPayment } from "@/hooks/doctor-details/payment/useConfirmPayment";
import { useBookAppointment } from "@/hooks/doctor-details/payment/useBookAppointment";
import CreditCardMockup from "@/components/profile-setting/payment/CreditCardMockup";
import { useDispatch, useSelector } from "react-redux";
import { removeCard, type SavedCard } from "@/redux/edit-profile/SaveCardsSlice";
import type { RootState } from "@/redux/store";
import {Pencil, Trash2 } from "lucide-react";

interface PaymentProps {
    id: number,
    name: PaymentMethods,
    icon: string
}

const paymentOptionsArray: PaymentProps[] = [
    {
        id: 0,
        name: 'paypal',
        icon: PaypalIcon
    },
    {
        id: 1,
        name: 'stripe',
        icon: StripeIcon
    },
    {
        id: 2,
        name: 'cash',
        icon: CashIcon
    },
]

export default function PaymentConfirmation() {
    document.title = 'Checkout';
    const navigate = useNavigate()
    const [transactionId, setTransactionId] = useState<string | null>(null);
    const [, setBookingId] = useState<number | null>(null);
    
    const [openDialog, setOpenDialog] = useState(false)
    const [confirmDialog, setConfirmDialog] = useState(false);
    const [openAddingCardDialog, setOpenAddingCardDialog] = useState(false);
    const [loading, setLoading] = useState(false);
    
    type SelectedPayment = PaymentMethods | string | null; 

    const [selectedPayment, setSelectedPayment] = useState<SelectedPayment>('paypal');
    const [selectedCardId, setSelectedCardId] = useState<string | null>(null); // ID of saved card
    const savedCards: SavedCard[] = useSelector((state: RootState) => state.saveCards.cards);
    const patientName = useSelector((state: RootState) => state.auth.user?.name);

    const [editingCard, setEditingCard] = useState<SavedCard | null>(null);
    const dispatch = useDispatch();
    
    const handleEditCard = (card: SavedCard) => {
        setEditingCard(card);
        setOpenAddingCardDialog(true);
    };
    // Taking the props that the path (doctors/id) gives
    const { state } = useLocation();
    const { day, timeSlot, doctor } = state || {};

    const { mutate: bookAppointment, error, isPending: isBookingPending, isSuccess } = useBookAppointment({
        onError: () => {
            toast.error("This date is already booked!");
            navigate(`/doctor/${doctor.doctor.id}`)
            setConfirmDialog(false)
        }
    });

    const { mutate: createPaymentIntent, isPending: isPaymentIntentPending } = useCreatePaymentIntent({
        onSuccess: (res) => {
            // Store the transaction ID for later use
            setTransactionId(res.data.transaction_id);
            setLoading(false);
            setConfirmDialog(true);

            // Get current stored array or empty array
            const storedPayments = JSON.parse(localStorage.getItem("payments") || "[]");

            // Add new payment with id and status
            const updatedPayments = [
                ...storedPayments,
                { bookingId: res.data.booking_id, status: res.data.status || "pending", doctorId: doctor.doctor.id, patientName: patientName, isReviewed: false },
            ];

            // Save updated array back to localStorage
            localStorage.setItem("payments", JSON.stringify(updatedPayments));
        },
        onError: () => {
            toast.error("Failed to create payment intent");
            setLoading(false);
        },
    });

    const { mutate: confirmPayment } = useConfirmPayment({
        onSuccess: (data) => {
            toast.success(data.message);
            setLoading(false);
            setConfirmDialog(false); 
            setOpenDialog(true);     
        },
        onError: () => {
            toast.error('Booking failed, You already have a booking at this day!');
            setLoading(false);
        },
    });

    const handleBook = () => {
        if (loading) return;
        setConfirmDialog(true)

        if(error) {
            setLoading(false)
            setConfirmDialog(false);
            return
        }
        if(isSuccess) {
            setConfirmDialog(true)
        }
    
        bookAppointment(
            {
                doctor_id: doctor.doctor.id,
                date_time: `${day} ${timeSlot}`,
                payment_method: selectedPayment,
                return_url: "https://app.example.com/paypal/return",
                cancel_url: "https://app.example.com/paypal/cancel",
            },
            {
                onSuccess: (res) => {
                    const newBookingId = res.data?.booking.id;
                    setBookingId(newBookingId);
                    
                    // Create payment intent after booking is successful
                    createPaymentIntent({
                        booking_id: newBookingId,
                        gateway: selectedPayment,
                        currency: "USD",
                        amount: doctor?.doctor?.session_price ?? 0,
                        description: `Booking #${newBookingId} with ${doctor.doctor.user.name}`,
                        return_url: "https://app.example.com/paypal/return",
                        cancel_url: "https://app.example.com/paypal/cancel",
                    });
                },
            }
        );
        
        const timeoutId = setTimeout(() => {
            setLoading(false);
            
        }, 3000);
        return () => clearTimeout(timeoutId);
    };

    const handleConfirmingBooking = () => {
        setLoading(true);
        confirmPayment(
            {
                gateway: selectedPayment,
                payment_id: transactionId!,
            },
        );
    };

    return <Card className="bg-background md:w-[70%] lg:w-[50%] mx-3 md:mx-auto border-none shadow-none">
        <CardTitle className="flex relative items-center gap-3 justify-center">
            <div className="relative">
                <img
                    src={doctor.doctor.user?.profile_photo ?? '/avatar.PNG'}
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
                    <img src={LocationIcon} alt="Location Icon" />
                    <p className="text-neutral-600">{doctor.doctor.clinic_address}</p>
                </div>
            </div>
        </CardTitle>

        <div className="flex items-center justify-around">
            <div className="flex items-center gap-2">
                <img alt="Calendar Icon" src={CalenderIcon} />
                <p className="hover:text-primary-600 transition duration-300 ease-in-out font-medium capitalize">{day} | {timeSlot}</p>
            </div>
            <Button variant='link' onClick={() => navigate(`/doctor/${doctor.doctor.id}`)}>Reschedule</Button>
        </div>

      {/* Payment Methods */}
        <CardContent>
            <h3 className="font-serif mb-3 text-lg">Payment Method</h3>
            <div className="grid gap-2">
                {paymentOptionsArray.map((option) => {
                    const isSelected = !selectedCardId && selectedPayment === option.name;
                    return (
                        <Button
                            key={option.id}
                            variant='outline'
                            onClick={() => {
                                setSelectedPayment(option.name)
                                setSelectedCardId(null);
                            }}

                            className={`flex items-center justify-between w-full ${isSelected ? "bg-green-100" : ""}`}
                        >
                            <div className="flex items-center gap-3">
                                {isSelected ? <FaCheckCircle className="text-green-500" /> : <FaRegCircle className="text-gray-300" />}
                                <p className="capitalize">{option.name}</p>
                            </div>
                            <img src={option.icon} alt={option.name} className="h-7 w-7" />
                        </Button>
                    );
                })}

                {savedCards.map(card => {
                    const isSelected = selectedCardId === card.id;
                    return (
                        <Button
                            key={card.id}
                            variant='outline'
                            
                            onClick={() => {
                                setSelectedCardId(card.id);
                                setSelectedPayment('stripe');
                            }}
                            className={`flex items-center justify-between w-full ${isSelected ? "bg-green-100" : ""}`}
                        >
                            <div className="flex items-center gap-3">
                                {isSelected ? <FaCheckCircle className="text-green-500" /> : <FaRegCircle className="text-gray-300" />}
                                <p className="text-xs sm:text-base">{card.cardName} <span className="text-neutral-500">•••• {card.last4}</span></p>
                            </div>

                            <div className="flex items-center gap-4">
                                <div className="flex items-center gap-1">
                                    <Button variant='outline' className="border-primary-700 text-primary-700" onClick={(e) => { e.stopPropagation(); handleEditCard(card); }} size="sm"><Pencil /></Button>
                                    <Button onClick={(e) => { e.stopPropagation(); dispatch(removeCard(card.id)); toast.success('Card deleted!') }} size="sm" variant="destructive"><Trash2 /></Button>
                                </div>
                                <img src={VisaIcon} className="w-7 h-7" />
                            </div>
                        </Button>
                    );
                })}
            </div>

            <Dialog open={openAddingCardDialog} onOpenChange={setOpenAddingCardDialog}>
                <DialogTrigger className="w-full">
                    <Button
                        variant="outline"
                        className="border-dashed border-primary-500 w-full text-primary-500 mt-3"
                        onClick={() => {
                            setEditingCard(null);
                            setOpenAddingCardDialog(true);
                        }}
                    >
                        + Add new card
                    </Button>
                </DialogTrigger>

                <DialogContent>
                    <CreditCardMockup
                        closeDialog={() => setOpenAddingCardDialog(false)}
                        editingCard={editingCard}
                    />
                </DialogContent>
            </Dialog>

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
                    <Button className="w-full" onClick={handleBook} disabled={loading}>
                        Pay
                    </Button>
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
                            onClick={handleConfirmingBooking}
                            disabled={!transactionId || loading}
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
                                isPaymentIntentPending || isBookingPending ? (
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
                                        Loading...
                                    </div>
                                ) : "Yes, confirm"
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