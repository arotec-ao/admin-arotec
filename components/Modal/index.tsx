import './style.css';

interface ModalProps{
    children: React.ReactNode, 
    show:boolean
}
export default function Modal({children, show}:ModalProps){
    return  (
        <div className={'modal ' + (show ? ' modal-show ': '')}>
            {children}
        </div>
    );
}