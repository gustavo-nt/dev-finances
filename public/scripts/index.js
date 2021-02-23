const Storage = {
    get() {
        return JSON.parse(localStorage.getItem("dev.finaces:transactions")) || [];
    },

    set(transactions) {
        localStorage.setItem("dev.finaces:transactions", JSON.stringify(transactions));
    }
}

const Transaction = {
    all: Storage.get(),

    add(transaction) {
        Transaction.all.push(transaction);

        App.reload();
    },

    remove(index) {
        Transaction.all.splice(index, 1);

        App.reload();
    },

    edit(index) {
        Modal.open("Editar Transação", true);

        let transaction = Transaction.all[index];
        let description = document.querySelector('input[name="description"]');
        let amount = document.querySelector('input[name="amount"]');
        let date = document.querySelector('input[name="date"]');
        let id = document.querySelector('input[name="transactionId"]');

        id.value = index;
        description.value = transaction.description;
        amount.value = Number(transaction.amount) / 100;
        date.value = transaction.date.split('/').reverse().join('-');
    },

    update(transaction, idTransaction) {
        Transaction.all.forEach((value, index) => {
            if(idTransaction == index) {
                value.description = transaction.description;
                value.amount = transaction.amount;
                value.date = transaction.date;
            }
        });

        Storage.set(Transaction.all);
        App.reload();
    },

    incomes() {
        let income = 0;

        Transaction.all.forEach(value => {
            if(value.amount > 0) {
                income += value.amount;
            }
        });

        return income;
    },

    expenses() {
        let expense = 0;

        Transaction.all.forEach(value => {
            if(value.amount < 0) {
                expense += value.amount;
            }
        });

        return expense;
    },

    total() {
        return Transaction.incomes() + Transaction.expenses();
    },

    extract() {
        const allTransactions = Transaction.all;
        const incomes = Transaction.incomes();
        const expenses = Transaction.expenses();
        const total = Transaction.total();

        const now = new Date();

        const date = {
            day: now.getDay(),
            month: now.getMonth() + 1,
            year: now.getFullYear(),
            hours: now.getHours(),
            minutes: now.getMinutes(),
            seconds: now.getSeconds()
        }

        let text = `Extrato - Data: ${`${date.day}/${date.month}/${date.year} - ${date.hours}:${date.minutes}:${date.seconds}\n`}`;
        
        text += allTransactions.reduce(
            (txt, transaction) =>
              (txt += `\n${transaction.date} - ${
                transaction.description
              }       ${Utils.formatCurrency(transaction.amount)}`),
            ""
        );


        text += `\n\nEntradas:        ${Utils.formatCurrency(incomes)}`;
        text += `\nSaídas:          ${Utils.formatCurrency(expenses)}`;
        text += `\nTotal:           ${Utils.formatCurrency(total)}`;

        Utils.download(text, "dev.finances.txt", "application/text");
    }
}

const DOM = {
    transactionsContainer: document.querySelector("#data-table tbody"),

    addTransaction(transaction, index) {
        const tr = document.createElement("tr");
        tr.innerHTML = DOM.innerHTMLTransaction(transaction, index);
        tr.dataset.index = index;
        DOM.transactionsContainer.appendChild(tr);
    },

    innerHTMLTransaction(transaction, index) {
        const cssClass = transaction.amount > 0 ? "income" : "expense";

        const amount = Utils.formatCurrency(transaction.amount);

        const html = `
            <td class="description">${transaction.description}</td>
            <td class="${cssClass}">${amount}</td>
            <td class="date">${transaction.date}</td>
            <td class="edit">
                <img onclick="Transaction.edit(${index})" src="./assets/edit.svg" alt="Editar Transação" onload="SVGInject(this)">
            </td>
            <td class="delete">
                <img onclick="Transaction.remove(${index})" src="./assets/trash.svg" alt="Remover Transação" onload="SVGInject(this)">
            </td>
        `

        return html;
    },

    updateBalance() {
        document
            .querySelector("#incomeDisplay")
            .innerHTML = Utils.formatCurrency(Transaction.incomes());

        document
            .querySelector("#expenseDisplay")
            .innerHTML = Utils.formatCurrency(Transaction.expenses());

        document
            .querySelector("#totalDisplay")
            .innerHTML = Utils.formatCurrency(Transaction.total());
    },

    clearTransactions() {
        DOM.transactionsContainer.innerHTML = "";
    }
}

const Utils = {
    formatAmount(value) {
        value = value * 100;
        return Math.round(value);
    },

    formatDate(value) {
        const splittedDate = value.split("-");
        return `${splittedDate[2]}/${splittedDate[1]}/${splittedDate[0]}`
    },

    formatCurrency(value) {
        const signal = Number(value) < 0 ? "-" : "";

        value = String(value).replace(/\D/g, "");

        value = Number(value) / 100;

        value = value.toLocaleString("pt-BR", {
            style: "currency",
            currency: "BRL"
        });

        return signal + value;
    }, 

    download(data, name, type) {
        const blob = new Blob([data], {
          type: type,
        });
        const link = window.document.createElement("a");
        link.href = window.URL.createObjectURL(blob);
        link.download = `${name}`;
        link.click();
        window.URL.revokeObjectURL(link.href);
        return;
    },
}

const Form = {
    description: document.querySelector("#description"),
    amount: document.querySelector("#amount"),
    date: document.querySelector("#date"),

    getValues() {
        return {
            description: Form.description.value,
            amount: Form.amount.value,
            date: Form.date.value
        }
    },

    validateFields() {
        const { description, amount, date} = Form.getValues();

        if(description.trim() === "" || amount.trim() === "" || date.trim === ""){
            throw new Error("Por favor, preencha todos os campos!");
        } 
    },

    formatValues() {
        let { description, amount, date} = Form.getValues();

        amount = Utils.formatAmount(amount);

        date = Utils.formatDate(date);

        return {
            description,
            amount,
            date
        }
    },

    clearFields() {
        Form.description.value = "",
        Form.amount.value = "",
        Form.date.value = ""
    },

    submit(event) {
        event.preventDefault();

        try {
            Form.validateFields();

            if(document.querySelector('.modal #form').dataset.editable == 'true') {
                const index =  document.querySelector('input[name="transactionId"]').value;

                Transaction.update(Form.formatValues(), index);
            } else {
                Transaction.add(Form.formatValues());
            }

            Form.clearFields();
            Modal.close();
        } catch (error) {
            alert(error.message);
        }
    }
}

const App = {
    init() {
        Transaction.all.forEach(DOM.addTransaction);

        DOM.updateBalance();
        Storage.set(Transaction.all);
    },

    reload() {
        DOM.clearTransactions();
        App.init();
    }
}

App.init();
