import PanelLayout from "@/components/PanelLayout";

//Logado
import LoggedProvider from '@/components/Providers/LoggedProvider';
import SinopecLearnContent from "./content";
import {getCollection, getItems} from '@/utils/firebase';

export default async function SinopecLearn() {
    const sinopec_learn_colecao = getCollection('sinopec_learn');
    
    //lista de todos alunos do sinopec
   const alunos_sinopec_learn = await getItems(sinopec_learn_colecao);

    return (
        <LoggedProvider>
            <PanelLayout  title="Sinopec Learn" page="sinopec_learn">
                    <SinopecLearnContent alunos={alunos_sinopec_learn} />
            </PanelLayout>
        </LoggedProvider>
    );
}

