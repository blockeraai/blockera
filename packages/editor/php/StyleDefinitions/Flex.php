<?php

namespace Blockera\Editor\StyleDefinitions;

use Blockera\Editor\StyleDefinitions\Contracts\CustomStyle;

class Flex extends BaseStyleDefinition implements CustomStyle {

	protected function css( array $setting): array {

        $declaration = [];
        $cssProperty = $setting['type'];

        if (empty($cssProperty) || empty($setting[ $cssProperty ]) || 'flex' !== $cssProperty) {

            return $declaration;
		}

		$flexType = $setting[ $cssProperty ];

		switch ($flexType) {
			case 'shrink':
				$this->setDeclaration('flex', '0 1 auto');
				break;

			case 'grow':
				$this->setDeclaration('flex', '1 1 0%');
				break;

			case 'no':
				$this->setDeclaration('flex', '0 0 auto');
				break;

			case 'custom':
				$grow_input = $setting['custom']['blockeraFlexChildGrow'];
				$grow       = ( is_string($grow_input) && strlen($grow_input) > 0 ) || $grow_input ? blockera_get_value_addon_real_value($setting['custom']['blockeraFlexChildGrow']) : '';
				if ( ( is_string($grow) && strlen($grow) > 0 ) || $grow ) {
					$this->setDeclaration('flex-grow', $grow);
				}

				$shrink_input = $setting['custom']['blockeraFlexChildShrink'];
				$shrink       = ( is_string($shrink_input) && strlen($shrink_input) > 0 ) || $shrink_input ? blockera_get_value_addon_real_value($setting['custom']['blockeraFlexChildShrink']) : '';
				if ( ( is_string($shrink) && strlen($shrink) > 0 ) || $shrink ) {
					$this->setDeclaration('flex-shrink', $shrink);
				}

				$basis = $setting['custom']['blockeraFlexChildBasis'] ? blockera_get_value_addon_real_value($setting['custom']['blockeraFlexChildBasis']) : '';
				if ( $basis ) {
					// Use !important only for flex-basis because WP have some styles for flex-basis with !important.
					$this->setDeclaration('flex-basis', $basis . ' !important');
				}
				break;
		}

		$this->setCss($this->declarations);

        return $this->css;
    }

	/**
     * @inheritDoc
     *
     * @param array  $settings
     * @param string $settingName
     * @param string $cssProperty
     *
     * @return array
     */
    public function getCustomSettings( array $settings, string $settingName, string $cssProperty): array {

		$settings                  = blockera_get_sanitize_block_attributes($settings);
		$currentBreakpointSettings = $this->getCurrentBreakpointSettings();

        if (isset($settings['value']) && 'custom' === $settings['value'] && 'flex' === $cssProperty) {

            $setting = [
                [
                    'isVisible'  => true,
                    'type'       => $cssProperty,
                    $cssProperty => $settings['value'] ?? 'custom',
                    'custom'     => [
                        'blockeraFlexChildGrow'   => $currentBreakpointSettings['blockeraFlexChildGrow']['value'] ?? $currentBreakpointSettings['blockeraFlexChildGrow'] ?? '',
                        'blockeraFlexChildShrink' => $currentBreakpointSettings['blockeraFlexChildShrink']['value'] ?? $currentBreakpointSettings['blockeraFlexChildShrink'] ?? '',
                        'blockeraFlexChildBasis'  => $currentBreakpointSettings['blockeraFlexChildBasis']['value'] ?? $currentBreakpointSettings['blockeraFlexChildBasis'] ?? '',
                    ],
                ],
            ];

        } else {

            $setting = [
                [
                    'isVisible'  => true,
                    'type'       => $cssProperty,
                    $cssProperty => $settings['value'] ?? [],
                ],
            ];
        }

        return $setting;
    }
}
