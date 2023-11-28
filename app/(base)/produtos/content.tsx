
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

import { formatNumber } from '@/utils/utils';

import './style.css';

interface ProdutosContentProps {
    produtos: {
        id: string,
        data: any
    }[];
}



const initialModalData: {
    categoria: string,
    desconto: number,
    descricao: string,
    entrega: number,
    estado: string,
    id: string,
    imagens: string[],
    marca: string,
    nome: string,
    preco: number,
    quantidade: number
} = {
    categoria: '',
    desconto: 0,
    descricao: '',
    entrega: 0,
    estado: '',
    id: '',
    imagens: [],
    marca: '',
    nome: '',
    preco: 0,
    quantidade: 0

};

export default function ProdutosContent({ produtos }: ProdutosContentProps) {

    const [pesquisa, setPesquisa] = useState('');
    const [filtro, setFiltro] = useState('nome');

    //faz o filtro de busca
    const produtosFiltrados = useMemo(()=>{

        //verificar a pesquisa
        const prods = produtos.filter((prod)=>{

            var isValid =false;
            if(pesquisa !=  ''){
                if ((new RegExp(pesquisa , 'i')).test(prod.data.nome)){
                    isValid=true;
                }
            }
            else{
                isValid=true;
            }
            return isValid;
        });

        //verificar a categoria
        return prods.sort((a:any, b:any)=>{
            switch (filtro){
                case 'nome':
                    if(a.data.nome < b.data.nome) { return -1; }
                    if(a.data.nome > b.data.nome) { return 1; }
                    return 0;
                 
                case 'marca':
                    if(a.data.marca < b.data.marca) { return -1; }
                    if(a.data.marca > b.data.marca) { return 1; }
                    return 0;
                 
                case 'categoria':
                    if(a.data.categoria < b.data.categoria) { return -1; }
                    if(a.data.categoria > b.data.categoria) { return 1; }
                    return 0;
                default:
                        if(a.data.nome < b.data.nome) { return -1; }
                        if(a.data.nome > b.data.nome) { return 1; }
                        return 0;
            }
        })

    }, [produtos, filtro, pesquisa]);


    const [showModal, setShowModal] = useState(false);

    //ID do documento (elemento) que está ser atualizado no modal
    const [docId, setDocId] = useState<string | null>(null);

    //Documentos selecionados para deletar
    const [docsSelected, setDocsSelected] = useState<string[]>([]);

    const [modalData, setModalData] = useState(initialModalData);

    const clickItem = (docId: string) => {
        setDocId(docId);
        setShowModal(true);

        const doc = produtos.find((produto) => {
            if (produto.id == docId) {
                return true;
            }

            return false;
        });

        setModalData({
            categoria: doc?.data.categoria,
            desconto: doc?.data.desconto,
            descricao: doc?.data.descricao,
            entrega: doc?.data.entrega,
            estado: doc?.data.estado,
            id: doc?.data.id,
            imagens: doc?.data.imagens.map((imagem: any) => {
                return imagem.name;
            }),
            marca: doc?.data.marca,
            nome: doc?.data.nome,
            preco: doc?.data.preco,
            quantidade: doc?.data.quantidade,
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
        if (docsSelected.length == produtos.length) {
            setDocsSelected([]);
        }
        else {
            setDocsSelected(produtos.map((produto) => {
                return produto.id;
            }))
        }
    }

    const openModal = () => {
        setDocId(null);
        setShowModal(true);

        setModalData({
            ...initialModalData
        });

    }

    const closeModal = () => {

        setShowModal(false);
    }


    const exportData = () => {
        exportDataExcel(produtosFiltrados.map((prod) => {
            return prod.data;
        }), 'Produtos da Loja IO', 'produtos');
    }

    const tableData: TableData = {
        labels: ['Nome', 'Marca', 'Preço', 'Quantidade', 'Categoria',
            'Valor de Entrega', 'Desconto', 'Número de imagens'],
        onClickRow: clickItem,
        onSelectRow: selectItem,
        onSelectToogleAll: selectAllToogle,
        selecteds: docsSelected,

        rows: produtosFiltrados.map((produto) => {
            const data = produto.data;
            return {
                id: produto.id.toString(),
                columns_data: [
                    data.nome.toString(),
                    data.marca.toString(),
                    formatNumber(data.preco) + ' Kz',
                    data.quantidade.toString(),
                    data.categoria.toString(),
                    formatNumber(data.entrega) + ' Kz',
                    data.desconto.toString() + '%',
                    data.imagens.length,
                ]
            }
        })
    };

    return (
        <>
            <div className='table-area'>
                <div className='table-area-title'>Produtos da Loja IO</div>
                <div className='table-filtros'>
                    <div className='table-filtros-pesquisa'>
                        Pesquise:
                        <input className='pesquisa-input' type="text"  placeholder='Escreve o nome do produto...' 
                        onChange={(ev)=>{
                            setPesquisa(ev.target.value);
                        }}/>
                    </div>
                    <div className='table-filtros-agrupar'>
                        Agrupar por: 
                        <select className='agrupar-input'onChange={(ev)=>{
                            setFiltro(ev.target.value);
                        }}>
                            <option value='nome'>Nome</option>
                            <option value='marca'>Marca</option>
                            <option value='categoria'>Categoria</option>
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
                        <input type="hidden" name='redirect_url' value='/produtos' />
                        <input type="hidden" name='collection' value='produtos' />

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
                <ModalHeader title={(docId == null ? 'Cadastrar' : 'Atualizar') + ' Produto'} onClose={closeModal}>
                    {docId == null ?
                        '' :
                        (<form action={deleteDocAction} onSubmit={() => {
                            setShowModal(false);
                        }}>
                            <input type="hidden" name='redirect_url' value='/produtos' />
                            <input type="hidden" name='collection' value='produtos' />
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
                    <input type="hidden" name='redirect_url' value='/produtos' />
                    <input type="hidden" name='collection' value='produtos' />
                    <input type="hidden" name="docId" value={docId == null ? '' : docId} />
                    <ModalContent>
                        <ModalInput label='Nome' name="nome" placeholder='Nome: ' initialValue={modalData.nome} />
                        <ModalInput label='Marca' name="marca" placeholder='Marca: ' initialValue={modalData.marca} />
                        <ModalInput label='Preço' name="preco" placeholder='Preço: ' initialValue={modalData.preco.toString()} />
                        <ModalInput label='Quantidade' name="quantidade" placeholder='Quantidade: ' initialValue={modalData.quantidade.toString()} />
                        <ModalInput label='Valor de Entrega' name="entrega" placeholder='Entrega: ' initialValue={modalData.entrega.toString()} />
                        <ModalInput label='Valor de Desconto' name="desconto" placeholder='Desconto: ' initialValue={modalData.desconto.toString()} />
                        <ModalInput label='Categoria' name="categoria" placeholder='Categoria: ' initialValue={modalData.categoria} />
                        <ModalInput label='Descrição' name='descricao' placeholder='Descrição: ' type='textarea' initialValue={modalData.descricao} />
                        <ModalInput label='Estado' name="estado" placeholder='Estado: ' initialValue={modalData.estado} />

                        {/* Modal Section Imagens */}
                        <div className='msImagens'>
                            <div className='msImagensTitle'>Imagens</div>

                            <div className='msImagensAdd'>
                                <button type='button' className='msImagensButton' onClick={() => {

                                    setModalData({
                                        ...modalData,
                                        imagens: [...modalData.imagens,
                                            '']
                                    });

                                }}>
                                    <Image src='/icons/sum.png' width='16' height='16' alt='' />
                                </button>
                            </div>

                            <div className='msImagemContainer'>
                                <input type="hidden" value={JSON.stringify(modalData.imagens)} name='imagens' />
                                {modalData.imagens.map((imagem, index) => {
                                    return (
                                        <div className='msImagem'>
                                            <strong>Imagem {index + 1}: {imagem}</strong>

                                            <input className='msImagemInput'
                                            accept='image/*'
                                             type="file" name={imagem == '' ? 'imagem_' + index : ''} 
                                             onChange={(ev)=>{
                                                setModalData(
                                                    {
                                                        ...modalData, 
                                                        imagens: modalData.imagens.map((i)=>{
                                                            if (i == imagem) return '';
                                                            return imagem;
                                                        })
                                                    }
                                                );
                                             }} />

                                            <button type='button' className='msImagensButton' onClick={() => {
                                                setModalData({
                                                    ...modalData,
                                                    imagens: modalData.imagens.filter((img) => {
                                                        if (img == imagem) return false;

                                                      return true;
                                                    })
                                                })
                                            }}>
                                                <Image src='/icons/minus.png' width='14' height='14' alt='' />
                                            </button>
                                        </div>
                                    );
                                })}

                            </div>
                        </div>

                    </ModalContent>

                    <ModalFooter update={docId == null ? false : true}></ModalFooter>
                </form>
            </Modal>
        </>
    );
}