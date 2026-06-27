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

	/**
	 * Encode SVG markup for blockeraIcon.renderedIcon storage (JS btoa(unescape(encodeURIComponent(svg)))).
	 *
	 * @param string $svg SVG markup.
	 *
	 * @return string Base64-encoded SVG markup, or empty string when input is empty.
	 */
	public static function encode( string $svg): string {
		$svg = trim($svg);

		if ('' === $svg) {
			return '';
		}

		if (function_exists('mb_convert_encoding')) {
			$binary = mb_convert_encoding($svg, 'ISO-8859-1', 'UTF-8');

			if (is_string($binary) && '' !== $binary) {
				return base64_encode($binary);
			}
		}

		return base64_encode($svg);
	}
}
