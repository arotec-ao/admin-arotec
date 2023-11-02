'use client'
import './style.css';

import {useState} from 'react'

import Sidebar from '../Sidebar';
import MainContent from '../MainContent'

interface PanelLayoutProps{
    title:string,
    children: React.ReactNode, 
    page?:string
}

export default function PanelLayout({title, children, page='home'}: PanelLayoutProps) {
  const [showSidebar, setShowSidebar]=useState(false);
  return (
    <main className='main'>
        <Sidebar page={page} showMobile={showSidebar} onToogleShowSidebar={setShowSidebar}/>
        <MainContent title={title} onToogleShowSidebar={setShowSidebar}>
            {children}
        </MainContent>
    </main>
  )
}
