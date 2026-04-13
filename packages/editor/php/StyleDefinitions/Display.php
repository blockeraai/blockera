<?php

namespace Blockera\Editor\StyleDefinitions;

class Display extends BaseStyleDefinition {

	/**
	 * Use important always (in v2 style engine).
	 *
	 * @return boolean
	 */
	protected function isImportant(): bool {
		return true;
	}

	protected function css( array $setting): array {
		if (! isset($setting['type'])) {
			return [];
		}

		$cssProperty = $setting['type'];

		if ('' === $cssProperty || ! isset($setting[ $cssProperty ]) || '' === $setting[ $cssProperty ]) {
			return [];
		}

		$this->declarations[ $cssProperty ] = $setting[ $cssProperty ];
		$this->setCss($this->declarations);

		// Extra deep compatibility for columns block: removes margin-block-start from inner items.
		// Removes margin-block-start from inner items.
		$blockName = $this->block['blockName'];
		if ('core/columns' === $blockName) {
			$this->setCss([ 'margin-block-start' => '0' ], 'margin-block-start', ' > *');
		}

		return $this->css;
	}
}
