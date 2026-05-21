/**
 * 戦略MG（飲食業）計算エンジン
 */

export const CATEGORIES = {
  // 入金系
  "ウ": { label: "売上", type: "inflow", color: "pink", symbol: "ウ" },
  "エ": { label: "売上", type: "inflow", color: "pink", symbol: "エ" },
  "ア": { label: "資本金", type: "inflow", color: "pink", symbol: "ア" },
  "イ": { label: "借入金", type: "inflow", color: "pink", symbol: "イ" },

  // 出金系
  "カ": { label: "食材仕入", type: "outflow", color: "green", symbol: "カ" },
  "コ": { label: "食材仕入", type: "outflow", color: "green", symbol: "コ" },
  "キ": { label: "人件費", type: "outflow", color: "blue", symbol: "キ" },
  "ク": { label: "販売費", type: "outflow", color: "blue", symbol: "ク" },
  "ケ": { label: "管理費", type: "outflow", color: "blue", symbol: "ケ" },
  "コ": { label: "営業外費用", type: "outflow", color: "blue", symbol: "コ" }
};

export const DEFAULT_PERIOD_DATA = {
  carryover: {
    cash: 300,
    smallStores: 0,
    largeStores: 0,
    storesValue: 0,
    employees: 0,
    pas: 0,
    loan: 0,
    receivables: 0,
    payables: 0,
    retainedEarnings: 0,
    capital: 300
  },
  ledger: [],
  actuals: {
    actualCash: 300
  },
  budget: {
    targetG: 0,
    laborBudget: 0,
    salesBudget: 0,
    adminBudget: 0,
    nonOperatingBudget: 0
  }
};

export function calculateStaffPayroll(carryover) {
  const employeePay = (carryover.employees || 0) * 50;
  const paPay = (carryover.pas || 0) * 20;
  return {
    totalPayroll: employeePay + paPay,
    employeePay,
    paPay
  };
}

export function calculateBudget(budget, carryover) {
  // 予算計画用（ManagementPlanで使用）
  const fixedCostTotal = (budget.laborBudget || 0) + (budget.salesBudget || 0) + (budget.adminBudget || 0) + (budget.nonOperatingBudget || 0);
  const requiredMQ = fixedCostTotal;
  return {
    fixedCostTotal,
    requiredMQ
  };
}

export function calculateFinancials(carryover, ledger, actuals) {
  let cashInflow = 0;
  let cashOutflow = 0;

  const ledgerTotals = {};
  Object.keys(CATEGORIES).forEach(k => {
    ledgerTotals[k] = { amount: 0, quantity: 0 };
  });

  ledger.forEach(entry => {
    const amt = Number(entry.amount) || 0;
    const qty = Number(entry.quantity) || 0;
    const cat = entry.category;

    if (CATEGORIES[cat]) {
      ledgerTotals[cat].amount += amt;
      ledgerTotals[cat].quantity += qty;

      if (CATEGORIES[cat].type === "inflow") {
        cashInflow += amt;
      } else if (CATEGORIES[cat].type === "outflow") {
        cashOutflow += amt;
      }
    }
  });

  const bookEndingCash = carryover.cash + cashInflow - cashOutflow;

  // P/L計算 (変動損益計算書)
  const salesRevenue = ledgerTotals["ウ"].amount + ledgerTotals["エ"].amount;
  const variableCost = ledgerTotals["カ"].amount + ledgerTotals["コ"].amount;
  const margin = salesRevenue - variableCost;
  const marginRatio = salesRevenue > 0 ? (margin / salesRevenue) * 100 : 0;

  // 固定費 F
  const laborCost = ledgerTotals["キ"].amount;
  const salesCost = ledgerTotals["ク"].amount;
  const adminCost = ledgerTotals["ケ"].amount;
  const nonOperatingCost = ledgerTotals["コ"].amount;

  // 店舗減価償却費
  const storeDepreciation = (carryover.smallStores || 0) * 10 + (carryover.largeStores || 0) * 20;

  const fixedCost = laborCost + salesCost + adminCost + nonOperatingCost + storeDepreciation;
  const operatingProfit = margin - fixedCost;
  const fmRatio = margin > 0 ? (fixedCost / margin) * 100 : 0;

  const profitBeforeTax = operatingProfit;

  const priorRetained = carryover.retainedEarnings || 0;
  let corporateTax = 0;
  if (profitBeforeTax > 0) {
    if (priorRetained < 0) {
      const totalTaxBase = profitBeforeTax + priorRetained;
      corporateTax = totalTaxBase > 0 ? Math.round(totalTaxBase * 0.5) : 0;
    } else {
      corporateTax = Math.round(profitBeforeTax * 0.5);
    }
  }

  const netProfit = profitBeforeTax - corporateTax;
  const endingRetained = priorRetained + netProfit;

  // B/S計算
  const endingCash = bookEndingCash;
  const endingReceivables = Math.max(0, carryover.receivables + ledgerTotals["ウ"].amount - (ledgerTotals["ウ"].amount > 0 ? 0 : 0));
  const endingPayables = Math.max(0, carryover.payables + variableCost - (variableCost > 0 ? 0 : 0));
  const endingLoans = Math.max(0, carryover.loan + ledgerTotals["イ"].amount);

  const storesValue = (carryover.smallStores || 0) * 100 + (carryover.largeStores || 0) * 200 - storeDepreciation;

  const totalCurrentAssets = endingCash + endingReceivables;
  const totalFixedAssets = Math.max(0, storesValue);
  const totalAssets = totalCurrentAssets + totalFixedAssets;

  const unpaidTax = corporateTax;
  const totalLiabilities = endingPayables + endingLoans + unpaidTax;

  const endingCapital = carryover.capital + ledgerTotals["ア"].amount;
  const totalNetAssets = endingCapital + endingRetained;

  const totalLiabilitiesAndNetAssets = totalLiabilities + totalNetAssets;
  const bsDifference = Math.abs(totalAssets - totalLiabilitiesAndNetAssets);

  // C/F計算
  const operatingCF = profitBeforeTax + storeDepreciation - (endingReceivables - carryover.receivables) + (endingPayables - carryover.payables);
  const investingCF = -((carryover.smallStores || 0) * 100 + (carryover.largeStores || 0) * 200);
  const financingCF = ledgerTotals["ア"].amount + ledgerTotals["イ"].amount;

  return {
    ledger,
    ledgerTotals,

    bs: {
      cash: endingCash,
      receivables: endingReceivables,
      currentAssets: totalCurrentAssets,
      fixedAssets: totalFixedAssets,
      totalAssets,
      payables: endingPayables,
      loans: endingLoans,
      unpaidTax,
      totalLiabilities,
      capital: endingCapital,
      retainedEarnings: endingRetained,
      totalNetAssets,
      totalLiabilitiesAndNetAssets,
      bsDifference,
      // 互換性: 製造版ではmat/wip/prodの値。飲食版では0
      materialsValue: 0,
      wipValue: 0,
      productValue: 0
    },

    pl: {
      salesRevenue,
      variableCost,
      margin,
      marginRatio,
      laborCost,
      salesCost,
      adminCost,
      nonOperatingCost,
      storeDepreciation,
      fixedCost,
      fixedCostTotal: fixedCost,
      operatingProfit,
      fmRatio,
      corporateTax,
      netProfit,
      profitBeforeTax,
      requiredMQ: fixedCost // 経営計画用
    },

    cf: {
      operatingCF,
      investingCF,
      financingCF,
      netCF: operatingCF + investingCF + financingCF,
      endingCash
    },

    stores: {
      small: carryover.smallStores || 0,
      large: carryover.largeStores || 0,
      depreciation: storeDepreciation
    },

    staff: {
      employees: carryover.employees || 0,
      pas: carryover.pas || 0
    },

    // 互換性: 製造版コンポーネントが参照する属性
    mat: { endingCount: 0, fireValue: 0 },
    wip: { endingCount: 0, missValue: 0 },
    prod: { endingCount: 0, theftValue: 0 },
    machines: { depreciation: 0 },
    bookEndingCash: bookEndingCash,
    rank: operatingProfit >= 0 ? 'A' : 'B'
  };
}
