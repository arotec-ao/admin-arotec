import PanelLayout from "@/components/PanelLayout";

//Logado
import LoggedProvider from '@/components/Providers/LoggedProvider';
import ComprasContent from "./content";
import {getCollection, getItems} from '@/utils/firebase';

export default async function Academia() {
    const compras_colecao = getCollection('compras');
    const produtos_colecao = getCollection('produtos');
    
    //lista de todas compras
   const compras = await getItems(compras_colecao);
   const produtos = (await getItems(produtos_colecao)).map((prod)=>{
    return {
        id: prod.id, 
        data: {
           nome: prod.data.nome, 
           preco: prod.data.preco, 
           quantidade: prod.data.quantidade, 
           desconto: prod.data.desconto
        }
    }
   });



    return (
        <LoggedProvider>
            <PanelLayout  title="Compras" page="compras">
                    <ComprasContent compras={compras} produtos={produtos} />
            </PanelLayout>
        </LoggedProvider>
    );
}

