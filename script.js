// ==========================================
// SpendWise – Week 3 requirements
// ==========================================

// 1. Multiple records in an ARRAY (Requirement 2)
let monthlyBudget = 500;

let expenseRecords = [
    { name: "Groceries", amount: 55.00,  category: "Food",          date: "2026-06-20" },
    { name: "Bus Fare",  amount: 6.10,   category: "Transport",     date: "2026-06-21" },
    { name: "Netflix",   amount: 13.00,  category: "Entertainment", date: "2026-06-22" },
    { name: "Rent",      amount: 250.00, category: "Rent",          date: "2026-06-01" },
    { name: "Coffee",    amount: 2.50,   category: "Food",          date: "2026-06-23" }
];

// ---------- helpers ----------
function formatMoney(num) {
    return "$" + Number(num).toFixed(2);
}

// 2. LOOPS to process records (Requirement 3)
function calculateTotalSpent() {
    let total = 0;
    for (let i = 0; i < expenseRecords.length; i++) {
        total += expenseRecords[i].amount;
    }
    return total;
}

function calculateCategoryTotal(categoryName) {
    let total = 0;
    for (let i = 0; i < expenseRecords.length; i++) {
        if (expenseRecords[i].category === categoryName) {
            total += expenseRecords[i].amount;
        }
    }
    return total;
}

// 3. CONDITIONALS for decision making (Requirement 1)
function evaluateBudgetStatus(spent, budget) {
    const remaining = budget - spent;

    if (expenseRecords.length === 0) {
        return { message: "No expenses yet. Add one to start tracking.", className: "success", remaining: remaining };
    }
    if (remaining < 0) {
        return {
            message: "You are over budget by " + formatMoney(Math.abs(remaining)) + ". Reduce spending.",
            className: "error",
            remaining: remaining
        };
    }
    if (remaining <= budget * 0.2) {
        return {
            message: "Warning: only " + formatMoney(remaining) + " left (" +
                     Math.round((remaining / budget) * 100) + "% of budget).",
            className: "warn",
            remaining: remaining
        };
    }
    return {
        message: "You are within budget. " + formatMoney(remaining) + " remaining. Good job!",
        className: "success",
        remaining: remaining
    };
}

// 4. DOM updates – show results on the page (Requirement 4)
function renderExpenseTable() {
    const tbody = document.getElementById("expense-tbody");
    const emptyState = document.getElementById("empty-state");
    tbody.innerHTML = "";

    if (expenseRecords.length === 0) {
        emptyState.style.display = "block";
        return;
    }
    emptyState.style.display = "none";

    // Loop through array and create rows
    for (let i = 0; i < expenseRecords.length; i++) {
        const item = expenseRecords[i];
        const tr = document.createElement("tr");

        tr.innerHTML =
            "<td>" + item.name + "</td>" +
            "<td>" + formatMoney(item.amount) + "</td>" +
            "<td>" + item.category + "</td>" +
            "<td>" + item.date + "</td>";

        tbody.appendChild(tr);
    }
}

function updateDashboard() {
    const spent = calculateTotalSpent();
    const status = evaluateBudgetStatus(spent, monthlyBudget);

    // Update category cards
    document.getElementById("amount-food").textContent          = formatMoney(calculateCategoryTotal("Food"));
    document.getElementById("amount-transport").textContent     = formatMoney(calculateCategoryTotal("Transport"));
    document.getElementById("amount-rent").textContent          = formatMoney(calculateCategoryTotal("Rent"));
    document.getElementById("amount-entertainment").textContent = formatMoney(calculateCategoryTotal("Entertainment"));
    document.getElementById("amount-remaining").textContent     = formatMoney(status.remaining);
    document.getElementById("amount-total").textContent         = formatMoney(spent);

    // Status labels on cards
    document.getElementById("status-food").textContent          = calculateCategoryTotal("Food") > 0 ? "Tracked" : "No data";
    document.getElementById("status-transport").textContent     = calculateCategoryTotal("Transport") > 0 ? "Tracked" : "No data";
    document.getElementById("status-rent").textContent          = calculateCategoryTotal("Rent") > 0 ? "Tracked" : "No data";
    document.getElementById("status-entertainment").textContent = calculateCategoryTotal("Entertainment") > 0 ? "Tracked" : "No data";

    const remStatus = document.getElementById("status-remaining");
    const totStatus = document.getElementById("status-total");
    if (status.remaining < 0) {
        remStatus.textContent = "Over budget";
        remStatus.className = "status warning";
        totStatus.textContent = "Exceeded";
        totStatus.className = "status warning";
    } else if (status.remaining <= monthlyBudget * 0.2) {
        remStatus.textContent = "Low remaining";
        remStatus.className = "status warning";
        totStatus.textContent = Math.round((spent / monthlyBudget) * 100) + "% used";
        totStatus.className = "status warning";
    } else {
        remStatus.textContent = "On track";
        remStatus.className = "status success";
        totStatus.textContent = Math.round((spent / monthlyBudget) * 100) + "% used";
        totStatus.className = "status success";
    }

    // Status message on the page
    const budgetStatus = document.getElementById("budget-status");
    budgetStatus.textContent = status.message;
    budgetStatus.className = "form-message " + status.className;

    renderExpenseTable();
}

// 5. EVENT LISTENERS (Requirement 5)
document.getElementById("expense-form").addEventListener("submit", function (event) {
    event.preventDefault(); // stop page reload

    const name     = document.getElementById("expense-name").value.trim();
    const amount   = parseFloat(document.getElementById("expense-amount").value);
    const category = document.getElementById("expense-category").value;
    const msg      = document.getElementById("form-message");

    // Conditionals for validation
    if (name === "") {
        msg.textContent = "Please enter an expense name.";
        msg.className = "form-message error";
        return;
    }
    if (isNaN(amount) || amount <= 0) {
        msg.textContent = "Please enter a valid positive amount.";
        msg.className = "form-message error";
        return;
    }

    const today = new Date().toISOString().slice(0, 10);

    // Add to the array
    expenseRecords.push({
        name: name,
        amount: amount,
        category: category,
        date: today
    });

    document.getElementById("expense-form").reset();
    msg.textContent = "Expense \"" + name + "\" added.";
    msg.className = "form-message success";

    // Update the page (Requirement 6 – connected flow)
    updateDashboard();
});

document.getElementById("set-budget-btn").addEventListener("click", function () {
    const value = parseFloat(document.getElementById("budget-input").value);
    if (isNaN(value) || value < 0) {
        alert("Enter a valid non-negative budget.");
        return;
    }
    monthlyBudget = value;
    updateDashboard();
});

document.getElementById("clear-all-btn").addEventListener("click", function () {
    if (expenseRecords.length === 0) return;
    if (confirm("Delete all expenses?")) {
        expenseRecords = [];
        updateDashboard();
        document.getElementById("form-message").textContent = "All expenses cleared.";
        document.getElementById("form-message").className = "form-message success";
    }
});

// Initial display on page load
updateDashboard();
