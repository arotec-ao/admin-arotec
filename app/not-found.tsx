import '@/styles/pages/404.css';

import Image from 'next/image';

export default function notFound(){
    return (
        <div className='main'>
            <div className='main-content'>
                <Image className='main-logo' src='/icons/logo-black.png' width='120' height='25' alt='' />
                <div className='nf-title'>404 Error</div>
                <div className='nf-description'>A página não foi encontrada!</div>
            </div>  
        </div>
    );
}