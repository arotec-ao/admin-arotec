import PanelLayout from "@/components/PanelLayout";

//Logado
import LoggedProvider from '@/components/Providers/LoggedProvider';
import EquipesContent from "./content";
import {getCollection, getItems} from '@/utils/firebase';

export default async function Equipes() {
    const equipes_colecao = getCollection('equipes');
    
    //lista de todas equipes do CANAR
   const equipes = await getItems(equipes_colecao);

    return (
        <LoggedProvider>
            <PanelLayout  title="Equipas (CANAR)" page="equipes-canar">
                    <EquipesContent equipes={equipes} />
            </PanelLayout>
        </LoggedProvider>
    );
}

