import PanelLayout from "@/components/PanelLayout";

//Logado
import LoggedProvider from '@/components/Providers/LoggedProvider';
import PlayersContent from "./content";
import {getCollection, getItems} from '@/utils/firebase';

export default async function UnitelCode() {
    const players_colecao = getCollection('players');
    
    //lista dos jogadores do Okupalenda
   const players = await getItems(players_colecao);

    return (
        <LoggedProvider>
            <PanelLayout  title="Jogadores (Okupalenda)" page="players">
                    <PlayersContent players={players} />
            </PanelLayout>
        </LoggedProvider>
    );
}

