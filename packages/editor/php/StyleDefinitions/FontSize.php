<?php

namespace Blockera\Editor\StyleDefinitions;

use Blockera\Editor\StyleDefinitions\Contracts\StandardDefinition;
use Blockera\Editor\StyleDefinitions\Traits\SimpleDefinitionTrait;

class FontSize extends BaseStyleDefinition implements StandardDefinition {

    use SimpleDefinitionTrait;

	/**
	 * Use important always (in v2 style engine).
	 *
	 * @return boolean
	 */
	protected function isImportant(): bool {
		return true;
	}

    public function getCssProperty(): string {

        return 'font-size';
    }
}
