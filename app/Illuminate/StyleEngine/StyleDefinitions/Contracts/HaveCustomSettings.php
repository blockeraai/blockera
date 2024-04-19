<?php

namespace Publisher\Framework\Illuminate\StyleEngine\StyleDefinitions\Contracts;

interface HaveCustomSettings {

	/**
	 * Retrieve css props.
	 *
	 * @param array $settings The settings block.
	 * @param string $settingName The key for setting value.
	 * @param string $cssProperty The related css property name.
	 *
	 * @return array the css properties as array.
	 */
	public function getCustomSettings( array $settings, string $settingName, string $cssProperty): array;

}
