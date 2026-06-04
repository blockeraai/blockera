<?php

namespace Blockera\Feature\Icon;

/**
 * Encode/decode blockeraIcon.renderedIcon (matches editor btoa(unescape(encodeURIComponent(svg)))).
 */
final class RenderedIconCodec {

	/**
	 * Decode base64-rendered SVG markup from block attributes.
	 *
	 * @param string $encoded Base64-encoded SVG markup.
	 *
	 * @return string Decoded SVG markup, or empty string on failure.
	 */
	public static function decode( string $encoded): string {
		$encoded = trim($encoded);

		if ('' === $encoded) {
			return '';
		}

		// Legacy/plain saves that stored raw SVG in renderedIcon.
		if (str_starts_with($encoded, '<')) {
			return $encoded;
		}

		$binary = base64_decode($encoded, true);

		if (false === $binary || '' === $binary) {
			$binary = base64_decode($encoded);
		}

		if (false === $binary || '' === $binary) {
			return '';
		}

		// Reverse JS: decodeURIComponent(escape(atob(encoded))).
		if (function_exists('mb_convert_encoding')) {
			$utf8 = mb_convert_encoding($binary, 'UTF-8', 'ISO-8859-1');

			if (is_string($utf8) && '' !== $utf8) {
				return $utf8;
			}
		}

		return $binary;
	}
}
