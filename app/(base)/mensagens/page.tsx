import PanelLayout from "@/components/PanelLayout";

//Logado
import LoggedProvider from '@/components/Providers/LoggedProvider';
import MensagensContent from "./content";
import {getCollection, getItems, getItem, putItem, updateItem, deleteItem} from '@/utils/firebase';

export default async function Mensagens() {
    const mensagens_colecao = getCollection('mensagens');
    
    //lista de mensagens
   const mensagens = await getItems(mensagens_colecao);

    return (
        <LoggedProvider>
            <PanelLayout  title="Mensagens" page="mensagens">
                    <MensagensContent mensagens={mensagens} />
            </PanelLayout>
        </LoggedProvider>
    );
}

