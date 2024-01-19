'use server'

import { logout } from '@/utils/auth';
import { Timestamp, deleteField } from "firebase/firestore";
import { getCollection, putItem, deleteItem, updateItem, getItem, getItemReference, uploadFile } from "@/utils/firebase";
import { redirect } from 'next/navigation';
import { v4 as uuidv4 } from 'uuid';


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
                case 'compras':
                    const produtosJson = formData.get('produtos');

                    if (produtosJson) {
                        const produtos = JSON.parse(produtosJson.toString());

                        //reduz um valor na colecao produtos quando é registrado uma compra
                        for (const p of produtos) {
                            if (p.pago) {
                                const doc = await getItemReference('produtos', p.id);
                                const doc_data: any = (await getItem(doc)).data();

                                await updateItem(doc, {
                                    quantidade: parseInt(doc_data.quantidade) - parseInt(p.quantidade)
                                });
                            }
                        }


                        (await putItem(collection, {
                            informacoesEntrega: {
                                nomeCompleto: formData.get('nomeCompleto')?.toString(),
                                endereco: formData.get('endereco')?.toString(),
                                email: formData.get('email')?.toString(),
                                telefone: formData.get('telefone')?.toString(),
                                pais: formData.get('pais')?.toString(),
                            },

                            entrega: parseInt(formData.get('entrega')?.toString() ?? '0'),
                            metodoObtencao: formData.get('metodoObtencao')?.toString(),
                            metodoPagamento: formData.get('metodoPagamento')?.toString(),
                            pago: (formData.get('pago')?.toString() ?? 'false') == 'true' ? true : false,
                            produtos: produtos.map((prod: any) => {
                                return {
                                    nome: prod.nome,
                                    id: prod.id,
                                    preco: prod.preco,
                                    quantidade: prod.quantidade,
                                    desconto: prod.desconto
                                }
                            }),
                            dataCompra: Timestamp.now(),
                        }))
                    }


                    break;
                case 'produtos':

                    const imagensString = formData.get('imagens')?.toString();
                    var imagens = null;

                    if (imagensString) {
                        try {
                            imagens = JSON.parse(imagensString);

                            if (!Array.isArray(imagens)) {
                                imagens = null;
                            }

                        } catch (e) { }
                    }

                    if (imagens) {

                        const imagensUploaded: {
                            name: string,
                            url: string,
                        }[] = [];

                        for (let x = 0; x < imagens.length; x++) {
                            const file = formData.get('imagem_' + x) as File;

                            if (file) {
                                var name_file = file.name;
                                const newDate = new Date(Timestamp.now().seconds * 1000);
                                var data_new = newDate.toLocaleString();

                                //pega a extensao do ficheiro
                                var extension = name_file.substring(name_file.lastIndexOf('.'), name_file.length);

                                //pega o nome real da ficheiro
                                var real_name_file = name_file.slice(0, name_file.lastIndexOf('.'));

                                //e gera o nome final
                                name_file = real_name_file + ' ' + data_new + extension;
                                name_file = name_file.replaceAll('/', '-');
                                name_file = name_file.replaceAll("\\", '-');

                                const urlDownload = await uploadFile('produtos/' + name_file, await file.arrayBuffer(), {
                                    contentType: file.type
                                });

                                imagensUploaded.push(
                                    { name: name_file, url: urlDownload }
                                );
                            }
                        }

                        (await putItem(collection, {
                            nome: formData.get('nome')?.toString(),
                            marca: formData.get('marca')?.toString(),
                            categoria: formData.get('categoria')?.toString(),
                            descricao: formData.get('descricao')?.toString(),
                            estado: formData.get('estado')?.toString(),
                            preco: parseFloat(formData.get('preco')?.toString() ?? '0'),
                            desconto: parseFloat(formData.get('desconto')?.toString() ?? '0'),
                            entrega: parseFloat(formData.get('entrega')?.toString() ?? '0'),
                            quantidade: parseInt(formData.get('quantidade')?.toString() ?? '0'),
                            imagens: imagensUploaded,
                            id: uuidv4()
                        }))
                    }


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
                        numElementos: 0
                    }))
                    break;
                    case 'voluntarios':
                        (await putItem(collection, {
                            idade: formData.get('idade')?.toString(),
                            participou: false,
                            email: formData.get('email')?.toString(),
                            nome: formData.get('nome')?.toString(),
                            telefone: formData.get('telefone')?.toString(),
                            interesses: formData.get('interesses')?.toString(),
                            grau_academica: formData.get('grau_academica')?.toString(),
                        }))
    
    
                        break;
                case 'projetos':

                    const imagensUploaded: {
                        name: string,
                        url: string,
                    } = {
                        name:'' ,
                        url:''
                    };


                    const file = formData.get('imagem') as File;


                    if (file) {
                        var name_file = file.name;
                        const newDate = new Date(Timestamp.now().seconds * 1000);
                        var data_new = newDate.toLocaleString();

                        //pega a extensao do ficheiro
                        var extension = name_file.substring(name_file.lastIndexOf('.'), name_file.length);

                        //pega o nome real da ficheiro
                        var real_name_file = name_file.slice(0, name_file.lastIndexOf('.'));

                        //e gera o nome final
                        name_file = real_name_file + ' ' + data_new + extension;
                        name_file = name_file.replaceAll('/', '-');
                        name_file = name_file.replaceAll("\\", '-');

                        const urlDownload = await uploadFile('projectos/' + name_file, await file.arrayBuffer(), {
                            contentType: file.type
                        });

                        imagensUploaded.name =  name_file; 
                        imagensUploaded.url = urlDownload ;
                    }


                    (await putItem(collection, {
                        titulo: formData.get('titulo')?.toString(),
                        nome: formData.get('nome')?.toString(),
                        email: formData.get('email')?.toString(),
                        descricao: formData.get('descricao')?.toString(),
                        visualizacoes: parseInt(formData.get('visualizacoes')?.toString() ?? '0'),
                        link: formData.get('link')?.toString(),
                        fotoUrl: imagensUploaded.name,
                        fotoUrlDownload: imagensUploaded.url,
                        id: uuidv4()
                    }));
                    break;
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
            const input_update: {
                key: string,
                type: string,
            }[] = [];

            switch (collection_name) {
                case 'inscricao':
                    input_update.push(
                        { key: 'curso', type: 'string' },
                        { key: 'email', type: 'string' },
                        { key: 'nome', type: 'string' },
                        { key: 'senha', type: 'string' },
                        { key: 'telefone', type: 'string' },
                        { key: 'endereco', type: 'string' },
                        { key: 'modalidade', type: 'string' });
                    break;
                case 'candidaturas':
                    input_update.push(
                        { key: 'nome', type: 'string' },
                        { key: 'email', type: 'string' },
                        { key: 'telefone', type: 'string' });
                    break;
                case 'compras':

                    //verificacoes que não constam na raiz do documento
                    update_data['informacoesEntrega'] = {};
                    for (let input of ['nomeCompleto', 'pais', 'email', 'telefone', 'endereco']) {
                        var data_temp = formData.get(input)?.toString() ?? '';

                        if (data_temp != '') {
                            update_data['informacoesEntrega'][input] = data_temp;
                        }
                        else {
                            update_data['informacoesEntrega'][input] =
                                doc_data.informacoesEntrega[input];
                        }
                    }

                    const produtosJson = formData.get('produtos');

                    if (produtosJson) {
                        try {
                            const produtos = JSON.parse(produtosJson.toString());

                            var isValidProdutosFormat = false;

                            //pequena validação para ver se formato é correcto
                            if (Array.isArray(produtos)) {
                                if (produtos.length > 0) {
                                    for (const prod of produtos) {
                                        const keys = Object.keys(prod);
                                        if (keys.includes('nome') &&
                                            keys.includes('id') &&
                                            keys.includes('preco') &&
                                            keys.includes('quantidade') &&
                                            keys.includes('desconto')) {
                                            if (typeof prod.nome != 'object' &&
                                                typeof prod.nome != 'function' &&
                                                typeof prod.nome != 'symbol' &&

                                                typeof prod.id != 'object' &&
                                                typeof prod.id != 'function' &&
                                                typeof prod.id != 'symbol' &&

                                                typeof prod.preco != 'object' &&
                                                typeof prod.preco != 'function' &&
                                                typeof prod.preco != 'symbol' &&

                                                typeof prod.quantidade != 'object' &&
                                                typeof prod.quantidade != 'function' &&
                                                typeof prod.quantidade != 'symbol' &&

                                                typeof prod.desconto != 'object' &&
                                                typeof prod.desconto != 'function' &&
                                                typeof prod.desconto != 'symbol') {
                                                isValidProdutosFormat = true;
                                            }
                                            else {
                                                isValidProdutosFormat = false;
                                                break;
                                            }
                                        }
                                        else {
                                            isValidProdutosFormat = false;
                                            break;
                                        }
                                    }
                                }
                                else {
                                    isValidProdutosFormat = true;
                                }

                            }


                            if (isValidProdutosFormat) {
                                update_data['produtos'] = produtos;
                            }
                        } catch (e) { }

                    }

                    input_update.push({ key: 'entrega', type: 'float' },
                        { key: 'metodoObtencao', type: 'string' },
                        { key: 'metodoPagamento', type: 'string' },
                        { key: 'pago', type: 'bool' });

                    break;
                case 'produtos':

                    //imagens 
                    const imagensString = formData.get('imagens')?.toString();
                    var imagens = null;

                    if (imagensString) {
                        try {
                            imagens = JSON.parse(imagensString);

                            if (!Array.isArray(imagens)) {
                                imagens = null;
                            }

                        } catch (e) { }
                    }

                    if (imagens) {
                        update_data.imagens = [];

                        for (let x = 0; x < imagens.length; x++) {

                            //verifica  se é a posicao de uma imagem existente
                            if (x <= doc_data.imagens.length - 1) {
                                let img = imagens[x];

                                if (img != '') {
                                    update_data.imagens.push(doc_data.imagens.find((imagem: any) => {
                                        if (img == imagem.name) return true;
                                        return false;
                                    }));
                                    continue;
                                }

                            }

                            const file = formData.get('imagem_' + x) as File;

                            if (file) {
                                var name_file = file.name;
                                const newDate = new Date(Timestamp.now().seconds * 1000);
                                var data_new = newDate.toLocaleString();

                                //pega a extensao do ficheiro
                                var extension = name_file.substring(name_file.lastIndexOf('.'), name_file.length);

                                //pega o nome real da ficheiro
                                var real_name_file = name_file.slice(0, name_file.lastIndexOf('.'));

                                //e gera o nome final
                                name_file = real_name_file + ' ' + data_new + extension;
                                name_file = name_file.replaceAll('/', '-');
                                name_file = name_file.replaceAll("\\", '-');

                                const urlDownload = await uploadFile('produtos/' + name_file, await file.arrayBuffer(), {
                                    contentType: file.type
                                });

                                update_data.imagens.push({ name: name_file, url: urlDownload });
                            }
                        }
                    }


                    input_update.push(
                        { key: 'nome', type: 'string' },
                        { key: 'marca', type: 'string' },
                        { key: 'categoria', type: 'string' },
                        { key: 'descricao', type: 'string' },
                        { key: 'estado', type: 'string' },
                        { key: 'preco', type: 'float' },
                        { key: 'desconto', type: 'float' },
                        { key: 'entrega', type: 'float' },
                        { key: 'quantidade', type: 'int' });
                    break;
                case 'equipes':

                input_update.push({ key: 'nome', type: 'string' },
                { key: 'telefone', type: 'string' },
                { key: 'email', type: 'string' },
                { key: 'telefone', type: 'string' });
                  
                    break;

                case 'voluntarios':
                
                input_update.push({ key: 'nome', type: 'string' },
                { key: 'interesses', type: 'string' },
                { key: 'email', type: 'string' },
                { key: 'telefone', type: 'string' }, 
                { key: 'grau_academica', type: 'string' }, 
                { key: 'idade', type: 'string' }, 
                );
                    break;
                case 'projetos':

                    const file = formData.get('imagem') as File;

                    if (file) {
                        var name_file = file.name;
                        const newDate = new Date(Timestamp.now().seconds * 1000);
                        var data_new = newDate.toLocaleString();

                        //pega a extensao do ficheiro
                        var extension = name_file.substring(name_file.lastIndexOf('.'), name_file.length);

                        //pega o nome real da ficheiro
                        var real_name_file = name_file.slice(0, name_file.lastIndexOf('.'));

                        //e gera o nome final
                        name_file = real_name_file + ' ' + data_new + extension;
                        name_file = name_file.replaceAll('/', '-');
                        name_file = name_file.replaceAll("\\", '-');

                        const urlDownload = await uploadFile('projectos/' + name_file, await file.arrayBuffer(), {
                            contentType: file.type
                        });

                        update_data['fotoUrl']  =  name_file;
                        update_data['fotoUrlDownload']  =  urlDownload;
                    }

                    input_update.push(
                        { key: 'titulo', type: 'string' },
                        { key: 'nome', type: 'string' },
                        { key: 'email', type: 'string' },
                        { key: 'descricao', type: 'string' },
                        { key: 'visualizacoes', type: 'int' },
                        { key: 'link', type: 'string' },
                     );
                    break;
                case 'sinopec_learn':
                    input_update.push(
                        { key: 'nome', type: 'string' },
                        { key: 'email', type: 'string' },
                        { key: 'endereco', type: 'string' },
                        { key: 'telefone', type: 'string' },
                        { key: 'encarregado', type: 'string' },
                        { key: 'idade', type: 'string' },
                        { key: 'local', type: 'string' },
                        { key: 'hora', type: 'string' });
                    break;

                case 'unitel_code':
                    input_update.push(
                        { key: 'nome', type: 'string' },
                        { key: 'email', type: 'string' },
                        { key: 'endereco', type: 'string' },
                        { key: 'telefone', type: 'string' },
                        { key: 'encarregado', type: 'string' },
                        { key: 'idade', type: 'string' },
                        { key: 'local', type: 'string' },
                        { key: 'hora', type: 'string' });
                    break;
                case 'players':
                    input_update.push(
                        { key: 'nome', type: 'string' },
                        { key: 'pais', type: 'string' },
                        { key: 'iso', type: 'string' },
                        { key: 'pontos', type: 'int' });
                    break;

                case 'mensagens':
                    input_update.push(
                        { key: 'nomeCompleto', type: 'string' },
                        { key: 'email', type: 'string' },
                        { key: 'telefone', type: 'string' },
                        { key: 'mensagem', type: 'string' });
                    break;
                case 'newsletter':
                    input_update.push({ key: 'email', type: 'string' });
                    break;


            }


            for (let { key, type } of input_update) {
                var data_temp: string = formData.get(key)?.toString() ?? '';

                if (data_temp != '') {
                    if (data_temp != doc_data[key]) {
                        switch (type) {
                            case 'string':
                                update_data[key] = data_temp;
                                break;
                            case 'int':
                                update_data[key] = parseInt(data_temp);
                                break;
                            case 'float':
                                update_data[key] = parseFloat(data_temp);
                                break;
                            case 'bool':
                                update_data[key] = data_temp == 'true' ? true : false;
                                break;
                            default:
                                update_data[key] = data_temp;
                                break;
                        }
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

export async function deleteDocsAction(formData: FormData) {
    const collection_name = formData.get('collection');
    const docs: string = formData.get('docs')?.toString() ?? '';
    const redirect_url = formData.get('redirect_url')?.toString() ?? '/';

    if (collection_name && docs) {
        for (let doc of docs.split(' ')) {
            await deleteItem(collection_name.toString(), doc.toString());
        }
    }

    return redirect(redirect_url);

}

//Actions only for Equipe 

export async function elementEquipeAction(formData: FormData) {

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
            let id_last = 0;

            for (let key of Object.keys(doc_data)) {
                if (key.startsWith('elemento-')) {
                    let id_temp = parseInt(key.slice(('elemento-'.length), key.length));
                    if (id_last == 0) {
                        id_last = id_temp;
                    }
                    else {
                        if (id_temp > id_last) {
                            id_last = id_temp;
                        }
                    }
                }
            }

            const update_obj: any = {
                numElementos: parseInt(doc_data.numElementos) + 1
            };

            update_obj['elemento-' + (id_last + 1)] = {
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

            const elemento = doc_data['elemento-' + elementId];

            if (elemento) {
                const update_data: any = {};
                update_data['elemento-' + elementId] = {};

                for (let input of
                    ['nome', 'funcao', 'nascimento']) {
                    var data_temp = formData.get(input)?.toString() ?? '';

                    if (data_temp != '') {
                        update_data['elemento-' + elementId][input] = data_temp;
                    }
                    else {
                        update_data['elemento-' + elementId][input] = elemento[input];
                    }
                }

                await updateItem(doc, update_data);

            }


        }

    }

    redirect(redirect_url);

}
export async function deleteElementEquipeAction(formData: FormData) {
    const collection_name = formData.get('collection');
    const docId = formData.get('docId');
    const elementId: string = formData.get('elementId')?.toString() ?? '';
    const redirect_url = formData.get('redirect_url')?.toString() ?? '/';

    if (collection_name && docId && elementId != '') {

        const doc = await getItemReference(collection_name.toString(), docId.toString());
        const doc_data: any = (await getItem(doc)).data();

        const elemento = doc_data['elemento-' + elementId];

        if (elemento) {


            const delete_element: any = { numElementos: parseInt(doc_data.numElementos) - 1 };
            delete_element['elemento-' + elementId] = deleteField();
            await updateItem(doc, delete_element);
        }
    }

    redirect(redirect_url);
}

export async function deleteElementsEquipeAction(formData: FormData) {
    const collection_name = formData.get('collection');
    const docId = formData.get('docId');
    //ids dos elementos
    const elements: string = formData.get('elements')?.toString() ?? '';
    const redirect_url = formData.get('redirect_url')?.toString() ?? '/';

    if (collection_name && docId && elements != '') {

        const doc = await getItemReference(collection_name.toString(), docId.toString());
        const doc_data: any = (await getItem(doc)).data();

        const delete_element: any = {};

        let numberElementsDeleted: number = 0;

        for (let elementId of elements.split(' ')) {
            const elemento = doc_data['elemento-' + elementId];

            if (elemento) {
                delete_element['elemento-' + elementId] = deleteField();
                numberElementsDeleted++;
            }

        }

        delete_element.numElementos =
            parseInt(doc_data.numElementos) - numberElementsDeleted;

        await updateItem(doc, delete_element);

    }

    redirect(redirect_url);
}

//Logout Action
export async function logoutAction(formData: FormData) {
    logout();
    redirect(`/auth/${process.env.AUTH_TOKEN}/`);
}
