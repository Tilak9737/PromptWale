import MaintenanceCheck from "@/components/ui/MaintenanceCheck";

export default function PublicLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <>
            <MaintenanceCheck />
            {children}
        </>
    );
}
