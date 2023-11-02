import './style.css';

import TableHeader from './Header';
import TableBody from './Body';
import TableRow from './Row';
import TableColumn from './Column';


interface TableProps {
    children: React.ReactNode;
}

export default function Table({ children }: TableProps) {
    return (
        <table className='table'>
            {children}
        </table>
    );
}

export interface TableData {
    labels: string[],
    onClickRow:Function,
    rows: {
        id:string, 
        columns_data:string[]
    }[]
}
export function generateTable(dados: TableData) {

    return (
        <Table>
            <TableHeader>
                <TableRow>
                    {dados.labels.map((label, index)=>{
                        return (<TableColumn key={index} header>{label}</TableColumn>)
                    })}
             
                </TableRow>
            </TableHeader>

            <TableBody>
                {
                    dados.rows.map((row:{id: string, columns_data:string[]})=>
                        (<TableRow key={row.id} onClick={()=>{dados.onClickRow(row.id)}}>
                                    {row.columns_data.map((column:string, index)=>
                                         (<TableColumn  key={index}>{column}</TableColumn>)
                                    )}
                              </TableRow>)
                    )
                }
            </TableBody>
        </Table>

    )

}