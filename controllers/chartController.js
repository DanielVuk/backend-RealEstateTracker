const { Property } = require("../models/property");

// @desc:   Get chart data
// @route   GET /api/charts/:chart/:propertyId
// @access  Private
const getChartData = async (req, res) => {
  const { propertyId, chart } = req.params;
  let chartData;

  const property = await Property.findById(propertyId);

  if (!property) {
    return res.status(404).json({ error: "Property not found" });
  }

  if (chart === "income-expense-by-project") {
    const incomeData = [];
    const expenseData = [];
    const xLabels = [];

    property.projects.forEach((project) => {
      const projectIncome = project.transactions
        .filter((transaction) => transaction.type === "income")
        .reduce((total, transaction) => total + transaction.amount, 0);

      const projectExpense = project.transactions
        .filter((transaction) => transaction.type === "expense")
        .reduce((total, transaction) => total + transaction.amount, 0);

      incomeData.push(projectIncome);
      expenseData.push(projectExpense);
      xLabels.push(project.name);
    });

    chartData = {
      incomeData,
      expenseData,
      xLabels,
    };
  }

  if (chart === "propertyChart") {
    const allTransactions = property.projects.reduce(
      (transactions, project) => {
        return transactions.concat(project.transactions);
      },
      []
    );

    const sortedTransactions = allTransactions.sort(
      (a, b) => new Date(a.date) - new Date(b.date)
    );

    let propertyValue = property.price;
    const propertyValueData = [];

    propertyValueData.push({
      date: property.purchaseDate.toLocaleDateString(),
      propertyValue,
    });

    for (const transaction of sortedTransactions) {
      if (transaction.type === "expense") {
        propertyValue -= transaction.amount;
      } else if (transaction.type === "income") {
        propertyValue += transaction.amount;
      }

      propertyValueData.push({
        date: transaction.date.toLocaleDateString(),
        propertyValue,
      });
    }

    chartData = {
      dates: propertyValueData.map((entry) => entry.date),
      propertyValues: propertyValueData.map((entry) => entry.propertyValue),
    };
  }

  res.status(200).json(chartData);
};

module.exports = { getChartData };
