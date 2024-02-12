import { ActionButtonRow } from './components/ActionButtonRow'
import { Content, RootLayout, Sidebar } from './components/custom/AppLayout'

function App(): JSX.Element {
    //const ipcHandle = (): void => window.Electron.ipcRenderer.send('ping')

    return (
        <RootLayout className='bg-zinc-900 text-white'>
            <Sidebar className='p-2'>
                <ActionButtonRow className='flex items-center justify-end gap-3' />
            </Sidebar>
            <Content className='p-2 border-l bg-zinc-800/50 border-zinc-700/50'>Content</Content>
        </RootLayout>
    )
}

export default App
