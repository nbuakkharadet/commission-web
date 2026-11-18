const sales = [];
const LOCK_PRICE = 45;
const STOCK_PRICE = 30;
const BARREL_PRICE = 25;

const $ = (id) => document.getElementById(id);

function calculateCommission(totalSales) {
  if (totalSales >= 1800) {
    return 0.10 * 1000 + 0.15 * 800 + 0.20 * (totalSales - 1800);
  } else if (totalSales >= 1000) {
    return 0.10 * 1000 + 0.15 * (totalSales - 1000);
  } else {
    return 0.10 * totalSales;
  }
}

function money(value) {
  return "$" + value.toFixed(2);
}

function render() {
  const totals = sales.reduce((a, r) => {
    a.locks += r.locks;
    a.stocks += r.stocks;
    a.barrels += r.barrels;
    a.sales += r.sales;
    return a;
  }, {locks:0, stocks:0, barrels:0, sales:0});

  $("totalLocks").textContent = totals.locks;
  $("totalStocks").textContent = totals.stocks;
  $("totalBarrels").textContent = totals.barrels;
  $("roundCount").textContent = sales.length;
  $("roundBadge").textContent = `รอบที่ ${sales.length + 1}`;

  const tbody = $("salesTable");
  tbody.innerHTML = "";

  sales.forEach((r, i) => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${i + 1}</td>
      <td>${r.locks}</td>
      <td>${r.stocks}</td>
      <td>${r.barrels}</td>
      <td>${money(r.sales)}</td>
      <td><button class="delete" onclick="removeSale(${i})">ลบ</button></td>
    `;
    tbody.appendChild(tr);
  });

  $("emptyText").textContent = sales.length ? `${sales.length} รายการ` : "ยังไม่มีข้อมูลการขาย";

  $("sales").textContent = money(totals.sales);
  $("commission").textContent = money(calculateCommission(totals.sales));

  if (!sales.length) {
    $("commissionRule").textContent = "ยังไม่มีข้อมูลสำหรับคำนวณ";
  } else if (totals.sales >= 1800) {
    $("commissionRule").textContent = "ใช้ขั้น 10% + 15% + 20%";
  } else if (totals.sales >= 1000) {
    $("commissionRule").textContent = "ใช้ขั้น 10% + 15%";
  } else {
    $("commissionRule").textContent = "ใช้ Commission 10%";
  }
}

function validateInteger(value, min, max) {
  return Number.isInteger(value) && value >= min && value <= max;
}

$("saleForm").addEventListener("submit", (e) => {
  e.preventDefault();
  $("error").textContent = "";

  const locks = Number($("locks").value);
  const stocks = Number($("stocks").value);
  const barrels = Number($("barrels").value);

  if (!validateInteger(locks, 1, 70)) {
    $("error").textContent = "⚠️ Locks ต้องเป็นจำนวนเต็ม 1–70";
    return;
  }
  if (!validateInteger(stocks, 1, 80)) {
    $("error").textContent = "⚠️ Stocks ต้องเป็นจำนวนเต็ม 1–80";
    return;
  }
  if (!validateInteger(barrels, 1, 90)) {
    $("error").textContent = "⚠️ Barrels ต้องเป็นจำนวนเต็ม 1–90";
    return;
  }

  const rowSales = locks * LOCK_PRICE + stocks * STOCK_PRICE + barrels * BARREL_PRICE;
  sales.push({locks, stocks, barrels, sales: rowSales});

  e.target.reset();
  render();
});

window.removeSale = (index) => {
  sales.splice(index, 1);
  render();
};

$("clearBtn").addEventListener("click", () => {
  if (sales.length && confirm("ต้องการล้างข้อมูลทั้งหมดหรือไม่?")) {
    sales.length = 0;
    render();
  }
});

render();
