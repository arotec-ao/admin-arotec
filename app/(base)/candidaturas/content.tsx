
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

import { modalFormAction, deleteDocAction, deleteDocsAction } from '@/app/actions';
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
    
    //Documentos selecionados para deletar
    const [docsSelected, setDocsSelected]= useState<string[]>([]);

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

    const selectItem = (id:string)=>{

        if(docsSelected.includes(id)){
          setDocsSelected(docsSelected.filter((doc)=>{
                if(doc == id) return false;
                return true;
          }));
        }
        else{
            setDocsSelected([...docsSelected, id]);
        }

    }
    const selectAllToogle= ()=>{
        if(docsSelected.length == candidaturas.length){
            setDocsSelected([]);
        }
        else{
            setDocsSelected(candidaturas.map((candidatura)=>{
                return candidatura.id;
            }))
        }
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
        onSelectRow:selectItem,
        onSelectToogleAll: selectAllToogle,
        selecteds:docsSelected,
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
                    <form action={async (data:FormData)=>{
                        await deleteDocsAction(data);
                        setDocsSelected([]);
                    }} onSubmit={()=>{
                            setShowModal(false);
                        }}> 
                            <input type="hidden" name='redirect_url' value='/candidaturas'/>
                            <input type="hidden" name='collection' value='candidaturas'/>


                            <input type="hidden" name="docs" value={docsSelected.length > 0 ? docsSelected.reduce((previous, value)=> {
                                return previous + ' '+value;
                            }): ''} />
                             <button className="btn-table btn-table-delete-item" 
                            disabled={docsSelected.length == 0 ? true :false }>
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