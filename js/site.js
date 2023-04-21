const tooltipTriggerList = document.querySelectorAll(
  '[data-bs-toggle="tooltip"]'
);
const tooltipList = [...tooltipTriggerList].map(
  (tooltipTriggerEl) => new bootstrap.Tooltip(tooltipTriggerEl)
);

var USDollar = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
});

function calculateAmounts() {
  let loanAmount = parseFloat(document.getElementById("loanAmount").value);
  let loanTerm = parseInt(document.getElementById("loanTerm").value);
  let loanRate = parseFloat(document.getElementById("loanRate").value);

  if (loanAmount > 0 && loanTerm > 0 && loanRate > 0) {
    let monthlyPayment =
      (loanAmount * (loanRate / 1200)) /
      (1 - (1 + loanRate / 1200) ** (-1 * loanTerm));

    let totalCost = monthlyPayment * loanTerm;
    let totalInterest = totalCost - loanAmount;

    setAmounts(monthlyPayment, loanAmount, totalInterest, totalCost);
    buildTable(loanAmount, loanTerm, loanRate, monthlyPayment);
  } else {
    Swal.fire({
      icon: "error",
      title: "Oops!",
      text: "Please enter valid values.",
      backdrop: "false",
      heightAuto: "false",
    });
  }
}

function setAmounts(monthlyPayment, principalAmount, totalInterest, totalCost) {
  document.getElementById("monthlyPayment").textContent =
    USDollar.format(monthlyPayment);

  document.getElementById("totalPrincipal").textContent =
    USDollar.format(principalAmount);

  document.getElementById("totalCost").textContent = USDollar.format(totalCost);

  document.getElementById("totalInterest").textContent =
    USDollar.format(totalInterest);

  let paymentStats = {
    monthlyPayment: monthlyPayment,
    principalAmount: principalAmount,
    totalInterest: totalInterest,
    totalCost: totalCost,
  };

  localStorage.setItem("jgPaymentStats", JSON.stringify(paymentStats));
}

function buildTable(loanAmount, loanTerm, loanRate, monthlyPayment) {
  let paymentRows = [
    {
      month: 0,
      payment: 0,
      principal: 0,
      interest: 0,
      totalInterest: 0,
      balance: loanAmount,
    },
  ];

  let paymentTable = document.getElementById("paymentTable");
  let template = document.getElementById("tableRowTemplate");
  paymentTable.innerHTML = "";

  for (let i = 1; i <= loanTerm; i++) {
    let tableRow = document.importNode(template.content, true);

    let interest = paymentRows[i - 1].balance * (loanRate / 1200);
    let totalInterest = paymentRows[i - 1].totalInterest + interest;
    let principal = monthlyPayment - interest;
    let balance = paymentRows[i - 1].balance - principal;

    if (balance <= 0)
    {
      balance = 0;
    }

    let paymentRow = {
      month: i,
      payment: monthlyPayment,
      principal: principal,
      interest: interest,
      totalInterest: totalInterest,
      balance: balance,
    };

    paymentRows.push(paymentRow);

    tableRow.querySelector('[data-id="monthNumber"]').textContent = i;
    tableRow.querySelector('[data-id="payment"]').textContent =
      USDollar.format(monthlyPayment);
    tableRow.querySelector('[data-id="principal"]').textContent =
      USDollar.format(principal);
    tableRow.querySelector('[data-id="interest"]').textContent =
      USDollar.format(interest);
    tableRow.querySelector('[data-id="totalInterest"]').textContent =
      USDollar.format(totalInterest);
    tableRow.querySelector('[data-id="balance"]').textContent =
      USDollar.format(balance);

    paymentTable.appendChild(tableRow);
  }

  let paymentInput = {
    loanAmount: loanAmount,
    loanTerm: loanTerm,
    loanRate: loanRate,
    monthlyPayment: monthlyPayment,
  };

  localStorage.setItem("jgPaymentInput", JSON.stringify(paymentInput));
}

function checkData() {
  data1 = localStorage.getItem("jgPaymentStats");
  data2 = localStorage.getItem("jgPaymentInput");

  if (data1 != null && data2 != null) {
    paymentStats = JSON.parse(data1);
    paymentInput = JSON.parse(data2);

    setAmounts(
      paymentStats.monthlyPayment,
      paymentStats.principalAmount,
      paymentStats.totalInterest,
      paymentStats.totalCost
    );
    buildTable(
      paymentInput.loanAmount,
      paymentInput.loanTerm,
      paymentInput.loanRate,
      paymentInput.monthlyPayment
    );
  }
}
