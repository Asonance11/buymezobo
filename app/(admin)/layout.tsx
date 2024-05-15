import Sidebar from '@/components/Sidebar/Sidebar';
import AdminHeader from '@/components/common/AdminHeader';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
	return (
		<section className="max-h-screen bg-black flex">
			<Sidebar />
			<main className="flex-1 min-h-dvh bg-zinc-100 flex flex-col">
				<AdminHeader />
				<section className="flex-1 max-h-screen overflow-y-scroll scrollbar-hide">{children}</section>
			</main>
		</section>
	);
}
