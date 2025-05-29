/**
 * External dependencies
 */
const fs = require('fs');

/**
 * Internal dependencies
 */
const secretKeysProcessor = require('./processors/secret-keys-processor');
const appendSecretKeysValidation = require('./variables/secret-keys-variable');

/**
 * Processor class.
 */
class Processor {
	rules = [
		{
			name: 'subscriberId',
			validationType: 'secret-key',
			conditions: [
				'required',
				'string',
				'count(32)',
				'hyphens(4)',
				'exists:domain;subscription',
				'version:1',
				'algo:sha256',
			],
		},
		{
			name: 'clientId',
			validationType: 'secret-key',
			conditions: ['required', 'string', 'uuid'],
		},
		{
			name: 'clientSecret',
			validationType: 'secret-key',
			conditions: ['required', 'string', 'password', 'count(32)'],
		},
		{
			name: 'subscription-name',
			validationType: 'naming-subscription',
			conditions: [
				'required',
				'string',
				'starts-with:#subscription-id',
				'exists:domain',
			],
		},
		{
			name: 'subscription-expiry-date',
			validationType: 'expiry-date',
			conditions: ['required', 'date', 'after:now'],
		},
		{
			name: 'subscription-start-date',
			validationType: 'start-date',
			conditions: ['required', 'date', 'before:now'],
		},
		{
			name: 'subscription-status',
			validationType: 'status',
			conditions: ['required', 'string', 'active'],
		},
	];

	constructor(currentFile) {
		this.currentFile = currentFile;
	}

	applyRandomRefactor() {
		if (!this.currentFile) {
			throw new Error('No file specified for processing');
		}

		if (!this.rules.length) {
			throw new Error('No rules found');
		}

		let secretKeysCodes = '';
		const shuffledRules = this.rules.sort(() => Math.random() - 0.5);

		shuffledRules.forEach(({ name, validationType, conditions }) => {
			const shuffledConditions = conditions.sort(
				() => Math.random() - 0.5
			);

			switch (validationType) {
				case 'secret-key':
					secretKeysCodes += secretKeysProcessor(
						name,
						shuffledConditions
					);

					break;

				case 'subscription-name':
					break;

				case 'subscription-next-payment-due-date':
					break;

				case 'subscription-start-date':
					break;

				case 'subscription-status':
					break;

				default:
					break;
			}
		});

		appendSecretKeysValidation(this, secretKeysCodes);

		return this;
	}

	readFile(filePath) {
		return fs.readFileSync(filePath, 'utf8');
	}

	writeFile(filePath, content) {
		fs.writeFileSync(filePath, content);
	}
}

module.exports = Processor;
