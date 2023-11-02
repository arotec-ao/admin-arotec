
interface ModalContentProps{
    children: React.ReactNode
}
export default function ModalContent({children}:ModalContentProps){
    return (
        <div className='modal-content'>
            {children}
        </div>
    );
}