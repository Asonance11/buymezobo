import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet"
import { useInterface } from "@/store/InterfaceStore"
import { IoMdSearch } from "react-icons/io";
import SideBarCard from "./SideBarCard";

export function SideMenuNavigationComponent() {
    const { onOpen, type, isOpen, onClose } = useInterface()
    const open = type == "sideMenuNavigation" && isOpen

    const openMenu = () => {
        onOpen("searchCreators")
    }
    return (
        <Sheet open={open} onOpenChange={onClose} >
            <SheetContent side={"left"} className="overflow-y-auto px-3 py-0">
                <SheetHeader>
                    <SheetTitle></SheetTitle>
                </SheetHeader>
                <aside className="flex flex-col w-full h-screen px-0 py-4 overflow-y-auto bg-white dark:bg-gray-900 ">
                    <a href="#">
                        <p>BuyMeZobo</p>
                    </a>

                    <div className="flex flex-col justify-between flex-1 mt-6">
                        <nav className="flex-1 space-y-3 ">
                            {/*
                            */}
                            <div onClick={openMenu} className='flex gap-1 items-center justify-start p-2 rounded-lg bg-zinc-100 '>
                                <IoMdSearch className="text-xl" />
                                <input onClick={openMenu} type='text' placeholder='Search Creators' className='focus:outline-none flex-1 bg-transparent text-sm font-semibold placeholder-zinc-700' />
                            </div>

                            <a className="flex items-center px-3 py-2 text-gray-600 transition-colors duration-300 transform rounded-lg dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 dark:hover:text-gray-200 hover:text-gray-700" href="#">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" className="w-5 h-5">
                                    <path stroke-linecap="round" stroke-linejoin="round" d="M3.75 3v11.25A2.25 2.25 0 006 16.5h2.25M3.75 3h-1.5m1.5 0h16.5m0 0h1.5m-1.5 0v11.25A2.25 2.25 0 0118 16.5h-2.25m-7.5 0h7.5m-7.5 0l-1 3m8.5-3l1 3m0 0l.5 1.5m-.5-1.5h-9.5m0 0l-.5 1.5m.75-9l3-3 2.148 2.148A12.061 12.061 0 0116.5 7.605" />
                                </svg>

                                <span className="mx-2 text-sm font-medium">Dashboard</span>
                            </a>

                        </nav>
                    </div>
                </aside>
            </SheetContent>
        </Sheet>

    )
}
