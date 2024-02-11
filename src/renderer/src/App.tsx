import { Content, RootLayout, Sidebar } from './components/custom/AppLayout'

function App(): JSX.Element {
    //const ipcHandle = (): void => window.Electron.ipcRenderer.send('ping')

    return (
        <RootLayout>
            <Sidebar className='p-2 border-4 border-red-700'>Sidebar</Sidebar>
            <Content className='border-4 border-blue-800'>Content</Content>
        </RootLayout>
    )
}

export default App
