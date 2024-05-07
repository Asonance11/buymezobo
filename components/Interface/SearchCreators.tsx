import {
    CommandDialog,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from "@/components/ui/command"
import { useInterface } from "@/store/InterfaceStore"
import { Profile } from "@prisma/client"
import { useEffect, useState } from "react"
import { debounce } from "lodash"
import axios from "axios"


export function SearchCreatorMenu() {
    const { type, onOpen, onClose, isOpen } = useInterface()

    const [creators, setCreators] = useState<Profile[]>([])

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

    const [loading, setLoading] = useState(false)

    const debouncedSearchCreator = debounce(async (username: string) => {
        try {
            setLoading(true);

            if (username.length == 0) {
                setCreators([])
                return
            }

            const response = await axios.get(`/api/creators?creator=${username}`);
            const data = await response.data;

            console.log(data)
            if (data.creators) {
                setLoading(false);
                setCreators(data.creators)

            } else {
                setLoading(false);
                setCreators([])
            }
        } catch (error) {
            setLoading(false);
            setCreators([])
        }
    }, 700);



    const handleCreatorSearch = (event: any) => {
        event.preventDefault();
        const username = event.target.value;
        console.log(username)
        debouncedSearchCreator(username)
    };


    return (
        <CommandDialog open={open} onOpenChange={onClose}>
            <CommandInput onChangeCapture={handleCreatorSearch} placeholder="Search your favourite Creators..." />
            <CommandList>
                {
                    creators.length > 0 ? (
                        creators.map((creator) => (
                            <div key={creator.id} >{creator.userName}</div>
                        ))
                    ) : (
                        <CommandEmpty>No results found.</CommandEmpty>
                    )
                }
            </CommandList>
        </CommandDialog >
    )
}
