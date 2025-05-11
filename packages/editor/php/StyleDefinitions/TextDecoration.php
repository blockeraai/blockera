<?php

namespace Blockera\Editor\StyleDefinitions;

use Blockera\Editor\StyleDefinitions\Traits\SimpleDefinitionTrait;

class TextDecoration extends BaseStyleDefinition {

    use SimpleDefinitionTrait;

    public function getCssProperty(): string {

        return 'text-decoration';
    }
}
