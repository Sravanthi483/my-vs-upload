// ===============================
// Arrays to Store Data
// ===============================

let income = [];
let expenses = [];
// ===============================
// Display Transactions
// ===============================

function displayTransactions() {

    const transactionList = document.getElementById("transactionList");

    transactionList.innerHTML = "";

    let hasData = false;

    // Income Transactions
    income.forEach((item, index) => {

        hasData = true;

        transactionList.innerHTML += `
            <div class="transaction-item income">

                <div>
                    <h4>${item.category}</h4>
                    <p>${item.description}</p>
                </div>

                <div>

                    <div class="amount income-amount">
                        +₹${item.amount}
                    </div>

                    <button class="edit-btn"
                        onclick="editIncome(${index})">
                        ✏ Edit
                    </button>

                    <button class="delete-btn"
                        onclick="deleteIncome(${index})">
                        🗑 Delete
                    </button>

                </div>

            </div>
        `;

    });

    // Expense Transactions
    expenses.forEach((item, index) => {

        hasData = true;

        transactionList.innerHTML += `
            <div class="transaction-item expense">

                <div>
                    <h4>${item.category}</h4>
                    <p>${item.description}</p>
                </div>

                <div>

                    <div class="amount expense-amount">
                        -₹${item.amount}
                    </div>

                    <button class="edit-btn"
                        onclick="editExpense(${index})">
                        ✏ Edit
                    </button>

                    <button class="delete-btn"
                        onclick="deleteExpense(${index})">
                        🗑 Delete
                    </button>

                </div>

            </div>
        `;

    });

    if (!hasData) {

        transactionList.innerHTML = `
            <div class="empty">
                <i class="fas fa-receipt"></i>
                <p>No Transactions Yet</p>
            </div>
        `;
    }
}
function updateTotalIncome() {

    let total = 0;

    income.forEach(item => {

        total += Number(item.amount);

    });

    document.getElementById("totalIncome").innerText = "₹" + total;

}
function updateTotalExpense() {

    let total = 0;

    expenses.forEach(item => {

        total += Number(item.amount);

    });

    document.getElementById("totalExpense").innerText = "₹" + total;

}
function updateBalance() {

    let totalIncome = 0;
    let totalExpense = 0;

    income.forEach(item => {
        totalIncome += Number(item.amount);
    });

    expenses.forEach(item => {
        totalExpense += Number(item.amount);
    });

    const balance = totalIncome - totalExpense;

    document.getElementById("balance").innerText = "₹" + balance;
}
// ===============================
// Monthly Report
// ===============================

function generateMonthlyReport(){

    const report = document.getElementById("monthlyReport");

    report.innerHTML = "";

    let months = {};

  
    // ===============================
// Expense Pie Chart
// ===============================

let expenseChart;

function updateExpenseChart(){

    const categories = {};

    expenses.forEach(item=>{

        if(categories[item.category]){

            categories[item.category] += Number(item.amount);

        }

        else{

            categories[item.category] = Number(item.amount);

        }

    });

    const labels = Object.keys(categories);

    const data = Object.values(categories);

    const ctx = document.getElementById("expenseChart").getContext("2d");

    if(expenseChart){

        expenseChart.destroy();

    }

    expenseChart = new Chart(ctx,{

        type:"pie",

        data:{

            labels:labels,

            datasets:[{

                data:data,

                backgroundColor:[

                    "#16a34a",
                    "#2563eb",
                    "#f59e0b",
                    "#dc2626",
                    "#9333ea",
                    "#06b6d4",
                    "#e11d48"

                ]

            }]

        },

        options:{

            responsive:true,

            plugins:{

                legend:{

                    position:"bottom"

                }

            }

        }

    });

}
  // Income

    income.forEach(item=>{

        const month = item.date.substring(0,7);

        if(!months[month]){

            months[month]={

                income:0,
                expense:0

            };

        }

        months[month].income += Number(item.amount);

    });

    // Expense

    expenses.forEach(item=>{

        const month = item.date.substring(0,7);

        if(!months[month]){

            months[month]={

                income:0,
                expense:0

            };

        }

        months[month].expense += Number(item.amount);

    });

    if(Object.keys(months).length===0){

        report.innerHTML="<p>No Report Available</p>";

        return;

    }

    for(let month in months){

        const balance = months[month].income - months[month].expense;

        report.innerHTML += `

        <div class="month-card">

            <h3>${month}</h3>

            <p><strong>Income :</strong> ₹${months[month].income}</p>

            <p><strong>Expense :</strong> ₹${months[month].expense}</p>

            <p><strong>Balance :</strong> ₹${balance}</p>

        </div>

        `;

    }

}
// ===============================
// Income Section
// ===============================

const addIncomeBtn = document.getElementById("addIncome");
const incomeForm = document.getElementById("incomeForm");

addIncomeBtn.addEventListener("click", () => {
    incomeForm.style.display = "block";
});

document.getElementById("incomeFormData").addEventListener("submit", function(e){

    e.preventDefault();

    const incomeItem = {
        amount: document.getElementById("incomeAmount").value,
        category: document.getElementById("incomeCategory").value,
        date: document.getElementById("incomeDate").value,
        description: document.getElementById("incomeDescription").value
    };

    income.push(incomeItem);

// Save to Local Storage
localStorage.setItem("income", JSON.stringify(income));

    displayTransactions();
    updateTotalIncome();
    updateBalance();
generateMonthlyReport();
updateExpenseChart();
    alert("Income Added Successfully!");

    this.reset();

    incomeForm.style.display = "none";
});
// ===============================
// Expense Section
// ===============================

const addExpenseBtn = document.getElementById("addExpense");
const expenseForm = document.getElementById("expenseForm");

addExpenseBtn.addEventListener("click", () => {
    expenseForm.style.display = "block";
});

document.getElementById("expenseFormData").addEventListener("submit", function(e){

    e.preventDefault();

    const expenseItem = {
        amount: document.getElementById("expenseAmount").value,
        category: document.getElementById("expenseCategory").value,
        date: document.getElementById("expenseDate").value,
        description: document.getElementById("expenseDescription").value
    };

    expenses.push(expenseItem);

// Save to Local Storage
localStorage.setItem("expenses", JSON.stringify(expenses));

    displayTransactions();
    updateTotalExpense();
    updateBalance();
generateMonthlyReport();
updateExpenseChart();
    alert("Expense Added Successfully!");

    this.reset();

    expenseForm.style.display = "none";
});
// ===============================
// Delete Income
// ===============================

function deleteIncome(index){

    income.splice(index, 1);

localStorage.setItem("income", JSON.stringify(income));

    displayTransactions();
    updateTotalIncome();
    updateBalance();
generateMonthlyReport();
updateExpenseChart();
}
// ===============================
// Delete Expense
// ===============================

function deleteExpense(index){

    expenses.splice(index, 1);

localStorage.setItem("expenses", JSON.stringify(expenses));

    displayTransactions();
    updateTotalExpense();
    updateBalance();
generateMonthlyReport();
updateExpenseChart();
}
// ===============================
// Edit Income
// ===============================

function editIncome(index){

    const item = income[index];

    const newAmount = prompt("Enter Amount", item.amount);
    const newCategory = prompt("Enter Category", item.category);
    const newDescription = prompt("Enter Description", item.description);

    if(newAmount !== null && newCategory !== null && newDescription !== null){

        income[index].amount = newAmount;
        income[index].category = newCategory;
        income[index].description = newDescription;
localStorage.setItem("income", JSON.stringify(income));
        displayTransactions();
        updateTotalIncome();
        updateBalance();
generateMonthlyReport();
updateExpenseChart();
    }

}
// ===============================
// Edit Expense
// ===============================

function editExpense(index){

    const item = expenses[index];

    const newAmount = prompt("Enter Amount", item.amount);
    const newCategory = prompt("Enter Category", item.category);
    const newDescription = prompt("Enter Description", item.description);

    if(newAmount !== null && newCategory !== null && newDescription !== null){

        expenses[index].amount = newAmount;
        expenses[index].category = newCategory;
        expenses[index].description = newDescription;
localStorage.setItem("expenses", JSON.stringify(expenses));
        displayTransactions();
        updateTotalExpense();
        updateBalance();
generateMonthlyReport();
updateExpenseChart();
    }

}
// ===============================
// Load Data from Local Storage
// ===============================

window.onload = function () {

    const savedIncome = localStorage.getItem("income");
    const savedExpenses = localStorage.getItem("expenses");

    if (savedIncome) {
        income = JSON.parse(savedIncome);
    }

    if (savedExpenses) {
        expenses = JSON.parse(savedExpenses);
    }

    displayTransactions();
    updateTotalIncome();
    updateTotalExpense();
    updateBalance();
    generateMonthlyReport();
    updateExpenseChart();
};