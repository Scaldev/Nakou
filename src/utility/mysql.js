const mysql = require("mysql2/promise");
require('dotenv').config();

function openPool() {
    return mysql.createPool({ host: process.env.HOST, user: process.env.USER, password: process.env.PASSWORD, port: process.env.PORT, database: process.env.DATABASE });
}

async function queryData(query, inputs) {
    const pool = openPool();
    console.log(query, inputs);
    const [rows] = await pool.execute(query, inputs);
    return rows;
};

async function tableCheck(table, att, value) {
    const pool = openPool();
    const [rows] = await pool.execute(`SELECT ${att} FROM ${table} WHERE ${att} = "${value}";`);
    console.log(att, value, rows, rows.length, rows.length != 0);
    return rows.length != 0;
}

module.exports = { queryData, tableCheck };