import { utils, writeFile } from 'xlsx';
import { formatNumber } from './utils';

//Este recurso deve ser importado em um Client Component

export function exportDataExcel(data: any, title: string, type: string = 'default') {

    var ws = null;
    switch (type) {
        case 'default':
            ws = utils.json_to_sheet(data);
            break;
        case 'equipes-canar':
            ws = utils.aoa_to_sheet([[]]);
            utils.sheet_add_aoa(ws, [
                ['Nome da equipe: ', data.nomeTeam]
                , ['Nome da Instituição: ', data.nomeInstituicao],
                ['Telefone da Equipe: ', data.telefone],
                ['Email', data.email]], { origin: { r: 0, c: 0 } })

            if (data.elementos.length > 0) {
                utils.sheet_add_aoa(ws, [['Nome', 'Função', 'Nascimento']], { origin: { r: 5, c: 0 } });

                utils.sheet_add_aoa(ws, data.elementos.map((elemento: any) => {
                    return (
                        [
                            elemento.nome,
                            elemento.funcao,
                            elemento.nascimento
                        ]
                    )
                }), { origin: { r: 6, c: 0 } });
            }
            break;
        case 'compras':
            if (data.length > 0) {
                ws = utils.aoa_to_sheet([[]]);


                var nextRow = 0;
                for (let x = 0; x < data.length; x++) {
                    const compra = data[x];

                    utils.sheet_add_aoa(ws, [
                        ['Cliente ' + (x + 1) + ': ', compra.informacoesEntrega.nomeCompleto],
                        ['Nome Completo: ', compra.informacoesEntrega.nomeCompleto],
                        ['Email: ', compra.informacoesEntrega.email],
                        ['Telefone: ', compra.informacoesEntrega.telefone],
                        ['Endereço: ', compra.informacoesEntrega.endereco],
                        ['País: ', compra.informacoesEntrega.pais],
                        ['Custo da Entrega: ', formatNumber(compra.entrega) + ' Kz'],
                        ['Metódo de Pagamento: ', compra.metodoPagamento],
                        ['Metódo de Obtenção: ', compra.metodoObtencao],
                        ['Pago: ', (compra.pago ? 'Sim' : 'Não')],

                        [''],
                        ['Produtos'],
                        ['Nome', 'Preço', 'Desconto', 'Quantidade'],

                        ...compra.produtos.map((produto: any) => {
                            return [
                                produto.nome,
                                formatNumber(produto.preco) + ' Kz',
                                produto.desconto + '%',
                                produto.quantidade,
                            ]
                        })

                    ], {
                        origin: {
                            r: nextRow,
                            c: 0,
                        }
                    });


                    //calculando a próxima linha que ele vai escrever
                    nextRow += 13 + (compra.produtos.length) + 3;

                }

            }
            break;
        case 'produtos':
            if (data.length > 0) {
                ws = utils.aoa_to_sheet([[]]);

                utils.sheet_add_aoa(ws, [
                    ['Nome do Produto', 'Marca', 'Categoria', 'Preço',
                        'Quantidade', 'Estado', 'Valor de Entrega', 'Desconto']
                ], {
                    origin: {
                        c: 0,
                        r: 0
                    }
                });

                for (let x = 0; x < data.length; x++) {
                    const prod = data[x];
                    utils.sheet_add_aoa(ws, [
                        [prod.nome, prod.marca, prod.categoria,
                        prod.preco + ' Kz', prod.quantidade, prod.estado,
                        prod.entrega + ' Kz', prod.desconto + '%']
                    ], {
                        origin: {
                            r: 1 + x,
                            c: 0
                        }
                    })
                }

            }
            break;
    }


    if (ws != null) {
        const wb = utils.book_new();

        utils.book_append_sheet(wb, ws, 'Planilha de Dados');
        writeFile(wb, (title + '.xlsx'));
    }

}