import './style.css';
import Image from 'next/image';
import { redirect } from 'next/navigation';
import { logoutAction } from '@/app/actions';

interface MainContentHeaderProps {
    title:string, 
    onToogleShowSidebar:Function
}

export default function MainContentHeader({title, onToogleShowSidebar}:MainContentHeaderProps){
    return (
        <div className='mc-header'>
            
            <button  className='btn-collapse-sidebar' onClick={()=>{onToogleShowSidebar(true)}}>
                    <Image src='/icons/menu.png'  alt='' height='20' width='20' />
            </button>
            <div className='mc-header-title'>{title}</div>
            <div className='mc-header-right'>
                <form action={logoutAction}>
                    <button type='submit' className='mc-header-btn-exit'>
                        <Image src='/icons/exit.png' className='mc-header-image-exit' alt='' height='15' width='15' />
                    </button>
                </form>
            </div>
        </div>
    );
}

