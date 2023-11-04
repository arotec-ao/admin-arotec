
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
import ModalSelect from '@/components/Modal/Select';
import ModalSelectOption from '@/components/Modal/Select/Option';

import { useState } from 'react';
import { Timestamp } from 'firebase/firestore';

import { modalFormAction, deleteDocAction, deleteDocsAction} from '@/app/actions';
import { exportDataExcel } from '@/utils/excel';

interface AcademiaContentProps {
    alunos: {
        id: string,
        data: any
    }[];
}

const cursos= [
    'Curso Pequeno Engenheiro', 
    'Curso de Arduino', 
    'Mecânica e Eletrônica Industrial'
];

const modalidades=['Presencial', 'Online'];

export default function AcademiaContent({ alunos }: AcademiaContentProps) {

    const [showModal, setShowModal] = useState(false);
    
    //ID do documento (elemento) que está ser atualizado no modal
    const [docId, setDocId] = useState<string | null>(null);

    //Documentos selecionados para deletar
    const [docsSelected, setDocsSelected]= useState<string[]>([]);

    const [modalData, setModalData]= useState({
        nome:'', 
        telefone:'', 
        endereco: '', 
        email:'', 
        curso: 0, 
        modalidade:0,
        senha:''

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
            curso: cursos.findIndex((value)=>{
                if(value == doc?.data.curso){
                    return true;
                }
                return false;
            }), 
            modalidade: modalidades.findIndex((value)=>{
                if(value == doc?.data.modalidade){
                    return true;
                }
                return false;
            }),
            senha:doc?.data.senha
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
        if(docsSelected.length == alunos.length){
            setDocsSelected([]);
        }
        else{
            setDocsSelected(alunos.map((aluno)=>{
                return aluno.id;
            }))
        }
    }

    const openModal = () => {
        setDocId(null);
        setShowModal(true);
      
        setModalData({
            nome:'', 
            telefone:'', 
            endereco: '', 
            email:'', 
            curso: 0, 
            modalidade:0, 
            senha:''
    
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
        }), 'Alunos da Academia');
    }

    const tableData: TableData = {
        labels: ['Nome Completo', 'Email', 'Telefone', 'Endereço', 'Curso', 'Modalidade',
            'Data de inscrição'],
        onClickRow: clickItem,
        onSelectRow:selectItem,
        onSelectToogleAll: selectAllToogle,
        selecteds:docsSelected,
        
        rows: alunos.map((aluno) => {
            const data = aluno.data;
            return {
                id: aluno.id.toString(),
                columns_data: [
                    data.nome.toString(),
                    data.email.toString(),
                    data.telefone.toString(),
                    data.endereco.toString(),
                    data.curso.toString(),
                    data.modalidade.toString(),
                    Timestamp.fromMillis(data.dataEnvio.seconds * 1000).toDate().toLocaleDateString("pt-pt")
                ]
            }
        })
    };


    return (
        <>
            <div className='table-area'>
                <div className='table-area-title'>Alunos da Academia</div>
                <div className='table-area-header'>
                    
                    <form action={async (data:FormData)=>{
                        await deleteDocsAction(data);
                        setDocsSelected([]);
                    }} onSubmit={()=>{
                            setShowModal(false);
                        }}> 
                            <input type="hidden" name='redirect_url' value='/academia'/>
                            <input type="hidden" name='collection' value='inscricao'/>


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
                <ModalHeader title={(docId == null ? 'Cadastrar' : 'Atualizar') + ' Aluno'} onClose={closeModal}>
                    {docId == null ?
                        '' :
                        (<form action={deleteDocAction} onSubmit={()=>{
                            setShowModal(false);
                        }}> 
                            <input type="hidden" name='redirect_url' value='/academia'/>
                            <input type="hidden" name='collection' value='inscricao'/>
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
                    <input type="hidden" name='redirect_url' value='/academia'/>
                    <input type="hidden" name='collection' value='inscricao'/>
                    <input type="hidden" name="docId" value={docId == null ? '': docId} />
                    <ModalContent>
                        <ModalInput label='Nome Completo' name="nome" placeholder='Nome: ' initialValue={modalData.nome}/>
                        <ModalInput label='Email' name="email" placeholder='Email: '  initialValue={modalData.email} />
                        <ModalInput label='Telefone' name="telefone" placeholder='Telefone: '   initialValue={modalData.telefone}/>
                        <ModalInput label='Endereço' name="endereco" placeholder='Endereço: '  initialValue={modalData.endereco} />

                        <ModalInput label='Curso' type='select'>
                            <ModalSelect name="curso">
                                {cursos.map((curso, index)=>{
                                    return (<ModalSelectOption current={index == modalData.curso ? true: false} key={index}>{curso}</ModalSelectOption>)
                                })}
                               
                            </ModalSelect>
                        </ModalInput>

                        <ModalInput label='Modalidade' type='select'>
                            <ModalSelect name="modalidade">
                                {modalidades.map((modalidade, index)=>{
                                    return (<ModalSelectOption current={index == modalData.modalidade ? true: false} key={index}>{modalidade}</ModalSelectOption>)
                                })}
                       
                            </ModalSelect>
                        </ModalInput>

                        <ModalInput label='Senha' name="senha" type="password" placeholder='Senha: ' initialValue={modalData.senha} />

                    </ModalContent>

                    <ModalFooter update={docId == null ? false: true}></ModalFooter>
                </form>
            </Modal>
        </>
    );
}