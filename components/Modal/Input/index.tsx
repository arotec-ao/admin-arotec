import { ReactElement } from "react";

interface ModalInputProps{
label:string, 
placeholder?: string,
type?: string, 
children?:React.ReactNode,
name?:string,
initialValue?:string,
}

export default function ModalInput({label, placeholder='', type='input', 
name='', children=(<></>), initialValue=''} : ModalInputProps){

    var input_element;
    switch(type){
        case 'input':
            input_element = 
            ( <input name={name} className="modal-input" type="text" placeholder={placeholder} 
            defaultValue={initialValue}></input>);
            break;
        case 'password':
            input_element = 
            ( <input name={name} className="modal-input" type="password" placeholder={placeholder}
            defaultValue={initialValue}></input>);
            break;
        case 'textarea':
            input_element=(
                <textarea name={name} className="modal-input" placeholder={placeholder} defaultValue={initialValue}></textarea>
            );
            break;

        case 'select':
            input_element=(children);
            break;
    }
    return (
        <div className="modal-input-group">
            <label className="modal-label">{label}</label>
            {input_element}
        </div>
    )
}