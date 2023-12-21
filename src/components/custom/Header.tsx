import Link from "next/link";
import Menu from "./Hamburger";

export default function Header() {
    return (
        <header className="w-full p-3 bg-green-900 ">
            <main className="flex justify-between lg:w-2/3 mx-auto">
                <div>
                    <Link href="/" className="-tracking-widest font-bold">playground</Link>
                </div>
                <div>
                    <button className="underline">menu</button>
                </div>
            </main>
            <Menu />
        </header>
    )
}
