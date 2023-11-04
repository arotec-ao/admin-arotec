import './style.css';

import TableHeader from './Header';
import TableBody from './Body';
import TableRow from './Row';
import TableColumn from './Column';
import TableCheckout from './Checkbox';


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
    onSelectRow?: Function, 
    onSelectToogleAll?:Function,
    selecteds?:string[],
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
                    {dados.onSelectToogleAll && <TableColumn   header><TableCheckout checked={(dados.selecteds?.length ?? 0) == dados.rows.length ? true: false} 
                    onClick={(value:boolean)=>{
                        if(dados.onSelectToogleAll){
                            dados.onSelectToogleAll()
                        }
                    
                    }} /> </TableColumn>}
                    {dados.labels.map((label, index)=>{
                        return (<TableColumn key={index} header>{label}</TableColumn>)
                    })}
             
                </TableRow>
            </TableHeader>

            <TableBody>
                {
                    dados.rows.map((row:{id: string, columns_data:string[]})=>
                        (<TableRow key={row.id} onClick={()=>{dados.onClickRow(row.id)}}>
                                 {dados.onSelectRow && <TableColumn> <TableCheckout
                                 checked={dados.selecteds?.includes(row.id) ?? false}
                                 onClick={(value:boolean)=>{
                                        if(dados.onSelectRow){
                                            dados.onSelectRow(row.id)
                                        }
                                
                                }} /></TableColumn>}

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