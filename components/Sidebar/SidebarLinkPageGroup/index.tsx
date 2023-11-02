import './style.css'
import Image from 'next/image'

interface SidebarLinkPageGroupProps
{
    title:string, 
    children: React.ReactNode
}

export default function SidebarLinkPageGroup({title, children}:SidebarLinkPageGroupProps){
    return (
        <div className='sidebar-lp-group'>
            <div className='sidebar-lp-group-button'>
                {title}
                <Image  className='sidebar-lp-group-arrow' src='/icons/arrow-down.png' alt='' width='16' height='16' />
            </div>
            <div className='sidebar-lp-group-options'>
                {children}
            </div>
        </div>
    );    
}