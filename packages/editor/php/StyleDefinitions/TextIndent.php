<?php

namespace Blockera\Editor\StyleDefinitions;

use Blockera\Editor\StyleDefinitions\Traits\SimpleDefinitionTrait;

class TextIndent extends BaseStyleDefinition {

    use SimpleDefinitionTrait;

    public function getCssProperty(): string {

        return 'text-indent';
    }
}
