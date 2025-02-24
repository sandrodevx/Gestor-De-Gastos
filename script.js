// Seleccionar elementos del DOM
const descriptionInput = document.getElementById("description");
const categorySelect = document.getElementById("category");
const typeSelect = document.getElementById("type");
const amountInput = document.getElementById("amount");
const dateInput = document.getElementById("date");
const addTransactionButton = document.getElementById("addTransaction");
const balanceAmount = document.getElementById("balanceAmount");
const totalIncome = document.getElementById("totalIncome");
const totalExpense = document.getElementById("totalExpense");
const transactionList = document.getElementById("transactionList");
const exportDataButton = document.getElementById("exportData");

let transactions = [];

// Cargar transacciones desde localStorage
function loadTransactions() {
    const savedTransactions = JSON.parse(localStorage.getItem("transactions")) || [];
    transactions = savedTransactions; // Corregido: transactions = savedTransactions
    updateUI();
}

// Guardar transacciones en localStorage
function saveTransactions() {
    localStorage.setItem("transactions", JSON.stringify(transactions));
}

// Agregar una transacción
function addTransaction() {
    const description = descriptionInput.value.trim(); // Corregido: descriptionInput.value
    const category = categorySelect.value; // Corregido: categorySelect.value
    const type = typeSelect.value; // Corregido: typeSelect.value
    const amount = parseFloat(amountInput.value);
    const date = dateInput.value;

    if (description === "" || isNaN(amount) || date === "") return; // Corregido: description

    const newTransaction = {
        id: Date.now(),
        description,
        category,
        type,
        amount,
        date,
    };

    transactions.push(newTransaction); // Corregido: newTransaction
    saveTransactions(); // Corregido: saveTransactions
    updateUI();
    clearInputs();
}

// Actualizar la interfaz de usuario
function updateUI() {
    // Calcular balance, ingresos y gastos
    const income = transactions
        .filter(transaction => transaction.type === "ingreso")
        .reduce((total, transaction) => total + transaction.amount, 0);

    const expense = transactions
        .filter(transaction => transaction.type === "gasto")
        .reduce((total, transaction) => total + transaction.amount, 0);

    const balance = income - expense;

    // Actualizar valores en la interfaz
    balanceAmount.textContent = balance.toFixed(2); // Corregido: textContent
    totalIncome.textContent = income.toFixed(2);
    totalExpense.textContent = expense.toFixed(2);

    // Actualizar lista de transacciones
    transactionList.innerHTML = "";
    transactions.forEach(transaction => {
        const li = document.createElement("li");
        li.innerHTML = `
            <span>${transaction.description} (${transaction.category})</span>
            <span>${transaction.type === "ingreso" ? "+" : "-"}${transaction.amount.toFixed(2)}</span>
        `;
        transactionList.appendChild(li);
    });

    // Actualizar gráficos (usando Chart.js)
    updateCharts();
}

// Limpiar campos de entrada
function clearInputs() {
    descriptionInput.value = "";
    amountInput.value = "";
    dateInput.value = "";
}

// Exportar datos a CSV
function exportToCSV() {
    const csvContent = "data:text/csv;charset=utf-8," + // Corregido: data:text/csv;charset=utf-8
        transactions.map(transaction => Object.values(transaction).join(",")).join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "transacciones.csv");
    document.body.appendChild(link);
    link.click();
}

// Event listeners
addTransactionButton.addEventListener("click", addTransaction);
exportDataButton.addEventListener("click", exportToCSV);

// Cargar transacciones al iniciar
loadTransactions();