<?php

namespace Blockera\Editor\StyleDefinitions;

class Flex extends BaseStyleDefinition {

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
}
