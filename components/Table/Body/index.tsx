interface TableBodyProps{
    children: React.ReactNode,
}

export default function TableBody({children}: TableBodyProps){
    return (
        <tbody className="table-body">
            {children}
        </tbody>
    );
}