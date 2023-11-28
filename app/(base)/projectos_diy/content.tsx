
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

interface ProjectosDIYContentProps {
    projectos: {
        id: string,
        data: any
    }[];
}
export default function ProjectosDIYContent({ projectos }: ProjectosDIYContentProps) {

    const [pesquisa, setPesquisa] = useState('');
    const [filtro, setFiltro] = useState('titulo');

    //faz o filtro de busca
    const projectosFiltrados = useMemo(() => {

        //verificar a pesquisa
        const projs = projectos.filter((projecto) => {

            var isValid = false;
            if (pesquisa != '') {
                if ((new RegExp(pesquisa, 'i')).test(projecto.data.nome) ||
                    (new RegExp(pesquisa, 'i')).test(projecto.data.titulo)) {
                    isValid = true;
                }
            }
            else {
                isValid = true;
            }
            return isValid;
        });

        //verificar a categoria
        return projs.sort((a: any, b: any) => {
            switch (filtro) {
                case 'nome':
                    if (a.data.nome < b.data.nome) { return -1; }
                    if (a.data.nome > b.data.nome) { return 1; }
                    return 0;

                case 'titulo':
                    if (a.data.titulo < b.data.titulo) { return -1; }
                    if (a.data.titulo > b.data.titulo) { return 1; }
                    return 0;

                case 'visualizacoes':
                    if (a.data.visualizacoes < b.data.visualizacoes) { return 1; }
                    if (a.data.visualizacoes > b.data.visualizacoes) { return -1; }
                    return 0;

                default:
                    if (a.data.nome < b.data.nome) { return -1; }
                    if (a.data.nome > b.data.nome) { return 1; }
                    return 0;
            }
        })

    }, [projectos, filtro, pesquisa]);

    const [showModal, setShowModal] = useState(false);

    //ID do documento (elemento) que está ser atualizado no modal
    const [docId, setDocId] = useState<string | null>(null);

    //Documentos selecionados para deletar
    const [docsSelected, setDocsSelected] = useState<string[]>([]);

    const [modalData, setModalData] = useState({
        titulo: '',
        nome: '',
        email: '',
        descricao: '',
        visualizacoes: '',
        link: '',
        foto: ''
    });

    const clickItem = (docId: string) => {
        setDocId(docId);
        setShowModal(true);

        const doc = projectos.find((projecto) => {
            if (projecto.id == docId) {
                return true;

            }

            return false;
        });



        setModalData({
            titulo: doc?.data.titulo,
            nome: doc?.data.nome,
            email: doc?.data.email,
            descricao: doc?.data.descricao,
            visualizacoes: doc?.data.visualizacoes,
            link: doc?.data.link,
            foto: doc?.data.fotoUrl,
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
        if (docsSelected.length == projectos.length) {
            setDocsSelected([]);
        }
        else {
            setDocsSelected(projectos.map((projecto) => {
                return projecto.id;
            }))
        }
    }

    const openModal = () => {

        setDocId(null);
        setShowModal(true);

        setModalData({
            titulo: '',
            nome: '',
            email: '',
            descricao: '',
            visualizacoes: '',
            link: '',
            foto: '',

        });

    }

    const closeModal = () => {

        setShowModal(false);
    }


    const exportData = () => {
        exportDataExcel(projectosFiltrados.map((projecto) => {
            return projecto.data;
        }), 'Projecto DIY');
    }


    const tableData: TableData = {
        labels: ['Título', 'Nome', 'Email', 'Descrição', 'Visualizações', 'Link'],
        onClickRow: clickItem,
        onSelectRow: selectItem,
        onSelectToogleAll: selectAllToogle,
        selecteds: docsSelected,
        rows: projectosFiltrados.map((projecto) => {
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
                <div className='table-filtros'>
                    <div className='table-filtros-pesquisa'>
                        Pesquise:
                        <input className='pesquisa-input' type="text" placeholder='Escreve o nome do projecto...'
                            onChange={(ev) => {
                                setPesquisa(ev.target.value);
                            }} />
                    </div>
                    <div className='table-filtros-agrupar'>
                        Agrupar por:
                        <select className='agrupar-input' onChange={(ev) => {
                            setFiltro(ev.target.value);
                        }}>
                            <option value='titulo'>Título</option>
                            <option value='nome'>Nome</option>
                            <option value='visualizacoes'>Visualizações</option>

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
                        <input type="hidden" name='redirect_url' value='/projectos_diy' />
                        <input type="hidden" name='collection' value='projetos' />

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
                <ModalHeader title={(docId == null ? 'Cadastrar' : 'Atualizar') + ' Projecto'} onClose={closeModal}>
                    {docId == null ?
                        '' :
                        (<form action={deleteDocAction} onSubmit={() => {
                            setShowModal(false);
                        }}>
                            <input type="hidden" name='redirect_url' value='/projectos_diy' />
                            <input type="hidden" name='collection' value='projetos' />
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
                    <input type="hidden" name='redirect_url' value='/projectos_diy' />
                    <input type="hidden" name='collection' value='projetos' />
                    <input type="hidden" name="docId" value={docId == null ? '' : docId} />
                    <ModalContent>
                        <ModalInput label='Título' name="titulo" placeholder='Título: ' initialValue={modalData.titulo} />
                        <ModalInput label='Descrição' name="descricao" placeholder='Descrição: ' type="textarea" initialValue={modalData.descricao} />
                        <ModalInput label='Email' name="email" placeholder='Email: ' initialValue={modalData.email} />
                        <ModalInput label='Nome' name="nome" placeholder='Nome: ' initialValue={modalData.nome} />
                        <ModalInput label='Link' name="link" placeholder='Link: ' initialValue={modalData.link} />
                        <ModalInput label='Visualizações' name="visualizacoes" placeholder='Visualizações: ' initialValue={modalData.visualizacoes} />

                        {/* Modal Section Imagem */}
                        <div>
                            <div>Imagens</div>
                            <br />

                            <input 
                                accept='image/*'
                                type="file" name={modalData.foto == '' ? 'imagem' : ''}
                                onChange={(ev) => {
                                    if(ev.target.files){
                                        if(ev.target.files.length  > 0){
                                            const file = ev.target.files[0] as File;
                                            setModalData({
                                                ...modalData, 
                                                foto: '',
                                            })
                                        }
                                    }

                                  
                                }} />
                        </div>

                    </ModalContent>

                    <ModalFooter update={docId == null ? false : true}></ModalFooter>
                </form>
            </Modal>

        </>
    );
}