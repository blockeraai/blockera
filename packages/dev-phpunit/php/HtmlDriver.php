<?php

namespace Blockera\Dev\PhpUnit;

use PHPUnit\Framework\Assert;
use Spatie\Snapshots\Drivers\TextDriver;

class HtmlDriver extends TextDriver {

	public function extension(): string {
		return 'html';
	}

	public function serialize( $data ): string {
		return $this->normalizeHtml( parent::serialize( $data ) );
	}

	public function match( $expected, $actual ): void {
		Assert::assertEquals(
			$this->normalizeHtml( (string) $expected ),
			$this->serialize( $actual )
		);
	}

	/**
	 * Stabilize HTML across DomParser/libxml platform differences (CI vs local).
	 *
	 * @param string $html HTML markup.
	 *
	 * @return string
	 */
	private function normalizeHtml( string $html ): string {
		// libxml may lowercase SVG presentation attributes when re-serializing via DomParser.
		$html = preg_replace( '/\bviewbox=/i', 'viewBox=', $html ) ?? $html;

		// DomParser may emit different inter-tag whitespace across libxml builds.
		$html = preg_replace( '/>\s+</', '><', $html ) ?? $html;

		return $html;
	}
}
