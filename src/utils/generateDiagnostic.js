import { utils, writeFileXLSX } from 'xlsx';

export async function generateDiagnostic(dataRow) {
    const dataExcel = [
        ['ESTANDAR', 'ESTANDAR', 'Item del estandar', 'Valor', 'Peso porcentual', 'Puntaje posible', '', '', ''],
        ['', '', '', '', '', 'Cumple', 'No cumple', 'Justifica', 'No justifica'],
        ['', '', '', '', '', '', '', '', '']
    ];

    dataRow.forEach((requirement) => {
        requirement.items.forEach((item) => {
            item.items.forEach((item2, index) => {
                dataExcel.push([
                    requirement.nameRequirement, 
                    item.reqChild.description,
                    `${item.reqChild.number}.${index + 1} ${item2.item}`,
                     item2.value, 
                     item?.items?.reduce((acc, item) => acc + parseFloat(item.value), 0),
                     item2.fullyComplies,
                      item2.doesNotComply, 
                      item.justifies, 
                      item.doesNotJustify]);
            });
        });
    });

    const wb = utils.book_new();
    const ws = utils.aoa_to_sheet(dataExcel);

    // Ajustar el ancho de las columnas
    const wscols = [
        { wch: 20 }, // Norma
        { wch: 20 }, // Descripción
        { wch: 20 }, // Item del estandar
        { wch: 10 }, // Valor
        { wch: 15 }, // Peso porcentual
        { wch: 10 }, // Cumple
        { wch: 10 }, // No cumple
        { wch: 10 }, // Justifica
        { wch: 10 } // No justifica
    ];
    ws['!cols'] = wscols;

    // Combinar celdas para los encabezados
    ws['!merges'] = [
        { s: { r: 0, c: 0 }, e: { r: 2, c: 1 } }, // Norma
        { s: { r: 0, c: 2 }, e: { r: 2, c: 2 } }, // Item del estandar
        { s: { r: 0, c: 3 }, e: { r: 2, c: 3 } }, // Valor
        { s: { r: 0, c: 4 }, e: { r: 2, c: 4 } }, // Peso porcentual
        { s: { r: 0, c: 5 }, e: { r: 0, c: 8 } }, // Puntaje posible
        { s: { r: 1, c: 5 }, e: { r: 2, c: 5 } }, // Cumple
        { s: { r: 1, c: 6 }, e: { r: 2, c: 6 } }, // No cumple
        { s: { r: 1, c: 7 }, e: { r: 2, c: 7 } }, // Justifica
        { s: { r: 1, c: 8 }, e: { r: 2, c: 8 } } // No justifica
    ];

    // Combinar celdas para nameRequirement y item.reqChild.description
    let mergeRanges = [];
    let startRow = 3; // La fila donde empiezan los datos
    dataRow.forEach((requirement) => {
        let requirementStartRow = startRow;
        requirement.items.forEach((item) => {
            let itemStartRow = startRow;
            item.items.forEach(() => {
                startRow++;
            });
            if (item.items.length > 1) {
                mergeRanges.push({ s: { r: itemStartRow, c: 1 }, e: { r: startRow - 1, c: 1 } }); // item.reqChild.description
                mergeRanges.push({ s: { r: itemStartRow, c: 4 }, e: { r: startRow - 1, c: 4 } }); // Peso porcentual
            }
        });
        if (requirement.items.length > 1) {
            mergeRanges.push({ s: { r: requirementStartRow, c: 0 }, e: { r: startRow - 1, c: 0 } });
        }
    });

    ws['!merges'] = ws['!merges'].concat(mergeRanges);

    utils.book_append_sheet(wb, ws, 'DIAGNOSTICO');
    await writeFileXLSX(wb, 'DIAGNOSTICO.xlsx');
}