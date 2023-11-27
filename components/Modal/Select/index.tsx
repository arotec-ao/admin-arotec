import React from "react";

interface SelectProps {
    children: React.ReactNode,
    name?: string,
}

export default function ModalSelect({ children, name }: SelectProps) {

    return (<select name={name} className="modal-input" >
        {children}
    </select>);

}