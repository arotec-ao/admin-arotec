import './style.css'
import Image from 'next/image';
import Toast from '@/components/Toast';
import { ToastType } from '@/components/Toast/Type';
import LoggedProvider from '@/components/Providers/LoggedProvider';
import { isTokenAuth, auth } from '@/utils/auth';
import {notFound, redirect} from 'next/navigation';

interface AuthParamsType {
    authToken: string, 
  
}

interface AuthSearchParamsType{
    error?:string
}

interface AuthProps {
    params: AuthParamsType, 
    searchParams:AuthSearchParamsType
}

export default function Auth({ params, searchParams }: AuthProps) {
    const { authToken } = params;

    var isErrorLogin =false;

    if('error' in searchParams){
        isErrorLogin=true;
    }

    return (
        <LoggedProvider isLoginPage>
            {
                !isTokenAuth(authToken) ? notFound() :
                    <div className='auth-main'>
                        <div className='auth-main-area'>
                            <Image className='auth-main-logo' src='/icons/logo-black.png' width='150' height='35' alt='' />
                            <div className='auth-main-subtitle'>Login</div>
                            <form className='form-login' action={loginAction}>
                                <div className='input-group'>
                                    <label htmlFor='input_username'>Nome de usuário</label>
                                    <input type="text" name='username' id='input_username' placeholder='Seu nome de usuário' />
                                </div>

                                <div className='input-group'>
                                    <label htmlFor='input_password'>Senha</label>
                                    <input type="password" name='password' id='input_password' placeholder='Sua senha' />
                                </div>
                                <input type="submit" className='btn-submit' value="Entrar"  />
                            </form>
                        </div>
                        { isErrorLogin ? 
                            (<Toast type={ToastType.Error} message='As suas credencias estão erradas'
                            autoplay />): ''
                        }
                    </div>
            }
        </LoggedProvider>
    );

}

async function loginAction(formData:FormData) {
    'use server'
    var username = formData.get('username')?.toString() || "";
    var password = formData.get('password')?.toString() || "";

    if(auth(username, password)){
        redirect('/');
    }
    else{
        redirect(`/auth/${process.env.AUTH_TOKEN}/?error`);
    }
    

} 