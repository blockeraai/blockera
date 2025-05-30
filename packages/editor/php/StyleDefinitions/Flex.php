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
				$this->setDeclaration(
                    'flex',
                    sprintf(
                        '%s %s %s',
                        $setting['custom']['blockeraFlexChildGrow'] ? blockera_get_value_addon_real_value($setting['custom']['blockeraFlexChildGrow']) : 0,
                        $setting['custom']['blockeraFlexChildShrink'] ? blockera_get_value_addon_real_value($setting['custom']['blockeraFlexChildShrink']) : 0,
                        $setting['custom']['blockeraFlexChildBasis'] ? blockera_get_value_addon_real_value($setting['custom']['blockeraFlexChildBasis']) : 'auto'
                    )
                );
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

        if (isset($settings['value']) && 'custom' === $settings['value'] && 'flex' === $cssProperty) {

            $setting = [
                [
                    'isVisible'  => true,
                    'type'       => $cssProperty,
                    $cssProperty => $settings['value'] ?? 'custom',
                    'custom'     => [
                        'blockeraFlexChildGrow'   => $settings['value']['blockeraFlexChildGrow'] ?? 0,
                        'blockeraFlexChildShrink' => $settings['value']['blockeraFlexChildShrink'] ?? 0,
                        'blockeraFlexChildBasis'  => $settings['value']['blockeraFlexChildBasis'] ?? 'auto',
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
