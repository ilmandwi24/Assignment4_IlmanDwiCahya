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

const userTable = process.env.USER_TABLE || 'user';

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


const addUser = async (email,nama,password) => {
  const query = `INSERT INTO ${userTable} (email, nama, password) VALUES (?, ?, ?)`;
  const values = [email, nama, password];
  await executeQuery(query, values);
};

const getEmailUser = async(email)=>{
  const query = `SELECT * FROM ${userTable} WHERE email = ?`;
  const values = [email];
  const result = await executeQuery(query, values);
  return result;
}

// const logoutUser = async(email)=>{
//   const query = `DELETE FROM ${userTable} WHERE email = ?`;
//   const values = [email];
//   const result = await executeQuery(query, values);
//   return result;
// }


module.exports = {
    // getListPhonebook,
   
    addUser,
 
    // editPhonebook,
    // deletePhonebook
    getEmailUser
};
