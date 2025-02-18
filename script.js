// Careful modification of ExpenseTracker class to add dynamic categories
// without touching the calendar implementation

class ExpenseTracker {
  constructor() {
    this.expenses = [];
    // Add categories array as a new property
    this.categories = [
      'Food',
      'Transportation',
      'Housing',
      'Utilities',
      'Entertainment',
      'Healthcare',
      'Shopping',
      'Education',
      'Other'
    ];
    this.form = document.getElementById("expenseForm");
    this.tableBody = document.getElementById("expenseTable");
    this.totalAmountElement = document.getElementById("totalAmount");

    // Keep the original flatpickr initialization exactly as is
    flatpickr("#expenseDate", {
      dateFormat: "Y-m-d",
      theme: "custom",
      defaultDate: new Date(),
      disableMobile: true,
    });

    // Add initialization of category dropdown
    this.populateCategoriesDropdown();
    
    this.loadExpenses();
    this.setupEventListeners();
  }

  // New method to populate categories dropdown
  populateCategoriesDropdown() {
    const dropdown = document.getElementById('categoryDropdown');
    if (!dropdown) return;

    const menu = dropdown.querySelector('.custom-dropdown-menu');
    // Clear existing options
    menu.innerHTML = '';
    
    // First option - empty placeholder
    const placeholderOption = document.createElement('div');
    placeholderOption.className = 'custom-dropdown-option';
    placeholderOption.dataset.value = '';
    placeholderOption.textContent = 'Select Category';
    menu.appendChild(placeholderOption);

    // Add all categories from the array
    this.categories.forEach(category => {
      const option = document.createElement('div');
      option.className = 'custom-dropdown-option';
      option.dataset.value = category;
      option.textContent = category;
      menu.appendChild(option);
    });

    // Setup event listeners for new dropdown options
    this.setupCategoryDropdownListeners();
  }

  // Separate method to handle dropdown listeners
  setupCategoryDropdownListeners() {
    const dropdown = document.getElementById('categoryDropdown');
    if (!dropdown) return;
    
    const button = document.getElementById('categoryButton');
    const options = dropdown.querySelectorAll('.custom-dropdown-option');
    const hiddenInput = document.getElementById('expenseCategory');
    
    options.forEach(option => {
      option.addEventListener('click', function() {
        const value = this.dataset.value;
        const text = this.textContent;
        
        button.textContent = text;
        hiddenInput.value = value;
        
        options.forEach(opt => opt.classList.remove('selected'));
        this.classList.add('selected');
        dropdown.classList.remove('open');
        
        if (value) {
          dropdown.closest('.form-group').classList.remove('error');
        }
        
        const inputEvent = new Event('input', { bubbles: true });
        hiddenInput.dispatchEvent(inputEvent);
      });
      
      option.setAttribute('tabindex', '0');
      
      option.addEventListener('keydown', function(e) {
        if (e.key === 'Enter' || e.key === ' ') {
          this.click();
          e.preventDefault();
        } else if (e.key === 'Escape') {
          dropdown.classList.remove('open');
          button.focus();
        } else if (e.key === 'ArrowDown') {
          const index = Array.from(options).indexOf(this);
          if (index < options.length - 1) {
            options[index + 1].focus();
          }
          e.preventDefault();
        } else if (e.key === 'ArrowUp') {
          const index = Array.from(options).indexOf(this);
          if (index > 0) {
            options[index - 1].focus();
          } else {
            button.focus();
          }
          e.preventDefault();
        }
      });
    });
  }

  // All other methods unchanged
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

    this.form.querySelectorAll(".form-group").forEach((group) => {
      group.classList.remove("error");
    });

    if (!name.value.trim()) {
      isValid = false;
      name.closest(".form-group").classList.add("error");
    }

    if (!amount.value || parseFloat(amount.value) <= 0) {
      isValid = false;
      amount.closest(".form-group").classList.add("error");
    }

    if (!date.value) {
      isValid = false;
      date.closest(".form-group").classList.add("error");
    }

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
    
    // Reset custom dropdown button text if it exists
    const categoryButton = document.getElementById('categoryButton');
    if (categoryButton) {
      categoryButton.textContent = 'Select Category';
    }
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
            <button class="delete-btn" onclick="expenseTracker.deleteExpense(${expense.id})">
              Delete
            </button>
          </td>
        `;
        this.tableBody.appendChild(row);
      });
  }
}

// Keep the existing document.addEventListener for dropdown functionality
document.addEventListener('DOMContentLoaded', function() {
  const dropdown = document.getElementById('categoryDropdown');
  if (!dropdown) return; // Exit if element doesn't exist
  
  const button = document.getElementById('categoryButton');
  
  // Toggle dropdown - add stopPropagation to prevent click from bubbling up
  button.addEventListener('click', function(event) {
    dropdown.classList.toggle('open');
    event.stopPropagation(); // Stop click from propagating
    event.preventDefault();
  });
  
  // Close dropdown when clicking outside
  document.addEventListener('click', function(event) {
    if (!dropdown.contains(event.target)) {
      dropdown.classList.remove('open');
    }
  });
  
  button.addEventListener('keydown', function(e) {
    if (e.key === 'Enter' || e.key === ' ') {
      dropdown.classList.toggle('open');
      e.preventDefault();
    } else if (e.key === 'Escape') {
      dropdown.classList.remove('open');
    } else if (e.key === 'ArrowDown' && dropdown.classList.contains('open')) {
      const options = dropdown.querySelectorAll('.custom-dropdown-option');
      if (options.length > 0) {
        options[0].focus();
      }
      e.preventDefault();
    }
  });
});

const expenseTracker = new ExpenseTracker();