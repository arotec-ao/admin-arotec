'use client';

import './style.css';
import Image from 'next/image';
import { useRef } from 'react';

interface TableCheckoutProps{
    checked?:boolean, 
    onClick?:Function,
}

export default function TableCheckout({checked=false,  onClick}:TableCheckoutProps) {

    const checkboxRef = useRef<null | HTMLInputElement>(null);

    const clickCheckbox= (event:any)=>{
        if(checkboxRef.current){
            checkboxRef.current.click();
        }

        event.stopPropagation();
    }

    const onChange=()=>{
        if(onClick){
            onClick(checkboxRef.current?.checked  ?? false);
        }
    }

    return (
        <div className="table-checkbox" onClick={clickCheckbox}>
            <input type="checkbox" ref={checkboxRef} checked={checked} onChange={onChange} />
            <div className="handle">
                <Image className="checkmark" alt="checkmark"
                 src="/icons/check.png" width='12' height='12' />
            </div>
        </div>
    );
}