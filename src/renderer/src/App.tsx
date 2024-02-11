import { Button } from '@/components/ui/button'
import { PopoverDemo } from './components/custom/CardPopOver'

function App(): JSX.Element {
    //const ipcHandle = (): void => window.Electron.ipcRenderer.send('ping')

    return (
        <>
            <p className='text-black text-3xl font-bold underline flex flex-col space-y-3 items-center justify-center'>
                Hello world Bitches
                <Button>Hello world</Button>
                <PopoverDemo />
            </p>
        </>
    )
}

export default App
