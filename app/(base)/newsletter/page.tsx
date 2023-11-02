import PanelLayout from "@/components/PanelLayout";

//Logado
import LoggedProvider from '@/components/Providers/LoggedProvider';
import NewsletterContent from "./content";
import {getCollection, getItems} from '@/utils/firebase';

export default async function Newsletter() {
    const newsletter_colecao = getCollection('newsletter');
    
    //lista de inscritos na newsletter
   const inscritos = await getItems(newsletter_colecao);

    return (
        <LoggedProvider>
            <PanelLayout  title="Newsletter" page="newsletter">
                    <NewsletterContent inscritos={inscritos} />
            </PanelLayout>
        </LoggedProvider>
    );
}

