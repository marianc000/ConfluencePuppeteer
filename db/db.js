import oracledb from 'oracledb';
import dbConfig from './dbconfig.js';

const sql = `select table_name,column_name,data_type,data_length,data_precision,data_scale,b.comments ccomment,c.comments tcomment
from user_tab_cols a 
left join user_col_comments b using(table_name,column_name)
join user_tables using(table_name)
left join  user_tab_comments c using (table_name)
order by  table_name,column_id`;

const con = await oracledb.getConnection(dbConfig);

export const rows = await con.execute(sql, [], {
  outFormat: oracledb.OUT_FORMAT_OBJECT
}).then(r => r.rows);

await con.close();



