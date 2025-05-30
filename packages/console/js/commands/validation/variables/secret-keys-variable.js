/**
 * Internal dependencies
 */
const path = require('path');

let codes = `// @flow

/**
 * External dependencies
 */
import sha256 from 'crypto-js/sha256';

/**
 * Validate secret keys.
 *
 * @param {Array<Object>} possibleArgs - The possible arguments to test.
 *
 * @return {boolean} true on success, false on failure.
 */
export const validateSecretKeys = ({
	domain,
	clientId,
	subscriberId,
	clientSecret,
	subscriptionId,
}: {
	domain: string,
	clientId: string,
	subscriberId: string,
	clientSecret: string,
	subscriptionId: string,
}): Object | false => {
	const parts = subscriberId.split('-');
	const domainHash = parts[1];`;

module.exports = (processor, preparedCodes) => {
	codes += preparedCodes;
	codes += 'return true;}';

	const guardPackageRoot = path.join(__dirname, '../../../../../guard/js');
	const targetFile = path.join(guardPackageRoot, 'validate-secret-keys.js');

	processor.writeFile(targetFile, codes);
};
