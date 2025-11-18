<?php

namespace Blockera\Editor\StyleDefinitions;

use Blockera\Editor\StyleDefinitions\Traits\SimpleDefinitionTrait;
use Blockera\Editor\StyleDefinitions\Contracts\StandardDefinition;

class Content extends BaseStyleDefinition implements StandardDefinition {

    use SimpleDefinitionTrait;

    public function getCssProperty(): string {

        return 'content';
    }

    /**
     * Validate the setting before generating css.
	 * 
	 * @param array $setting The setting to validate.
     *
     * @return boolean true on success, false on failure.
     */
    protected function validate( array $setting): bool {

		$allowed_inners = $this->getSupports(false)['blockeraContentPseudoElement']['allowedInners'];
		$allowed        = in_array($this->block_type, $allowed_inners, true);

		if (! empty($setting['content'])) {

			// If the content is equals to double quotes, it means that the content is empty.
			if ( '""' === $setting['content']) {

				return $allowed;
			}

			return $allowed;
		}

        return $allowed;
    }
}
