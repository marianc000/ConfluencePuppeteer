import { rows } from './db.js';
import { groupBy } from './collections.js';


rows.filter(r => r.DATA_TYPE === 'VARCHAR2')
    .forEach(r => r.DATA_TYPE += `(${r.DATA_LENGTH})`);

rows.filter(r => r.DATA_TYPE === 'NUMBER')
    .forEach(r => {
        if (r.DATA_PRECISION)
            r.DATA_TYPE += `(${r.DATA_PRECISION},${r.DATA_SCALE})`
    });

let tables = groupBy(rows, o => o.TABLE_NAME);

tables = Object.entries(tables).map(([title, cols]) => ({
    title,
    html: `<p>${cols[0].TCOMMENT}</p>`
        + `<table><tr><th>Column name</th><th>Type</th><th>Description</th></tr>`
        + cols.map(c => `<tr><td>${c.COLUMN_NAME}</td><td>${c.DATA_TYPE}</td><td>${c.CCOMMENT}</td></tr>`).join('')
        + `</table>`
}));

console.log(tables.slice(0, 3));
export { tables };

