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

            const expensesContainer = document.createElement("div");
            expensesContainer.innerHTML = `
                <h3>Spese Effettuate</h3>
                <ul>${month.speseEffettuate.map((spesa, i) => `
                    <li>
                        ${spesa.descrizione} - €${spesa.importo.toFixed(2)}
                        <button class="edit-btn" onclick="editSpesa(${index}, ${i}, 'effettuata')">✏️</button>
                        <button class="delete-btn" onclick="deleteSpesa(${index}, ${i}, 'effettuata')">❌</button>
                    </li>`).join("")}
                </ul>

                <h3>Spese Preventivate</h3>
                <ul>${month.spesePreventivate.map((spesa, i) => `
                    <li>
                        ${spesa.descrizione} - €${spesa.importo.toFixed(2)}
                        <button class="edit-btn" onclick="editSpesa(${index}, ${i}, 'preventivata')">✏️</button>
                        <button class="delete-btn" onclick="deleteSpesa(${index}, ${i}, 'preventivata')">❌</button>
                    </li>`).join("")}
                </ul>
            `;

            monthDiv.appendChild(monthHeader);
            monthDiv.appendChild(balanceContainer);
            monthDiv.appendChild(expensesContainer);
            monthsContainer.appendChild(monthDiv);
        });
    }

    addMonthBtn.addEventListener("click", () => {
        if (monthPicker.value && initialBalanceInput.value) {
            months.push({
                name: monthPicker.value,
                balanceEffettuato: parseFloat(initialBalanceInput.value),
                balancePreventivato: parseFloat(initialBalanceInput.value),
                speseEffettuate: [],
                spesePreventivate: []
            });
            saveMonths();
            renderMonths();
        }
    });

    window.deleteSpesa = function (monthIndex, spesaIndex, tipo) {
        if (confirm("Vuoi eliminare questa spesa?")) {
            months[monthIndex][tipo === "effettuata" ? "speseEffettuate" : "spesePreventivate"].splice(spesaIndex, 1);
            saveMonths();
            renderMonths();
        }
    };

    renderMonths();
});
