'use client'
import './style.css';

import Image from 'next/image';
import {useRef} from 'react';

import { ToastType } from './Type';



interface ToastProps{
    type: ToastType, 
    message: string,
    autoplay?: boolean 
}

export default function Toast({type=ToastType.Info, message, autoplay=false}:ToastProps){
    const [color_toast, icon_toast, title_toast] = getColorAndIcon(type);
    
    const delayCloseToast =  ()=>{
        setTimeout(()=>{
            if(toastRef.current){
                toastRef.current.classList.remove('toast-open');      
            }
        }, 2500)   
    }

    const toastRef = useRef<HTMLDivElement>(null);

   delayCloseToast();


 
   return (
     <div className={'toast '+  color_toast + (autoplay? ' toast-open ': ' ')} ref={toastRef}>
        <div className='toast-mark'></div>
        <div className='toast-icon'>
            <Image src={icon_toast} width='15' height='15' alt='' />
        </div>
        <div className='toast-main'>
            <div className='toast-title'>{title_toast}</div>
            <div className='toast-content'>{message}</div>
        </div>
     
    </div>

   );
}

function getColorAndIcon(type:ToastType):[string, string, string]{
    switch(type){
        case ToastType.Info:
            return ['toast-info', '/icons/toast/info.png' , 'Informação'];
        case ToastType.Alert:
            return ['toast-alert', '/icons/toast/alert.png', 'Alerta'];
        case ToastType.Error:
            return ['toast-error', '/icons/toast/error.png', 'Erro'];
        case ToastType.Success:
            return ['toast-success', '/icons/toast/success.png', 'Sucesso'];
    }

}