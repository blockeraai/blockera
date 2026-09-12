/**
 * Which editor performance scenarios run for a subject, CI scope, and baseline.
 *
 * `requiresBlockera` — skip Core subject / PR vs Core job; gate on PR vs Master.
 * `compareAgainstMaster` — also run (and gate) on PR vs Master even when the
 * scenario is Core-comparable (no `requiresBlockera`).
 */

/**
 * @param {{requiresBlockera?: boolean}|undefined} scenario
 * @return {boolean} True when the scenario cannot run with the plugin off.
 */
function scenarioRequiresBlockera(scenario) {
	return Boolean(scenario?.requiresBlockera);
}

/**
 * @param {{compareAgainstMaster?: boolean}|undefined} scenario
 * @return {boolean} True when the scenario also gates on PR vs Master.
 */
function scenarioCompareAgainstMaster(scenario) {
	return Boolean(scenario?.compareAgainstMaster);
}

/**
 * @param {Object} options
 * @param {{requiresBlockera?: boolean, compareAgainstMaster?: boolean}|undefined} options.scenario
 * @param {string} options.scenarioId
 * @param {string} options.subject
 * @param {string} options.scenarioScope
 * @return {{skip: boolean, reason: string}} Skip decision for the active subject/scope.
 */
function shouldSkipScenario({ scenario, scenarioId, subject, scenarioScope }) {
	const requiresBlockera = scenarioRequiresBlockera(scenario);

	if (subject === 'core' && requiresBlockera) {
		return {
			skip: true,
			reason: `${scenarioId} requires Blockera (PERF_SUBJECT=blockera)`,
		};
	}

	if (scenarioScope === 'core-comparable' && requiresBlockera) {
		return {
			skip: true,
			reason: `${scenarioId} skipped (PERF_SCENARIO_SCOPE=core-comparable)`,
		};
	}

	if (
		scenarioScope === 'blockera-only' &&
		!requiresBlockera &&
		!scenarioCompareAgainstMaster(scenario)
	) {
		return {
			skip: true,
			reason: `${scenarioId} skipped (PERF_SCENARIO_SCOPE=blockera-only)`,
		};
	}

	return { skip: false, reason: '' };
}

/**
 * @param {{requiresBlockera?: boolean, compareAgainstMaster?: boolean}} scenario
 * @param {string} mode
 * @return {boolean} True when the scenario belongs in this baseline report.
 */
function scenarioMatchesBaseline(scenario, mode) {
	if (mode === 'master') {
		return (
			scenarioRequiresBlockera(scenario) ||
			scenarioCompareAgainstMaster(scenario)
		);
	}

	return !scenarioRequiresBlockera(scenario);
}

/**
 * @param {{thresholdPercent?: number, thresholdPercentMaster?: number}} scenario
 * @param {string} mode
 * @param {number} defaultThreshold
 * @return {number} Percent threshold for the active baseline.
 */
function scenarioThresholdPercent(scenario, mode, defaultThreshold) {
	if (
		mode === 'master' &&
		typeof scenario.thresholdPercentMaster === 'number'
	) {
		return scenario.thresholdPercentMaster;
	}

	if (typeof scenario.thresholdPercent === 'number') {
		return scenario.thresholdPercent;
	}

	return defaultThreshold;
}

module.exports = {
	scenarioCompareAgainstMaster,
	scenarioMatchesBaseline,
	scenarioRequiresBlockera,
	scenarioThresholdPercent,
	shouldSkipScenario,
};
