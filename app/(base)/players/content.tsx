
'use client'

import Image from 'next/image';

//Tabela 
import { generateTable, TableData } from '@/components/Table';

//Modal
import Modal from '@/components/Modal';
import ModalHeader from '@/components/Modal/Header';
import ModalContent from '@/components/Modal/Content';
import ModalFooter from '@/components/Modal/Footer';
import ModalInput from '@/components/Modal/Input';

import { useState, useMemo } from 'react';

import { modalFormAction, deleteDocAction, deleteDocsAction } from '@/app/actions';
import { exportDataExcel } from '@/utils/excel';

interface PlayersContentProps {
    players: {
        id: string,
        data: any
    }[];
}
export default function PlayersContent({ players }: PlayersContentProps) {

    const [pesquisa, setPesquisa] = useState('');
    const [filtro, setFiltro] = useState('nome');

    //faz o filtro de busca
    const playersFiltrados = useMemo(()=>{

        //verificar a pesquisa
        const plys = players.filter((player)=>{

            var isValid =false;
            if(pesquisa !=  ''){
                if ((new RegExp(pesquisa , 'i')).test(player.data.nome)){
                    isValid=true;
                }
            }
            else{
                isValid=true;
            }
            return isValid;
        });
    
        //verificar a categoria
        return plys.sort((a:any, b:any)=>{
            switch (filtro){
                case 'nome':
                    if(a.data.nome < b.data.nome) { return -1; }
                    if(a.data.nome > b.data.nome) { return 1; }
                    return 0;
                 
                case 'iso':
                    if(a.data.iso < b.data.iso) { return -1; }
                    if(a.data.iso > b.data.iso) { return 1; }
                    return 0;
                 
                case 'pais':
                    if(a.data.pais < b.data.pais) { return -1; }
                    if(a.data.pais > b.data.pais) { return 1; }
                    return 0;

                    case 'pontos':
                        if(a.data.pontos < b.data.pontos) { return 1; }
                        if(a.data.pontos > b.data.pontos) { return -1; }
                        return 0;
         
                default:
                        if(a.data.nome < b.data.nome) { return -1; }
                        if(a.data.nome > b.data.nome) { return 1; }
                        return 0;
            }
        })

    }, [players, filtro, pesquisa]);

    const [showModal, setShowModal] = useState(false);
    
    //ID do documento (elemento) que está ser atualizado no modal
    const [docId, setDocId] = useState<string | null>(null);
    
    //Documentos selecionados para deletar
    const [docsSelected, setDocsSelected] = useState<string[]>([]);

    const [modalData, setModalData]= useState({
        nome:'', 
        pais:'', 
        iso:"",
        pontos:'0'
    });

    const clickItem = (docId:string)=>{
        setDocId(docId);
        setShowModal(true);

        const doc = players.find((player)=>{
            if(player.id == docId){
                return true;
            }

            return false;
        });

        setModalData({
            nome: doc?.data.nome, 
            pais: doc?.data.pais, 
            iso: doc?.data.iso, 
            pontos: doc?.data.pontos, 
        })
    }

    const selectItem = (id: string) => {

        if (docsSelected.includes(id)) {
            setDocsSelected(docsSelected.filter((doc) => {
                if (doc == id) return false;
                return true;
            }));
        }
        else {
            setDocsSelected([...docsSelected, id]);
        }

    }
    const selectAllToogle = () => {
        if (docsSelected.length == players.length) {
            setDocsSelected([]);
        }
        else {
            setDocsSelected(players.map((player) => {
                return player.id;
            }))
        }
    }

    const openModal = () => {

        setDocId(null);
        setShowModal(true);
      
        setModalData({
            nome:'', 
            pais:'', 
            iso:"",
            pontos:'0'
    
        });

     
    }

    const closeModal = () => {

        setShowModal(false);
    }


    const exportData = ()=>{
        exportDataExcel(playersFiltrados.map((player)=>{
            return player.data;
        }), 'Jogadores do Okupalenda');
    }


    const tableData: TableData = {
        labels: ['Nome', 'País', 'ISO', 'Pontos'],
        onClickRow: clickItem,
        onSelectRow: selectItem,
        onSelectToogleAll: selectAllToogle,
        selecteds: docsSelected,

        rows: playersFiltrados.map((player) => {
            const data = player.data;
            return {
                id: player.id.toString(),
                columns_data: [
                    data.nome.toString(),
                    data.pais.toString(),
                    data.iso.toString(),
                    data.pontos.toString(),
                ]
            }
        })
    };


    return (
        <>
        <div className='table-area'>
            <div className='table-area-title'></div>
            <div className='table-filtros'>
                    <div className='table-filtros-pesquisa'>
                        Pesquise:
                        <input className='pesquisa-input' type="text"  placeholder='Escreve o nome do aluno...' 
                        onChange={(ev)=>{
                            setPesquisa(ev.target.value);
                        }}/>
                    </div>
                    <div className='table-filtros-agrupar'>
                        Agrupar por: 
                        <select className='agrupar-input'onChange={(ev)=>{
                            setFiltro(ev.target.value);
                        }}>
                            <option value='nome'>Nome</option>
                            <option value='pais'>País</option>
                            <option value='iso'>ISO</option>
                            <option value='pontos'>Pontos</option>
                 
                        </select>

                    </div>
                
                </div>
            <div className='table-area-header'>
            <form action={async (data: FormData) => {
                        await deleteDocsAction(data);
                        setDocsSelected([]);
                    }} onSubmit={() => {
                        setShowModal(false);
                    }}>
                        <input type="hidden" name='redirect_url' value='/players' />
                        <input type="hidden" name='collection' value='players' />

                        <input type="hidden" name="docs" value={docsSelected.length > 0 ? docsSelected.reduce((previous, value) => {
                            return previous + ' ' + value;
                        }) : ''} />
                        <button className="btn-table btn-table-delete-item"
                            disabled={docsSelected.length == 0 ? true : false}>
                            <Image src='/icons/trash.png' width='20' height='20' alt='' />
                            Apagar Itens
                        </button>
            </form>
                    
                <button className="btn-table btn-table-add" onClick={openModal}>
                    <Image src='/icons/add.png' width='20' height='20' alt='' />
                    Adicionar
                </button>
                <button className="btn-table btn-table-export" onClick={exportData}>
                    <Image src='/icons/excel.png' width='20' height='20' alt='' />
                    Exportar para Excel
                </button>
            </div>
            <div className='table-real'>
                {generateTable(tableData)}
            </div>
        </div>

        <Modal show={showModal}>
                <ModalHeader title={(docId == null ? 'Cadastrar' : 'Atualizar') + ' Jogador'} onClose={closeModal}>
                    {docId == null ?
                        '' :
                        (<form action={deleteDocAction} onSubmit={()=>{
                            setShowModal(false);
                        }}> 
                            <input type="hidden" name='redirect_url' value='/players'/>
                            <input type="hidden" name='collection' value='players'/>
                            <input type="hidden" name="docId" value={docId == null ? '': docId} />
                            <button className='btn-delete-in-modal' type="submit">
                                <Image src='/icons/trash.png' width='20' height='20' alt='' />
                                Deletar
                            </button>
                        </form>)
                    }

                </ModalHeader>
                <form action={modalFormAction} onSubmit={()=>{
                    setShowModal(false);
                }}>
                    <input type="hidden" name='redirect_url' value='/players'/>
                    <input type="hidden" name='collection' value='players'/>
                    <input type="hidden" name="docId" value={docId == null ? '': docId} />
                    <ModalContent>
                        <ModalInput label='Nome Completo' name="nome" placeholder='Nome: ' initialValue={modalData.nome}/>
                        <ModalInput label='País' name="pais" placeholder='País: ' initialValue={modalData.pais}/>
                        <ModalInput label='ISO' name="iso" placeholder='ISO: ' initialValue={modalData.iso}/>
                        <ModalInput label='Pontos' name="pontos" placeholder='Pontos: ' initialValue={modalData.pontos}/>
                    </ModalContent>

                    <ModalFooter update={docId == null ? false: true}></ModalFooter>
                </form>
            </Modal>

        </>
    );
}