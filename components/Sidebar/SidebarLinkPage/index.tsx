import { parse } from 'url';
import './style.css';
import Link from 'next/link'

interface SidebarLinkPageProps{
    title:string, 
    href: string,
    current?: boolean
}
export default function SidebarLinkPage({title, href, current=false}: SidebarLinkPageProps){
    return (
        <Link href={parse(href)}  className={'sidebar-lp '+ (current ? ' sidebar-lp-active': '')}>
            {title}
        </Link>
    );

}