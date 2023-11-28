import {  useMemo, useRef, useEffect } from "react";

interface ModalInputProps {
    label: string,
    placeholder?: string,
    type?: string,
    children?: React.ReactNode,
    name?: string,
    initialValue?: string,
    onChange?: Function,
}

export default function ModalInput({ label, placeholder = '', type = 'input',
    name = '', children = '', initialValue = '', onChange }: ModalInputProps) {

    const inputRef = useRef<any | null>(null);

    useEffect(()=>{
        if(inputRef.current){
            inputRef.current.value = initialValue;
        }
    }, [initialValue, inputRef]);

    const changeEvent = (ev: any) => {
        if (onChange) {
            onChange(ev)
        }
    }

    const input_element = useMemo(() => {
        switch (type) {
            case 'input':
                return (<input ref={inputRef} name={name} className="modal-input" type="text" placeholder={placeholder}
                    onChange={changeEvent}></input>);

            case 'password':
                return (<input ref={inputRef} name={name} className="modal-input" type="password" placeholder={placeholder}
                    onChange={changeEvent}></input>);

            case 'textarea':
                return (
                    <textarea ref={inputRef} name={name} className="modal-input" placeholder={placeholder}
                        onChange={changeEvent}></textarea>
                );

            case 'select':
                return (children);
            default:
                return (<input ref={inputRef} name={name}
                    className="modal-input" type="text" placeholder={placeholder}
                    onChange={changeEvent}></input>);
        }

    }, [type]);

    return (
        <div className="modal-input-group">
            <label className="modal-label">{label}</label>
            {input_element}
        </div>
    )
}