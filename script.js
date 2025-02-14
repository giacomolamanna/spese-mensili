document.addEventListener("DOMContentLoaded", function () {
    const monthsContainer = document.getElementById("months-container");
    const addMonthBtn = document.getElementById("add-month");
    const monthPicker = document.getElementById("month-picker");
    const initialBalanceInput = document.getElementById("initial-balance");

    let months = JSON.parse(localStorage.getItem("budgetData")) || [];

    function saveMonths() {
        localStorage.setItem("budgetData", JSON.stringify(months));
    }

    function getMonthName(dateString) {
        const date = new Date(dateString + "-01");
        return date.toLocaleDateString("it-IT", { month: "long", year: "numeric" });
    }

    function renderMonths() {
        monthsContainer.innerHTML = "";
        months.forEach((month, index) => {
            const monthDiv = document.createElement("div");
            monthDiv.classList.add("month");

            const monthHeader = document.createElement("h2");
            monthHeader.innerHTML = `
                ${getMonthName(month.name)}
                <button class="delete-btn" onclick="deleteMonth(${index})">🗑️</button>
            `;

            const balanceContainer = document.createElement("div");
            balanceContainer.classList.add("balance-container");
            balanceContainer.innerHTML = `
                <span>Saldo Effettuato: €${month.balanceEffettuato.toFixed(2)}</span>
                <span>Saldo Preventivato: €${month.balancePreventivato.toFixed(2)}</span>
            `;

            monthDiv.appendChild(monthHeader);
            monthDiv.appendChild(balanceContainer);

            const expensesList = document.createElement("ul");
            month.expenses.forEach((expense, expIndex) => {
                const expItem = document.createElement("li");
                expItem.innerHTML = `
                    ${expense.name} - €${expense.amount.toFixed(2)}
                    <button class="delete-btn" onclick="deleteExpense(${index}, ${expIndex})">❌</button>
                `;
                expensesList.appendChild(expItem);
            });

            const plannedList = document.createElement("ul");
            month.planned.forEach((expense, planIndex) => {
                const planItem = document.createElement("li");
                planItem.innerHTML = `
                    ${expense.name} - €${expense.amount.toFixed(2)}
                    <button class="delete-btn" onclick="deletePlanned(${index}, ${planIndex})">❌</button>
                `;
                plannedList.appendChild(planItem);
            });

            monthDiv.appendChild(expensesList);
            monthDiv.appendChild(plannedList);
            monthsContainer.appendChild(monthDiv);
        });
    }

    addMonthBtn.addEventListener("click", () => {
        if (monthPicker.value && initialBalanceInput.value) {
            months.push({
                name: monthPicker.value,
                balanceEffettuato: parseFloat(initialBalanceInput.value),
                balancePreventivato: parseFloat(initialBalanceInput.value),
                expenses: [],
                planned: []
            });
            saveMonths();
            renderMonths();
        }
    });

    window.deleteMonth = function (index) {
        if (confirm("Sei sicuro di voler eliminare questo mese e tutte le spese?")) {
            months.splice(index, 1);
            saveMonths();
            renderMonths();
        }
    };

    renderMonths();
});
