import Image from 'next/image';

interface ModalHeaderProps{
    children?: React.ReactNode, 
    title:string, 
    onClose?:Function
}

export default function ModalHeader({children='', title, onClose=()=>{}}:ModalHeaderProps){
   
    return (
        <div className='modal-header'>
            {children}
              
            <div className='modal-header-title'>{title}</div>

            <button className='modal-btn-close' onClick={()=>{onClose()}}>
                <Image src='/icons/x.png' width='15' height='15' alt=''/>
            </button>
          
        </div>
    );
}