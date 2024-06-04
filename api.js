const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const dboperations = require('./dbOperations');

const app = express();
const port = 3000;

app.use(cors());
app.use(bodyParser.json());



// Endpoint per ottenere i dettagli degli utenti
app.post('/api/employees', (req, res) => {
  const interval = req.body;
  console.log(interval.intervallo);
  dboperations.getLoginDetails(interval.intervallo)
    .then(result => {
      console.log('Risultato della query:', result); // Log dei risultati
      res.json(result);
    })
    .catch(error => {
      console.error('Errore nella connessione al database:', error); // Log degli errori
      res.status(500).json({ error: 'Errore nella connessione al database' });
    });
});



// Endpoint per filtrare gli utenti in base al nome e cognome parziale
app.post('/api/filter', (req, res) => {
  const { interval, nome, cognome } = req.body;
  dboperations.getPeopleByNamePartial(nome, cognome, interval)
    .then(result => {
      res.json(result);
    })
    .catch(error => {
      console.error('Errore nella connessione al database:', error); // Log degli errori
      res.status(500).json({ error: 'Errore nella connessione al database' });
    });
});



// Endpoint per inserire un nuovo utente
app.post('/api/newuser', async(req, res) => {
  const { nome, cognome, email, salario } = req.body;
  dboperations.insertEmployee(nome, cognome, email, salario)
    .then(result => {
      console.log('Nuovo utente inserito:', result); // Log dei risultati
      res.status(201).json({ message: 'Nuovo utente inserito con successo', result });
    })
    .catch(error => {
      console.error('Errore durante l\'inserimento del nuovo utente:', error); // Log degli errori
      res.status(500).json({ error: 'Errore durante l\'inserimento del nuovo utente' });
    });
});



// Endpoint per cancellare un utente
app.delete('/api/employees/:email', (req, res) => {
  const email = req.params.email;
  dboperations.deleteEmployeeByEmail(email)
    .then(result => {
      console.log(result.rowsAffected);
      if (result.rowsAffected > 0) {
        res.json({ message: 'Utente cancellato con successo' });
      } else {
        console.log("aaaa");
        res.status(404).json({ error: 'Utente non trovato' });
      }
    })
    .catch(error => {
      console.log("aacaa");
      console.error('Errore durante la cancellazione dell\'utente:', error); // Log degli errori
      res.status(500).json({ error: 'Errore durante la cancellazione dell\'utente' });
    });
});



app.put('/api/employees/:email', (req, res) => {
  const email = req.params.email;
  const { First_Name, Last_Name, salary } = req.body;

  if (!First_Name || !Last_Name || !salary) {
      return res.status(400).json({ error: 'Tutti i campi sono obbligatori' });
  }

  dboperations.updateEmployeeByEmail(email, First_Name, Last_Name, salary)
  .then(result => {
      if (result.rowsAffected > 0) {
          res.json({ message: 'Utente aggiornato con successo' });
      } else {
        console.log("AAAA");
          res.status(404).json({ error: 'Utente non trovato' });
      }
  })
  .catch(error => {
      console.error('Errore durante l\'aggiornamento dell\'utente:', error); // Log degli errori
      res.status(500).json({ error: 'Errore durante l\'aggiornamento dell\'utente' });
  });
});



// Avvio del server
app.listen(port, () => {
  console.log(`Server in ascolto sulla porta ${port}`);
});
