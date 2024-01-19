//styles
import './style.css';

//components
import PanelLayout from '@/components/PanelLayout';
import CardDashboard from '@/components/CardDashboard';

//Logado
import LoggedProvider from '@/components/Providers/LoggedProvider';

import {sizeCollection, getCollection} from '@/utils/firebase';

async function getSizeColecoes() {
  return {
    academia: await sizeCollection(getCollection('inscricao')),
    compras: await sizeCollection(getCollection('compras')),
    produtos: await sizeCollection(getCollection('produtos')),
    candidaturas:await sizeCollection(getCollection('candidaturas')),
    equipes: await sizeCollection(getCollection('equipes')),
    voluntarios: await sizeCollection(getCollection('voluntarios')),
    projectos_diy: await sizeCollection (getCollection('projetos')),
    sinopec_learn: await sizeCollection (getCollection('sinopec_learn')),
    unitel_code: await sizeCollection (getCollection('unitel_code')),
    players: await sizeCollection (getCollection('players')),
    mensagens: await sizeCollection (getCollection('mensagens')),
    newsletter: await sizeCollection (getCollection('newsletter')),
 }
 
 
}
export default async function Home() {
  const size_colecoes =  await getSizeColecoes();
  
  return (
    <LoggedProvider>
        <PanelLayout  title="Dashboard" page="home">
            <div className="cards-dashboard-container">
      
                <CardDashboard title='Alunos da Academia' url_view='/academia' value={size_colecoes.academia} />
                <CardDashboard title='Compras da Loja IO' url_view='/compras' value={size_colecoes.compras} />
                <CardDashboard title='Produtos da Loja IO' url_view='/produtos' value={size_colecoes.produtos} />
                <CardDashboard title='Candidaturas de Estágio' url_view='/candidaturas' value={size_colecoes.candidaturas} />
                <CardDashboard title='Equipes do CANAR' url_view='/equipes-canar' value={size_colecoes.equipes} />
                <CardDashboard title='Voluntários' url_view='/voluntarios' value={size_colecoes.voluntarios} />
                <CardDashboard title='Projectos DIY' url_view='/projectos_diy' value={size_colecoes.projectos_diy} />
                <CardDashboard title='Alunos Sinopec Learn' url_view='/sinopec_learn' value={size_colecoes.sinopec_learn} />
                <CardDashboard title='Alunos Unitel Code' url_view='/unitel_code' value={size_colecoes.unitel_code} />
                <CardDashboard title='Jogadores (Okupalenda)' url_view='/players' value={size_colecoes.players} />
                <CardDashboard title='Mensagens' url_view='/mensagens' value={size_colecoes.mensagens} />
                <CardDashboard title='Inscritos na Newsletter' url_view='/newsletter' value={size_colecoes.newsletter} />
  </div>
        </PanelLayout>
    </LoggedProvider>
  )
}
