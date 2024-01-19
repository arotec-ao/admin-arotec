import PanelLayout from "@/components/PanelLayout";

//Logado
import LoggedProvider from '@/components/Providers/LoggedProvider';
import VoluntariosContent from "./content";
import {getCollection, getItems} from '@/utils/firebase';

export default async function Voluntarios() {
    const voluntarios_colecao = getCollection('voluntarios');
    
    //lista de todos voluntarios do canar
   const voluntarios = await getItems(voluntarios_colecao);

    return (
        <LoggedProvider>
            <PanelLayout  title="Voluntários" page="voluntario">
                    <VoluntariosContent voluntarios={voluntarios} />
            </PanelLayout>
        </LoggedProvider>
    );
}

