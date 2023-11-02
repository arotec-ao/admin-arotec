
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

import { useState } from 'react';

import { modalFormAction, deleteDocAction } from '@/app/actions';
import { exportDataExcel } from '@/utils/excel';

interface PlayersContentProps {
    players: {
        id: string,
        data: any
    }[];
}
export default function PlayersContent({ players }: PlayersContentProps) {


    const [showModal, setShowModal] = useState(false);
    
    //ID do documento (elemento) que está ser atualizado no modal
    const [docId, setDocId] = useState<string | null>(null);
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
        exportDataExcel(players.map((player)=>{
            return player.data;
        }), 'Jogadores do Okupalenda');
    }


    const tableData: TableData = {
        labels: ['Nome', 'País', 'ISO', 'Pontos'],
        onClickRow: clickItem,

        rows: players.map((player) => {
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
            <div className='table-area-header'>
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