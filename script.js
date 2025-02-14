document.addEventListener("DOMContentLoaded", function () {
    const monthsContainer = document.getElementById("months-container");
    const addMonthBtn = document.getElementById("add-month");
    const monthPicker = document.getElementById("month-picker");

    let months = JSON.parse(localStorage.getItem("budgetData")) || [];

    function saveMonths() {
        localStorage.setItem("budgetData", JSON.stringify(months));
    }

    function renderMonths() {
        monthsContainer.innerHTML = "";
        months.forEach((month, index) => {
            const monthDiv = document.createElement("div");
            monthDiv.classList.add("month");

            const monthHeader = document.createElement("h2");
            monthHeader.innerHTML = `
                ${month.name} 
                <span class="balance">Saldo: €${month.balance.toFixed(2)}</span>
                <button class="delete-btn" onclick="deleteMonth(${index})">🗑️</button>
            `;

            monthDiv.appendChild(monthHeader);

            // Sezione delle spese effettuate
            const expensesDiv = document.createElement("div");
            expensesDiv.classList.add("expenses");
            expensesDiv.innerHTML = "<h3>Spese Effettuate</h3>";
            const expenseList = document.createElement("ul");

            month.expenses.forEach((expense, expenseIndex) => {
                const expenseLi = document.createElement("li");
                expenseLi.innerHTML = `
                    ${expense.name} - €${expense.amount.toFixed(2)}
                    <button class="delete-btn" onclick="deleteExpense(${index}, ${expenseIndex})">❌</button>
                `;
                expenseList.appendChild(expenseLi);
            });

            expensesDiv.appendChild(expenseList);
            monthDiv.appendChild(expensesDiv);

            // Sezione delle spese preventivate
            const plannedDiv = document.createElement("div");
            plannedDiv.classList.add("expenses");
            plannedDiv.innerHTML = "<h3>Spese Preventivate</h3>";
            const plannedList = document.createElement("ul");

            month.planned.forEach((expense, plannedIndex) => {
                const plannedLi = document.createElement("li");
                plannedLi.innerHTML = `
                    ${expense.name} - €${expense.amount.toFixed(2)}
                    <button class="delete-btn" onclick="deletePlanned(${index}, ${plannedIndex})">❌</button>
                `;
                plannedList.appendChild(plannedLi);
            });

            plannedDiv.appendChild(plannedList);
            monthDiv.appendChild(plannedDiv);

            // Input per aggiungere una spesa
            const expenseInput = document.createElement("input");
            expenseInput.type = "text";
            expenseInput.placeholder = "Nome Spesa";
            const amountInput = document.createElement("input");
            amountInput.type = "number";
            amountInput.placeholder = "Importo (€)";

            const addExpenseBtn = document.createElement("button");
            addExpenseBtn.textContent = "➕ Aggiungi Spesa Effettuata";
            addExpenseBtn.addEventListener("click", () => {
                if (expenseInput.value.trim() && amountInput.value > 0) {
                    month.expenses.push({
                        name: expenseInput.value,
                        amount: parseFloat(amountInput.value),
                    });
                    month.balance -= parseFloat(amountInput.value);
                    saveMonths();
                    renderMonths();
                }
            });

            // Input per aggiungere una spesa preventivata
            const addPlannedBtn = document.createElement("button");
            addPlannedBtn.textContent = "📝 Aggiungi Spesa Preventivata";
            addPlannedBtn.addEventListener("click", () => {
                if (expenseInput.value.trim() && amountInput.value > 0) {
                    month.planned.push({
                        name: expenseInput.value,
                        amount: parseFloat(amountInput.value),
                    });
                    month.balance -= parseFloat(amountInput.value);
                    saveMonths();
                    renderMonths();
                }
            });

            monthDiv.appendChild(expenseInput);
            monthDiv.appendChild(amountInput);
            monthDiv.appendChild(addExpenseBtn);
            monthDiv.appendChild(addPlannedBtn);
            monthsContainer.appendChild(monthDiv);
        });
    }

    addMonthBtn.addEventListener("click", () => {
        if (monthPicker.value) {
            const existingMonth = months.find(m => m.name === monthPicker.value);
            if (!existingMonth) {
                months.push({
                    name: monthPicker.value,
                    balance: 0,
                    expenses: [],
                    planned: [],
                });
                saveMonths();
                renderMonths();
            } else {
                alert("Il mese è già stato aggiunto!");
            }
        }
    });

    window.deleteMonth = function (index) {
        if (confirm("Sei sicuro di voler eliminare questo mese e tutte le spese?")) {
            months.splice(index, 1);
            saveMonths();
            renderMonths();
        }
    };

    window.deleteExpense = function (monthIndex, expenseIndex) {
        if (confirm("Sei sicuro di voler eliminare questa spesa?")) {
            months[monthIndex].balance += months[monthIndex].expenses[expenseIndex].amount;
            months[monthIndex].expenses.splice(expenseIndex, 1);
            saveMonths();
            renderMonths();
        }
    };

    window.deletePlanned = function (monthIndex, plannedIndex) {
        if (confirm("Sei sicuro di voler eliminare questa spesa preventivata?")) {
            months[monthIndex].balance += months[monthIndex].planned[plannedIndex].amount;
            months[monthIndex].planned.splice(plannedIndex, 1);
            saveMonths();
            renderMonths();
        }
    };

    renderMonths();
});
