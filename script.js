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
      this.addExpense();
    });
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
    const name = document.getElementById("expenseName").value;
    const amount = parseFloat(document.getElementById("expenseAmount").value);
    const date = document.getElementById("expenseDate").value;
    const category = document.getElementById("expenseCategory").value;

    const expense = {
      id: Date.now(),
      name,
      amount,
      date,
      category,
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
}
const expenseTracker = new ExpenseTracker();
