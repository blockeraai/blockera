<?php

namespace Blockera\Editor\StyleDefinitions;

class TextOrientation extends BaseStyleDefinition {

	protected function css( array $setting): array {

		if (! isset($setting['type'])) {
			return [];
		}

		$cssProperty = $setting['type'];

		if ('text-orientation' !== $cssProperty || ! isset($setting[ $cssProperty ])) {
			return [];
		}

		static $lookup = [
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

		$value = $setting[ $cssProperty ];

		if (isset($lookup[ $value ])) {
			$this->setCss($lookup[ $value ]);
		}

		return $this->css;
	}
}
