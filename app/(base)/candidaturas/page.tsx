import PanelLayout from "@/components/PanelLayout";

//Logado
import LoggedProvider from '@/components/Providers/LoggedProvider';
import CandidaturasContent from "./content";
import {getCollection, getItems} from '@/utils/firebase';

export default async function Candidaturas() {
    const candidaturas_colecao = getCollection('candidaturas');
    
    //lista de todos candidatos para estágio
   const candidaturas = await getItems(candidaturas_colecao);

    return (
        <LoggedProvider>
            <PanelLayout  title="Candidaturas" page="candidaturas">
                    <CandidaturasContent candidaturas={candidaturas} />
            </PanelLayout>
        </LoggedProvider>
    );
}

