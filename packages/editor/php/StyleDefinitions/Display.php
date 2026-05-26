<?php

namespace Blockera\Editor\StyleDefinitions;

class Display extends BaseStyleDefinition {

    protected function css( array $setting): array {

		$declaration = [];
        $cssProperty = $setting['type'];

        if (empty($cssProperty) || empty($setting[ $cssProperty ])) {

            return $declaration;
        }

		$this->setDeclaration($cssProperty, $setting[ $cssProperty ]);

		$this->setCss($this->declarations);

		// Extra deep compatibility for columns block.
		// Removes margin-block-start from inner items.
		if ( 'core/columns' === $this->block['blockName'] ) {
			$this->setCss(
				[
					'margin-block-start' => '0',
				],
				'margin-block-start',
				' > *'
			);
		}

        return $this->css;
    }
}
