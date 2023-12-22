import { useRouter } from 'next/navigation'

interface Props {
    children:React.ReactNode
    href:string
    className:string
}
 
export default function MyLink({ children, href , className }:Props) {
  const router = useRouter()
 
  const handleClick = (e:any) => {
    e.preventDefault()
    router.push(href)
  }
 
  return (
    <a href={href} onClick={handleClick} className={className}>
      {children}
    </a>
  )
}
 
