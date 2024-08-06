// eslint-disable-next-line import/no-extraneous-dependencies
const MySQL = require('mysql2/promise');
const CommonHelper = require('../helpers/CommonHelper');

const connectionPool = MySQL.createPool({
    host: process.env.MYSQL_CONFIG_HOST || 'localhost',
    user: process.env.MYSQL_CONFIG_USER || 'root',
    password: process.env.MYSQL_CONFIG_PASSWORD || 'password',
    database: process.env.MYSQL_CONFIG_DATABASE || 'laptop',
    port: Number(process.env.MYSQL_PORT) || 3306,
    connectionLimit: Number(process.env.MYSQL_CONN_LIMIT) || 0
});

const laptopTable = process.env.LAPTOP_TABLE || 'laptop';

const executeQuery = async (query, values = []) => {
  let connection = null;
  try {
    connection = await connectionPool.getConnection();
    const timeStart = process.hrtime();
    const [result] = await connection.query(query, values);
    const timeDiff = process.hrtime(timeStart);
    const timeTaken = Math.round((timeDiff[0] * 1e9 + timeDiff[1]) / 1e6);
    CommonHelper.log(['Database', 'Operation', 'INFO'], {
      message: { query, timeTaken }
    });
    if (connection) connection.release();
    return result;
  } catch (error) {
    CommonHelper.log(['Database', 'Operation', 'ERROR'], {
      message: `${error}`
    });
    if (connection) connection.release();
    throw error;
  }
};

const getListLaptop = async () => {
  const query = `SELECT * FROM ${laptopTable}`;
  const rawResult = await executeQuery(query);
  return Object.values(JSON.parse(JSON.stringify(rawResult)));
};

const getListIdLaptop = async () => {
  const query = `SELECT id FROM ${laptopTable}`;
  const rawResult = await executeQuery(query);
  return Object.values(JSON.parse(JSON.stringify(rawResult)));
};

const addLaptop = async (nama,brand,processor,ram,vga,harga) => {
    
  const query = `INSERT INTO ${laptopTable} (nama, brand, processor, ram,vga,harga) VALUES (?, ?, ?, ?,?,?)`;
  const values = [nama, brand, processor, ram,vga,harga];
  await executeQuery(query, values);
};

const editLaptop = async (id, nama,brand,processor,ram,vga,harga) => {
  
  const query = `UPDATE ${laptopTable} SET nama = ?, brand = ?, processor = ?, ram = ?, vga = ?, harga = ? WHERE id = ?`;
  const values = [nama,brand,processor,ram,vga,harga,Number(id)];
  const result = await executeQuery(query, values);
  return result?.affectedRows > 0;
};

const deleteLaptop = async (id) => {
  const query = `DELETE FROM ${laptopTable} WHERE id = ?`;
  const values = [id];
  const result = await executeQuery(query, values);
  return result?.affectedRows > 0;
};

module.exports = {
    // getListPhonebook,
    getListLaptop,
    addLaptop,
    editLaptop,
    deleteLaptop,
    getListIdLaptop
    // editPhonebook,
    // deletePhonebook
};
