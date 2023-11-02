import PanelLayout from "@/components/PanelLayout";

//Logado
import LoggedProvider from '@/components/Providers/LoggedProvider';
import AcademiaContent from "./content";
import {getCollection, getItems} from '@/utils/firebase';

export default async function Academia() {
    const academia_colecao = getCollection('inscricao');
    
    //lista de todos alunos da academia
   const alunos = await getItems(academia_colecao);

    return (
        <LoggedProvider>
            <PanelLayout  title="Academia" page="academia">
                    <AcademiaContent alunos={alunos} />
            </PanelLayout>
        </LoggedProvider>
    );
}

