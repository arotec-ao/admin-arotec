
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

interface CandidaturasContentProps {
    candidaturas: {
        id: string,
        data: any
    }[];
}
export default function CandidaturasContent({ candidaturas }: CandidaturasContentProps) {
    const [showModal, setShowModal] = useState(false);
    
    //ID do documento (elemento) que está ser atualizado no modal
    const [docId, setDocId] = useState<string | null>(null);
    const [modalData, setModalData]= useState({
        nome:'', 
        telefone:'', 
        email:''
    });

    
    const clickItem = (docId:string)=>{
        setDocId(docId);
        setShowModal(true);

        const doc = candidaturas.find((candidatura)=>{
            if(candidatura.id == docId){
                return true;
            }

            return false;
        });

        setModalData({
            nome: doc?.data.nome, 
            telefone: doc?.data.telefone, 
            email: doc?.data.email,
        })
    }

    const openModal = () => {
        setDocId(null);
        setShowModal(true);
      
        setModalData({
            nome:'', 
            telefone:'', 
            email:''
        });

        
    }

    const closeModal = () => {
        setShowModal(false);
    }

    const exportData = ()=>{
        exportDataExcel(candidaturas.map((candidatura)=>{
            return candidatura.data;
        }), 'Candidaturas de Estágio');
    }

    const tableData: TableData = {
        labels: ['Nome Completo', 'Email', 'Telefone'],
        onClickRow: clickItem,
        rows: candidaturas.map((candidatura) => {
            const data = candidatura.data;

            return {
                id: candidatura.id.toString(),
                columns_data: [
                    data.nome.toString(),
                    data.email.toString(),
                    data.telefone.toString(),
                ]
            }
        })
    };


    return (
        <>
            <div className='table-area'>
                <div className='table-area-title'>Candidaturas para Estágio</div>
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
                <ModalHeader title={(docId == null ? 'Cadastrar' : 'Atualizar') + ' Candidatura'} onClose={closeModal}>
                    {docId == null ?
                        '' :
                        (<form action={deleteDocAction} onSubmit={()=>{
                            setShowModal(false);
                        }}> 
                            <input type="hidden" name='redirect_url' value='/candidaturas'/>
                            <input type="hidden" name='collection' value='candidaturas'/>
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
                    <input type="hidden" name='redirect_url' value='/candidaturas'/>
                    <input type="hidden" name='collection' value='candidaturas'/>
                    <input type="hidden" name="docId" value={docId == null ? '': docId} />
                    <ModalContent>
                        <ModalInput label='Nome Completo' name="nome" placeholder='Nome: ' initialValue={modalData.nome}/>
                        <ModalInput label='Email' name="email" placeholder='Email: '  initialValue={modalData.email} />
                        <ModalInput label='Telefone' name="telefone" placeholder='Telefone: '   initialValue={modalData.telefone}/>
                    </ModalContent>

                    <ModalFooter update={docId == null ? false: true}></ModalFooter>
                </form>
            </Modal>



        </>
    );
}