//Auth.js é um ficheiro que só deve ser importado por um Server Component
import { cookies } from 'next/headers';
const md5 = require('md5');

const COOKIE_NAME_AUTH= 'app_main';

const authKeys:string[] = process.env.AUTH_GENERATE_KEYS?.split(',') || [];

//Verifica se ele está logado
export function isLogged():boolean{
    const cookiesStore = cookies();
    if(cookiesStore.has(COOKIE_NAME_AUTH)){

        var key_user =cookiesStore.get(COOKIE_NAME_AUTH)?.value || "";

        if(key_user == ""){
            return false;
        }     


        for(let key of authKeys){
            if(md5(key) == key_user){
                return true;
            }
        }

    }

    return false;
}

//Verifica se token da página está correcto
export function isTokenAuth(token:string):boolean{

    if(process.env.AUTH_TOKEN == token){
        return true;
    }
  
    return false;
}   

//Tenta autenticar o usuário por meio de (nome de usuário e senha)
export function auth(username:string, password:string){
    if(process.env.AUTH_USERNAME == username && process.env.AUTH_PASSWORD == password){
        const cookiesStore = cookies();

        //sorteiar um número para pegar uma chave.
       var random = Math.floor(Math.random() * authKeys.length);
       if(random == authKeys.length){
            random--;
       }

       var key:string = md5(authKeys[random]);

       cookiesStore.set(COOKIE_NAME_AUTH,key, {maxAge: parseInt(process.env.AUTH_MAXAGE?.toString() || "0")});
    
       return true;
    }

    return false;

}

//Terminar sessão
export function logout(){
    const cookiesStore = cookies();
    cookiesStore.delete(COOKIE_NAME_AUTH);
}