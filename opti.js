const units = ['g', 'kg', 'ml', 'L', 'tsp', 'tbsp', 'cup', 'fl oz', 'pc(s)', 'pack(s)'];

const mangoGrahamIngredients = [
  { name: 'Heavy Cream', availableQty: 1000, availableUnit: 'ml', unitCost: 360 / 1000, qtyPerProduct: 960, recipeUnit: 'ml', totalCost: 360 },
  { name: 'Condensed Milk', availableQty: 300, availableUnit: 'ml', unitCost: 40 / 300, qtyPerProduct: 120, recipeUnit: 'ml', totalCost: 16 },
  { name: 'Salt', availableQty: 250, availableUnit: 'g', unitCost: 20 / 250, qtyPerProduct: 1, recipeUnit: 'tsp', totalCost: 0.10 },
  { name: 'Ripe Mangoes', availableQty: 4, availableUnit: 'pc(s)', unitCost: 80 / 4, qtyPerProduct: 4, recipeUnit: 'pc(s)', totalCost: 80 },
  { name: 'Graham Crackers', availableQty: 2, availableUnit: 'pack(s)', unitCost: 65 / 2, qtyPerProduct: 2, recipeUnit: 'pack(s)', totalCost: 65 },
];

function loadIngredients() {
  const selected = document.getElementById("productName").value;
  const tbody = document.getElementById("ingredientRows");
  tbody.innerHTML = "";
  if (selected === "Mango Graham Float") {
    mangoGrahamIngredients.forEach(ing => addIngredient(ing));
  }
}

function unitOptions(selectedUnit = '') {
  return units.map(unit => `<option value="${unit}" ${unit === selectedUnit ? 'selected' : ''}>${unit}</option>`).join('');
}

function addIngredient(data = {}) {
  const row = document.createElement("tr");
  row.innerHTML = `
    <td><input type="text" value="${data.name || ''}" /></td>
    <td><input type="number" value="${data.availableQty || ''}" /></td>
    <td><select>${unitOptions(data.availableUnit)}</select></td>
    <td><input type="number" value="${data.unitCost ? data.unitCost.toFixed(2) : ''}" /></td>
    <td><input type="number" value="${data.qtyPerProduct || ''}" /></td>
    <td><select>${unitOptions(data.recipeUnit)}</select></td>
    <td><input type="number" value="${data.totalCost ? data.totalCost.toFixed(2) : ''}" /></td>
    <td><span class="icon" onclick="removeIngredient(this)">🗑️</span></td>
  `;
  document.getElementById("ingredientRows").appendChild(row);
}

function removeIngredient(el) {
  el.closest('tr').remove();
}

function calculate() {
  const price = parseFloat(document.getElementById("sellingPrice").value) || 0;
  const overhead = parseFloat(document.getElementById("fixedOverhead").value) || 0;

  let totalIngredientCost = 0;
  let minUnits = Infinity;

  document.querySelectorAll("#ingredientRows tr").forEach(row => {
    const inputs = row.querySelectorAll("input, select");
    const availableQty = parseFloat(inputs[1].value);
    const qtyPerProduct = parseFloat(inputs[4].value);
    const totalCost = parseFloat(inputs[6].value) || 0;

    if (qtyPerProduct > 0) {
      const possibleUnits = Math.floor(availableQty / qtyPerProduct);
      if (possibleUnits < minUnits) minUnits = possibleUnits;
    }

    totalIngredientCost += totalCost;
  });

  const totalCost = totalIngredientCost + overhead;
  const costPerUnit = minUnits > 0 ? totalCost / minUnits : 0;
  const revenue = price * minUnits;
  const profit = revenue - totalCost;
  const breakEvenUnits = price - costPerUnit > 0 ? Math.ceil(overhead / (price - costPerUnit)) : 'N/A';

  const resultDiv = document.getElementById("output");
  resultDiv.innerHTML = `
    <strong>Max Producible Units:</strong> ${minUnits}<br>
    <strong>Total Ingredient Cost:</strong> ₱${totalIngredientCost.toFixed(2)}<br>
    <strong>Total Cost (Ingredients + Overhead):</strong> ₱${totalCost.toFixed(2)}<br>
    <strong>Cost per Unit:</strong> ₱${costPerUnit.toFixed(2)}<br>
    <strong>Revenue:</strong> ₱${revenue.toFixed(2)}<br>
    <strong>Profit:</strong> ₱${profit.toFixed(2)}<br>
    <strong>Break-even Units:</strong> ${breakEvenUnits}
  `;
  resultDiv.style.display = "block";
}

window.onload = loadIngredients;