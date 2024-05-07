import {
    CommandDialog,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from "@/components/ui/command"
import { useInterface } from "@/store/InterfaceStore"
import { useEffect } from "react"


export function SearchCreatorMenu() {
    const { type, onOpen, onClose, isOpen } = useInterface()

    const open = type === "searchCreators" && isOpen

    useEffect(() => {
        const down = (e: KeyboardEvent) => {
            if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
                e.preventDefault()
                onOpen("searchCreators")
            }
        }
        document.addEventListener("keydown", down)
        return () => document.removeEventListener("keydown", down)
    }, [])

    return (
        <CommandDialog open={open} onOpenChange={onClose}>
            <CommandInput placeholder="Search your favourite Creators..." />
            <CommandList>
                <CommandEmpty>No results found.</CommandEmpty>
                <CommandGroup heading="Suggestions">
                    <CommandItem>Calendar</CommandItem>
                    <CommandItem>Search Emoji</CommandItem>
                    <CommandItem>Calculator</CommandItem>
                </CommandGroup>
            </CommandList>
        </CommandDialog>
    )
}
