<?php

namespace Blockera\Editor\StyleDefinitions;

use Blockera\Editor\StyleDefinitions\Traits\SimpleDefinitionTrait;

class AlignSelf extends BaseStyleDefinition {

	use SimpleDefinitionTrait;

    public function getCssProperty(): string {

        return 'align-self';
    }
}
