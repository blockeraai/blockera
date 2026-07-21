<?php

namespace Blockera\Editor\StyleDefinitions;

use Blockera\Editor\StyleDefinitions\Traits\WithDisplayValueTrait;

/**
 * CSS grid template columns mirroring core block-editor grid layout getLayoutStyle().
 * Registered for blockeraGridMinimumColumnWidth and blockeraGridColumnCount; reads both from block attrs.
 */
class GridLayout extends BaseStyleDefinition {

	use WithDisplayValueTrait;

	/**
	 * Use important always (in v2 style engine).
	 */
	protected function isImportant(): bool {
		return true;
	}

	/**
	 * @param array $setting Setting envelope from BaseStyleDefinition (ignored; we read block attrs).
	 * @return array
	 */
	protected function css( array $setting): array {
		if ( 'grid' !== $this->getDisplayValue() ) {
			return [];
		}

		$minimum_column_width = $this->get_grid_minimum_column_width();
		$column_count         = $this->get_grid_column_count();
		$horizontal_gap       = $this->get_horizontal_gap_for_grid();

		$declarations = [];

		if ( '' !== $minimum_column_width && $column_count > 0 ) {
			$block_gap_to_use                      = $this->ensure_gap_unit( $horizontal_gap );
			$max_value                             = sprintf(
				'max(min( %1$s, 100%%), ( 100%% - (%2$s*%3$d) ) / %4$d )',
				$minimum_column_width,
				$block_gap_to_use,
				$column_count - 1,
				$column_count
			);
			$declarations['grid-template-columns'] = sprintf(
				'repeat(auto-fill, minmax(%s, 1fr))',
				$max_value
			);
			$declarations['container-type']        = 'inline-size';
		} elseif ( $column_count > 0 ) {
			$declarations['grid-template-columns'] = sprintf(
				'repeat(%d, minmax(0, 1fr))',
				$column_count
			);
		} else {
			$min_or_default                        = '' !== $minimum_column_width ? $minimum_column_width : '12rem';
			$declarations['grid-template-columns'] = sprintf(
				'repeat(auto-fill, minmax(min(%s, 100%%), 1fr))',
				$min_or_default
			);
			$declarations['container-type']        = 'inline-size';
		}

		$this->setCss( $declarations );

		return $this->css;
	}

	/**
	 * Root attrs plus current breakpoint overrides from block states.
	 * prepareBreakpointStyles() passes a partial bag into prepareStateStyles(); grid values
	 * often exist only on the breakpoint slice — merge here so we match editor/front parity
	 * without mutating StyleEngine’s block snapshot.
	 *
	 * @return array<string, mixed>
	 */
	private function get_layout_effective_attrs(): array {
		$root   = $this->block['attrs'] ?? [];
		$states = $root['blockeraBlockStates']['value'] ?? null;
		if ( empty( $states ) || ! is_array( $states ) ) {
			return $root;
		}
		$bp_only = $this->getCurrentBreakpointSettings( false );
		if ( ! is_array( $bp_only ) || [] === $bp_only ) {
			return $root;
		}

		return array_merge( $root, $bp_only );
	}

	private function get_grid_minimum_column_width(): string {
		$attrs = $this->get_layout_effective_attrs();
		$a     = $attrs['blockeraGridMinimumColumnWidth'] ?? null;
		if ( is_string( $a ) ) {
			return trim( $a );
		}
		if ( is_array( $a ) && isset( $a['value'] ) && is_string( $a['value'] ) ) {
			return trim( $a['value'] );
		}

		return '';
	}

	private function get_grid_column_count(): int {
		$attrs = $this->get_layout_effective_attrs();
		$a     = $attrs['blockeraGridColumnCount'] ?? null;
		if ( is_numeric( $a ) ) {
			return max( 0, (int) $a );
		}
		if ( is_array( $a ) && array_key_exists( 'value', $a ) ) {
			$v = $a['value'];
			if ( is_numeric( $v ) ) {
				return max( 0, (int) $v );
			}
		}

		return 0;
	}

	private function get_horizontal_gap_for_grid(): string {
		$fallback = '1.2rem';
		$attrs    = $this->get_layout_effective_attrs();
		$gap_attr = $attrs['blockeraGap'] ?? null;
		if ( ! is_array( $gap_attr ) ) {
			return $fallback;
		}

		$gap = $gap_attr['value'] ?? $gap_attr;
		if ( ! is_array( $gap ) ) {
			return $fallback;
		}

		$raw = '';
		if ( ! empty( $gap['lock'] ) ) {
			if ( isset( $gap['gap'] ) && '' !== $gap['gap'] ) {
				$resolved = blockera_get_value_addon_real_value( $gap['gap'] );
				$raw      = is_string( $resolved ) ? $resolved : '';
			}
		} else {
			if ( isset( $gap['columns'] ) && '' !== $gap['columns'] ) {
				$resolved = blockera_get_value_addon_real_value( $gap['columns'] );
				$raw      = is_string( $resolved ) ? $resolved : '';
			} elseif ( isset( $gap['gap'] ) && '' !== $gap['gap'] ) {
				$resolved = blockera_get_value_addon_real_value( $gap['gap'] );
				$raw      = is_string( $resolved ) ? $resolved : '';
			}
		}

		$normalized = $this->normalize_gap_horizontal( $raw );

		return '' !== $normalized ? $normalized : $fallback;
	}

	private function normalize_gap_horizontal( string $css ): string {
		$css = trim( $css );
		if ( '' === $css ) {
			return '';
		}
		// Core getLayoutStyle() multiplies the full gap token: ( 100% - (gap * (n-1)) ) / n.
		// Theme / preset gaps are often var(--wp--preset--..., clamp(30px, 5vw, 50px)) with spaces
		// inside parens; splitting on whitespace would take "clamp(30px," as the horizontal gap and
		// produce invalid CSS like ( clamp(30px, * 2 ). Only split axial "row col" when there are
		// no function calls (matches simple pairs like "1em 2em").
		if ( str_contains( $css, '(' ) ) {
			return $css;
		}
		$parts = preg_split( '/\s+/', $css );
		if ( is_array( $parts ) && count( $parts ) > 1 ) {
			return $parts[1];
		}

		return $parts[0] ?? $css;
	}

	/**
	 * @param string|int|float $g Gap token.
	 * @return string
	 */
	private function ensure_gap_unit( $g ): string {
		if ( '0' === $g || 0 === $g ) {
			return '0px';
		}

		return (string) $g;
	}
}
