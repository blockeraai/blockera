<?php

namespace Blockera\Blocks\Core;

use Blockera\Features\Core\Contracts\EditableBlockHTML;

interface BlockInterface {

	/**
	 * Render the block.
	 *
	 * @param string            $html The html of the block.
	 * @param EditableBlockHTML $feature The feature to render.
	 * @param array             $args The block data.
	 * 
	 * @return string the rendered html.
	 */
	public function render( string $html, EditableBlockHTML $feature, array $args = []): string;
}
