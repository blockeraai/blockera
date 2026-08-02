/**
 * Wrap a pattern string in a WordPress i18n + escaping PHP call.
 *
 * @param {string} text Raw text (or already-localized PHP).
 * @param {string} textDomain Text domain.
 * @param {boolean} [isAttr=false] Use esc_attr_e when true, else esc_html_e.
 * @return {string} Original text or PHP echo wrapper.
 */
function escapeText(text, textDomain, isAttr = false) {
	const trimmedText = text && text.trim();

	if (!textDomain || !trimmedText || trimmedText.startsWith('<?php')) {
		return text;
	}

	const escFunction = isAttr ? 'esc_attr_e' : 'esc_html_e';
	const spaceChar = text.startsWith(' ') ? '&nbsp;' : '';
	const resultText = text.replace(/'/g, "\\'").trim();

	return `${spaceChar}<?php ${escFunction}( '${resultText}', '${textDomain}' ); ?>`;
}

module.exports = { escapeText };
