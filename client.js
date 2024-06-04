let numeroDiPagina = 0;


//FILTRAGGIO

const filtroNomi = document.getElementById('filtro-nomi');
const filtroCognome = document.getElementById('filtro-cognome');

function handleKeyPress(event) {
    applyFilters();
}

filtroNomi.addEventListener('input', handleKeyPress);
filtroCognome.addEventListener('input', handleKeyPress);

function applyFilters() {
    const nome = filtroNomi.value;
    const cognome = filtroCognome.value;
    const interval = numeroDiPagina;

    if(nome === "" && cognome ===""){
        getEmployeeFromDatabase(numeroDiPagina);
    }
    else{
        fetch('http://localhost:3000/api/filter', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({interval, nome: nome === "First_Name" ? '' : nome, cognome: cognome === "Last_Name" ? '' : cognome  })
        })
        .then(response => response.json())
        .then(data => {
            displayEmployees(data);
        })
        .catch(error => {
            console.error('Errore durante la richiesta:', error);
        });
    }
        
}





//MODIFICA

function showUpdateModal(employee) {
    const trselected = document.getElementById(employee.ID);

    let tdModifica = "id"+ employee.ID+'update';
    
    const cellUpdate = trselected.querySelector(`#${tdModifica}`);
    cellUpdate.innerHTML = `<div class="modal">
                                <button id="id${employee.ID}confirmUpdate" class="updateButton">Salva</button>
                                <button id="id${employee.ID}cancelUpdate" class="updateButton">Annulla</button>
                            </div>`;

    var newRow = document.createElement('tr');
    var newCell1 = document.createElement('td');

    newCell1.colSpan = 7;

    // Imposta il contenuto delle nuove celle
    newCell1.innerHTML = `
    <div class="modal-label">Modifica Utente con ID: ${employee.ID}</div>
    <div class="modal">
        <label for="updateFirstName">Nome:</label>
        <input type="text" id="id${employee.ID}updateFirstName" value="${employee.First_Name}"><br>
        <label for="updateLastName">Cognome:</label>
        <input type="text" id="id${employee.ID}updateLastName" value="${employee.Last_Name}"><br>
        <label for="updateEmail">Email:</label>
        <input type="email" id="id${employee.ID}updateEmail" value="${employee.email}" disabled><br>
        <label for="updateSalary">Salario:</label>
        <input type="number" id="id${employee.ID}updateSalary" value="${employee.salary}"><br>
    </div>
    `;

    // Aggiungi le celle alla nuova riga
    newRow.appendChild(newCell1);

    // Aggiungi la nuova riga dopo la riga selezionata
    trselected.parentNode.insertBefore(newRow, trselected.nextSibling);


    // Event listener per il pulsante di conferma aggiornamento
    document.getElementById(`id${employee.ID}confirmUpdate`).addEventListener('click', function() {
        const updatedFirstName = document.getElementById(`id${employee.ID}updateFirstName`).value;
        const updatedLastName = document.getElementById(`id${employee.ID}updateLastName`).value;
        const updatedSalary = document.getElementById(`id${employee.ID}updateSalary`).value;

        console.log(updatedFirstName);

        fetch(`http://localhost:3000/api/employees/${employee.email}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                First_Name: updatedFirstName,
                Last_Name: updatedLastName,
                salary: updatedSalary
            })
        })
        .then(response => response.json())
        .then(data => {
            if (data.error) {
                console.error('Errore:', data.error);
                newRow.remove();
                console.log(numeroDiPagina);
                getEmployeeFromDatabase(numeroDiPagina);
            } else {
                console.log(data.message);
                modal.remove();
                
                getEmployeeFromDatabase(numeroDiPagina);
            }
        })
        .catch((error) => {
            console.error('Errore durante la richiesta:', error);
        });
    });

    // Event listener per il pulsante di annullamento
    document.getElementById(`id${employee.ID}cancelUpdate`).addEventListener('click', function() {
        newRow.remove();
        cellUpdate.innerHTML = `<td id=id${employee.ID}update><button class="updateButton">Modifica</button></td>`;
        addingEventListenerToButton(trselected, employee);
    });
}





//ELIMINA

function cancelEmployee(employee) {
    const confirmDelete = confirm(`Sei sicuro di voler cancellare l'utente con email ${employee.email}?`);
    if (confirmDelete) {
        fetch(`http://localhost:3000/api/employees/${employee.email}`, {
            method: 'DELETE',
        })
        .then(response => {
            if (response.ok) {
                console.log('Utente cancellato con successo');
                document.getElementById('result').textContent = `Utente con email ${employee.email} cancellato con successo.`;
                row.remove();
                getEmployeeFromDatabase(numeroDiPagina);
            } else {
                console.error('Errore durante la cancellazione:', response.statusText);
                console.log(numeroDiPagina);
                getEmployeeFromDatabase(numeroDiPagina);
            }
        })
        .catch(error => {
            console.error('Errore durante la richiesta:', error);
            getEmployeeFromDatabase();
        });
    }
}




//GET 10 EMPLOYEES

function getEmployeeFromDatabase(interval) {
    console.log(interval);
    fetch('http://localhost:3000/api/employees', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            intervallo: interval,
        })
    })
    .then(response => response.json())
    .then(data => {
        console.log('Elenco degli impiegati:', data);

        // Trova la tabella e il corpo della tabella
        const tableBody = document.querySelector('#employeeTable tbody');
        tableBody.innerHTML = ''; // Pulisci il corpo della tabella

        // Popola la tabella con i dati
        displayEmployees(data);
    })
    .catch(error => {
        console.error('Errore durante la richiesta:', error);
    });
}





//SHOW EMPLOYEES

function displayEmployees(data) {
    const tableBody = document.querySelector('#employeeTable tbody');
    tableBody.innerHTML = ''; // Pulisci il corpo della tabella

    console.log(data);

    // Popola la tabella con gli utenti filtrati
    data.forEach(employee => {
        const row = document.createElement('tr');
        row.id = employee.ID;
        row.innerHTML = `
            <td>${employee.ID}</td>
            <td id=id${employee.ID}name>${employee.First_Name}</td>
            <td id=id${employee.ID}surname>${employee.Last_Name}</td>
            <td id=id${employee.ID}mail>${employee.email}</td>
            <td id=id${employee.ID}salary>€${employee.salary}</td>
            <td id=id${employee.ID}update><button class="updateButton">Modifica</button></td>
            <td><button class="deleteButton">-</button></td> 
        `;
        tableBody.appendChild(row);

        addingEventListenerToButton(row, employee);
    });
}




//ADD EVENT LISTENER TO BUTTONS

function addingEventListenerToButton(row, employee){
    // Aggiungi listener per i bottoni di aggiornamento
    row.querySelector('.updateButton').addEventListener('click', function() {
        showUpdateModal(employee);
    });

    // Aggiungi listener per i bottoni di cancellazione
    row.querySelector('.deleteButton').addEventListener('click', function() {
        cancelEmployee(employee);
    });
}






//REGISTRAZIONE

document.getElementById('registrationForm').addEventListener('submit', function(event) {
    event.preventDefault();

    const nome = document.getElementById('nome').value;
    const cognome = document.getElementById('cognome').value;
    const email = document.getElementById('email').value;
    const salario = document.getElementById('salario').value;

    fetch('http://localhost:3000/api/newuser', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ nome, cognome, email, salario })
    })
    .then(response => response.json())
    .then(data => {
        if (data.error) {
            console.error('Errore:', data.error);
        } else {
            console.log(data.message);
            console.log(numeroDiPagina);
            getEmployeeFromDatabase(numeroDiPagina);
        }
    })
    .catch((error) => {
        console.error('Errore durante la richiesta:', error);
    });
});




//IMPAGINAZIONE

document.getElementById('buttonPages').addEventListener('click', function() {
    numeroDiPagina = (document.getElementById('pages').value)-1;
    applyFilters();
});
document.getElementById('increment-button').addEventListener('click', function(){
    numeroDiPagina++;
    document.getElementById('pages').value++;
});
document.getElementById('decrement-button').addEventListener('click', function(){
    if(numeroDiPagina>0){
        numeroDiPagina--;
        document.getElementById('pages').value--;
    }
});




//Function at start
getEmployeeFromDatabase(numeroDiPagina);