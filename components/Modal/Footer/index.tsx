interface ModalFooterProps{
    children?: React.ReactNode, 
    update?:boolean
}

export default function ModalFooter({children='', update=false}: ModalFooterProps){
    return (
        <div className="modal-footer">
            {children}
            <button  className='modal-btn-submit'>{update ? 'Atualizar': 'Cadastrar'}</button>
        </div>
    );
}