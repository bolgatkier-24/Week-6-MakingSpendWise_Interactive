# SpendWise – Budget Tracker (Week 3 Improvements)

## What improved this week

Previously SpendWise showed static data and mostly used the browser console.  
This week the app was updated so that:

- Decisions are made with **conditional statements**
- Multiple expenses are stored in an **array**
- Records are processed with **loops**
- Results appear **on the webpage** (DOM updates)
- The app responds to **user actions** with event listeners
- User actions, data, and the UI are clearly **connected**

The original layout (sidebar, dashboard cards, form, table, video) was kept.  
Only small IDs and a short script were added so the requirements work.

---

## How conditionals are used

Conditionals appear in two places:

### 1. Budget feedback (`evaluateBudgetStatus`)

```js
if (expenseRecords.length === 0) { ... }        // no expenses yet
else if (remaining < 0) { ... }                 // over budget
else if (remaining <= budget * 0.2) { ... }     // 20% or less left (warning)
else { ... }                                    // within budget

2. Form validation
When the user submits an expense:

Empty name → show error message and stop
Invalid or negative amount → show error message and stop
Valid data → add the expense and refresh the dashboard

How arrays are used to store data
All expenses live in one array:
JavaScriptlet expenseRecords = [
    { name: "Groceries", amount: 55.00, category: "Food", date: "2026-06-20" },
    // ...
];

New expenses are added with expenseRecords.push(...)
Clearing expenses resets the array: expenseRecords = []
The same array is used for the table, category totals, and budget calculations

This replaces keeping only a few separate variables.

How the DOM is updated
After any data change, updateDashboard() runs and:

Calculates totals with loops
Runs the budget conditionals
Writes new values into the page using textContent:
Food, Transport, Rent, Entertainment card amounts
Remaining Budget and Total Spent cards
Status labels on the cards
Budget status message

Rebuilds the expense table by looping through the array and creating <tr> elements

Nothing important is left only in the console — the user sees the results on the webpage.

How user interactions are handled through events


ElementEventWhat happensExpense formsubmitPrevents page reload, validates input, pushes to array, updates dashboard“Update Budget” buttonclickValidates and saves the new budget, updates dashboard“Clear All” buttonclickConfirms, empties the array, updates dashboard
All listeners use addEventListener.

End-to-end flow (Requirement 6)

User fills the form and clicks Add Expense
The submit event fires → conditionals validate the data
A new object is pushed into expenseRecords
updateDashboard() runs:
Loops calculate totals
Conditionals decide the status message
Cards and table are updated on the page

The user immediately sees the new expense and updated budget feedback

The same pattern is used for changing the budget and clearing expenses.

Challenges and how they were resolved


ChallengeSolutionStatic table did not change when new expenses were addedRemoved the hard-coded rows and rebuild the table from the array with a loop after every changeResults only appeared in the consoleMoved feedback into page elements (cards + status message) using textContentKeeping cards, table and status in syncPut all display logic in one updateDashboard() function and call it after every data changeForm caused a full page reloadUsed event.preventDefault() on the form submit listener
