
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

import { modalFormAction, deleteDocAction, deleteDocsAction } from '@/app/actions';
import { exportDataExcel } from '@/utils/excel';


interface MensagensContentProps {
    mensagens: {
        id: string,
        data: any
    }[];
}
export default function MensagensContent({ mensagens }: MensagensContentProps) {

    const [showModal, setShowModal] = useState(false);

    //ID do documento (elemento) que está ser atualizado no modal
    const [docId, setDocId] = useState<string | null>(null);

    //Documentos selecionados para deletar
    const [docsSelected, setDocsSelected] = useState<string[]>([]);

    const [modalData, setModalData] = useState({
        nomeCompleto: '',
        telefone: '',
        email: '',
        mensagem: '',
    });

    const clickItem = (docId: string) => {
        setDocId(docId);
        setShowModal(true);

        const doc = mensagens.find((mensagem) => {
            if (mensagem.id == docId) {
                return true;
            }

            return false;
        });

        setModalData({
            nomeCompleto: doc?.data.nomeCompleto,
            telefone: doc?.data.telefone,
            email: doc?.data.email,
            mensagem: doc?.data.mensagem,
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
        if (docsSelected.length == mensagens.length) {
            setDocsSelected([]);
        }
        else {
            setDocsSelected(mensagens.map((mensagem) => {
                return mensagem.id;
            }))
        }
    }

    const openModal = () => {

        setDocId(null);
        setShowModal(true);

        setModalData({
            nomeCompleto: '',
            telefone: '',
            email: '',
            mensagem: '',

        });


    }

    const closeModal = () => {

        setShowModal(false);
    }


    const exportData = () => {
        exportDataExcel(mensagens.map((mensagem) => {
            return {
                ...mensagem.data,
                dataEnvio:
                    (Timestamp.fromMillis(mensagem.data.dataEnvio.seconds * 1000).
                        toDate().toLocaleDateString("pt-pt"))
            };
        }), 'Mensagens');
    }

    const tableData: TableData = {
        labels: ['Nome completo', 'Telefone', 'Email', 'Mensagem', 'Data de envio'],

        onClickRow: clickItem,
        onSelectRow: selectItem,
        onSelectToogleAll: selectAllToogle,
        selecteds: docsSelected,

        rows: mensagens.map((mensagem) => {
            const data = mensagem.data;

            return {
                id: mensagem.id.toString(),
                columns_data: [
                    data.nomeCompleto.toString(),
                    data.telefone.toString(),
                    data.email.toString(),
                    data.mensagem.toString(),
                    Timestamp.fromMillis(data.dataEnvio.seconds * 1000).toDate().toLocaleDateString("pt-pt")
                ]
            }
        })
    };


    return (
        <><div className='table-area'>
            <div className='table-area-title'></div>
            <div className='table-area-header'>

                <form action={async (data: FormData) => {
                    await deleteDocsAction(data);
                    setDocsSelected([]);
                }} onSubmit={() => {
                    setShowModal(false);
                }}>
                    <input type="hidden" name='redirect_url' value='/mensagens' />
                    <input type="hidden" name='collection' value='mensagens' />


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
                <ModalHeader title={(docId == null ? 'Cadastrar' : 'Atualizar') + ' Mensagem'} onClose={closeModal}>
                    {docId == null ?
                        '' :
                        (<form action={deleteDocAction} onSubmit={() => {
                            setShowModal(false);
                        }}>
                            <input type="hidden" name='redirect_url' value='/mensagens' />
                            <input type="hidden" name='collection' value='mensagens' />
                            <input type="hidden" name="docId" value={docId == null ? '' : docId} />
                            <button className='btn-delete-in-modal' type="submit">
                                <Image src='/icons/trash.png' width='20' height='20' alt='' />
                                Deletar
                            </button>
                        </form>)
                    }

                </ModalHeader>
                <form action={modalFormAction} onSubmit={() => {
                    setShowModal(false);
                }}>
                    <input type="hidden" name='redirect_url' value='/mensagens' />
                    <input type="hidden" name='collection' value='mensagens' />
                    <input type="hidden" name="docId" value={docId == null ? '' : docId} />
                    <ModalContent>
                        <ModalInput label='Nome Completo' name="nomeCompleto" placeholder='Nome: ' initialValue={modalData.nomeCompleto} />
                        <ModalInput label='Email' name="email" placeholder='Email: ' initialValue={modalData.email} />
                        <ModalInput label='Telefone' name="telefone" placeholder='Telefone: ' initialValue={modalData.telefone} />
                        <ModalInput label='Mensagem' name="mensagem" type="textarea" placeholder='Mensagem: ' initialValue={modalData.mensagem} />

                    </ModalContent>

                    <ModalFooter update={docId == null ? false : true}></ModalFooter>
                </form>
            </Modal>

        </>
    );
}