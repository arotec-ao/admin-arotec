
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
import { Timestamp } from 'firebase/firestore';

import { modalFormAction, deleteDocAction, deleteDocsAction } from '@/app/actions';
import { exportDataExcel } from '@/utils/excel';


interface SinopecLearnContentProps {
    alunos: {
        id: string,
        data: any
    }[];
}
export default function SinopecLearnContent({ alunos }: SinopecLearnContentProps) {

    const [pesquisa, setPesquisa] = useState('');
    const [filtro, setFiltro] = useState('nome');

    //faz o filtro de busca
    const alunosFiltrados = useMemo(()=>{

        //verificar a pesquisa
        const als = alunos.filter((aluno)=>{

            var isValid =false;
            if(pesquisa !=  ''){
                if ((new RegExp(pesquisa , 'i')).test(aluno.data.nome)){
                    isValid=true;
                }
            }
            else{
                isValid=true;
            }
            return isValid;
        });
    
        //verificar a categoria
        return als.sort((a:any, b:any)=>{
            switch (filtro){
                case 'nome':
                    if(a.data.nome < b.data.nome) { return -1; }
                    if(a.data.nome > b.data.nome) { return 1; }
                    return 0;
                 
                case 'encarregado':
                    if(a.data.encarregado < b.data.encarregado) { return -1; }
                    if(a.data.encarregado > b.data.encarregado) { return 1; }
                    return 0;
                 
                case 'local':
                    if(a.data.local < b.data.local) { return -1; }
                    if(a.data.local > b.data.local) { return 1; }
                    return 0;

                    case 'hora':
                        if(a.data.hora < b.data.hora) { return -1; }
                        if(a.data.hora > b.data.hora) { return 1; }
                        return 0;
                case 'data':
                  
                        if(a.data.dataEnvio.seconds < b.data.dataEnvio.seconds) { return 1; }
                        if(a.data.dataEnvio.seconds > b.data.dataEnvio.seconds) { return -1; }
                        return 0;
                default:
                        if(a.data.nome < b.data.nome) { return -1; }
                        if(a.data.nome > b.data.nome) { return 1; }
                        return 0;
            }
        })

    }, [alunos, filtro, pesquisa]);

    const [showModal, setShowModal] = useState(false);
    
    //ID do documento (elemento) que está ser atualizado no modal
    const [docId, setDocId] = useState<string | null>(null);
    
    //Documentos selecionados para deletar
    const [docsSelected, setDocsSelected] = useState<string[]>([]);

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
        if (docsSelected.length == alunos.length) {
            setDocsSelected([]);
        }
        else {
            setDocsSelected(alunos.map((aluno) => {
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
        exportDataExcel(alunosFiltrados.map((aluno)=>{
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
        onSelectRow: selectItem,
        onSelectToogleAll: selectAllToogle,
        selecteds: docsSelected,
        rows: alunosFiltrados.map((aluno) => {
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
            <div className='table-filtros'>
                    <div className='table-filtros-pesquisa'>
                        Pesquise:
                        <input className='pesquisa-input' type="text"  placeholder='Escreve o nome do aluno...' 
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
                            <option value='encarregado'>Encarregado</option>
                            <option value='local'>Local</option>
                            <option value='hora'>Hora</option>
                            <option value='data'>Data de inscricão</option>
                   
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
                        <input type="hidden" name='redirect_url' value='/sinopec_learn' />
                        <input type="hidden" name='collection' value='sinopec_learn' />

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