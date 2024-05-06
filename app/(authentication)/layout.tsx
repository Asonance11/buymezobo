import bg from "/public/images/authbg.svg"

export default function ClerkLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <section className="min-h-dvh bg-red-300 ">
            {children}
        </section>
    );
}
