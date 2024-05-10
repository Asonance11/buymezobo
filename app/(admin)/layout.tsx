import Sidebar from "@/components/Sidebar/Sidebar";
import AdminHeader from "@/components/common/AdminHeader";

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <section className="min-h-dvh bg-pink-700 flex">
            <Sidebar />
            <main className="flex-1 min-h-dvh bg-zinc-100 flex flex-col">
                <AdminHeader />
                <section className="flex-1">
                    {children}
                </section>
            </main>
        </section>
    );
}
