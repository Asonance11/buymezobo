import { useRouter } from 'next/navigation'
import { ClassAttributes, LegacyRef } from 'react'

interface Props extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
    children:React.ReactNode
    href:string
    className:string
    newref:LegacyRef<HTMLAnchorElement>
}

 
export default function MyLink({ children, href , className , newref}:Props) {
  const router = useRouter()
 
  const handleClick = (e:any) => {
    e.preventDefault()
    router.push(href)
  }
 
  return (
    <a href={href} onClick={handleClick} className={className} ref={newref}>
      {children}
    </a>
  )
}
 
