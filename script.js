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

            // Contenitore per le spese
            const expensesContainer = document.createElement("div");
            expensesContainer.classList.add("expenses-container");

            // Form per aggiungere spese
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
                        importo: importo
                    };

                    if (spesaTipo.value === "effettuata") {
                        month.speseEffettuate.push(nuovaSpesa);
                        month.balanceEffettuato -= importo;
                    } else {
                        month.spesePreventivate.push(nuovaSpesa);
                    }
                    month.balancePreventivato -= importo;

                    saveMonths();
                    renderMonths();
                }
            });

            // Liste delle spese
            const speseEffettuateDiv = document.createElement("div");
            speseEffettuateDiv.innerHTML = `<h3>Spese Effettuate</h3>`;
            const speseEffettuateList = document.createElement("ul");
            month.speseEffettuate.forEach((spesa, spesaIndex) => {
                const spesaItem = document.createElement("li");
                spesaItem.innerHTML = `
                    ${spesa.descrizione} - €${spesa.importo.toFixed(2)}
                    <button class="delete-btn" onclick="deleteSpesa(${index}, ${spesaIndex}, 'effettuata')">❌</button>
                `;
                speseEffettuateList.appendChild(spesaItem);
            });
            speseEffettuateDiv.appendChild(speseEffettuateList);

            const spesePreventivateDiv = document.createElement("div");
            spesePreventivateDiv.innerHTML = `<h3>Spese Preventivate</h3>`;
            const spesePreventivateList = document.createElement("ul");
            month.spesePreventivate.forEach((spesa, spesaIndex) => {
                const spesaItem = document.createElement("li");
                spesaItem.innerHTML = `
                    ${spesa.descrizione} - €${spesa.importo.toFixed(2)}
                    <button class="delete-btn" onclick="deleteSpesa(${index}, ${spesaIndex}, 'preventivata')">❌</button>
                `;
                spesePreventivateList.appendChild(spesaItem);
            });
            spesePreventivateDiv.appendChild(spesePreventivateList);

            expensesContainer.appendChild(spesaInput);
            expensesContainer.appendChild(importoInput);
            expensesContainer.appendChild(spesaTipo);
            expensesContainer.appendChild(addSpesaBtn);
            expensesContainer.appendChild(speseEffettuateDiv);
            expensesContainer.appendChild(spesePreventivateDiv);

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

    window.deleteMonth = function (index) {
        if (confirm("Vuoi eliminare questo mese?")) {
            months.splice(index, 1);
            saveMonths();
            renderMonths();
        }
    };

    window.deleteSpesa = function (monthIndex, spesaIndex, tipo) {
        if (confirm("Vuoi eliminare questa spesa?")) {
            if (tipo === "effettuata") {
                months[monthIndex].balanceEffettuato += months[monthIndex].speseEffettuate[spesaIndex].importo;
                months[monthIndex].balancePreventivato += months[monthIndex].speseEffettuate[spesaIndex].importo;
                months[monthIndex].speseEffettuate.splice(spesaIndex, 1);
            } else {
                months[monthIndex].balancePreventivato += months[monthIndex].spesePreventivate[spesaIndex].importo;
                months[monthIndex].spesePreventivate.splice(spesaIndex, 1);
            }
            saveMonths();
            renderMonths();
        }
    };

    renderMonths();
});
