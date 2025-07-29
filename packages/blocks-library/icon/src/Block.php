<?php

namespace Blockera\Block\Icon;

use Blockera\Bootstrap\Application;
use Blockera\Blocks\Core\BlockInterface;
use Blockera\Feature\Icon\EditBlockHTML;
use Blockera\Bootstrap\Traits\AssetsLoaderTrait;
use Blockera\Features\Core\Contracts\EditableBlockHTML;

class Block implements BlockInterface {

	use AssetsLoaderTrait;

	/**
	 * Store the block id.
	 *
	 * @var string $id the block id.
	 */
	protected string $id = 'icon';

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

		$this->setContext('block');
		$this->enqueueAssets(
			$this->args['plugin_base_path'],
			$this->args['plugin_base_url'],
			$this->args['plugin_version']
		);

		foreach ($dom->find('img') as $img) {
			$img->outertext = '';
		}

		$value = $block['attrs']['blockeraIcon']['value'] ?? $this->fallback_value;

		$figure = $dom->findOne('figure');
		
		if ($figure) {
			$figure->innerhtml .= sprintf(
				'<span title="%1$s" role="img" class="wp-block-image__icon">%2$s</span>', 
				sprintf( 
					// translators: %s is the icon name.
					__('%s Icon', 'blockera'), 
					str_replace('-', ' ', $value['icon'] ?? '') 
				), 
				$feature->getIconHTML($value)
			);

			$svg = $dom->findOne('svg');

			if ($svg) {
				$size  = $block['attrs']['blockeraIconSize']['value'] ?? '1.33em';
				$color = $block['attrs']['blockeraIconColor']['value'] ?? 'currentColor';

				$style = 'width:' . $size . ';height:' . $size . ';fill:' . $color . ';color:' . $color . ';';

				$transform = '';

				// Handle icon rotate.
				$rotate = $block['attrs']['blockeraIconRotate']['value'] ?? '';
				if (! empty($rotate)) {
					$transform .= 'rotate(' . $rotate . 'deg) ';
				}

				// Handle icon flip horizontal.
				$flipHorizontal = $block['attrs']['blockeraIconFlipHorizontal']['value'] ?? '';
				if (! empty($flipHorizontal)) {
					$transform .= 'scaleX(' . ( $flipHorizontal ? '-1' : '1' ) . ') ';
				}

				// Handle icon flip vertical.
				$flipVertical = $block['attrs']['blockeraIconFlipVertical']['value'] ?? '';
				if (! empty($flipVertical)) {
					$transform .= 'scaleY(' . ( $flipVertical ? '-1' : '1' ) . ') ';
				}

				if (! empty($transform)) {
					$style .= 'transform:' . $transform . ';';
				}

				$svg->style = $style;
			}
		}

		return $dom->outerhtml;
	}
}
