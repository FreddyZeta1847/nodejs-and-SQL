var config = require('./dbConfig');
const sql = require('msnodesqlv8');

const querySelect = "SELECT * FROM EMPLOYEES ORDER BY ID OFFSET ? ROWS FETCH NEXT 10 ROWS ONLY";
const queryInsert = "insert into EMPLOYEES (First_Name, Last_Name, email, salary) values (?, ?, ?, ?)";
const queryDelete = "delete from EMPLOYEES where email = ?";
const queryUpdate = "update EMPLOYEES set First_Name = ?, Last_Name = ?, salary = ?, email = ? where email = ?";
const queryPartialNameSurname = "SELECT * FROM EMPLOYEES WHERE First_name LIKE ? and Last_name LIKE ? ORDER BY ID OFFSET ? ROWS FETCH NEXT 10 ROWS ONLY";

async function getLoginDetails(interval) {
  console.log(interval);
  interval = interval*10;
  return new Promise((resolve, reject) => {
    sql.query(config, querySelect, [interval], (err, rows) => {
      if (err) {
        reject(err);
      } else {
        resolve(rows);
      }
    });
  });
}

async function insertEmployee(nome, cognome, email, salario) {
  return new Promise((resolve, reject) => {
      sql.query(config, queryInsert, [nome, cognome, email, salario], (err, result) => {
          if (err) {
              console.error('Errore durante l\'esecuzione della query di inserimento:', err);
              reject(err);
          } else {
              resolve(result);
          }
      });
  });
}


async function deleteEmployeeByEmail(email) {
  return new Promise((resolve, reject) => {
    console.log(`Esecuzione query: ${queryDelete} con email: ${email}`);
    sql.query(config, queryDelete, [email], (err, result) => {
      if (err) {
        console.error('Errore durante l\'esecuzione della query:', err);
        reject(err);
      } else {
        console.log('Risultato della query:', result);
        resolve(result);
      }
    });
  });
}

async function updateEmployeeByEmail(oldEmail, First_Name, Last_Name, salary) {
  return new Promise((resolve, reject) => {
    sql.query(config, queryUpdate, [First_Name, Last_Name, salary, oldEmail, oldEmail], (err, result) => {
      if (err) {
        reject(err);
      } else {
        resolve(result);
      }
    });
  });
}


async function getPeopleByNamePartial(nome, cognome, interval) {
  const partialName = '%' + nome + '%'; // Aggiunge il carattere jolly '%' per corrispondenze parziali
  const partialSurname = '%' + cognome + '%';
  interval = parseInt(interval, 10);
  interval = interval*10;
  
  return new Promise((resolve, reject) => {
    sql.query(config, queryPartialNameSurname, [partialName, partialSurname, interval], (err, rows) => {
      if (err) {
        reject(err);
      } else {
        resolve(rows);
      }
    });
  });
}

module.exports = {
  getLoginDetails,
  insertEmployee,
  deleteEmployeeByEmail:deleteEmployeeByEmail,
  updateEmployeeByEmail,
  getPeopleByNamePartial
};