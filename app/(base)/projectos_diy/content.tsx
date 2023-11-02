
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

interface ProjectosDIYContentProps {
    projectos: {
        id: string,
        data: any
    }[];
}
export default function ProjectosDIYContent({ projectos }: ProjectosDIYContentProps) {
    
    const [showModal, setShowModal] = useState(false);
    
    //ID do documento (elemento) que está ser atualizado no modal
    const [docId, setDocId] = useState<string | null>(null);
    const [modalData, setModalData]= useState({
        titulo:'', 
        nome:'', 
        email:'', 
        descricao:'', 
        visualizacoes: '',
        link:'',
        fotoUrl: '', 
        fotoUrlDownload:'', 
        id:''
    });

    const clickItem = (docId:string)=>{
        setDocId(docId);
        setShowModal(true);

        const doc = projectos.find((projecto)=>{
            if(projecto.id == docId){
                return true;
             
            }

            return false;
        });
        
     

        setModalData({
            titulo:doc?.data.titulo, 
            nome:doc?.data.nome, 
            email:doc?.data.email, 
            descricao:doc?.data.descricao, 
            visualizacoes: doc?.data.visualizacoes,
            link:doc?.data.link, 
            id:doc?.data.id, 
            fotoUrl: doc?.data.fotoUrl, 
            fotoUrlDownload:doc?.data.fotoUrlDownload
        })
    }

    const openModal = () => {

        setDocId(null);
        setShowModal(true);
      
        setModalData({
            titulo:'', 
            nome:'', 
            email:'', 
            descricao:'', 
            visualizacoes: '',
            link:'', 
            fotoUrl: '', 
            fotoUrlDownload:'', 
            id:''
    
        });
        
    }

    const closeModal = () => {

        setShowModal(false);
    }


    const exportData = ()=>{
        exportDataExcel(projectos.map((projecto)=>{
            return projecto.data;
        }), 'Projecto DIY');
    }


    const tableData: TableData = {
        labels: ['Título', 'Nome', 'Email', 'Descrição', 'Visualizações', 'Link'],
        onClickRow: clickItem,
        rows: projectos.map((projecto) => {
            const data = projecto.data;

            return {
                id: projecto.id.toString(),
                columns_data: [
                    data.titulo.toString(),
                    data.nome.toString(),
                    data.email.toString(),
                    data.descricao.toString(),
                    data.visualizacoes.toString(),
                    data.link.toString(),
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
                <ModalHeader title={(docId == null ? 'Cadastrar' : 'Atualizar') + ' Projecto'} onClose={closeModal}>
                    {docId == null ?
                        '' :
                        (<form action={deleteDocAction} onSubmit={()=>{
                            setShowModal(false);
                        }}> 
                            <input type="hidden" name='redirect_url' value='/projectos_diy'/>
                            <input type="hidden" name='collection' value='projetos'/>
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
                    <input type="hidden" name='redirect_url' value='/projectos_diy'/>
                    <input type="hidden" name='collection' value='projetos'/>
                    <input type="hidden" name="docId" value={docId == null ? '': docId} />
                    <ModalContent>
                        <ModalInput label='ID' name="id" placeholder='ID: ' initialValue={modalData.id}/>
                        <ModalInput label='Título' name="titulo" placeholder='Título: ' initialValue={modalData.titulo}/>
                        <ModalInput label='Descrição' name="descricao" placeholder='Descrição: ' type="textarea" initialValue={modalData.descricao}/>
                        <ModalInput label='Email' name="email" placeholder='Email: ' initialValue={modalData.email}/>
                        <ModalInput label='Nome' name="nome" placeholder='Nome: '  initialValue={modalData.nome} />
                        <ModalInput label='Link' name="link" placeholder='Link: '  initialValue={modalData.link} />
                        <ModalInput label='Visualizações' name="visualizacoes" placeholder='Visualizações: '  initialValue={modalData.visualizacoes} />
                        <ModalInput label='Foto URL' name="fotoUrl" placeholder='Foto URL: '  initialValue={modalData.fotoUrl} />
                        <ModalInput label='Foto URL Download' name="fotoUrlDownload" placeholder='Foto URL Download: '  initialValue={modalData.fotoUrlDownload} />

                    </ModalContent>

                    <ModalFooter update={docId == null ? false: true}></ModalFooter>
                </form>
            </Modal>

        </>
    );
}