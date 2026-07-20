<?php

namespace Blockera\Editor\StyleDefinitions;

class Display extends BaseStyleDefinition {

	/**
	 * Use important always (in v2 style engine).
	 *
	 * @return boolean
	 */
	protected function isImportant(): bool {
		return true;
	}

	protected function css( array $setting ): array {
		if ( ! isset( $setting['type'], $setting['display'] ) ) {
			return [];
		}

		$cssProperty = $setting['type'];

		if ( '' === $cssProperty || '' === $setting['display'] ) {
			return [];
		}

		$this->declarations[ $cssProperty ] = $setting['display'];
		$this->setCss( $this->declarations );

		// Extra deep compatibility for columns block: removes margin-block-start from inner items.
		if ( 'core/columns' === ( $this->block['blockName'] ?? '' ) ) {
			$this->setCss( [ 'margin-block-start' => '0' ], 'margin-block-start', ' > *' );
		}

		return $this->css;
	}
}
