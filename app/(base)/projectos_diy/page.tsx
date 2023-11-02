import PanelLayout from "@/components/PanelLayout";

//Logado
import LoggedProvider from '@/components/Providers/LoggedProvider';
import ProjectosDIYContent from "./content";
import {getCollection, getItems} from '@/utils/firebase';

export default async function ProjectosDIY() {
    const projectos_colecao = getCollection('projetos');
    
    //lista de todos projectos DIY
   const projectos_diy = await getItems(projectos_colecao);

    return (
        <LoggedProvider>
            <PanelLayout  title="Projectos DIY" page="projectos_diy">
                    <ProjectosDIYContent projectos={projectos_diy} />
            </PanelLayout>
        </LoggedProvider>
    );
}

