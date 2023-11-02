interface SelectOptionProps{
    children: React.ReactNode,
    current?:boolean
}
export default function ModalSelectOption({children, current=false}: SelectOptionProps){
    

    if(current){
        return (
            <option selected>
                {children}
            </option>
        );
    }
    else{
        return (
            <option>
                {children}
            </option>
        );
    }

}
    