
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

import { useRef, useState, useMemo } from 'react';
import { Timestamp } from 'firebase/firestore';

import { modalFormAction, deleteDocAction, deleteDocsAction } from '@/app/actions';
import { exportDataExcel } from '@/utils/excel';
import { formatNumber } from '@/utils/utils';

import './style.css';

interface ComprasContentProps {
    compras: {
        id: string,
        data: any
    }[];
    produtos: {
        id: string,
        data: any
    }[];
}


interface ProdutoCompraType {
    nome: string,
    id: string,
    preco: number,
    quantidade: number,
    desconto: number,
}

interface CompraType {
    metodoPagamento: number,
    metodoObtencao: number,
    produtos: ProdutoCompraType[],
    informacoesEntrega: {
        nomeCompleto: string,
        email: string,
        pais: string,
        telefone: string,
        endereco: string,
    },
    pago: boolean,
    entrega: number,
}

const metodosObtencao: string[] = [
    'Encomendar',
    'Levantar'
];
const metodosPagamento: string[] = [
    'Transferência',
    'Depósito',
    'Cash'
]

export default function ComprasContent({ compras, produtos }: ComprasContentProps) {

    
    const [pesquisa, setPesquisa] = useState('');
    const [filtro, setFiltro] = useState('nome');

    //faz o filtro de busca
    const comprasFiltrados = useMemo(()=>{

        //verificar a pesquisa
        const cmps = compras.filter((compra)=>{

            var isValid =false;
            if(pesquisa !=  ''){
                if ((new RegExp(pesquisa , 'i')).test(compra.data.informacoesEntrega.nomeCompleto)){
                    isValid=true;
                }
            }
            else{
                isValid=true;
            }
            return isValid;
        });
    
        //verificar a categoria
        return cmps.sort((a:any, b:any)=>{
            switch (filtro){
                case 'nome':
                    if(a.data.informacoesEntrega.nomeCompleto < b.data.informacoesEntrega.nomeCompleto) { return -1; }
                    if(a.data.informacoesEntrega.nomeCompleto > b.data.informacoesEntrega.nomeCompleto) { return 1; }
                    return 0;
                 
                case 'pais':
                    if(a.data.informacoesEntrega.pais < b.data.informacoesEntrega.pais) { return -1; }
                    if(a.data.informacoesEntrega.pais > b.data.informacoesEntrega.pais) { return 1; }
                    return 0;
                case 'data':
                  
                        if(a.data.dataCompra.seconds < b.data.dataCompra.seconds) { return 1; }
                        if(a.data.dataCompra.seconds > b.data.dataCompra.seconds) { return -1; }
                        return 0;
                default:
                        if(a.data.informacoesEntrega.nomeCompleto < b.data.informacoesEntrega.nomeCompleto) { return -1; }
                        if(a.data.informacoesEntrega.nomeCompleto > b.data.informacoesEntrega.nomeCompleto) { return 1; }
                        return 0;
            }
        })

    }, [compras, filtro, pesquisa]);

    const [showModal, setShowModal] = useState(false);

    //ID do documento (elemento) que está ser atualizado no modal
    const [docId, setDocId] = useState<string | null>(null);

    //Documentos selecionados para deletar
    const [docsSelected, setDocsSelected] = useState<string[]>([]);


    //produtos ainda não selecionado no modal
    const [produtosEnabledModal, setProdutosEnabledModal] = useState([...produtos]);

    //referencia do select para adicionar produto
    const selectProdutoModalRef = useRef<HTMLSelectElement | null>(null);

    const [modalData, setModalData] = useState<CompraType>({
        metodoPagamento: 0,
        metodoObtencao: 0,
        produtos: [],
        informacoesEntrega: {
            nomeCompleto: '',
            email: '',
            pais: '',
            telefone: '',
            endereco: '',
        },
        pago: false,
        entrega: 0,
    });

    const calcularValorFinal = (produtos: ProdutoCompraType[]) => {
        let valorFinal = 0;
        for (const prod of produtos) {

            let valor = prod.preco - (prod.preco * (prod.desconto / 100));
            valor = valor * prod.quantidade;
            valorFinal = valorFinal + (valor);
        }

        return valorFinal;
    }
    const clickItem = (docId: string) => {
        setDocId(docId);
        setShowModal(true);

        const doc = compras.find((compra) => {
            if (compra.id == docId) {
                return true;
            }

            return false;
        });
     

        setProdutosEnabledModal(produtos.filter((prod)=>{
            //informe que o produto já contem na lista de produtos da compra 
            let isContem=false;
            for (const p of doc?.data.produtos){
                if(p.id == prod.id) {
                    isContem=true;
                    break;
                }
            }

            return !isContem;
        }))


        setModalData({
            metodoPagamento: metodosPagamento.findIndex((metodo) => {
                if (metodo == doc?.data.metodoPagamento) {
                    return true;
                }

                return false;

            }),

            metodoObtencao: metodosObtencao.findIndex((metodo) => {
                if (metodo == doc?.data.metodoObtencao) {
                    return true;
                }

                return false;
            }),

            produtos: [...doc?.data.produtos],
            entrega: doc?.data.entrega,
            informacoesEntrega: { ...doc?.data.informacoesEntrega },
            pago: doc?.data.pago 
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
        if (docsSelected.length == compras.length) {
            setDocsSelected([]);
        }
        else {
            setDocsSelected(compras.map((compra) => {
                return compra.id;
            }))
        }
    }

    const openModal = () => {
        setProdutosEnabledModal([...produtos]);
        setDocId(null);
        setShowModal(true);

        setModalData({
            metodoPagamento: 0,
            metodoObtencao: 0,
            produtos: [],
            informacoesEntrega: {
                nomeCompleto: '',
                email: '',
                pais: '',
                telefone: '',
                endereco: '',
            },
            pago: false,
            entrega: 0,
        });



    }

    const closeModal = () => {

        setShowModal(false);
    }


    const exportData = () => {
        exportDataExcel(comprasFiltrados.map((compra) => {
            return {
                ...compra.data,
                dataCompra:
                    (Timestamp.fromMillis(compra.data.dataCompra.seconds * 1000).
                        toDate().toLocaleDateString("pt-pt"))
            };
        }), 'Compras da Loja IO', 'compras');
    }

    const tableData: TableData = {
        labels: ['Nome Completo', 'Email', 'Telefone', 'Endereço', 'País',
            'Número de produtos', 'Valor da Compra', 'Pago',
            'Metódo de Obtenção', 'Metódo de Pagamento',
            'Data de compra'],
        onClickRow: clickItem,
        onSelectRow: selectItem,
        onSelectToogleAll: selectAllToogle,
        selecteds: docsSelected,


        rows: comprasFiltrados.map((compra) => {
            const data = compra.data;
            return {
                id: compra.id.toString(),
                columns_data: [
                    data.informacoesEntrega.nomeCompleto.toString(),
                    data.informacoesEntrega.email.toString(),
                    data.informacoesEntrega.telefone.toString(),
                    data.informacoesEntrega.endereco.toString(),
                    data.informacoesEntrega.pais.toString(),
                    data.produtos.length,


                    formatNumber(calcularValorFinal(data.produtos) + data.entrega) + ' Kz',

                    (data.pago ? 'Pago' : 'Por pagar'),
                    data.metodoObtencao.toString(),
                    data.metodoPagamento.toString(),
                    Timestamp.fromMillis(data.dataCompra.seconds * 1000).toDate().toLocaleDateString("pt-pt")
                ]
            }

        })
    };


    return (
        <>
            <div className='table-area'>
                <div className='table-area-title'>Compras da Loja IO</div>
                
                <div className='table-filtros'>
                    <div className='table-filtros-pesquisa'>
                        Pesquise:
                        <input className='pesquisa-input' type="text"  placeholder='Escreve o nome do comprador...' 
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
                            <option value='nome'>Pais</option>
                            <option value='data'>Data de compra</option>
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
                        <input type="hidden" name='redirect_url' value='/compras' />
                        <input type="hidden" name='collection' value='compras' />


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
                <ModalHeader title={(docId == null ? 'Cadastrar' : 'Atualizar') + ' Compra'} onClose={closeModal}>
                    {docId == null ?
                        '' :
                        (<form action={deleteDocAction} onSubmit={() => {
                            setShowModal(false);
                        }}>
                            <input type="hidden" name='redirect_url' value='/compras' />
                            <input type="hidden" name='collection' value='compras' />
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
                    <input type="hidden" name='redirect_url' value='/compras' />
                    <input type="hidden" name='collection' value='compras' />
                    <input type="hidden" name="docId" value={docId == null ? '' : docId} />
                    <ModalContent>
                        <ModalInput label='Nome Completo' name="nomeCompleto" placeholder='Nome: ' initialValue={modalData.informacoesEntrega.nomeCompleto} />
                        <ModalInput label='Email' name="email" placeholder='Email: ' initialValue={modalData.informacoesEntrega.email} />
                        <ModalInput label='Telefone' name="telefone" placeholder='Telefone: ' initialValue={modalData.informacoesEntrega.telefone} />
                        <ModalInput label='Endereço' name="endereco" placeholder='Endereço: ' initialValue={modalData.informacoesEntrega.endereco} />
                        <ModalInput label='País' name="pais" placeholder='País: ' initialValue={modalData.informacoesEntrega.pais} />

                        <ModalInput label='Metódo de Obtenção' type='select'>
                            <ModalSelect name="metodoObtencao">
                                {metodosObtencao.map((metodo, index) => {
                                    return (<ModalSelectOption current={index == modalData.metodoObtencao ? true : false} key={index}>{metodo}</ModalSelectOption>)
                                })}

                            </ModalSelect>
                        </ModalInput>

                        <ModalInput label='Metódo de Pagamento' type='select'>
                            <ModalSelect name="metodoPagamento">
                                {metodosPagamento.map((metodo, index) => {
                                    return (<ModalSelectOption current={index == modalData.metodoPagamento ? true : false} key={index}>{metodo}</ModalSelectOption>)
                                })}

                            </ModalSelect>
                        </ModalInput>

                        <ModalInput label='Pago' type='select'>
                            <select name="pago" className='modal-input'>
                              
                                <option value={'false'} selected={modalData.pago == false}>Não</option>
                                <option value={'true'} selected={modalData.pago == true}>Sim</option>
                            </select>
                        </ModalInput>



                        <ModalInput label='Custo de Entrega' name="entrega" placeholder='Custo de Entrega: ' initialValue={modalData.entrega.toString()}
                            onChange={(ev: any) => {
                                var value = ev.target.value;
                                if (!Number.isNaN(value)) {

                                    let valueInt: number = parseInt(value);
                                    if (valueInt >= 0) {
                                        setModalData({
                                            ...modalData,
                                            entrega: valueInt
                                        })

                                    }
                                }

                            }} />

                        {/* Modal Section Produtos */}
                        <div className='msProdutos'>
                            <div className='msProdutosTitle'>Produtos</div>
                            {
                                produtosEnabledModal.length > 0 &&
                                <div className='msProdutosAdd'>

                                    <select className="modal-input" ref={selectProdutoModalRef}>
                                        {
                                            produtosEnabledModal.map((prod) => {
                                                return (<ModalSelectOption key={prod.id}>{prod.data.nome} ({prod.data.quantidade + ' utds'})</ModalSelectOption>)
                                            })
                                        }
                                    </select>

                                    <button type='button' className='msProdutosButton' onClick={() => {
                                        if (selectProdutoModalRef.current) {
                                            const prod = produtosEnabledModal.splice(selectProdutoModalRef.current.selectedIndex, 1)[0];

                                            setModalData({
                                                ...modalData,
                                                produtos: [...modalData.produtos, {
                                                    id: prod.id,
                                                    nome: prod.data.nome,
                                                    preco: prod.data.preco,
                                                    quantidade: 1,
                                                    desconto: prod.data.desconto

                                                }]
                                            })


                                        }

                                    }}>
                                        <Image src='/icons/sum.png' width='16' height='16' alt='' />
                                    </button>
                                </div>

                            }

                            <div className='msProdutoContainer'>
                                <input type="hidden" value={JSON.stringify(modalData.produtos)} name='produtos' />
                                {modalData.produtos.map((prod, index) => {
                                    return (
                                        <div className='msProduto'>
                                            <strong>{prod.nome}</strong> {formatNumber(prod.preco)} Kz.
                                            Desconto {prod.desconto}%
                                            <input className='msProdutoInput' min='1' max={produtos.find((p) => {
                                                if (p.id == prod.id) {
                                                    return true;
                                                }
                                                else {
                                                    return false;
                                                }

                                            })?.data.quantidade ?? 1} type="number" defaultValue={prod.quantidade} onChange={(ev) => {
                                                var value = ev.target.value;
                                                if (!Number.isNaN(value)) {

                                                    let valueInt: number = parseInt(value);
                                                    if (valueInt) {
                                                        setModalData({
                                                            ...modalData,
                                                            produtos: modalData.produtos.map((prd, i) => {
                                                                if (index == i) {
                                                                    return { ...prd, quantidade: valueInt };
                                                                }
                                                                else {
                                                                    return { ...prd };
                                                                }
                                                            })
                                                        })

                                                    }
                                                }

                                            }} /> Unidades
                                            <button type='button' className='msProdutosButton' onClick={() => {
                                                setModalData({
                                                    ...modalData,
                                                    produtos: modalData.produtos.filter((p) => {
                                                        if (p.id == prod.id) {
                                                            return false;
                                                        }

                                                        else {
                                                            return true;
                                                        }
                                                    })
                                                })
                                                const prd = produtos.find((p) => {
                                                    return prod.id == p.id;
                                                });

                                                if (prd) {
                                                    setProdutosEnabledModal([...produtosEnabledModal, prd])
                                                }
                                            }}>
                                                <Image src='/icons/minus.png' width='14' height='14' alt='' />
                                            </button>
                                        </div>)
                                })}

                            </div>

                        </div>

                    </ModalContent>

                    <ModalFooter update={docId == null ? false : true}>
                        <strong>Valor Total:</strong> {formatNumber(calcularValorFinal(modalData.produtos) + modalData.entrega) + ' Kz'}
                    </ModalFooter>
                </form>
            </Modal>
        </>
    );
}