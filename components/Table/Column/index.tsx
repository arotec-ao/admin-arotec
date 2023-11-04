interface TableColumnProps{
    children?: React.ReactNode,
    header?:boolean, 
}

export default function TableColumn({children='', header=false}: TableColumnProps){

    if (header){
        return (
            <th className='table-column'>
                {children}
            </th>
        );
    }

    else{   
        return (
            <td className='table-column'>
                {children}
            </td>
        );
    }   

}