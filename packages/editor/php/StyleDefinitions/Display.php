<?php

namespace Blockera\Editor\StyleDefinitions;

use Blockera\Editor\StyleDefinitions\Contracts\StandardDefinition;
use Blockera\Editor\StyleDefinitions\Traits\SimpleDefinitionTrait;

class Display extends BaseStyleDefinition implements StandardDefinition {

    use SimpleDefinitionTrait;

    public function getCssProperty(): string {

        return 'display';
    }

	/**
	 * Validate the Display style generation process.
	 *
	 * @param array $setting
	 * @return boolean true on success, false on otherwise!
	 */
	protected function validate( array $setting): bool {
		
		return  isset($setting['display']) && 'default' !== $setting['display'];
	}
}
