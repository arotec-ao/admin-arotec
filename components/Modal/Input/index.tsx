import { useState, useMemo } from "react";

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
    name = '', children = (<></>), initialValue = '', onChange }: ModalInputProps) {

    const input_element = useMemo(() => {
        switch (type) {
            case 'input':

                return (<input name={name} className="modal-input" type="text" placeholder={placeholder}
                    defaultValue={initialValue} onChange={(ev) => {
                        if (onChange) {
                            onChange(ev)

                        }
                    }}></input>);

            case 'password':
                return (<input name={name} className="modal-input" type="password" placeholder={placeholder}
                    defaultValue={initialValue} onChange={(ev) => {
                        if (onChange) {
                            onChange(ev)

                        }
                    }}></input>);

            case 'textarea':
                return (
                    <textarea name={name} className="modal-input" placeholder={placeholder} defaultValue={initialValue} onChange={(ev) => {
                        if (onChange) {
                            onChange(ev)

                        }
                    }}></textarea>
                );
                break;

            case 'select':
                return (children);
                break;
        }

    }, [initialValue, children]);

    return (
        <div className="modal-input-group">
            <label className="modal-label">{label}</label>
            {input_element}
        </div>
    )
}