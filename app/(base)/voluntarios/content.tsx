
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

import { useState, useMemo } from 'react';

import { modalFormAction, deleteDocAction, deleteDocsAction } from '@/app/actions';
import { exportDataExcel } from '@/utils/excel';

interface VoluntariosContentProps {
    voluntarios: {
        id: string,
        data: any
    }[];
}


const graus_academicos = [
    'Ensino Superior', 
    'Ensino Médio', 
    'Ensino Fundamental', 
    'N/A'
]


export default function VoluntariosContent({ voluntarios }: VoluntariosContentProps) {

    const [pesquisa, setPesquisa] = useState('');
    const [filtro, setFiltro] = useState('nome');

    //faz o filtro de busca
    const voluntariosFiltrados = useMemo(() => {

        //verificar a pesquisa
        const vls = voluntarios.filter((aluno) => {

            var isValid = false;
            if (pesquisa != '') {
                if ((new RegExp(pesquisa, 'i')).test(aluno.data.nome)) {
                    isValid = true;
                }
            }
            else {
                isValid = true;
            }
            return isValid;
        });

        //verificar a categoria
        return vls.sort((a: any, b: any) => {
            switch (filtro) {
                case 'nome':
                    if (a.data.nome < b.data.nome) { return -1; }
                    if (a.data.nome > b.data.nome) { return 1; }
                    return 0;

                case 'idade':
                    if (a.data.idade < b.data.idade) { return -1; }
                    if (a.data.idade > b.data.idade) { return 1; }
                    return 0;

                case 'grau':
                    if (a.data.grau_academica < b.data.grau_academica) { return -1; }
                    if (a.data.grau_academica > b.data.grau_academica) { return 1; }
                    return 0;
                default:
                    if (a.data.nome < b.data.nome) { return -1; }
                    if (a.data.nome > b.data.nome) { return 1; }
                    return 0;
            }
        })

    }, [voluntarios, filtro, pesquisa]);

    const [showModal, setShowModal] = useState(false);

    //ID do documento (elemento) que está ser atualizado no modal
    const [docId, setDocId] = useState<string | null>(null);

    //Documentos selecionados para deletar
    const [docsSelected, setDocsSelected] = useState<string[]>([]);

    const [modalData, setModalData] = useState({
        nome: '',
        telefone: '',
        email: '',
        grau_academica: '',
        idade: '',
        interesses: ''

    });

    const clickItem = (docId: string) => {
        setDocId(docId);
        setShowModal(true);

        const doc = voluntarios.find((voluntario) => {
            if (voluntario.id == docId) {
                return true;
            }

            return false;
        });

        setModalData({
            nome: doc?.data.nome,
            telefone: doc?.data.telefone,
            email: doc?.data.email,
            grau_academica: doc?.data.grau_academica,
            idade: doc?.data.idade,
            interesses: doc?.data.interesses
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
        if (docsSelected.length == voluntarios.length) {
            setDocsSelected([]);
        }
        else {
            setDocsSelected(voluntarios.map((voluntario) => {
                return voluntario.id;
            }))
        }
    }

    const openModal = () => {
        setDocId(null);
        setShowModal(true);

        setModalData({
            nome: '',
            telefone: '',
            email: '',
            grau_academica: '',
            idade: '',
            interesses: ''
        });

    }

    const closeModal = () => {

        setShowModal(false);
    }


    const exportData = () => {
        exportDataExcel(voluntariosFiltrados.map((voluntario) => {
            return {
                ...voluntario.data,
                participou: voluntario.data.participou == true ? 'Sim' : 'Não'
            };
        }), 'Voluntários');
    }

    const tableData: TableData = {
        labels: ['Nome Completo', 'Idade', 'Grau Acadêmico', 'Email', 'Telefone', 'Participou do CANAR antes?'],
        onClickRow: clickItem,
        onSelectRow: selectItem,
        onSelectToogleAll: selectAllToogle,
        selecteds: docsSelected,

        rows: voluntariosFiltrados.map((voluntario) => {
            const data = voluntario.data;
            return {
                id: voluntario.id.toString(),
                columns_data: [
                    data.nome.toString(),
                    data.idade.toString(),
                    data.grau_academica.toString(),
                    data.email.toString(),
                    data.telefone.toString(),
                    data.participou == true ? 'Sim' : 'Não'
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
                        <input className='pesquisa-input' type="text" placeholder='Escreve o nome do aluno...'
                            onChange={(ev) => {
                                setPesquisa(ev.target.value);
                            }} />
                    </div>
                    <div className='table-filtros-agrupar'>
                        Agrupar por:
                        <select className='agrupar-input' onChange={(ev) => {
                            setFiltro(ev.target.value);
                        }}>
                            <option value='nome'>Nome</option>
                            <option value='idade'>Idade</option>
                            <option value='grau'>Grau Acadêmico</option>
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
                        <input type="hidden" name='redirect_url' value='/voluntarios' />
                        <input type="hidden" name='collection' value='voluntarios' />


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
                <ModalHeader title={(docId == null ? 'Cadastrar' : 'Atualizar') + ' Voluntário'} onClose={closeModal}>
                    {docId == null ?
                        '' :
                        (<form action={deleteDocAction} onSubmit={() => {
                            setShowModal(false);
                        }}>
                            <input type="hidden" name='redirect_url' value='/voluntarios' />
                            <input type="hidden" name='collection' value='voluntarios' />
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
                    <input type="hidden" name='redirect_url' value='/voluntarios' />
                    <input type="hidden" name='collection' value='voluntarios' />
                    <input type="hidden" name="docId" value={docId == null ? '' : docId} />
                    <ModalContent>
                        <ModalInput label='Nome Completo' name="nome" placeholder='Nome: ' initialValue={modalData.nome} />
                        <ModalInput label='Idade' name="idade" placeholder='Idade: ' initialValue={modalData.idade} />
                        <ModalInput label='Email' name="email" placeholder='Email: ' initialValue={modalData.email} />
                        <ModalInput label='Telefone' name="telefone" placeholder='Telefone: ' initialValue={modalData.telefone} />
                        <ModalInput label='Interesses' name="interesses" placeholder='Interesses: ' type="textarea" initialValue={modalData.interesses} />


                        <ModalInput label='Grau Acadêmico' type='select'>
                            <ModalSelect name="grau_academica">
                                {graus_academicos.map((grau, index) => {
                                    return (<ModalSelectOption current={grau == modalData.grau_academica ? true : false} key={index}>{grau}</ModalSelectOption>)
                                })}

                            </ModalSelect>
                        </ModalInput>


                    </ModalContent>

                    <ModalFooter update={docId == null ? false : true}></ModalFooter>
                </form>
            </Modal>
        </>
    );
}