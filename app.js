(() => {
  "use strict";

  const STORAGE_KEY = "licitia-startup-funding-valuation-v2";
  const scenarioOrder = ["upside", "base", "downside"];
  const scenarioNames = { upside: "Optimista", base: "Base", downside: "Pesimista" };

  const presets = {
    fintech: {
      name: "Fintech / Payments",
      baseMetricLabel: "TPV anual actual",
      baseMetricHelp: "Volumen total de pagos procesados en el último año.",
      monetizationLabel: "Take rate final",
      metricFinalHeader: "TPV final",
      baseMetric: 250000000,
      years: 5,
      discountRate: 35,
      funding: {
        runwayMonths: 18, cashAvailable: 500000, committedCapital: 0, monthlyRevenue: 100000, monthlyRevenueGrowth: 5, contingencyRate: 12,
        payrollMonthly: 180000, technologyMonthly: 45000, marketingMonthly: 50000, adminMonthly: 35000, otherMonthly: 15000,
        productInvestment: 600000, hiringInvestment: 250000, launchMarketing: 300000, legalInvestment: 150000, infrastructureInvestment: 100000, otherInvestment: 0
      },
      scenarios: {
        upside: { growth: 85, monetization: 2, multiple: 12, probability: 25 },
        base: { growth: 50, monetization: 1.8, multiple: 7, probability: 55 },
        downside: { growth: 10, monetization: 1.2, multiple: 2, probability: 20 }
      }
    },
    saas: {
      name: "SaaS",
      baseMetricLabel: "ARR actual",
      baseMetricHelp: "Ingresos recurrentes anuales actuales. El factor valorizado se mantiene en 100% para aplicar múltiplos sobre ARR.",
      monetizationLabel: "Factor de ARR valorizado",
      metricFinalHeader: "ARR proyectado",
      baseMetric: 3000000,
      years: 5,
      discountRate: 40,
      funding: {
        runwayMonths: 18, cashAvailable: 300000, committedCapital: 0, monthlyRevenue: 250000, monthlyRevenueGrowth: 6, contingencyRate: 12,
        payrollMonthly: 220000, technologyMonthly: 70000, marketingMonthly: 65000, adminMonthly: 30000, otherMonthly: 15000,
        productInvestment: 500000, hiringInvestment: 300000, launchMarketing: 350000, legalInvestment: 80000, infrastructureInvestment: 50000, otherInvestment: 0
      },
      scenarios: {
        upside: { growth: 80, monetization: 100, multiple: 10, probability: 25 },
        base: { growth: 40, monetization: 100, multiple: 6, probability: 55 },
        downside: { growth: 8, monetization: 100, multiple: 2, probability: 20 }
      }
    },
    marketplace: {
      name: "Marketplace",
      baseMetricLabel: "GMV anual actual",
      baseMetricHelp: "Valor bruto anual de las operaciones realizadas en la plataforma.",
      monetizationLabel: "Take rate final",
      metricFinalHeader: "GMV final",
      baseMetric: 20000000,
      years: 5,
      discountRate: 40,
      funding: {
        runwayMonths: 18, cashAvailable: 350000, committedCapital: 0, monthlyRevenue: 120000, monthlyRevenueGrowth: 6, contingencyRate: 12,
        payrollMonthly: 190000, technologyMonthly: 55000, marketingMonthly: 90000, adminMonthly: 35000, otherMonthly: 20000,
        productInvestment: 550000, hiringInvestment: 250000, launchMarketing: 500000, legalInvestment: 100000, infrastructureInvestment: 80000, otherInvestment: 0
      },
      scenarios: {
        upside: { growth: 70, monetization: 15, multiple: 8, probability: 25 },
        base: { growth: 35, monetization: 12, multiple: 4, probability: 55 },
        downside: { growth: 5, monetization: 8, multiple: 1.5, probability: 20 }
      }
    },
    general: {
      name: "Negocio general",
      baseMetricLabel: "Ventas anuales actuales",
      baseMetricHelp: "Ingresos o ventas del último año completo.",
      monetizationLabel: "Margen EBITDA final",
      metricFinalHeader: "Ventas proyectadas",
      baseMetric: 5000000,
      years: 5,
      discountRate: 35,
      funding: {
        runwayMonths: 15, cashAvailable: 400000, committedCapital: 0, monthlyRevenue: 300000, monthlyRevenueGrowth: 3, contingencyRate: 10,
        payrollMonthly: 150000, technologyMonthly: 25000, marketingMonthly: 40000, adminMonthly: 45000, otherMonthly: 20000,
        productInvestment: 250000, hiringInvestment: 150000, launchMarketing: 200000, legalInvestment: 60000, infrastructureInvestment: 300000, otherInvestment: 0
      },
      scenarios: {
        upside: { growth: 50, monetization: 25, multiple: 8, probability: 25 },
        base: { growth: 25, monetization: 18, multiple: 5, probability: 55 },
        downside: { growth: 3, monetization: 8, multiple: 2, probability: 20 }
      }
    }
  };

  const $ = (selector) => document.querySelector(selector);

  const elements = {
    form: $("#calculatorForm"), startupName: $("#startupName"), businessModel: $("#businessModel"), currency: $("#currency"),
    runwayMonths: $("#runwayMonths"), cashAvailable: $("#cashAvailable"), committedCapital: $("#committedCapital"), monthlyRevenue: $("#monthlyRevenue"), monthlyRevenueGrowth: $("#monthlyRevenueGrowth"), contingencyRate: $("#contingencyRate"),
    payrollMonthly: $("#payrollMonthly"), technologyMonthly: $("#technologyMonthly"), marketingMonthly: $("#marketingMonthly"), adminMonthly: $("#adminMonthly"), otherMonthly: $("#otherMonthly"),
    productInvestment: $("#productInvestment"), hiringInvestment: $("#hiringInvestment"), launchMarketing: $("#launchMarketing"), legalInvestment: $("#legalInvestment"), infrastructureInvestment: $("#infrastructureInvestment"), otherInvestment: $("#otherInvestment"),
    milestone1: $("#milestone1"), milestone2: $("#milestone2"), milestone3: $("#milestone3"), milestoneMonth1: $("#milestoneMonth1"), milestoneMonth2: $("#milestoneMonth2"), milestoneMonth3: $("#milestoneMonth3"),
    monthlyCostLive: $("#monthlyCostLive"), oneTimeCostLive: $("#oneTimeCostLive"), targetRaiseValue: $("#targetRaiseValue"), targetRaiseNote: $("#targetRaiseNote"), capitalRequiredValue: $("#capitalRequiredValue"), netBurnValue: $("#netBurnValue"), runwayValue: $("#runwayValue"), projectedRevenueValue: $("#projectedRevenueValue"), totalUsesValue: $("#totalUsesValue"), totalOffsetsValue: $("#totalOffsetsValue"), endingRevenueValue: $("#endingRevenueValue"), breakEvenValue: $("#breakEvenValue"), fundingHealthCard: $("#fundingHealthCard"), fundingHealthTitle: $("#fundingHealthTitle"), fundingHealthText: $("#fundingHealthText"), useOfFundsBars: $("#useOfFundsBars"), milestoneSummary: $("#milestoneSummary"), milestoneHorizon: $("#milestoneHorizon"),
    syncInvestment: $("#syncInvestment"), investment: $("#investment"), investmentHelp: $("#investmentHelp"), baseMetric: $("#baseMetric"), years: $("#years"), discountRate: $("#discountRate"), baseMetricLabel: $("#baseMetricLabel"), baseMetricHelp: $("#baseMetricHelp"), metricFinalHeader: $("#metricFinalHeader"), probabilityStatus: $("#probabilityStatus"),
    resultTitle: $("#resultTitle"), modelBadge: $("#modelBadge"), preMoneyValue: $("#preMoneyValue"), postMoneyValue: $("#postMoneyValue"), equityValue: $("#equityValue"), founderValue: $("#founderValue"), moicValue: $("#moicValue"), expectedExitValue: $("#expectedExitValue"), discountFactorValue: $("#discountFactorValue"), capitalToValuationValue: $("#capitalToValuationValue"), valuationHealthCard: $("#valuationHealthCard"), valuationHealthTitle: $("#valuationHealthTitle"), valuationHealthText: $("#valuationHealthText"), resultsTableBody: $("#resultsTableBody"),
    roundStatus: $("#roundStatus"), roundMinimumValue: $("#roundMinimumValue"), roundInvestmentValue: $("#roundInvestmentValue"), roundDifferenceText: $("#roundDifferenceText"), roundEquityValue: $("#roundEquityValue"), roundEquityText: $("#roundEquityText"), roundDiagnostic: $("#roundDiagnostic"), roundDiagnosticTitle: $("#roundDiagnosticTitle"), roundDiagnosticText: $("#roundDiagnosticText"),
    saveButton: $("#saveButton"), loadButton: $("#loadButton"), printButton: $("#printButton"), resetButton: $("#resetButton"), toast: $("#toast"),
    printStartupName: $("#printStartupName"), printBusinessModel: $("#printBusinessModel"), printReportDate: $("#printReportDate"), printHeaderStartup: $("#printHeaderStartup"), printDatePage1: $("#printDatePage1"), printCurrencyLabel: $("#printCurrencyLabel"),
    printPreMoneyValue: $("#printPreMoneyValue"), printPostMoneyValue: $("#printPostMoneyValue"), printEquityValue: $("#printEquityValue"), printFounderValue: $("#printFounderValue"), printTargetRaiseValue: $("#printTargetRaiseValue"), printCapitalRequiredValue: $("#printCapitalRequiredValue"), printGrossBurnValue: $("#printGrossBurnValue"), printNetBurnValue: $("#printNetBurnValue"), printRunwayValue: $("#printRunwayValue"), printBreakEvenValue: $("#printBreakEvenValue"), printProjectedRevenueValue: $("#printProjectedRevenueValue"), printEndingRevenueValue: $("#printEndingRevenueValue"),
    printUseOfFundsList: $("#printUseOfFundsList"), printMilestonesList: $("#printMilestonesList"), printMilestoneHorizon: $("#printMilestoneHorizon"), printRoundStatus: $("#printRoundStatus"), printDiagnosticTitle: $("#printDiagnosticTitle"), printDiagnosticText: $("#printDiagnosticText"),
    printBaseMetricLabel: $("#printBaseMetricLabel"), printBaseMetricValue: $("#printBaseMetricValue"), printYearsValue: $("#printYearsValue"), printDiscountRateValue: $("#printDiscountRateValue"), printInvestmentValue: $("#printInvestmentValue"), printExpectedExitValue: $("#printExpectedExitValue"), printDiscountFactorValue: $("#printDiscountFactorValue"), printCapitalToValuationValue: $("#printCapitalToValuationValue"), printMoicValue: $("#printMoicValue"), printProbabilityStatus: $("#printProbabilityStatus"), printCapitalCoverageValue: $("#printCapitalCoverageValue"),
    printBarValueUpside: $("#printBarValueUpside"), printBarValueBase: $("#printBarValueBase"), printBarValueDownside: $("#printBarValueDownside"), printMetricFinalHeader: $("#printMetricFinalHeader"), printResultsTableBody: $("#printResultsTableBody"), printRoundMinimumValue: $("#printRoundMinimumValue"), printRoundInvestmentValue: $("#printRoundInvestmentValue"), printRoundEquityValue: $("#printRoundEquityValue")
  };

  const scenarioInputs = {};
  scenarioOrder.forEach((scenario) => {
    scenarioInputs[scenario] = {};
    ["growth", "monetization", "multiple", "probability"].forEach((field) => {
      scenarioInputs[scenario][field] = document.querySelector(`[data-scenario="${scenario}"][data-field="${field}"]`);
    });
  });

  function numberValue(input, fallback = 0) {
    const value = Number.parseFloat(input.value);
    return Number.isFinite(value) ? value : fallback;
  }

  function clamp(value, min, max) { return Math.min(Math.max(value, min), max); }

  function formatCurrency(value, currency, compact = false) {
    return new Intl.NumberFormat("es-MX", {
      style: "currency", currency, currencyDisplay: "narrowSymbol", maximumFractionDigits: 0, notation: compact ? "compact" : "standard"
    }).format(Number.isFinite(value) ? value : 0);
  }

  function formatPercent(value, digits = 1) {
    return new Intl.NumberFormat("es-MX", { style: "percent", minimumFractionDigits: digits, maximumFractionDigits: digits }).format(Number.isFinite(value) ? value : 0);
  }

  function formatMultiple(value) {
    return `${new Intl.NumberFormat("es-MX", { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(Number.isFinite(value) ? value : 0)}x`;
  }

  function collectFundingState() {
    return {
      months: clamp(numberValue(elements.runwayMonths, 18), 1, 60),
      cashAvailable: Math.max(0, numberValue(elements.cashAvailable)),
      committedCapital: Math.max(0, numberValue(elements.committedCapital)),
      monthlyRevenue: Math.max(0, numberValue(elements.monthlyRevenue)),
      revenueGrowth: Math.max(-1, numberValue(elements.monthlyRevenueGrowth) / 100),
      contingencyRate: Math.max(0, numberValue(elements.contingencyRate) / 100),
      monthly: {
        payroll: Math.max(0, numberValue(elements.payrollMonthly)), technology: Math.max(0, numberValue(elements.technologyMonthly)), marketing: Math.max(0, numberValue(elements.marketingMonthly)), admin: Math.max(0, numberValue(elements.adminMonthly)), other: Math.max(0, numberValue(elements.otherMonthly))
      },
      oneTime: {
        product: Math.max(0, numberValue(elements.productInvestment)), hiring: Math.max(0, numberValue(elements.hiringInvestment)), launch: Math.max(0, numberValue(elements.launchMarketing)), legal: Math.max(0, numberValue(elements.legalInvestment)), infrastructure: Math.max(0, numberValue(elements.infrastructureInvestment)), other: Math.max(0, numberValue(elements.otherInvestment))
      },
      milestones: [
        { text: elements.milestone1.value.trim() || "Hito 1", month: clamp(numberValue(elements.milestoneMonth1, 4), 1, 60) },
        { text: elements.milestone2.value.trim() || "Hito 2", month: clamp(numberValue(elements.milestoneMonth2, 9), 1, 60) },
        { text: elements.milestone3.value.trim() || "Hito 3", month: clamp(numberValue(elements.milestoneMonth3, 15), 1, 60) }
      ]
    };
  }

  function calculateProjectedRevenue(startingRevenue, growthRate, months) {
    if (startingRevenue <= 0) return { total: 0, ending: 0 };
    if (Math.abs(growthRate) < 0.0000001) return { total: startingRevenue * months, ending: startingRevenue };
    const total = startingRevenue * ((Math.pow(1 + growthRate, months) - 1) / growthRate);
    const ending = startingRevenue * Math.pow(1 + growthRate, months);
    return { total: Math.max(0, total), ending: Math.max(0, ending) };
  }

  function roundRaise(value) {
    if (value <= 0) return 0;
    const increment = value < 1000000 ? 50000 : value < 10000000 ? 100000 : 500000;
    return Math.ceil(value / increment) * increment;
  }

  function calculateFunding(state) {
    const monthlyCost = Object.values(state.monthly).reduce((sum, value) => sum + value, 0);
    const oneTimeCost = Object.values(state.oneTime).reduce((sum, value) => sum + value, 0);
    const operatingCost = monthlyCost * state.months;
    const revenue = calculateProjectedRevenue(state.monthlyRevenue, state.revenueGrowth, state.months);
    const contingency = (operatingCost + oneTimeCost) * state.contingencyRate;
    const totalUses = operatingCost + oneTimeCost + contingency;
    const totalOffsets = revenue.total + state.cashAvailable + state.committedCapital;
    const capitalRequired = Math.max(0, totalUses - totalOffsets);
    const targetRaise = roundRaise(capitalRequired);
    const grossBurn = monthlyCost;
    const netBurn = monthlyCost - state.monthlyRevenue;
    const averageNetBurn = (operatingCost - revenue.total) / state.months;
    const runway = netBurn > 0 ? state.cashAvailable / netBurn : Infinity;
    let breakEvenMonth = null;
    if (state.monthlyRevenue >= monthlyCost && monthlyCost > 0) breakEvenMonth = 0;
    else if (state.monthlyRevenue > 0 && state.revenueGrowth > 0 && monthlyCost > 0) {
      breakEvenMonth = Math.ceil(Math.log(monthlyCost / state.monthlyRevenue) / Math.log(1 + state.revenueGrowth));
      if (!Number.isFinite(breakEvenMonth) || breakEvenMonth < 0) breakEvenMonth = null;
    }

    const uses = {
      "Equipo": state.monthly.payroll * state.months + state.oneTime.hiring,
      "Producto y tecnología": state.monthly.technology * state.months + state.oneTime.product + state.oneTime.infrastructure,
      "Marketing y ventas": state.monthly.marketing * state.months + state.oneTime.launch,
      "Administración y legal": state.monthly.admin * state.months + state.oneTime.legal,
      "Otros": state.monthly.other * state.months + state.oneTime.other,
      "Contingencia": contingency
    };

    return { monthlyCost, oneTimeCost, operatingCost, projectedRevenue: revenue.total, endingRevenue: revenue.ending, contingency, totalUses, totalOffsets, capitalRequired, targetRaise, grossBurn, netBurn, averageNetBurn, runway, breakEvenMonth, uses };
  }

  function collectValuationState(fundingResult) {
    const scenarios = {};
    scenarioOrder.forEach((scenario) => {
      scenarios[scenario] = {
        growth: numberValue(scenarioInputs[scenario].growth), monetization: numberValue(scenarioInputs[scenario].monetization), multiple: numberValue(scenarioInputs[scenario].multiple), probability: numberValue(scenarioInputs[scenario].probability)
      };
    });
    const syncedInvestment = elements.syncInvestment.checked ? fundingResult.targetRaise : Math.max(0, numberValue(elements.investment));
    return {
      baseMetric: Math.max(0, numberValue(elements.baseMetric)), years: clamp(numberValue(elements.years, 5), 1, 15), discountRate: Math.max(0, numberValue(elements.discountRate)) / 100, investment: syncedInvestment, scenarios
    };
  }

  function calculateValuation(state) {
    const discountFactor = Math.pow(1 + state.discountRate, state.years);
    let preMoney = 0;
    let expectedExit = 0;
    let probabilityTotal = 0;
    const scenarios = {};

    scenarioOrder.forEach((scenario) => {
      const input = state.scenarios[scenario];
      const growthRate = Math.max(-1, input.growth / 100);
      const monetizationRate = Math.max(0, input.monetization / 100);
      const probabilityRate = Math.max(0, input.probability / 100);
      const metricFinal = state.baseMetric * Math.pow(1 + growthRate, state.years);
      const finalRevenue = metricFinal * monetizationRate;
      const exitValue = finalRevenue * Math.max(0, input.multiple);
      const presentValue = discountFactor > 0 ? exitValue / discountFactor : 0;
      const weightedValue = presentValue * probabilityRate;
      probabilityTotal += probabilityRate;
      preMoney += weightedValue;
      expectedExit += exitValue * probabilityRate;
      scenarios[scenario] = { metricFinal, finalRevenue, exitValue, presentValue, weightedValue, probabilityRate };
    });

    const postMoney = preMoney + state.investment;
    const equity = postMoney > 0 ? state.investment / postMoney : 0;
    const founderShare = Math.max(0, 1 - equity);
    const investorExpectedExit = expectedExit * equity;
    const moic = state.investment > 0 ? investorExpectedExit / state.investment : 0;
    return { discountFactor, probabilityTotal, preMoney, postMoney, equity, founderShare, expectedExit, moic, scenarios };
  }

  function updateModelLabels(modelKey) {
    const preset = presets[modelKey] || presets.fintech;
    elements.baseMetricLabel.textContent = preset.baseMetricLabel;
    elements.baseMetricHelp.textContent = preset.baseMetricHelp;
    elements.metricFinalHeader.textContent = preset.metricFinalHeader;
    if (elements.printMetricFinalHeader) elements.printMetricFinalHeader.textContent = preset.metricFinalHeader;
    if (elements.printBaseMetricLabel) elements.printBaseMetricLabel.textContent = preset.baseMetricLabel;
    elements.modelBadge.textContent = preset.name;
    ["Upside", "Base", "Downside"].forEach((suffix) => {
      const label = document.querySelector(`#monetizationLabel${suffix}`);
      if (label) label.textContent = preset.monetizationLabel;
    });
  }

  function updateFundingHealth(funding, state) {
    elements.fundingHealthCard.classList.remove("warning", "risk");
    if (funding.netBurn <= 0) {
      elements.fundingHealthTitle.textContent = "La operación actual no consume caja";
      elements.fundingHealthText.textContent = "La ronda se destinaría principalmente a acelerar crecimiento e inversiones, no a cubrir un déficit operativo inmediato.";
    } else if (funding.runway < 6) {
      elements.fundingHealthCard.classList.add("risk");
      elements.fundingHealthTitle.textContent = "Runway crítico";
      elements.fundingHealthText.textContent = "El efectivo actual cubre menos de seis meses. La empresa debe reducir burn rate, cerrar ingresos o iniciar la ronda con urgencia.";
    } else if (funding.runway < 12) {
      elements.fundingHealthCard.classList.add("warning");
      elements.fundingHealthTitle.textContent = "Runway limitado";
      elements.fundingHealthText.textContent = "Existe margen para preparar la ronda, pero cualquier retraso comercial puede obligar a negociar desde una posición débil.";
    } else {
      elements.fundingHealthTitle.textContent = "Runway razonable para preparar la ronda";
      elements.fundingHealthText.textContent = `El efectivo actual cubre aproximadamente ${funding.runway.toFixed(1)} meses al burn rate de hoy. Valida que los ingresos y gastos proyectados sean alcanzables.`;
    }
    if (funding.capitalRequired === 0) {
      elements.targetRaiseNote.textContent = "Los recursos e ingresos cubren el horizonte definido; una ronda sería para acelerar, no para sobrevivir.";
    } else {
      elements.targetRaiseNote.textContent = `Monto redondeado para financiar ${state.months} meses y una contingencia de ${(state.contingencyRate * 100).toFixed(1)}%.`;
    }
  }

  function updateValuationHealth(valuation) {
    elements.valuationHealthCard.classList.remove("warning", "risk");
    if (Math.abs(valuation.probabilityTotal - 1) > 0.001) {
      elements.valuationHealthCard.classList.add("risk");
      elements.valuationHealthTitle.textContent = "Probabilidades incompletas";
      elements.valuationHealthText.textContent = "Los escenarios deben sumar 100%. La valuación no es comparable hasta corregirlos.";
      return;
    }
    const equityPercent = valuation.equity * 100;
    if (equityPercent <= 15) {
      elements.valuationHealthTitle.textContent = "Dilución relativamente controlada";
      elements.valuationHealthText.textContent = "La ronda deja margen para financiamientos posteriores, siempre que la valuación esté respaldada por métricas verificables.";
    } else if (equityPercent <= 25) {
      elements.valuationHealthCard.classList.add("warning");
      elements.valuationHealthTitle.textContent = "Dilución negociable, pero relevante";
      elements.valuationHealthText.textContent = "La ronda consume una parte importante del capital. Los hitos financiados deben justificar claramente ese porcentaje.";
    } else if (equityPercent <= 35) {
      elements.valuationHealthCard.classList.add("warning");
      elements.valuationHealthTitle.textContent = "Dilución alta";
      elements.valuationHealthText.textContent = "Puede limitar rondas posteriores. Evalúa reducir el monto, elevar hitos previos o desembolsar la inversión por etapas.";
    } else {
      elements.valuationHealthCard.classList.add("risk");
      elements.valuationHealthTitle.textContent = "Dilución crítica";
      elements.valuationHealthText.textContent = "La ronda puede debilitar el control fundador y la capacidad de atraer capital futuro. El plan financiero o la valuación requieren revisión.";
    }
  }

  function renderUseOfFunds(funding, currency) {
    elements.useOfFundsBars.replaceChildren();
    if (elements.printUseOfFundsList) elements.printUseOfFundsList.replaceChildren();
    const entries = Object.entries(funding.uses).filter(([, value]) => value > 0).sort((a, b) => b[1] - a[1]);
    const max = Math.max(...entries.map(([, value]) => value), 1);
    entries.forEach(([label, value]) => {
      const item = document.createElement("div");
      item.className = "fund-bar-item";
      const head = document.createElement("div");
      head.className = "fund-bar-label";
      const name = document.createElement("span");
      name.textContent = label;
      const amount = document.createElement("strong");
      amount.textContent = `${formatCurrency(value, currency, true)} · ${formatPercent(value / funding.totalUses, 0)}`;
      head.append(name, amount);
      const track = document.createElement("div");
      track.className = "fund-track";
      const bar = document.createElement("i");
      bar.style.width = `${Math.max(2, (value / max) * 100)}%`;
      track.appendChild(bar);
      item.append(head, track);
      elements.useOfFundsBars.appendChild(item);

      if (elements.printUseOfFundsList) {
        const row = document.createElement("div");
        const term = document.createElement("dt");
        const detail = document.createElement("dd");
        term.textContent = label;
        detail.textContent = `${formatCurrency(value, currency)} · ${formatPercent(value / funding.totalUses, 0)}`;
        row.append(term, detail);
        elements.printUseOfFundsList.appendChild(row);
      }
    });
  }

  function renderMilestones(state) {
    elements.milestoneSummary.replaceChildren();
    if (elements.printMilestonesList) elements.printMilestonesList.replaceChildren();
    elements.milestoneHorizon.textContent = `${state.months} meses`;
    if (elements.printMilestoneHorizon) elements.printMilestoneHorizon.textContent = `${state.months} meses`;
    state.milestones.sort((a, b) => a.month - b.month).forEach((milestone) => {
      const item = document.createElement("li");
      const month = document.createElement("span");
      month.textContent = `Mes ${milestone.month}`;
      const text = document.createElement("p");
      text.textContent = milestone.text;
      item.append(month, text);
      elements.milestoneSummary.appendChild(item);

      if (elements.printMilestonesList) {
        const printItem = document.createElement("li");
        const printMonth = document.createElement("span");
        const printText = document.createElement("p");
        printMonth.textContent = `Mes ${milestone.month}`;
        printText.textContent = milestone.text;
        printItem.append(printMonth, printText);
        elements.printMilestonesList.appendChild(printItem);
      }
    });
  }

  function renderScenarioTable(valuation, currency) {
    elements.resultsTableBody.replaceChildren();
    scenarioOrder.forEach((scenario) => {
      const row = document.createElement("tr");
      const data = valuation.scenarios[scenario];
      [scenarioNames[scenario], formatCurrency(data.metricFinal, currency), formatCurrency(data.finalRevenue, currency), formatCurrency(data.exitValue, currency), formatCurrency(data.presentValue, currency), formatPercent(data.probabilityRate), formatCurrency(data.weightedValue, currency)].forEach((content) => {
        const cell = document.createElement("td");
        cell.textContent = content;
        row.appendChild(cell);
      });
      elements.resultsTableBody.appendChild(row);
    });
  }

  function renderScenarioBars(valuation, currency) {
    const max = Math.max(...scenarioOrder.map((scenario) => valuation.scenarios[scenario].weightedValue), 1);
    const suffixes = { upside: "Upside", base: "Base", downside: "Downside" };
    scenarioOrder.forEach((scenario) => {
      const value = valuation.scenarios[scenario].weightedValue;
      $(`#bar${suffixes[scenario]}`).style.width = `${clamp((value / max) * 100, 0, 100)}%`;
      $(`#barValue${suffixes[scenario]}`).textContent = formatCurrency(value, currency, true);
    });
  }

  function renderPrintScenarioTable(valuation, valuationState, currency) {
    if (!elements.printResultsTableBody) return;
    elements.printResultsTableBody.replaceChildren();
    scenarioOrder.forEach((scenario) => {
      const row = document.createElement("tr");
      const data = valuation.scenarios[scenario];
      const assumptions = valuationState.scenarios[scenario];
      [
        scenarioNames[scenario],
        `${assumptions.growth.toFixed(1)}%`,
        `${assumptions.monetization.toFixed(2)}%`,
        `${assumptions.multiple.toFixed(1)}x`,
        formatCurrency(data.metricFinal, currency),
        formatCurrency(data.finalRevenue, currency),
        formatCurrency(data.exitValue, currency),
        formatCurrency(data.presentValue, currency),
        formatPercent(data.probabilityRate, 0),
        formatCurrency(data.weightedValue, currency)
      ].forEach((content) => {
        const cell = document.createElement("td");
        cell.textContent = content;
        row.appendChild(cell);
      });
      elements.printResultsTableBody.appendChild(row);
    });
  }

  function updateRoundDiagnostic(funding, valuation, investment, currency) {
    const difference = investment - funding.capitalRequired;
    const differenceRatio = funding.capitalRequired > 0 ? difference / funding.capitalRequired : 0;
    elements.roundStatus.className = "round-status";
    elements.roundDiagnostic.className = "diagnostic-card";

    if (funding.capitalRequired === 0 && investment > 0) {
      elements.roundStatus.textContent = "Ronda de aceleración";
      elements.roundStatus.classList.add("good");
      elements.roundDiagnosticTitle.textContent = "La operación proyectada no exige capital externo";
      elements.roundDiagnosticText.textContent = "La inversión debe justificarse como aceleración: crecimiento, adquisición de clientes, tecnología o expansión. No la presentes como capital de supervivencia.";
    } else if (difference < -Math.max(funding.capitalRequired * 0.05, 50000)) {
      elements.roundStatus.textContent = "Capital insuficiente";
      elements.roundStatus.classList.add("risk");
      elements.roundDiagnostic.classList.add("risk");
      elements.roundDiagnosticTitle.textContent = "La ronda no cubre el plan financiero";
      elements.roundDiagnosticText.textContent = "El monto usado en la valuación es menor al capital mínimo. Sin ajustes, la startup agotaría recursos antes de completar los hitos definidos.";
    } else if (differenceRatio > 0.25 && funding.capitalRequired > 0) {
      elements.roundStatus.textContent = "Sobre-financiamiento";
      elements.roundStatus.classList.add("warning");
      elements.roundDiagnostic.classList.add("warning");
      elements.roundDiagnosticTitle.textContent = "La ronda supera ampliamente la necesidad calculada";
      elements.roundDiagnosticText.textContent = "Solicitar más capital aumenta la dilución. Debes explicar qué hitos adicionales financiará la diferencia o reducir el monto de la ronda.";
    } else if (valuation.equity > 0.35) {
      elements.roundStatus.textContent = "Dilución crítica";
      elements.roundStatus.classList.add("risk");
      elements.roundDiagnostic.classList.add("risk");
      elements.roundDiagnosticTitle.textContent = "El plan exige demasiado equity";
      elements.roundDiagnosticText.textContent = "La necesidad financiera puede ser válida, pero la valuación actual no soporta la ronda sin una pérdida de participación excesiva. Considera hitos previos, tramos o financiamiento no dilutivo.";
    } else if (valuation.equity > 0.25) {
      elements.roundStatus.textContent = "Requiere negociación";
      elements.roundStatus.classList.add("warning");
      elements.roundDiagnostic.classList.add("warning");
      elements.roundDiagnosticTitle.textContent = "La ronda es financieramente consistente, pero costosa en equity";
      elements.roundDiagnosticText.textContent = "Los hitos y la velocidad de crecimiento deben justificar la dilución. Conviene evaluar desembolsos condicionados o una ronda más pequeña.";
    } else {
      elements.roundStatus.textContent = "Ronda consistente";
      elements.roundStatus.classList.add("good");
      elements.roundDiagnosticTitle.textContent = "El capital y la dilución están razonablemente alineados";
      elements.roundDiagnosticText.textContent = "El monto cubre la planeación sin exceder de forma relevante la necesidad calculada. El siguiente paso es validar los supuestos con evidencia comercial y financiera.";
    }

    elements.roundMinimumValue.textContent = formatCurrency(funding.capitalRequired, currency);
    elements.roundInvestmentValue.textContent = formatCurrency(investment, currency);
    elements.roundDifferenceText.textContent = Math.abs(difference) < 1 ? "Sin diferencia." : `${difference >= 0 ? "Excede" : "Faltan"} ${formatCurrency(Math.abs(difference), currency)} frente al mínimo.`;
    elements.roundEquityValue.textContent = formatPercent(valuation.equity, 2);
    elements.roundEquityText.textContent = valuation.equity <= 0.25 ? "Dentro de un rango usual de negociación." : "Impacto relevante sobre fundadores y rondas futuras.";
  }

  function render() {
    const currency = elements.currency.value;
    const fundingState = collectFundingState();
    const funding = calculateFunding(fundingState);

    if (elements.syncInvestment.checked) elements.investment.value = Math.round(funding.targetRaise);
    elements.investment.readOnly = elements.syncInvestment.checked;
    elements.investmentHelp.textContent = elements.syncInvestment.checked ? "Sincronizado con la ronda objetivo calculada." : "Monto manual usado para estimar la dilución.";

    const valuationState = collectValuationState(funding);
    const valuation = calculateValuation(valuationState);
    updateModelLabels(elements.businessModel.value);

    elements.monthlyCostLive.textContent = formatCurrency(funding.monthlyCost, currency);
    elements.oneTimeCostLive.textContent = formatCurrency(funding.oneTimeCost, currency);
    elements.targetRaiseValue.textContent = formatCurrency(funding.targetRaise, currency);
    elements.capitalRequiredValue.textContent = formatCurrency(funding.capitalRequired, currency);
    elements.netBurnValue.textContent = funding.netBurn <= 0 ? "Sin burn neto" : formatCurrency(funding.netBurn, currency);
    elements.runwayValue.textContent = Number.isFinite(funding.runway) ? `${funding.runway.toFixed(1)} meses` : "Autosostenible";
    elements.projectedRevenueValue.textContent = formatCurrency(funding.projectedRevenue, currency);
    elements.totalUsesValue.textContent = formatCurrency(funding.totalUses, currency);
    elements.totalOffsetsValue.textContent = formatCurrency(funding.totalOffsets, currency);
    elements.endingRevenueValue.textContent = formatCurrency(funding.endingRevenue, currency);
    elements.breakEvenValue.textContent = funding.breakEvenMonth === 0 ? "Actual" : funding.breakEvenMonth === null ? "No alcanzado" : funding.breakEvenMonth <= fundingState.months ? `Mes ${funding.breakEvenMonth}` : `Después del mes ${fundingState.months}`;
    updateFundingHealth(funding, fundingState);
    renderUseOfFunds(funding, currency);
    renderMilestones(fundingState);

    const startupDisplayName = elements.startupName.value.trim() || "Mi Startup";
    const currentModelName = presets[elements.businessModel.value]?.name || "Modelo general";
    const reportDate = new Intl.DateTimeFormat("es-MX", { dateStyle: "long" }).format(new Date());

    elements.resultTitle.textContent = startupDisplayName;
    if (elements.printStartupName) elements.printStartupName.textContent = startupDisplayName;
    if (elements.printBusinessModel) elements.printBusinessModel.textContent = currentModelName;
    if (elements.printReportDate) elements.printReportDate.textContent = reportDate;
    if (elements.printHeaderStartup) elements.printHeaderStartup.textContent = `${startupDisplayName} · ${currentModelName}`;
    elements.preMoneyValue.textContent = formatCurrency(valuation.preMoney, currency);
    elements.postMoneyValue.textContent = formatCurrency(valuation.postMoney, currency);
    elements.equityValue.textContent = formatPercent(valuation.equity, 2);
    elements.founderValue.textContent = formatPercent(valuation.founderShare, 2);
    elements.moicValue.textContent = formatMultiple(valuation.moic);
    elements.expectedExitValue.textContent = formatCurrency(valuation.expectedExit, currency);
    elements.discountFactorValue.textContent = formatMultiple(valuation.discountFactor);
    elements.capitalToValuationValue.textContent = valuation.preMoney > 0 ? formatPercent(valuationState.investment / valuation.preMoney, 1) : "—";

    if (elements.printDatePage1) elements.printDatePage1.textContent = reportDate;
    if (elements.printCurrencyLabel) elements.printCurrencyLabel.textContent = currency;
    if (elements.printPreMoneyValue) elements.printPreMoneyValue.textContent = formatCurrency(valuation.preMoney, currency);
    if (elements.printPostMoneyValue) elements.printPostMoneyValue.textContent = formatCurrency(valuation.postMoney, currency);
    if (elements.printEquityValue) elements.printEquityValue.textContent = formatPercent(valuation.equity, 2);
    if (elements.printFounderValue) elements.printFounderValue.textContent = formatPercent(valuation.founderShare, 2);
    if (elements.printTargetRaiseValue) elements.printTargetRaiseValue.textContent = formatCurrency(funding.targetRaise, currency);
    if (elements.printCapitalRequiredValue) elements.printCapitalRequiredValue.textContent = formatCurrency(funding.capitalRequired, currency);
    if (elements.printGrossBurnValue) elements.printGrossBurnValue.textContent = formatCurrency(funding.grossBurn, currency);
    if (elements.printNetBurnValue) elements.printNetBurnValue.textContent = funding.netBurn <= 0 ? "Sin burn neto" : formatCurrency(funding.netBurn, currency);
    if (elements.printRunwayValue) elements.printRunwayValue.textContent = Number.isFinite(funding.runway) ? `${funding.runway.toFixed(1)} meses` : "Autosostenible";
    if (elements.printBreakEvenValue) elements.printBreakEvenValue.textContent = funding.breakEvenMonth === 0 ? "Actual" : funding.breakEvenMonth === null ? "No alcanzado" : funding.breakEvenMonth <= fundingState.months ? `Mes ${funding.breakEvenMonth}` : `Después del mes ${fundingState.months}`;
    if (elements.printProjectedRevenueValue) elements.printProjectedRevenueValue.textContent = formatCurrency(funding.projectedRevenue, currency);
    if (elements.printEndingRevenueValue) elements.printEndingRevenueValue.textContent = formatCurrency(funding.endingRevenue, currency);
    if (elements.printBaseMetricValue) elements.printBaseMetricValue.textContent = formatCurrency(valuationState.baseMetric, currency);
    if (elements.printYearsValue) elements.printYearsValue.textContent = `${valuationState.years} ${valuationState.years === 1 ? "año" : "años"}`;
    if (elements.printDiscountRateValue) elements.printDiscountRateValue.textContent = formatPercent(valuationState.discountRate, 1);
    if (elements.printInvestmentValue) elements.printInvestmentValue.textContent = formatCurrency(valuationState.investment, currency);
    if (elements.printExpectedExitValue) elements.printExpectedExitValue.textContent = formatCurrency(valuation.expectedExit, currency);
    if (elements.printDiscountFactorValue) elements.printDiscountFactorValue.textContent = formatMultiple(valuation.discountFactor);
    if (elements.printCapitalToValuationValue) elements.printCapitalToValuationValue.textContent = valuation.preMoney > 0 ? formatPercent(valuationState.investment / valuation.preMoney, 1) : "—";
    if (elements.printMoicValue) elements.printMoicValue.textContent = formatMultiple(valuation.moic);
    if (elements.printCapitalCoverageValue) elements.printCapitalCoverageValue.textContent = funding.capitalRequired > 0 ? formatPercent(valuationState.investment / funding.capitalRequired, 0) : "No requerido";
    if (elements.printBarValueUpside) elements.printBarValueUpside.textContent = formatCurrency(valuation.scenarios.upside.weightedValue, currency);
    if (elements.printBarValueBase) elements.printBarValueBase.textContent = formatCurrency(valuation.scenarios.base.weightedValue, currency);
    if (elements.printBarValueDownside) elements.printBarValueDownside.textContent = formatCurrency(valuation.scenarios.downside.weightedValue, currency);

    const probabilityPercent = valuation.probabilityTotal * 100;
    elements.probabilityStatus.textContent = `Probabilidad total: ${probabilityPercent.toFixed(1)}%`;
    elements.probabilityStatus.classList.toggle("invalid", Math.abs(probabilityPercent - 100) > 0.1);
    if (elements.printProbabilityStatus) elements.printProbabilityStatus.textContent = `${probabilityPercent.toFixed(1)}%`;
    updateValuationHealth(valuation);
    renderScenarioTable(valuation, currency);
    renderPrintScenarioTable(valuation, valuationState, currency);
    renderScenarioBars(valuation, currency);
    updateRoundDiagnostic(funding, valuation, valuationState.investment, currency);
    if (elements.printRoundStatus) elements.printRoundStatus.textContent = elements.roundStatus.textContent;
    if (elements.printDiagnosticTitle) elements.printDiagnosticTitle.textContent = elements.roundDiagnosticTitle.textContent;
    if (elements.printDiagnosticText) elements.printDiagnosticText.textContent = elements.roundDiagnosticText.textContent;
    if (elements.printRoundMinimumValue) elements.printRoundMinimumValue.textContent = formatCurrency(funding.capitalRequired, currency);
    if (elements.printRoundInvestmentValue) elements.printRoundInvestmentValue.textContent = formatCurrency(valuationState.investment, currency);
    if (elements.printRoundEquityValue) elements.printRoundEquityValue.textContent = formatPercent(valuation.equity, 2);
  }

  function applyPreset(modelKey, preserveIdentity = true) {
    const preset = presets[modelKey] || presets.fintech;
    const name = elements.startupName.value;
    const currency = elements.currency.value;
    elements.businessModel.value = modelKey;
    elements.baseMetric.value = preset.baseMetric;
    elements.years.value = preset.years;
    elements.discountRate.value = preset.discountRate;
    Object.entries(preset.funding).forEach(([key, value]) => { if (elements[key]) elements[key].value = value; });
    scenarioOrder.forEach((scenario) => Object.entries(preset.scenarios[scenario]).forEach(([field, value]) => { scenarioInputs[scenario][field].value = value; }));
    if (preserveIdentity) {
      elements.startupName.value = name || "Mi Startup";
      elements.currency.value = currency || "MXN";
    }
    render();
  }

  function exportState() {
    const funding = collectFundingState();
    const scenarios = {};
    scenarioOrder.forEach((scenario) => {
      scenarios[scenario] = {};
      ["growth", "monetization", "multiple", "probability"].forEach((field) => { scenarios[scenario][field] = numberValue(scenarioInputs[scenario][field]); });
    });
    return {
      startupName: elements.startupName.value, businessModel: elements.businessModel.value, currency: elements.currency.value,
      funding, syncInvestment: elements.syncInvestment.checked, investment: numberValue(elements.investment), baseMetric: numberValue(elements.baseMetric), years: numberValue(elements.years), discountRate: numberValue(elements.discountRate), scenarios
    };
  }

  function restoreState(saved) {
    if (!saved || !presets[saved.businessModel]) throw new Error("Datos no válidos");
    elements.startupName.value = saved.startupName || "Mi Startup";
    elements.businessModel.value = saved.businessModel;
    elements.currency.value = saved.currency || "MXN";
    const f = saved.funding || {};
    const mapping = {
      runwayMonths: f.months, cashAvailable: f.cashAvailable, committedCapital: f.committedCapital, monthlyRevenue: f.monthlyRevenue, monthlyRevenueGrowth: (f.revenueGrowth ?? 0) * 100, contingencyRate: (f.contingencyRate ?? 0) * 100,
      payrollMonthly: f.monthly?.payroll, technologyMonthly: f.monthly?.technology, marketingMonthly: f.monthly?.marketing, adminMonthly: f.monthly?.admin, otherMonthly: f.monthly?.other,
      productInvestment: f.oneTime?.product, hiringInvestment: f.oneTime?.hiring, launchMarketing: f.oneTime?.launch, legalInvestment: f.oneTime?.legal, infrastructureInvestment: f.oneTime?.infrastructure, otherInvestment: f.oneTime?.other
    };
    Object.entries(mapping).forEach(([key, value]) => { if (value !== undefined && elements[key]) elements[key].value = value; });
    (f.milestones || []).slice(0, 3).forEach((milestone, index) => {
      const i = index + 1;
      elements[`milestone${i}`].value = milestone.text || `Hito ${i}`;
      elements[`milestoneMonth${i}`].value = milestone.month || i * 4;
    });
    elements.syncInvestment.checked = saved.syncInvestment !== false;
    elements.investment.value = saved.investment ?? 0;
    elements.baseMetric.value = saved.baseMetric ?? 0;
    elements.years.value = saved.years ?? 5;
    elements.discountRate.value = saved.discountRate ?? 35;
    scenarioOrder.forEach((scenario) => ["growth", "monetization", "multiple", "probability"].forEach((field) => {
      if (saved.scenarios?.[scenario]?.[field] !== undefined) scenarioInputs[scenario][field].value = saved.scenarios[scenario][field];
    }));
    render();
  }

  let toastTimer;
  function showToast(message) {
    elements.toast.textContent = message;
    elements.toast.classList.add("show");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => elements.toast.classList.remove("show"), 2600);
  }

  document.addEventListener("input", (event) => {
    if (event.target.matches("input, select")) render();
  });
  elements.businessModel.addEventListener("change", () => {
    applyPreset(elements.businessModel.value, true);
    showToast("Se cargaron supuestos de referencia para el modelo seleccionado.");
  });
  elements.syncInvestment.addEventListener("change", () => {
    if (!elements.syncInvestment.checked) elements.investment.focus();
    render();
  });
  elements.saveButton.addEventListener("click", () => {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(exportState())); showToast("Simulación guardada en este navegador."); }
    catch { showToast("No fue posible guardar la simulación."); }
  });
  elements.loadButton.addEventListener("click", () => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return showToast("No hay una simulación guardada.");
      restoreState(JSON.parse(raw));
      showToast("Simulación recuperada.");
    } catch { showToast("Los datos guardados no son compatibles."); }
  });
  elements.resetButton.addEventListener("click", () => { applyPreset(elements.businessModel.value, true); showToast("Se restablecieron los valores de ejemplo."); });
  elements.printButton.addEventListener("click", () => window.print());

  if ("serviceWorker" in navigator && window.location.protocol.startsWith("http")) {
    window.addEventListener("load", () => navigator.serviceWorker.register("./sw.js").catch(() => {}));
  }

  window.LicitIACalculator = { calculateFunding, calculateValuation, presets };
  render();
})();
