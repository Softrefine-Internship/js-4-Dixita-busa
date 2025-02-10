class ExpenseTracker {
  constructor() {
    this.expenses = [];
    this.form = document.getElementById("expenseForm");
    this.tableBody = document.getElementById("expenseTable");
    this.totalAmountElement = document.getElementById("totalAmount");

    this.loadExpenses();
    this.setupEventListeners();
  }

  setupEventListeners() {
    this.form.addEventListener("submit", (e) => {
      e.preventDefault();
      if (this.validateForm()) {
        this.addExpense();
      }
    });
    const inputs = this.form.querySelectorAll("input, select");
    inputs.forEach((input) => {
      input.addEventListener("input", () => {
        const formGroup = input.closest(".form-group");
        if (formGroup.classList.contains("error")) {
          formGroup.classList.remove("error");
        }
      });
    });
  }

  validateForm() {
    let isValid = true;
    const name = document.getElementById("expenseName");
    const amount = document.getElementById("expenseAmount");
    const date = document.getElementById("expenseDate");
    const category = document.getElementById("expenseCategory");

    // Reset previous errors
    this.form.querySelectorAll(".form-group").forEach((group) => {
      group.classList.remove("error");
    });

    // Validate name
    if (!name.value.trim()) {
      isValid = false;
      name.closest(".form-group").classList.add("error");
    }

    // Validate amount
    if (!amount.value || parseFloat(amount.value) <= 0) {
      isValid = false;
      amount.closest(".form-group").classList.add("error");
    }

    // Validate date
    if (!date.value) {
      isValid = false;
      date.closest(".form-group").classList.add("error");
    }

    // Validate category
    if (!category.value) {
      isValid = false;
      category.closest(".form-group").classList.add("error");
    }

    if (!isValid) {
      this.form.classList.add("shake");
      setTimeout(() => {
        this.form.classList.remove("shake");
      }, 500);
    }

    return isValid;
  }

  loadExpenses() {
    const savedExpenses = localStorage.getItem("expenses");
    if (savedExpenses) {
      this.expenses = JSON.parse(savedExpenses);
      this.updateUI();
    }
  }

  saveExpenses() {
    localStorage.setItem("expenses", JSON.stringify(this.expenses));
  }

  addExpense() {
    const expense = {
      id: Date.now(),
      name: document.getElementById("expenseName").value,
      amount: parseFloat(document.getElementById("expenseAmount").value),
      date: document.getElementById("expenseDate").value,
      category: document.getElementById("expenseCategory").value,
    };

    this.expenses.push(expense);
    this.saveExpenses();
    this.updateUI();
    this.form.reset();
  }

  deleteExpense(id) {
    this.expenses = this.expenses.filter((expense) => expense.id !== id);
    this.saveExpenses();
    this.updateUI();
  }

  formatDate(dateString) {
    const options = { year: "numeric", month: "short", day: "numeric" };
    return new Date(dateString).toLocaleDateString(undefined, options);
  }

  formatAmount(amount) {
    return amount.toFixed(2);
  }

  calculateTotal() {
    return this.expenses.reduce((total, expense) => total + expense.amount, 0);
  }

  updateUI() {
    this.totalAmountElement.textContent = this.formatAmount(
      this.calculateTotal()
    );

    this.tableBody.innerHTML = "";
    this.expenses
      .sort((a, b) => new Date(b.date) - new Date(a.date))
      .forEach((expense) => {
        const row = document.createElement("tr");
        row.className = "animate-in";
        row.innerHTML = `
                  <td>${expense.name}</td>
                  <td>$${this.formatAmount(expense.amount)}</td>
                  <td>${this.formatDate(expense.date)}</td>
                  <td><span class="badge">${expense.category}</span></td>
                  <td>
                      <button class="delete-btn" onclick="expenseTracker.deleteExpense(${
                        expense.id
                      })">
                          Delete
                      </button>
                  </td>
              `;
        this.tableBody.appendChild(row);
      });
  }
}

const expenseTracker = new ExpenseTracker();
