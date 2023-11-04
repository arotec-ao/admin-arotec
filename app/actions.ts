'use server'

import { logout } from '@/utils/auth';
import { Timestamp, deleteField } from "firebase/firestore";
import { getCollection, putItem, deleteItem, updateItem, getItem, getItemReference } from "@/utils/firebase";
import { redirect } from 'next/navigation';


export async function modalFormAction(formData: FormData) {
    const collection_name: string = formData.get('collection')?.toString() ?? '';
    const docId: string = formData.get('docId')?.toString() ?? '';
    const redirect_url: string = formData.get('redirect_url')?.toString() ?? '/';
    if (collection_name) {
        const collection = getCollection(collection_name.toString());

        //quer dizer que estamos a criar algo e não atualizar
        if (docId == '') {
            switch (collection_name) {
                case 'inscricao':
                    (await putItem(collection, {
                        curso: formData.get('curso')?.toString(),
                        dataEnvio: Timestamp.now(),
                        email: formData.get('email')?.toString(),
                        endereco: formData.get('endereco')?.toString(),
                        modalidade: formData.get('modalidade')?.toString(),
                        nome: formData.get('nome')?.toString(),
                        senha: formData.get('senha')?.toString(),
                        telefone: formData.get('telefone')?.toString()
                    }))


                    break;
                case 'candidaturas':
                    (await putItem(collection, {
                        email: formData.get('email')?.toString(),
                        nome: formData.get('nome')?.toString(),
                        telefone: formData.get('telefone')?.toString()
                    }))

                    break;
                case 'equipes':
                    (await putItem(collection, {
                        nomeTeam: formData.get('nomeTeam')?.toString(),
                        nomeInstituicao: formData.get('nomeInstituicao')?.toString(),
                        telefone: formData.get('telefone')?.toString(),
                        email: formData.get('email')?.toString(), 
                        numElementos:0
                    }))
                    break;
                case 'projetos':
                    (await putItem(collection, {
                        titulo: formData.get('titulo')?.toString(),
                        nome: formData.get('nome')?.toString(),
                        email: formData.get('email')?.toString(),
                        descricao: formData.get('descricao')?.toString(),
                        visualizacoes: parseInt(formData.get('visualizacoes')?.toString() ?? '0'),
                        link: formData.get('link')?.toString(),
                        fotoUrl: formData.get('fotoUrl')?.toString(),
                        fotoUrlDownload: formData.get('fotoUrlDownload')?.toString(),
                        id: formData.get('id')?.toString()
                    }));
                case 'sinopec_learn':
                    (await putItem(collection, {
                        nome: formData.get('nome')?.toString(),
                        email: formData.get('email')?.toString(),
                        endereco: formData.get('endereco')?.toString(),
                        telefone: formData.get('telefone')?.toString(),
                        encarregado: formData.get('encarregado')?.toString(),
                        idade: formData.get('idade')?.toString(),
                        local: formData.get('local')?.toString(),
                        hora: formData.get('hora')?.toString(),
                        dataEnvio: Timestamp.now(),
                    }))
                    break;
                case 'unitel_code':
                    (await putItem(collection, {
                        nome: formData.get('nome')?.toString(),
                        email: formData.get('email')?.toString(),
                        endereco: formData.get('endereco')?.toString(),
                        telefone: formData.get('telefone')?.toString(),
                        encarregado: formData.get('encarregado')?.toString(),
                        idade: formData.get('idade')?.toString(),
                        local: formData.get('local')?.toString(),
                        hora: formData.get('hora')?.toString(),
                        dataEnvio: Timestamp.now(),
                    }));
                    break;

                case 'players':
                    (await putItem(collection, {
                        nome: formData.get('nome')?.toString(),
                        pais: formData.get('pais')?.toString(),
                        iso: formData.get('iso')?.toString(),
                        pontos: parseInt(formData.get('pontos')?.toString() ?? '0'),
                    }));
                    break;
                case 'mensagens':
                    (await putItem(collection, {
                            nomeCompleto: formData.get('nomeCompleto')?.toString(),
                            email: formData.get('email')?.toString(),
                            telefone: formData.get('telefone')?.toString(),
                            mensagem: formData.get('mensagem')?.toString(),
                            dataEnvio: Timestamp.now(),
                    }));
                    break;
                case 'newsletter':
                    (await putItem(collection, {
                            email: formData.get('email')?.toString(),
                            dataEnvio: Timestamp.now(),
                    }));
                    break;
            }

        }

        //quer dizer que estamos a atualizar algo
        else {
            const doc = await getItemReference(collection_name.toString(), docId.toString());
            const doc_data: any = (await getItem(doc)).data();
            const update_data: any = {};
            const input_update = [];

            switch (collection_name) {
                case 'inscricao':
                    input_update.push('curso', 'email', 'nome', 'senha', 'telefone', 'senha',
                        'endereco', 'modalidade');
                    break;
                case 'candidaturas':
                    input_update.push('nome', 'email', 'telefone');
                    break;
                case 'equipes':
                    input_update.push('nomeTeam', 'nomeInstituicao', 'email', 'telefone');
                    break;
                case 'projetos':
                    input_update.push('titulo', 'nome', 'email',
                        'descricao', 'visualizacoes', 'link', 'fotoUrl',
                        'fotoUrlDownload', 'id');
                    break;
                case 'sinopec_learn':
                    input_update.push('nome', 'email', 'endereco', 'telefone',
                        'encarregado', 'idade', 'local', 'hora');
                    break;

                case 'unitel_code':
                    input_update.push('nome', 'email', 'endereco', 'telefone',
                        'encarregado', 'idade', 'local', 'hora');
                    break;
                case 'players':
                    input_update.push('nome', 'pais', 'iso', 'pontos');
                    break;

                case 'mensagens':
                    input_update.push('nomeCompleto', 'email', 'telefone', 'mensagem');
                    break;
                case 'newsletter':
                    input_update.push('email');
                    break;


            }


            for (let input of input_update) {
                var data_temp = formData.get(input)?.toString() ?? '';

                if (data_temp != '') {
                    if (data_temp != doc_data[input]) {
                        update_data[input] = data_temp;
                    }

                }

            }

            await updateItem(doc, update_data);
        }

    }

    redirect(redirect_url);

}

export async function deleteDocAction(formData: FormData) {
    const collection_name = formData.get('collection');
    const docId = formData.get('docId');
    const redirect_url = formData.get('redirect_url')?.toString() ?? '/';

    if (collection_name && docId) {
        await deleteItem(collection_name.toString(), docId.toString());
    }

    redirect(redirect_url);

}

export async function deleteDocsAction(formData: FormData){
        const collection_name = formData.get('collection');
    const docs:string = formData.get('docs')?.toString()?? '' ;
    const redirect_url = formData.get('redirect_url')?.toString() ?? '/';

    if (collection_name && docs) {
        for(let doc of docs.split(' ')){
            await deleteItem(collection_name.toString(), doc.toString());
        }
    }

    return redirect(redirect_url);

}

//Actions only for Equipe 

export async function  elementEquipeAction(formData:FormData){

    const collection_name: string = formData.get('collection')?.toString() ?? '';
    const docId: string = formData.get('docId')?.toString() ?? '';
    const elementId: string = formData.get('elementId')?.toString() ?? '';
    const redirect_url: string = formData.get('redirect_url')?.toString() ?? '/';

    if (collection_name && docId) {
  
        //quer dizer que estamos a criar algo e não atualizar
        if (elementId == '') {  

            const doc = await getItemReference(collection_name.toString(), docId.toString());
            const doc_data: any = (await getItem(doc)).data();
            

            //ID do ultimo elemento da equipe
            let id_last =0;
    
            for(let key of Object.keys(doc_data)){
                if (key.startsWith('elemento-')){
                  let id_temp = parseInt(key.slice(('elemento-'.length), key.length));
                    if(id_last == 0){
                        id_last=id_temp;
                    }
                    else{
                        if(id_temp > id_last){
                            id_last=id_temp;
                        }
                    }
                }
            }

            const update_obj:any = {
                numElementos: parseInt(doc_data.numElementos)+1
            };

            update_obj['elemento-'+(id_last+1)]={
                nome: formData.get('nome')?.toString(),
                funcao: formData.get('funcao')?.toString(),
                nascimento: formData.get('nascimento')?.toString(),
            }
   
            await updateItem(doc, update_obj);
           
        }

        //quer dizer que estamos a atualizar algo
        else {
            const doc = await getItemReference(collection_name.toString(), docId.toString());
            const doc_data: any = (await getItem(doc)).data();

            const elemento = doc_data['elemento-'+elementId];

            if(elemento){
                const update_data: any = {};
                update_data['elemento-'+elementId]={};
                
                for (let input of
                     ['nome', 'funcao', 'nascimento']) {
                    var data_temp = formData.get(input)?.toString() ?? '';

                    if (data_temp != '') {
                        update_data['elemento-'+elementId][input] = data_temp;
                    }
                    else{
                        update_data['elemento-'+elementId][input] = elemento[input];
                    }
                }
    
                await updateItem(doc, update_data);

            }

       
        }

    }

    redirect(redirect_url);

}
export async function deleteElementEquipeAction(formData: FormData){
    const collection_name = formData.get('collection');
    const docId = formData.get('docId');
    const elementId:string = formData.get('elementId')?.toString() ?? '';
    const redirect_url = formData.get('redirect_url')?.toString() ?? '/';

    if (collection_name && docId && elementId != '') {

        const doc = await getItemReference(collection_name.toString(), docId.toString());
        const doc_data: any = (await getItem(doc)).data();

        const elemento = doc_data['elemento-'+elementId];

        if(elemento){

            const delete_element:any = {};
            delete_element['elemento-'+elementId] = deleteField();
            await updateItem(doc, delete_element);
        }
    }

    redirect(redirect_url);
}

export async function deleteElementsEquipeAction(formData: FormData){
    const collection_name = formData.get('collection');
    const docId = formData.get('docId');
    //ids dos elementos
    const elements:string = formData.get('elements')?.toString() ?? '';
    const redirect_url = formData.get('redirect_url')?.toString() ?? '/';

    if (collection_name && docId && elements != '') {

        const doc = await getItemReference(collection_name.toString(), docId.toString());
        const doc_data: any = (await getItem(doc)).data();
        const delete_element:any = {};

        for(let elementId of elements.split(' ')){
            const elemento = doc_data['elemento-'+elementId];

            if(elemento){
                delete_element['elemento-'+elementId] = deleteField();
            }

        }

        await updateItem(doc, delete_element);


        
        
    }

    redirect(redirect_url);
}


//Logout Action

export async function logoutAction(formData:FormData){
    logout();
    redirect(`/auth/${process.env.AUTH_TOKEN}/`);
}
