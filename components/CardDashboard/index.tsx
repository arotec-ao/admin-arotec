import './style.css'
import Image from 'next/image';
import Link from 'next/link'
import { parse } from 'url';

interface CardDashboardProps {
    title: string,
    value: string | number,
    url_view: string
}

export default function CardDashboard({ title, value, url_view }: CardDashboardProps) {

    return (

        <div className='cd'>
            <div className='cd-header'>
                <Image src='/icons/metricas.png' width='16' height='16' alt='' />
                <div className='cd-title'>{title}</div>
            </div>

            <div className='cd-value'>{value}</div>
            <div className='cd-footer'>
                <Link className="cd-link-view" href={parse(url_view)}>Ver tudo</Link>
            </div>
        </div>
    )
}