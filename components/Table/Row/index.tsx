interface TableRowProps{
    children: React.ReactNode,
    onClick?: Function
}

export default function TableRow({children, onClick=()=>{}}: TableRowProps){
    return (
        <tr className="table-row" onClick={()=>{onClick()}}>
            {children}
        </tr>
    );
}