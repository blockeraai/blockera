<?php

namespace Blockera\Editor\StyleDefinitions;

use Blockera\Editor\StyleDefinitions\Contracts\Repeater;

class Transition extends BaseStyleDefinition implements Repeater {

	private const TIMINGS = [
		'linear'            => 'linear',
		'ease'              => 'ease',
		'ease-in'           => 'ease-in',
		'ease-out'          => 'ease-out',
		'ease-in-out'       => 'ease-in-out',
		'ease-in-quad'      => 'cubic-bezier(0.55, 0.085, 0.68, 0.53)',
		'ease-in-cubic'     => 'cubic-bezier(0.550, 0.055, 0.675, 0.190)',
		'ease-in-quart'     => 'cubic-bezier(0.895, 0.030, 0.685, 0.220)',
		'ease-in-quint'     => 'cubic-bezier(0.755, 0.050, 0.855, 0.060)',
		'ease-in-sine'      => 'cubic-bezier(0.470, 0.000, 0.745, 0.715)',
		'ease-in-expo'      => 'cubic-bezier(0.950, 0.050, 0.795, 0.035)',
		'ease-in-circ'      => 'cubic-bezier(0.600, 0.040, 0.980, 0.335)',
		'ease-in-back'      => 'cubic-bezier(0.600, -0.280, 0.735, 0.045)',
		'ease-out-quad'     => 'cubic-bezier(0.250, 0.460, 0.450, 0.940)',
		'ease-out-cubic'    => 'cubic-bezier(0.215, 0.610, 0.355, 1.000)',
		'ease-out-quart'    => 'cubic-bezier(0.230, 1.000, 0.320, 1.000)',
		'ease-out-quint'    => 'cubic-bezier(0.230, 1.000, 0.320, 1.000)',
		'ease-out-sine'     => 'cubic-bezier(0.390, 0.575, 0.565, 1.000)',
		'ease-out-expo'     => 'cubic-bezier(0.190, 1.000, 0.220, 1.000)',
		'ease-out-circ'     => 'cubic-bezier(0.075, 0.820, 0.165, 1.000)',
		'ease-out-back'     => 'cubic-bezier(0.175, 0.885, 0.320, 1.275)',
		'ease-in-out-quad'  => 'cubic-bezier(0.455, 0.030, 0.515, 0.955)',
		'ease-in-out-cubic' => 'cubic-bezier(0.645, 0.045, 0.355, 1.000)',
		'ease-in-out-quart' => 'cubic-bezier(0.770, 0.000, 0.175, 1.000)',
		'ease-in-out-quint' => 'cubic-bezier(0.860, 0.000, 0.070, 1.000)',
		'ease-in-out-sine'  => 'cubic-bezier(0.445, 0.050, 0.550, 0.950)',
		'ease-in-out-expo'  => 'cubic-bezier(1.000, 0.000, 0.000, 1.000)',
		'ease-in-out-circ'  => 'cubic-bezier(0.785, 0.135, 0.150, 0.860)',
		'ease-in-out-back'  => 'cubic-bezier(0.680, -0.550, 0.265, 1.550)',
	];

	protected function css( array $setting): array {

		if ( ! isset( $setting['type'] ) || '' === $setting['type'] ) {
			return [];
		}

		$cssProperty = $setting['type'];

		if ( 'transition' !== $cssProperty || ! isset( $setting[ $cssProperty ] ) || '' === $setting[ $cssProperty ] ) {
			return [];
		}

		// Reference: variable payloads may replace `settings.value` with plain CSS inside get_sorted_repeater_rows_from_value().
		$value             = &$setting[ $cssProperty ];
		$declaration_only  = ! empty( $setting['_blockeraDeclarationOnly'] );
		$preset_mode       = ! empty( $setting['_blockeraGlobalPreset'] );
		$resolved_from_var = null;
		$self              = $this;
		// Variable + declaration/items: one shot via value-addon; otherwise sorted repeater rows (preset vs block rules in callback / loops below).
		$sortedTransitions = static::get_sorted_repeater_rows_from_value(
			$value,
			static function ( array $sorted ) use ( $preset_mode, $self ): string {
				$parts = array();
				foreach ( $sorted as $row ) {
					if ( ! is_array( $row ) ) {
						continue;
					}
					if ( $preset_mode ) {
						if ( ! ( $row['isVisible'] ?? true ) ) {
							continue;
						}
						$chunk = self::transition_row_to_css_value( $row, true );
					} else {
						if ( ! $self->isValidSetting( $row ) ) {
							continue;
						}
						$chunk = self::transition_row_to_css_value( $row, false );
					}
					if ( '' !== $chunk ) {
						$parts[] = $chunk;
					}
				}

				return implode( ', ', array_filter( $parts, 'strlen' ) );
			},
			$resolved_from_var
		);

		if ( null !== $resolved_from_var && '' !== $resolved_from_var ) {
			$this->setDeclaration( 'transition', $resolved_from_var );
		} elseif ( $preset_mode ) {
			foreach ( $sortedTransitions as $transition ) {
				if ( ! is_array( $transition ) || ! ( $transition['isVisible'] ?? true ) ) {
					continue;
				}
				$chunk = self::transition_row_to_css_value( $transition, true );
				if ( '' === $chunk ) {
					continue;
				}
				if ( isset( $this->declarations['transition'] ) && '' !== $this->declarations['transition'] ) {
					$this->setDeclaration( 'transition', $this->declarations['transition'] . ', ' . $chunk );
				} else {
					$this->setDeclaration( 'transition', $chunk );
				}
			}
		} else {
			foreach ( $sortedTransitions as $transition ) {
				if ( ! is_array( $transition ) ) {
					continue;
				}
				if ( $this->isValidSetting( $transition ) ) {
					$this->setTransition( $transition );
				}
			}
		}

		if ( ! isset( $this->declarations['transition'] ) || '' === $this->declarations['transition'] ) {
			return [];
		}

		if ( $declaration_only ) {
			return [];
		}

		$this->setCss( $this->declarations );

		return $this->css;
	}

	/**
	 * One repeater row → single transition list entry (e.g. `opacity 0.2s ease 0s`).
	 *
	 * @param array $row Repeater row.
	 * @param bool  $default_type_all When true, missing/empty `type` becomes `all` (presets); when false, empty type yields ''.
	 */
	protected static function transition_row_to_css_value( array $row, bool $default_type_all = false ): string {
		$type = $row['type'] ?? '';
		if ( ! is_string( $type ) || '' === $type ) {
			if ( ! $default_type_all ) {
				return '';
			}
			$type = 'all';
		}

		$timing_key = isset( $row['timing'] ) && is_string( $row['timing'] ) ? $row['timing'] : 'ease';
		$timing     = self::TIMINGS[ $timing_key ] ?? 'ease';

		return $type . ' '
			. blockera_get_value_addon_real_value( $row['duration'] ?? '' ) . ' '
			. $timing . ' '
			. blockera_get_value_addon_real_value( $row['delay'] ?? '' );
	}

	/**
	 * Check if the setting is valid.
	 *
	 * @param array $setting The setting.
	 *
	 * @return bool true if the setting is valid, false otherwise.
	 */
	public function isValidSetting( array $setting): bool {

		if ( ! isset( $setting['type'] ) || '' === $setting['type'] ) {
			return false;
		}

		return isset( $setting['isVisible'] ) && $setting['isVisible'];
	}

	/**
	 * Setup transition style properties into stack properties.
	 *
	 * @param array $setting the transition setting.
	 *
	 * @return void
	 */
	protected function setTransition( array $setting): void {

		$transition = self::transition_row_to_css_value( $setting, false );
		if ( '' === $transition ) {
			return;
		}

		if ( isset( $this->declarations['transition'] ) && '' !== $this->declarations['transition'] ) {
			$this->setDeclaration( 'transition', $this->declarations['transition'] . ', ' . $transition );
		} else {
			$this->setDeclaration( 'transition', $transition );
		}
	}
}
