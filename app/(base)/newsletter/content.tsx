
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
import { Timestamp } from 'firebase/firestore';

import { modalFormAction, deleteDocAction } from '@/app/actions';
import { exportDataExcel } from '@/utils/excel';


interface NewsletterContentProps {
    inscritos: {
        id: string,
        data: any
    }[];
}
export default function NewsletterContent({ inscritos }: NewsletterContentProps) {
    const [showModal, setShowModal] = useState(false);
    
    //ID do documento (elemento) que está ser atualizado no modal
    const [docId, setDocId] = useState<string | null>(null);
    const [modalData, setModalData]= useState({
        email:''
    });

    const clickItem = (docId:string)=>{
        setDocId(docId);
        setShowModal(true);

        const doc = inscritos.find((inscrito)=>{
            if(inscrito.id == docId){
                return true;
            }

            return false;
        });

        setModalData({
            email:doc?.data.email
        })
    }

    const openModal = () => {

        
        setDocId(null);
        setShowModal(true);
      
        setModalData({
           email:''

        });

    }

    const closeModal = () => {

        setShowModal(false);
    }


    const exportData = ()=>{
        exportDataExcel(inscritos.map((inscrito)=>{
            return {...inscrito.data, 
                dataEnvio:
                ( Timestamp.fromMillis(inscrito.data.dataEnvio.seconds * 1000).
                toDate().toLocaleDateString("pt-pt")) };
        }), 'Inscritos na Newsletter');
    }

    const tableData: TableData = {
        labels: ['Email', 'Data de inscrição'],
        onClickRow: clickItem,
        rows: inscritos.map((inscrito) => {
            const data = inscrito.data;

            return {
                id: inscrito.id.toString(),
                columns_data: [
                    data.email.toString(),
                    Timestamp.fromMillis(data.dataEnvio.seconds * 1000).toDate().toLocaleDateString("pt-pt")

                ]
            }
        })
    };


    return (
        <>
        <div className='table-area'>
            <div className='table-area-title'>Inscritos na newsletter</div>
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
                <ModalHeader title={(docId == null ? 'Cadastrar' : 'Atualizar') + ' Inscrito'} onClose={closeModal}>
                    {docId == null ?
                        '' :
                        (<form action={deleteDocAction} onSubmit={()=>{
                            setShowModal(false);
                        }}> 
                            <input type="hidden" name='redirect_url' value='/newsletter'/>
                            <input type="hidden" name='collection' value='newsletter'/>
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
                    <input type="hidden" name='redirect_url' value='/newsletter'/>
                    <input type="hidden" name='collection' value='newsletter'/>
                    <input type="hidden" name="docId" value={docId == null ? '': docId} />
                    <ModalContent>
                        <ModalInput label='Email' name="email" placeholder='Email: '  initialValue={modalData.email} />
                    </ModalContent>

                    <ModalFooter update={docId == null ? false: true}></ModalFooter>
                </form>
            </Modal>


        </>
    );
}