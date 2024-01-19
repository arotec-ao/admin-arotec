import './style.css';
import Link from 'next/link'
import Image from 'next/image'
import SidebarLinkPage from './SidebarLinkPage';
import SidebarLinkPageGroup from './SidebarLinkPageGroup';

interface SidebarProps{
    page?: string, 
    showMobile:boolean, 
    onToogleShowSidebar: Function
}

export default function Sidebar({page, showMobile, onToogleShowSidebar}:SidebarProps){
    return (
        <div className={'sidebar '+ (showMobile ? 'sidebar-open': '')}>
            <div className='sidebar-header'>
                <button className='sidebar-close' onClick={()=>{
                    onToogleShowSidebar(false)
                }}>
                    <Image className='sidebar-close-icon' src='/icons/add.png' width='10' height='10' alt='' />
                </button>
                <Link href="/" className='imgSidebar'>
                    <Image src="/icons/logo-white.png" alt='' width='120' height="30"/>
                </Link>
            </div>

            <div className='sidebar-container'>
                <SidebarLinkPage title="Dashboard" href="/" current={ page =='home' ?true: false}/>
                <SidebarLinkPage title="Academia" href="/academia" current={ page =='academia' ?true: false} />
                <SidebarLinkPage title="Compras" href="/compras" current={ page =='compras' ?true: false} />
                <SidebarLinkPage title="Produtos" href="/produtos" current={ page =='produtos' ?true: false} />
                <SidebarLinkPage title="Candidaturas" href="/candidaturas" current={ page =='candidaturas' ?true: false} />
                <SidebarLinkPage title="Equipes (CANAR)" href="/equipes-canar" current={ page =='equipes-canar' ?true: false} />
                <SidebarLinkPage title="Voluntários" href="/voluntarios" current={ page =='voluntarios' ?true: false} />
                <SidebarLinkPage title="Projectos DIY" href="/projectos_diy" current={ page =='projectos_diy' ?true: false} />
                <SidebarLinkPage title="Sinopec Learn" href="/sinopec_learn" current={ page =='sinopec_learn' ?true: false} />
                <SidebarLinkPage title="Unitel Code" href="/unitel_code" current={ page =='unitel_code' ?true: false} />
                <SidebarLinkPage title="Jogadores (Okupalenda)" href="/players"  current={ page =='players' ?true: false} />
                <SidebarLinkPage title="Mensagens"  href="/mensagens"  current={ page =='mensagens' ?true: false}/>
                <SidebarLinkPage title="Newsletter"  href="/newsletter" current={ page =='newsletter' ?true: false} />  
            </div>
          
        </div>
    );
}