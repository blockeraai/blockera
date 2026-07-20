<?php

namespace Blockera\Editor\StyleDefinitions;

use Blockera\Editor\StyleDefinitions\Contracts\StandardDefinition;

class Content extends BaseStyleDefinition implements StandardDefinition {

	/**
	 * Cached supports.
	 *
	 * @var array|null
	 */
	private ?array $cached_supports = null;

	public function getCssProperty(): string {
		return 'content';
	}

	protected function css( array $setting ): array {
		if ( ! isset( $setting['type'] ) || 'content' !== $setting['type'] || ! isset( $setting['content'] ) || '' === $setting['content'] ) {
			return [];
		}

		if ( ! $this->validate( $setting ) ) {
			return [];
		}

		$value = blockera_get_value_addon_real_value( $setting['content'] );

		if ( '' === $value ) {
			$this->declarations['content'] = $value;
			$this->setCss( $this->declarations );

			return $this->css;
		}

		// Unresolved value-addon payloads can be non-strings; skip CSS-func sanitization.
		if ( ! is_string( $value ) ) {
			$this->declarations['content'] = $value;
			$this->setCss( $this->declarations );

			return $this->css;
		}

		if ( false !== strpos( $value, 'attr(' ) || false !== strpos( $value, 'counter(' ) || false !== strpos( $value, 'counters(' ) || false !== strpos( $value, 'url(' ) ) {
			if ( preg_match( '/^[\'"]?(attr|counter|counters|url)\((?:[^()]+|\([^()]*\))*\)[\'"]?$/', $value ) ) {
				$len = strlen( $value );
				if ( $len > 1 ) {
					$first = $value[0];
					if ( ( '"' === $first || "'" === $first ) && $value[ $len - 1 ] === $first ) {
						$value = substr( $value, 1, -1 );
					}
				}
			} else {
				$value = preg_replace_callback(
					'/(attr|counter|counters|url)\((?:[^()]+|\([^()]*\))*\)/',
					static function ( array $m ): string {
						return '"' === $m[0][0] ? $m[0] : '"' . $m[0] . '"';
					},
					$value
				);
			}
		}

		$this->declarations['content'] = $value;
		$this->setCss( $this->declarations );

		return $this->css;
	}

	protected function validate( array $setting ): bool {
		if ( null === $this->cached_supports ) {
			$this->cached_supports = $this->getSupports( false );
		}

		$existing_state = in_array( $this->pseudo_state, $this->cached_supports['blockeraContentPseudoElement']['hasDefaultValueInStates'], true );

		if ( isset( $setting['content'] ) && '' !== $setting['content'] ) {
			return '""' === $setting['content'] ? $existing_state : true;
		}

		return $existing_state;
	}
}
