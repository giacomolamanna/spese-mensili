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

            // Input per aggiungere spese
            const spesaInput = document.createElement("input");
            spesaInput.type = "text";
            spesaInput.placeholder = "Descrizione Spesa";

            const importoInput = document.createElement("input");
            importoInput.type = "number";
            importoInput.placeholder = "Importo (€)";

            const spesaTipo = document.createElement("select");
            spesaTipo.innerHTML = `
                <option value="effettuata">Effettuata</option>
                <option value="preventivata">Preventivata</option>
            `;

            const addSpesaBtn = document.createElement("button");
            addSpesaBtn.textContent = "➕ Aggiungi Spesa";
            addSpesaBtn.addEventListener("click", () => {
                if (spesaInput.value.trim() && importoInput.value.trim()) {
                    const importo = parseFloat(importoInput.value);
                    const nuovaSpesa = {
                        descrizione: spesaInput.value,
                        importo: importo,
                        tipo: spesaTipo.value
                    };

                    if (spesaTipo.value === "effettuata") {
                        month.balanceEffettuato -= importo;
                    }
                    month.balancePreventivato -= importo;
                    month.spese.push(nuovaSpesa);

                    saveMonths();
                    renderMonths();
                }
            });

            monthDiv.appendChild(spesaInput);
            monthDiv.appendChild(importoInput);
            monthDiv.appendChild(spesaTipo);
            monthDiv.appendChild(addSpesaBtn);

            monthsContainer.appendChild(monthDiv);
        });
    }

    addMonthBtn.addEventListener("click", () => {
        if (monthPicker.value && initialBalanceInput.value) {
            months.push({
                name: monthPicker.value,
                balanceEffettuato: parseFloat(initialBalanceInput.value),
                balancePreventivato: parseFloat(initialBalanceInput.value),
                spese: []
            });
            saveMonths();
            renderMonths();
        }
    });

    window.deleteMonth = function (index) {
        if (confirm("Vuoi eliminare questo mese?")) {
            months.splice(index, 1);
            saveMonths();
            renderMonths();
        }
    };

    renderMonths();
});
