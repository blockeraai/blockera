<?php

namespace Blockera\Editor\StyleDefinitions;

class Order extends BaseStyleDefinition {

	protected function css( array $setting): array {

        $declaration = [];
        $cssProperty = $setting['type'];

        if (empty($cssProperty) || empty($setting[ $cssProperty ]) || 'flex' !== $cssProperty) {

            return $declaration;
		}		
		
		$orderType = $setting['order'];

		switch ($orderType) {
			case 'first':
				$this->setDeclaration('order', '-1');
				break;

			case 'last':
				$this->setDeclaration('order', '100');
				break;

			case 'custom':
				$this->setDeclaration('order', $setting['custom'] ? blockera_get_value_addon_real_value($setting['custom']) : '100');
				break;
		}

		$this->setCss($this->declarations);

        return $this->css;
    }
}
