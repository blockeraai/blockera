/**
 * External dependencies
 */
const path = require('path');

/**
 * Internal dependencies
 */
const countPatterns = require('../patterns/count-patterns');
const hyphensPatterns = require('../patterns/hyphens-patterns');
const isStringPatterns = require('../patterns/is-string-patterns');
const secretKeysPatterns = require('../patterns/secret-keys-patterns');
const subscriberIdPatterns = require('../patterns/subscriber-id-patterns');

/**
 * The secret keys processor.
 *
 * @param {string} name The name of the variable.
 * @param {Array<string>} conditions The conditions to apply.
 * @returns {string} The processed content.
 */
const processSecretKeys = (name, conditions) => {
	let processedCode = '';

	if ('subscriberId' === name) {
		processedCode +=
			subscriberIdPatterns[
				Math.floor(Math.random() * subscriberIdPatterns.length)
			];
	}

	conditions.forEach((condition) => {
		let count = condition?.match(/count\(\d+\)/gi);

		if (count?.length > 0) {
			count = count[0].replace(/count|\(\)/g, '');
			processedCode += countPatterns[
				Math.floor(Math.random() * countPatterns.length)
			]
				.replace('{{COUNT}}', count)
				.replace('{{NAME}}', name);
		}

		if (condition?.match(/exists:domain;subscription/gi)) {
			processedCode +=
				secretKeysPatterns[
					Math.floor(Math.random() * secretKeysPatterns.length)
				];
		}

		if ('string' === condition) {
			processedCode += isStringPatterns[
				Math.floor(Math.random() * isStringPatterns.length)
			].replace('{{NAME}}', name);
		}

		let hyphens = condition?.match(/hyphens\(\d+\)/gi);

		if (hyphens?.length > 0) {
			hyphens = hyphens[0].replace(/hyphens\(|\)/gi, '');
			processedCode += hyphensPatterns[
				Math.floor(Math.random() * hyphensPatterns.length)
			].replace('{{COUNT}}', Number(hyphens) + 1);
		}

		let version = condition?.match(/version:\d+/gi);

		if (version?.length > 0) {
			version = version[0].replace(/version:/g, '');
			processedCode += `if(${version} !== parts[0]){return false;}`;
		}

		if ('algo:sha256' === condition) {
			processedCode += `if (!domain || !subscriptionId) {return false;}const data = domain + '_' + subscriptionId;const testHash = sha256(data).toString().substring(0, 10);if (testHash !== domainHash) {return false;}`;
		}

		if ('required' === condition) {
			processedCode += `if(!${name}){return false;}`;
		}

		if ('uuid' === condition) {
			processedCode += `const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;if(!uuidRegex.test(${name})){return false;}`;
		}

		if ('password' === condition) {
			processedCode += `const hasUpperCase = /[A-Z]/.test(${name});const hasLowerCase = /[a-z]/.test(${name});const hasNumbers = /[0-9]/.test(${name});const hasSpecialChars = /[!@#$%^&*(),.?":{}|<>]/.test(${name});if(!hasUpperCase || !hasLowerCase || !hasNumbers || hasSpecialChars){return false;}`;
		}
	});

	if (!processedCode) {
		throw new Error('No processed code found');
	}

	return processedCode;
};

module.exports = processSecretKeys;
