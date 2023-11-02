import {redirect, notFound}from 'next/navigation';
import {isLogged} from '@/utils/auth'


interface LoggedProviderProps{
    children: React.ReactNode, 
    isLoginPage?:boolean
}
export default function LoggedProvider({children,isLoginPage=false }: LoggedProviderProps){
    if(isLogged()){
    
        if(isLoginPage){
            redirect('/');
        }
        else{
           return (<>{children}</>);
        }
    }
    else{
      
         if(isLoginPage){
            return (<>{children}</>);
       }
       else{
            notFound();
       }
    }

    
}