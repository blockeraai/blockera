<?php

namespace Blockera\Block\Icon;

use Blockera\Bootstrap\Application;
use Blockera\Blocks\Core\BlockInterface;
use Blockera\Feature\Icon\EditBlockHTML;
use Blockera\Features\Core\Contracts\EditableBlockHTML;

class Block implements BlockInterface {

	/**
	 * Store the application instance.
	 *
	 * @var Application $app the application container.
	 */
	protected Application $app;

	/**
	 * Store the block arguments.
	 *
	 * @var array $args the block arguments.
	 */
	protected array $args;

	/**
	 * Store the fallback value.
	 *
	 * @TODO: @ali please add a fallback for rendered icon if it's not set or deleted by user.
	 * @var array $fallback_value the fallback value.
	 */
	protected array $fallback_value = [
		'icon' => '',
		'library' => '',
		'renderedIcon' => '',
	];

	/**
	 * Initialize the block.
	 *
	 * @param Application $app the application container.
	 * @param array       $args the block arguments.
	 *
	 * @return void
	 */
	public function __construct( Application $app, array $args = []) {
		$this->app  = $app;
		$this->args = $args;
	}

	/**
	 * Render the block.
	 *
	 * @param string            $html the html of the block.
	 * @param EditableBlockHTML $feature the feature to render.
	 * @param array             $args the block data.
	 *
	 * @return string the rendered html.
	 */
	public function render( string $html, EditableBlockHTML $feature, array $args = []): string {

		if (! empty($html)) {
			return $html;
		}

		if (! $feature instanceof EditBlockHTML) {
			return $html;
		}

		$block = $args['block'] ?? [];

		if (empty($block) || ! str_contains($block['innerHTML'] ?? '', 'blockera-is-icon-block')) {
			return $html;
		}

		$dom = $this->app->dom_parser::str_get_html($block['innerHTML']);

		if (! $dom) {
			return $html;
		}

		foreach ($dom->find('img') as $img) {
			$img->outertext = '';
		}

		$value = $block['attrs']['blockeraIcon']['value'] ?? $this->fallback_value;

		$figure = $dom->findOne('figure');
		
		if ($figure) {
			$figure->innerhtml .= $feature->getIconHTML($value);
		}

		return $dom->outerhtml;
	}
}
