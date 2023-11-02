
'use client'

import './style.css';
import Image from 'next/image';

//Modal
import Modal from '@/components/Modal';
import ModalHeader from '@/components/Modal/Header';
import ModalContent from '@/components/Modal/Content';
import ModalFooter from '@/components/Modal/Footer';
import ModalInput from '@/components/Modal/Input';

import { useState } from 'react';

import { modalFormAction, deleteDocAction } from '@/app/actions';

import EquipeArea from './area';

interface AcademiaContentProps {
    equipes: {
        id: string,
        data: any
    }[];
}
export default function EquipesContent({ equipes }: AcademiaContentProps) {

    const [showModal, setShowModal] = useState(false);

    //ID do elemento do grupo que está ser atualizado no modal
    const [docId, setDocId] = useState<string | null>(null);
    const [modalData, setModalData] = useState({
        nomeTeam: '',
        nomeInstituicao: '',
        telefone: '',
        email: '',
    });

    const clickItem = (equipeId: string) => {
        setDocId(equipeId);
        setShowModal(true);

        const equipe = equipes.find((equipe) => {
            if (equipe.id == equipeId) {
                return true;
            }

            return false;
        });

        setModalData({
            nomeTeam: equipe?.data.nomeTeam ?? '',
            nomeInstituicao: equipe?.data.nomeInstituicao ?? '',
            telefone: equipe?.data.telefone ?? '',
            email: equipe?.data.email ?? '',
        })
    }

    const openModal = () => {

        setDocId(null);
        setShowModal(true);

        setModalData({
            nomeTeam: '',
            nomeInstituicao: '',
            telefone: '',
            email: '',
        });

    }

    const closeModal = () => {
        setShowModal(false);
    }

    return (
        <>
            <button className="btn-table btn-table-add mg-bottom-40" onClick={openModal}>
                <Image src='/icons/add.png' width='20' height='20' alt='' />
                Adicionar Equipe
            </button>

            {equipes.map((equipe, index) => {
                return (
             
                    <EquipeArea key={index} equipe={equipe} onEditarEquipe={clickItem} />
               
                )
            }

            )}
            <Modal show={showModal}>
                <ModalHeader title={(docId == null ? 'Cadastrar' : 'Atualizar') + ' Equipe'} onClose={closeModal}>
                    {docId == null ?
                        '' :
                        (<form action={deleteDocAction} onSubmit={() => {
                            setShowModal(false);
                        }}>
                            <input type="hidden" name='redirect_url' value='/equipes-canar' />
                            <input type="hidden" name='collection' value='equipes' />
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
                    <input type="hidden" name='redirect_url' value='/equipes-canar' />
                    <input type="hidden" name='collection' value='equipes' />
                    <input type="hidden" name="docId" value={docId == null ? '' : docId} />

                    <ModalContent>
                        <ModalInput label='Nome da Equipa' name="nomeTeam" placeholder='Nome da Equipa: ' initialValue={modalData.nomeTeam} />
                        <ModalInput label='Nome da Instituição' name="nomeInstituicao" placeholder='Nome da Instituição: ' initialValue={modalData.nomeInstituicao} />
                        <ModalInput label='Email' name="email" placeholder='Email: ' initialValue={modalData.email} />
                        <ModalInput label='Telefone' name="telefone" placeholder='Telefone: ' initialValue={modalData.telefone} />
                    </ModalContent>

                    <ModalFooter update={docId == null ? false : true}></ModalFooter>
                </form>
            </Modal>
        </>


    );
}

