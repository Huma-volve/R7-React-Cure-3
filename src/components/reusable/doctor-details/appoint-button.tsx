import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog"
import { useState } from "react";

export default function AppointmentButton() {
    const [openDialog, setOpenDialog] = useState(false);

    return (
        <Dialog open={openDialog} onOpenChange={setOpenDialog}>
            <DialogTrigger>
                <Button className="border-[#145DB8] text-[#145DB8] p-6 w-[123px] h-12" variant='outline'>
                    <span>Book</span>
                </Button>
            </DialogTrigger>

            <DialogContent>
                <div>
                    Hi Mr/Ms tester, I am still working on this 🙆‍♂️
                </div>
            </DialogContent>
        </Dialog>
    )
    
    // closeDialog={() => setOpenDialog(false)} 
}