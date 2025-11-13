export function DoctorStats({
    icon,
    amount,
    label,
}: {
    icon: string;
    amount: number | string;
    label: string;
}) {

    return (
        <div className="flex flex-col items-center justify-center gap-1 w-20 text-center">
            <span className="bg-background rounded-full p-3">
                <img src={icon} alt={`${label} Icon`} className="w-6 h-6 object-contain" />
            </span>
            <span className="font-semibold">{amount}</span>
            <span className="text-sm text-muted-foreground">{label}</span>
        </div>
    );
}
