import { utils, writeFileXLSX } from 'xlsx';

export async function generateDiagnostic(dataRow, dataTotals) {
    const dataExcel = [
        [
            'NOMBRE DEL CLIENTE',
            'NOMBRE DEL CLIENTE',
            'EVALUACIÓN INICIAL RESOLUCIÓN 0312/2019',
            'EVALUACIÓN INICIAL RESOLUCIÓN 0312/2019',
            'EVALUACIÓN INICIAL RESOLUCIÓN 0312/2019',
            'EVALUACIÓN INICIAL RESOLUCIÓN 0312/2019',
            'EVALUACIÓN INICIAL RESOLUCIÓN 0312/2019',
            'EVALUACIÓN INICIAL RESOLUCIÓN 0312/2019',
            'EVALUACIÓN INICIAL RESOLUCIÓN 0312/2019',
            'EVALUACIÓN INICIAL RESOLUCIÓN 0312/2019'
        ],
        ['', '', '', '', '', '', '', '', '', ''],
        ['', '', '', '', '', '', '', '', '', ''],
        [
            'TABLA DE VALORES Y CALIFICACIÓN',
            'TABLA DE VALORES Y CALIFICACIÓN',
            'TABLA DE VALORES Y CALIFICACIÓN',
            'TABLA DE VALORES Y CALIFICACIÓN',
            'TABLA DE VALORES Y CALIFICACIÓN',
            'TABLA DE VALORES Y CALIFICACIÓN',
            'TABLA DE VALORES Y CALIFICACIÓN',
            'TABLA DE VALORES Y CALIFICACIÓN',
            'TABLA DE VALORES Y CALIFICACIÓN',
            'TABLA DE VALORES Y CALIFICACIÓN'
        ],
        ['ESTANDAR', 'ESTANDAR', 'Item del estandar', 'Valor', 'Peso porcentual', 'Puntaje posible', '', '', '', 'CALIFICACIÓN DE LA EMPRESA O CONTRATANTE'],
        ['', '', '', '', '', 'Cumple', 'No cumple', 'Justifica', 'No justifica', ''],
        ['', '', '', '', '', '', '', '', '', '']
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
                    item.doesNotJustify,
                    item?.items?.reduce((acc, item) => acc + parseFloat(item.valueTotal), 0),
                ]);
            });
        });
    });

    dataExcel.push(['', '', '', '', '', '', '', '', '', '']);
    dataExcel.push(['TOTALES', '', '', '', dataTotals.total, dataTotals.cumple, dataTotals.noCumple, dataTotals.justifica, dataTotals.noJustifica, dataTotals.totalGeneral]);
    dataExcel.push(['Cuando se cumple con el ítem del estándar la calificación será la máxima del respectivo ítem, de lo contrario su calificación será igual a cero (0).', '', '', '', '', '', '', '', '', '']);
    dataExcel.push([
        'Si el estándar No Aplica, se deberá justificar la situación y se calificará con el porcentaje máximo del ítem indicado para cada estándar. En caso de no justificarse, la calificación el estándar será igual a cero (0)',
        '',
        '',
        '',
        '',
        '',
        '',
        '',
        '',
        ''
    ]);
    dataExcel.push([
        'El presente formulario es documento público, no se debe consignar hecho o manifestaciones falsas y está sujeto a las sanciones establecidas en los artículos 288 y 294 de la Ley 599 de 2000 (Código Penal Colombiano)',
        '',
        '',
        '',
        '',
        '',
        '',
        '',
        '',
        ''
    ]);

    const nivel = (dataTotals.totalGeneral <= 60) ? 'CRITICO '
        : (dataTotals.totalGeneral <= 85) ? 'MODERADO '
        : 'ACEPTABLE ';

    dataExcel.push(['', '', '', '', '', '', '', '', '', '']);
    dataExcel.push(['', '', '', '', '', '', '', '', '', '']);
    dataExcel.push(['EL NIVEL DE SU EVALUACIÓN ES:', '', '', '', '', nivel , '', '', '', '']);
    dataExcel.push(['', '', '', '', '', '', '', '', '', '']);
    dataExcel.push(['FIRMA RESPONSABLE DEL DISEÑO DEL SG-SST', '', '', '', '', '  ', '', '', '', '']);
    dataExcel.push(['', '', '', '', '', '', '', '', '', '']);
    dataExcel.push(['VALENTINA ZULUAGA HENAO SS2018060400878', '', '', '', '', ' ', '', '', '', '']);
    dataExcel.push(['', '', '', '', '', ' ', '', '', '', '']);

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
        { wch: 10 }, // No justifica
        { wch: 20 } // CALIFICACIÓN DE LA EMPRESA O CONTRATANTE
    ];
    ws['!cols'] = wscols;

    // Combinar celdas para los encabezados
    // ws['!merges'] = [
    //     { s: { r: 0, c: 0 }, e: { r: 2, c: 1 } }, // Norma
    //     { s: { r: 0, c: 2 }, e: { r: 2, c: 2 } }, // Item del estandar
    //     { s: { r: 0, c: 3 }, e: { r: 2, c: 3 } }, // Valor
    //     { s: { r: 0, c: 4 }, e: { r: 2, c: 4 } }, // Peso porcentual
    //     { s: { r: 0, c: 5 }, e: { r: 0, c: 8 } }, // Puntaje posible
    //     { s: { r: 1, c: 5 }, e: { r: 2, c: 5 } }, // Cumple
    //     { s: { r: 1, c: 6 }, e: { r: 2, c: 6 } }, // No cumple
    //     { s: { r: 1, c: 7 }, e: { r: 2, c: 7 } }, // Justifica
    //     { s: { r: 1, c: 8 }, e: { r: 2, c: 8 } } // No justifica
    // ];

    ws['!merges'] = [
        // nombre del cliente
        { s: { r: 0, c: 0 }, e: { r: 2, c: 1 } },
        // evaluación inicial resolución 0312/2019
        { s: { r: 0, c: 2 }, e: { r: 0, c: 9 } },
        // tabla de valores y calificación
        { s: { r: 3, c: 0 }, e: { r: 3, c: 9 } },
        // ESTANDAR (columnas A-B, filas 5-6)
        { s: { r: 4, c: 0 }, e: { r: 5, c: 1 } },
        // Item del estandar
        { s: { r: 4, c: 2 }, e: { r: 5, c: 2 } },
        // Valor
        { s: { r: 4, c: 3 }, e: { r: 5, c: 3 } },
        // Peso porcentual
        { s: { r: 4, c: 4 }, e: { r: 5, c: 4 } },
        // Puntaje posible (header spanning columns F-I)
        { s: { r: 4, c: 5 }, e: { r: 4, c: 8 } },
        // CALIFICACIÓN DE LA EMPRESA O CONTRATANTE
        { s: { r: 4, c: 9 }, e: { r: 5, c: 9 } }
    ];

    // Combinar celdas para nameRequirement y item.reqChild.description
    let mergeRanges = [];
    let startRow = 7; // La fila donde empiezan los datos
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
                mergeRanges.push({ s: { r: itemStartRow, c: 9 }, e: { r: startRow - 1, c: 9 } }); // CALIFICACIÓN DE LA EMPRESA O CONTRATANTE
            }
        });
        if (requirement.items.length > 1) {
            mergeRanges.push({ s: { r: requirementStartRow, c: 0 }, e: { r: startRow - 1, c: 0 } });
        }
    });

    // Combinar celdas para los totales
    startRow++;
    mergeRanges.push({ s: { r: startRow, c: 0 }, e: { r: startRow, c: 3 } });
    startRow++;
    mergeRanges.push({ s: { r: startRow, c: 0 }, e: { r: startRow + 1, c: 9 } });
    startRow += 2;
    mergeRanges.push({ s: { r: startRow, c: 0 }, e: { r: startRow + 1, c: 9 } });
    startRow += 3;
    mergeRanges.push({ s: { r: startRow, c: 0 }, e: { r: startRow + 1, c: 4 } });
    mergeRanges.push({ s: { r: startRow, c: 5 }, e: { r: startRow + 1, c: 9 } });
    startRow += 2;
    mergeRanges.push({ s: { r: startRow, c: 0 }, e: { r: startRow + 1, c: 4 } });
    mergeRanges.push({ s: { r: startRow, c: 5 }, e: { r: startRow + 1, c: 9 } });
    startRow += 2;
    mergeRanges.push({ s: { r: startRow, c: 0 }, e: { r: startRow + 1, c: 4 } });
    mergeRanges.push({ s: { r: startRow, c: 5 }, e: { r: startRow + 1, c: 9 } });


    ws['!merges'] = ws['!merges'].concat(mergeRanges);

    utils.book_append_sheet(wb, ws, 'DIAGNOSTICO');
    await writeFileXLSX(wb, 'DIAGNOSTICO.xlsx');
}
