'use client'

import {useEffect, useState} from 'react';
import { toInt } from '@/utils/utils';

import './style.css'
import Image from 'next/image';
import Link from 'next/link'
import { parse } from 'url';

interface CardDashboardProps {
    title: string,
    value: string | number,
    url_view: string
}

//tempo para contar (2 segundos)
const timeForCount = 2000;

export default function CardDashboard({ title, value, url_view }: CardDashboardProps) {

    const [valueCurrent, setValueCurrent] = useState<number | string>(0);
    //tiemeout

    if(typeof value == 'number'){
        useEffect(()=>{
            if(toInt(valueCurrent) < toInt(value)){
               const id_timeout= setTimeout(()=>{
                //100 é o tempo de update
                const add_value =Math.ceil(toInt(value) / (timeForCount / 100) );
                    if(toInt(valueCurrent) +  add_value<= toInt(value)){
                        setValueCurrent(toInt(valueCurrent) + add_value);
                    }
                    else{
                        setValueCurrent(toInt(value));
                    }
                }, 100);
    
                return ()=>{
                    clearTimeout(id_timeout);
                }
            }
        }, [valueCurrent]);
    }

    else{
        setValueCurrent(value);
    }
   
    return (

        <div className='cd'>
            <div className='cd-header'>
                <Image src='/icons/metricas.png' width='16' height='16' alt='' />
                <div className='cd-title'>{title}</div>
            </div>

            <div className='cd-value'>{valueCurrent}</div>
            <div className='cd-footer'>
                <Link className="cd-link-view" href={parse(url_view)}>Ver tudo</Link>
            </div>
        </div>
    )
}