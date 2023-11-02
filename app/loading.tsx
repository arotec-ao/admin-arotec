import '@/styles/pages/loading.css';

import Image from 'next/image';

export default function Loading(){
    return (<div className="loading-area">
       <div>
            <Image className='mg-bottom-20 block' src='/icons/logo-black.png' width='120' height='25' alt='' />
            <Image src="/gifs/loading.gif"  className="loading-icon" width="140" height="160" alt=""/>
            <h2 className='text-center'>Aguarde....</h2>
       </div>
    </div>)
}

