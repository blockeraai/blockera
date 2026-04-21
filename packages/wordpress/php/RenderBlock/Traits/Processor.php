<?php

namespace Blockera\WordPress\RenderBlock\Traits;

trait Processor {

	/**
	 * Slots for DOM order (pre_render_block order matches block HTML / tree order).
	 * render_block runs in post-order; we pair each render with the next matching slot here.
	 *
	 * @var array<int, array<string, mixed>>
	 */
	protected static array $block_dom_order_slots = [];

	/**
	 * Store the generated css with DOM order for stable output sorting.
	 *
	 * @var array<int, array{order: int, css: string}>
	 */
	protected static array $generated_css = [];

	/**
	 * Binary fingerprints of CSS strings already stored (md5, 16 bytes). Avoids O(n) scans on every block render.
	 *
	 * @var array<string, true>
	 */
	protected static array $generated_css_fingerprints = [];

	/**
	 * Per-render computed CSS fragments before imploding for global_css_props_classes checks.
	 *
	 * @var array<int, string>
	 */
	protected array $styles = [];

	/**
	 * Reset the generated css.
	 *
	 * @return void
	 */
	public static function resetGeneratedCSS(): void {
		static::$generated_css              = [];
		static::$block_dom_order_slots      = [];
		static::$generated_css_fingerprints = [];
	}

	/**
	 * Register a supported block when WordPress is about to render it (pre_render_block).
	 * Order follows block HTML structure (pre-order), unlike render_block (post-order).
	 *
	 * @param array $parsed_block The parsed block array.
	 *
	 * @return void
	 */
	public static function registerBlockDomOrderSlot( array $parsed_block): void {

		if (! blockera_is_supported_block($parsed_block)) {
			return;
		}

		$props_id = $parsed_block['attrs']['blockeraPropsId'] ?? '';
		if ('' === $props_id) {
			return;
		}

		static::$block_dom_order_slots[] = [
			'propsId'  => $props_id,
			'order'    => count(static::$block_dom_order_slots),
			'consumed' => false,
		];
	}

	/**
	 * Resolve DOM order for the block currently being rendered (render_block).
	 *
	 * @return int Order index, or PHP_INT_MAX when no slot matches.
	 */
	protected function consumeDomOrderForCurrentBlock(): int {

		// Pair with registerBlockDomOrderSlot() from pre_render_block (document order).
		// render_block fires post-order; we consume the next unconsumed slot for this props id.
		$props_id = $this->block['attrs']['blockeraPropsId'] ?? '';
		if ('' === $props_id) {
			return PHP_INT_MAX;
		}

		foreach (static::$block_dom_order_slots as $i => $slot) {
			if ( ! empty( $slot['consumed'] ) ) {
				continue;
			}
			if ( $slot['propsId'] === $props_id ) {
				static::$block_dom_order_slots[ $i ]['consumed'] = true;

				return $slot['order'];
			}
		}

		return PHP_INT_MAX;
	}

	/**
	 * Whether the same CSS payload was already stored.
	 *
	 * @param string $css The css string.
	 *
	 * @return bool
	 */
	protected function hasGeneratedCssContent( string $css): bool {

		$key = md5( $css, true );

		return isset( static::$generated_css_fingerprints[ $key ] );
	}

	/**
	 * Update the generated css.
	 *
	 * @param string $css The css to update.
	 * @param int    $order DOM order (lower = earlier in document). Defaults to last.
	 *
	 * @return void
	 */
	public function updateGeneratedCSS( string $css, int $order = PHP_INT_MAX): void {

		$fingerprint                                        = md5( $css, true );
		static::$generated_css_fingerprints[ $fingerprint ] = true;

		self::$generated_css[] = [
			'order' => $order,
			'css'   => $css,
		];
	}

	/**
	 * Get the generated css sorted by block DOM order.
	 *
	 * @return array The generated css strings.
	 */
	public function getGeneratedCSS(): array {

		// Called when printing inline CSS (typically once per head/footer); sort cost is negligible vs. output size.
		$items = static::$generated_css;
		usort(
			$items,
			static function ( array $a, array $b ): int {
				return $a['order'] <=> $b['order'];
			}
		);

		return array_column( $items, 'css' );
	}

	/**
	 * Get the styles.
	 *
	 * @return string the styles string.
	 */
	public function getStyles(): string {
		return implode(PHP_EOL, array_unique($this->styles));
	}
}
