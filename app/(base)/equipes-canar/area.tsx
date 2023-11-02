import Image from 'next/image';

//Tabela 
import { generateTable } from '@/components/Table';

//Modal
import Modal from '@/components/Modal';
import ModalHeader from '@/components/Modal/Header';
import ModalContent from '@/components/Modal/Content';
import ModalFooter from '@/components/Modal/Footer';
import ModalInput from '@/components/Modal/Input';

import { useState } from 'react';

import { elementEquipeAction , deleteElementEquipeAction} from '@/app/actions';
import { exportDataExcel } from '@/utils/excel';

interface EquipeAreaProps {
    equipe: {
        id: string,
        data: any
    },
    onEditarEquipe: Function
}

export default function EquipeArea({ equipe, onEditarEquipe }: EquipeAreaProps) {

    const data = equipe.data;
    const elementos: {
        id: string, nome: string, funcao: string,
        nascimento: string
    }[] = [];


    const elements_keys = Object.keys(data).filter((key)=>{
        if (key.startsWith('elemento-')){
            return key;
        }
    });

    for (let key of elements_keys) {
        
        elementos.push({ ...equipe.data[key], id: key.slice(('elemento-'.length), key.length)  });
    }

    const [showModal, setShowModal] = useState(false);

    //ID do elemento do grupo que está ser atualizado no modal
    const [elementId, setElementId] = useState<string | null>(null);
    const [modalData, setModalData] = useState({
        nome: '',
        funcao: '',
        nascimento: '',
    });

    const clickItem = (elementId: string) => {
        setElementId(elementId);
        setShowModal(true);

        const elemento = elementos.find((elemento) => {
            if (elemento.id == elementId) {
                return true;
            }

            return false;
        });

        setModalData({
            nome: elemento?.nome ?? '',
            funcao: elemento?.funcao ?? '',
            nascimento: elemento?.nascimento ?? '',
        })
    }

    const openModal = () => {

        setModalData({
            nome: '',
            funcao: '',
            nascimento: ''

        });

        setElementId(null);
        setShowModal(true);
    }

    const closeModal = () => {

        setShowModal(false);
    }


    const exportData = () => {
        exportDataExcel({
            nomeInstituicao: data.nomeInstituicao,
            nomeTeam: data.nomeTeam,
            telefone: data.telefone,
            email: data.email,

            elementos:
                elementos.map((elemento) => {
                    return {
                        nome: elemento.nome,
                        funcao: elemento.funcao,
                        nascimento: elemento.nascimento
                    };
                })

        }, 'Equipe ' + data.nomeTeam, 'equipes-canar');
    }

    return (
        <div className='equipe-area'>
            <div className='table-area'>
                <div className='table-area-title d-flex gp-10'>Equipa {data.nomeTeam ? data.nomeTeam : '(Sem nome)'}
                    <button className="btn-table btn-table-add" onClick={() => { onEditarEquipe(equipe.id) }}>
                        Editar Equipe
                    </button>
                </div>
                <div className='mg-bottom-15'>Email da equipa: {data.email}</div>
                <div className='mg-bottom-15'>Telefone da equipa: {data.telefone}</div>
                <div className='mg-bottom-15'>Nome da instituição: {data.nomeInstituicao}</div>
                <div className='table-area-header'>
                    <button className="btn-table btn-table-add" onClick={openModal}>
                        <Image src='/icons/add.png' width='20' height='20' alt='' />
                        Adicionar Elemento
                    </button>
                    <button className="btn-table btn-table-export" onClick={exportData}>
                        <Image src='/icons/excel.png' width='20' height='20' alt='' />
                        Exportar para Excel
                    </button>
                </div>
                <div className='table-real'>
                    {generateTable({
                        labels: ['Nome Completo', 'Função', 'Data de nascimento'],
                        onClickRow: clickItem,
                        rows: elementos.map((elemento) => {
                            return {
                                id: elemento.id,
                                columns_data: [
                                    elemento.nome.toString(),
                                    elemento.funcao.toString(),
                                    elemento.nascimento.toString(),
                                ]
                            }
                        })
                    })}
                </div>
            </div>


            <Modal show={showModal}>
                <ModalHeader title={(elementId == null ? 'Cadastrar' : 'Atualizar') + ' Elemento'} onClose={closeModal}>
                    {elementId == null ?
                        '' :
                        (<form action={deleteElementEquipeAction} onSubmit={()=>{
                            setShowModal(false);
                        }}> 
                            <input type="hidden" name='redirect_url' value='/equipes-canar'/>
                            <input type="hidden" name='collection' value='equipes'/>
                            <input type="hidden" name="docId" value={equipe.id} />
                            <input type="hidden" name="elementId" value={elementId == null ? '': elementId} />
                            <button className='btn-delete-in-modal' type="submit">
                                <Image src='/icons/trash.png' width='20' height='20' alt='' />
                                Deletar
                            </button>
                        </form>)
                    }

                </ModalHeader>
                <form action={elementEquipeAction} onSubmit={()=>{
                    setShowModal(false);
                }}>
                    <input type="hidden" name='redirect_url' value='/equipes-canar'/>
                    <input type="hidden" name='collection' value='equipes'/>
                    <input type="hidden" name="docId" value={equipe.id} />
                    <input type="hidden" name="elementId" value={elementId == null ? '': elementId} />
                    <ModalContent>
                        <ModalInput label='Nome Completo' name="nome" placeholder='Nome: ' initialValue={modalData.nome}/>
                        <ModalInput label='Função' name="funcao" placeholder='Funcão: '  initialValue={modalData.funcao} />
                        <ModalInput label='Data de nascimento' name="nascimento" placeholder='Data de nascimento: '   initialValue={modalData.nascimento}/>
                    </ModalContent>

                    <ModalFooter update={elementId == null ? false: true}></ModalFooter>
                </form>
            </Modal>

        </div>
    )

}