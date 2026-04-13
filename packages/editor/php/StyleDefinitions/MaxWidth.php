<?php

namespace Blockera\Editor\StyleDefinitions;

use Blockera\Editor\StyleDefinitions\Traits\WidthDefinitionTrait;

class MaxWidth extends BaseStyleDefinition {

	use WidthDefinitionTrait;

	/**
     * Check is important style property value?
     *
     * @return bool true on success, false when otherwise.
     */
    protected function isImportant(): bool {

        return true;
    }

	public function getCssProperty(): string {

		return 'max-width';
	}
}
