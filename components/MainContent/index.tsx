import React from 'react';
import './style.css';
import MainContentHeader from './MainContentHeader';


interface MainContentProps{
    children: React.ReactNode, 
    title:string, 
    onToogleShowSidebar:Function
}

export default function MainContent({children, title, onToogleShowSidebar}:MainContentProps){
    return (
        <div className='main-content'>
            <MainContentHeader title={title} onToogleShowSidebar={onToogleShowSidebar}/>
            {children}
        </div>
    );
}