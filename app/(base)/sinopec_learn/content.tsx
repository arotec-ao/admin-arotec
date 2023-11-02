
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


interface SinopecLearnContentProps {
    alunos: {
        id: string,
        data: any
    }[];
}
export default function SinopecLearnContent({ alunos }: SinopecLearnContentProps) {

    const [showModal, setShowModal] = useState(false);
    
    //ID do documento (elemento) que está ser atualizado no modal
    const [docId, setDocId] = useState<string | null>(null);
    const [modalData, setModalData]= useState({
        nome:'', 
        telefone:'', 
        endereco: '', 
        email:'', 
        local:'',
        encarregado:'',
        idade: '', 
        hora:'', 
    });

    const clickItem = (docId:string)=>{
        setDocId(docId);
        setShowModal(true);

        const doc = alunos.find((aluno)=>{
            if(aluno.id == docId){
                return true;
            }

            return false;
        });

        setModalData({
            nome: doc?.data.nome, 
            telefone: doc?.data.telefone, 
            endereco: doc?.data.endereco, 
            email: doc?.data.email,
            local: doc?.data.local,
            encarregado: doc?.data.encarregado,
            idade: doc?.data.idade,
            hora: doc?.data.hora,
        })
    }

    const openModal = () => {

        
        setDocId(null);
        setShowModal(true);
      
        setModalData({
            nome:'', 
            telefone:'', 
            endereco: '', 
            email:'', 
            local:'',
            encarregado:'',
            idade: '', 
            hora:'', 
    
        });

    }

    const closeModal = () => {

        setShowModal(false);
    }


    const exportData = ()=>{
        exportDataExcel(alunos.map((aluno)=>{
            return {...aluno.data, 
                dataEnvio:
                ( Timestamp.fromMillis(aluno.data.dataEnvio.seconds * 1000).
                toDate().toLocaleDateString("pt-pt")) };
        }), 'Alunos do Sinopec Learn');
    }

    const tableData: TableData = {
        labels: ['Nome completo', 'Email', 'Telefone', 'Encarregado',
         'Idade', 'Local', 'Hora',
            'Endereço', 'Data de inscricão'],
        onClickRow: clickItem,
        rows: alunos.map((aluno) => {
            const data = aluno.data;

            return {
                id: aluno.id.toString(),
                columns_data: [
                    data.nome.toString(),
                    data.email.toString(),
                    data.telefone.toString(),
                    data.encarregado.toString(),
                    data.idade.toString(),
                    data.local.toString(),
                    data.hora.toString(),
                    data.endereco.toString(),
                    Timestamp.fromMillis(data.dataEnvio.seconds * 1000).toDate().toLocaleDateString("pt-pt")

                ]
            }
        })
    };


    return (
        <>
        <div className='table-area'>
            <div className='table-area-title'>Alunos do Sinopec Learn</div>
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
                <ModalHeader title={(docId == null ? 'Cadastrar' : 'Atualizar') + ' Aluno'} onClose={closeModal}>
                    {docId == null ?
                        '' :
                        (<form action={deleteDocAction} onSubmit={()=>{
                            setShowModal(false);
                        }}> 
                            <input type="hidden" name='redirect_url' value='/sinopec_learn'/>
                            <input type="hidden" name='collection' value='sinopec_learn'/>
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
                    <input type="hidden" name='redirect_url' value='/sinopec_learn'/>
                    <input type="hidden" name='collection' value='sinopec_learn'/>
                    <input type="hidden" name="docId" value={docId == null ? '': docId} />
                    <ModalContent>
                        <ModalInput label='Nome Completo' name="nome" placeholder='Nome: ' initialValue={modalData.nome}/>
                        <ModalInput label='Email' name="email" placeholder='Email: '  initialValue={modalData.email} />
                        <ModalInput label='Telefone' name="telefone" placeholder='Telefone: '   initialValue={modalData.telefone}/>
                        <ModalInput label='Endereço' name="endereco" placeholder='Endereço: '  initialValue={modalData.endereco} />
                        <ModalInput label='Encarregado' name="encarregado" placeholder='Encarregado: '  initialValue={modalData.encarregado} />
                        <ModalInput label='Idade' name="idade" placeholder='Idade: '  initialValue={modalData.idade} />
                        <ModalInput label='Local' name="local" placeholder='Local: '  initialValue={modalData.local} />
                        <ModalInput label='Hora' name="hora" placeholder='Hora: '  initialValue={modalData.hora} />
                    </ModalContent>

                    <ModalFooter update={docId == null ? false: true}></ModalFooter>
                </form>
            </Modal>

        </>
    );
}