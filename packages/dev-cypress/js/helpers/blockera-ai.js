/**
 * Authorize Cypress against blockera.ai reCAPTCHA bypass.
 *
 * Requires the blockera-bypass-recaptcha plugin on blockera.ai and
 * BLOCKERA_BYPASS_RECAPTCHA_SECRET configured in wp-config.php.
 */
export const authorizeBlockeraAIRecaptchaBypass = (
	blockeraAIUrl = Cypress.env('blockeraAIUrl') || 'https://blockera.ai'
) => {
	const secret = Cypress.env('blockeraBypassRecaptchaSecret');

	if (!secret) {
		cy.log(
			'blockeraBypassRecaptchaSecret is not set; skipping reCAPTCHA bypass authorization.'
		);
		return cy.wrap(null);
	}

	return cy.request({
		method: 'POST',
		url: `${blockeraAIUrl.replace(
			/\/$/,
			''
		)}/wp-json/blockera-bypass-recaptcha/v1/session`,
		headers: {
			'X-Blockera-Bypass-Recaptcha': secret,
		},
		failOnStatusCode: true,
	});
};

/**
 * Visit a blockera.ai page after authorizing reCAPTCHA bypass.
 *
 * @param {string} path Path on blockera.ai.
 */
export const visitBlockeraAI = (
	path = '/',
	blockeraAIUrl = Cypress.env('blockeraAIUrl') || 'https://blockera.ai'
) => {
	authorizeBlockeraAIRecaptchaBypass(blockeraAIUrl);

	return cy.visit(`${blockeraAIUrl.replace(/\/$/, '')}${path}`);
};
