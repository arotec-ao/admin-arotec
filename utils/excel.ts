import {utils, writeFile} from 'xlsx';


//Este recurso deve ser importado em um Client Component

export function exportDataExcel(data:any, title:string, type:string='default'){

    var ws = null;
    switch(type){
        case 'default':
            ws = utils.json_to_sheet(data);
            break;
        case 'equipes-canar':
            ws = utils.aoa_to_sheet([[]]);
            utils.sheet_add_aoa(ws, [
                ['Nome da equipe: ', data.nomeTeam]
                ,['Nome da Instituição: ', data.nomeInstituicao], 
                ['Telefone da Equipe: ', data.telefone], 
                ['Email', data.email]], {origin:{r:0, c:0}})
            
            if(data.elementos.length > 0){
                utils.sheet_add_aoa(ws, [['Nome', 'Função', 'Nascimento']], {origin:{r:5, c:0}});

                utils.sheet_add_aoa(ws, data.elementos.map((elemento:any)=>{
                    return (
                        [
                            elemento.nome, 
                            elemento.funcao, 
                            elemento.nascimento
                        ]
                    )
                }), {origin:{r:6, c:0}});
            }
            break;
    }

   
    if(ws !=null){
        const wb = utils.book_new();
             
        utils.book_append_sheet(wb, ws, 'Planilha de Dados');
        writeFile(wb, (title+'.xlsx'));
    }
   
}