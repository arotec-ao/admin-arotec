import PanelLayout from "@/components/PanelLayout";

//Logado
import LoggedProvider from '@/components/Providers/LoggedProvider';
import ProdutosContent from "./content";
import {getCollection, getItems} from '@/utils/firebase';

export default async function Academia() {
    const produtos_colecao = getCollection('produtos');
    
    //lista de todos os produtos da loja IO
   const produtos = await getItems(produtos_colecao);

    return (
        <LoggedProvider>
            <PanelLayout  title="Produtos" page="produtos">
                    <ProdutosContent produtos={produtos} />
            </PanelLayout>
        </LoggedProvider>
    );
}

