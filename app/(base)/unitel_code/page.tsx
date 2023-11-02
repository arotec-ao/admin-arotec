import PanelLayout from "@/components/PanelLayout";

//Logado
import LoggedProvider from '@/components/Providers/LoggedProvider';
import UnitelCodeContent from "./content";
import {getCollection, getItems} from '@/utils/firebase';

export default async function UnitelCode() {
    const unitel_code_colecao = getCollection('unitel_code');
    
    //lista de todos alunos do unitel code
   const alunos_unitel_code = await getItems(unitel_code_colecao);

    return (
        <LoggedProvider>
            <PanelLayout  title="Unitel Code" page="unitel_code">
                    <UnitelCodeContent alunos={alunos_unitel_code} />
            </PanelLayout>
        </LoggedProvider>
    );
}

