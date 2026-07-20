<?php

namespace Blockera\Editor\StyleDefinitions;

class TextOrientation extends BaseStyleDefinition {

	/**
	 * Style → writing-mode / text-orientation map (built once per request).
	 *
	 * @var array<string, array<string, string>>|null
	 */
	private static ?array $lookup = null;

	protected function css( array $setting ): array {

		$cssProperty = $setting['type'] ?? '';

		if ( 'text-orientation' !== $cssProperty || ! isset( $setting[ $cssProperty ] ) ) {
			return [];
		}

		if ( null === self::$lookup ) {
			self::$lookup = [
				'style-1' => [
					'writing-mode'     => 'vertical-lr',
					'text-orientation' => 'mixed',
				],
				'style-2' => [
					'writing-mode'     => 'vertical-rl',
					'text-orientation' => 'mixed',
				],
				'style-3' => [
					'writing-mode'     => 'vertical-lr',
					'text-orientation' => 'upright',
				],
				'style-4' => [
					'writing-mode'     => 'vertical-rl',
					'text-orientation' => 'upright',
				],
				'initial' => [
					'writing-mode'     => 'horizontal-tb',
					'text-orientation' => 'mixed',
				],
			];
		}

		$value = $setting[ $cssProperty ];

		if ( isset( self::$lookup[ $value ] ) ) {
			$this->setCss( self::$lookup[ $value ] );
		}

		return $this->css;
	}
}
