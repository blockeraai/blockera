<?php

namespace Blockera\Feature\Icon;

use voku\helper\SimpleHtmlDom;
use Blockera\Icons\IconsManager;
use Blockera\Utils\Adapters\DomParser;
use Blockera\Block\Icon\Block as IconBlock;
use Blockera\Bootstrap\Traits\AssetsLoaderTrait;
use Blockera\Features\Core\Contracts\EditableBlockHTML;

class EditBlockHTML implements EditableBlockHTML {

	use AssetsLoaderTrait;

	/**
	 * Store the id.
	 *
	 * @var string $id the id.
	 */
	protected string $id = 'icon';

    /**
     * Store the blocks configuration.
     *
     * @var array $blocks_config the blocks configuration.
     */
    protected array $blocks_config;

	/**
	 * Store the dom parser.
	 *
	 * @var DomParser $dom the dom parser.
	 */
	protected DomParser $dom;

	/**
	 * Initialize the class.
	 *
	 * @param array $args The arguments.
	 */
    public function __construct( array $args) {
        
		$this->blocks_config = $args;
    }

    /**
     * Manipulating html content of received element.
     *
     * @param string $html The html to manipulate.
     * @param array  $data The data to manipulate.
     *
     * @return string the manipulated html.
     */
    public function htmlManipulate( string $html, array $data): string {
        [
			'app'          => $app,
            'block'        => $block,
        ] = $data;

		if (! $this->isValidBlock($block, $html) && 'core/image' !== $block['blockName'] && 'core/icon' !== $block['blockName']) {
			return $html;
		}

		// Enqueue the feature assets.
		$this->enqueueAssets($data['plugin_base_path'], 'feature');

		if (str_contains($block['attrs']['className'] ?? '', 'blockera-is-icon-block')) {
			return $app->make(IconBlock::class)->render($html, $this, $data);
		}

		if ('core/icon' === $block['blockName']) {
			if (blockera_core_icon_has_renderable_blockera_icon($block)) {
				return $this->replaceCoreIconSvg($html, $block, $data);
			}
		}

        $blockElement = $this->findBlockElement($data);

        if (! $blockElement) {
            return $html;
        }

		// Get the root element from the DOM.
        $rootElement = $this->dom->find('*', 0);

		// Clean up the block element html before appending anything.
        $blockElement->innerhtml = $this->cleanupBlockElementHTML($blockElement->innerhtml);
		// Append icon to the block element if it has inner content.
		$blockElement->innerhtml = $this->appendIcon($html, $blockElement, $block);

		try {
			// Clean up the block element html after appending icon.
			return $this->cleanupBlockElementHTML($rootElement->outerhtml);
		} catch (\Exception $e) {
			// If traversal fails, return the current element's outer HTML.
			return $blockElement->outerhtml;
		}
    }

	/**
	 * Replace core/icon SVG markup with Blockera-rendered icon output.
	 *
	 * @param string $html  The block html.
	 * @param array  $block The block data.
	 * @param array  $data  The manipulation context.
	 *
	 * @return string
	 */
	protected function replaceCoreIconSvg( string $html, array $block, array $data): string {
		$value     = blockera_get_blockera_icon_attr_value($block);
		$ariaLabel = $block['attrs']['ariaLabel'] ?? '';

		$iconArgs = [];

		if (! empty($ariaLabel)) {
			$iconArgs['role']  = 'img';
			$iconArgs['title'] = $ariaLabel;
		}

		$iconHTML = $this->getIconHTML($value, $iconArgs);

		if (empty($iconHTML)) {
			return $html;
		}

		$iconHTML = $this->applyCoreIconPresentationStyles($iconHTML, $block, $ariaLabel);
		$iconHTML = blockera_core_icon_wrap_with_link($iconHTML, $block);

		// Seeded/empty core output: inject via string (dom parser is unreliable on empty wrappers).
		if (! str_contains($html, '<svg')) {
			return $this->injectCoreIconIntoWrapperHtml($html, $iconHTML, $block);
		}

		$dom = $data['dom'] ?? null;

		if (empty($dom) && ! empty($data['app'])) {
			$dom = $data['app']->dom_parser::str_get_html($html);
		}

		if (! $dom) {
			return $this->injectCoreIconIntoWrapperHtml($html, $iconHTML, $block);
		}

		$this->dom = $dom;

		$svgElement  = $this->dom->findOne('.wp-block-icon svg');
		$iconWrapper = $this->dom->findOne('.wp-block-icon');

		if ($svgElement && 'svg' !== strtolower($svgElement->tag ?? '')) {
			$svgElement = null;
		}

		if (! $svgElement && ! $iconWrapper) {
			return $this->injectCoreIconIntoWrapperHtml($html, $iconHTML, $block);
		}

		if ($svgElement && 'svg' === strtolower($svgElement->tag ?? '')) {
			$svgElement->outerhtml = $iconHTML;
		} elseif ($iconWrapper) {
			$iconWrapper->innerhtml = $iconHTML;
		} else {
			return $this->injectCoreIconIntoWrapperHtml($html, $iconHTML, $block);
		}

		try {
			$rootElement = $this->dom->find('*', 0);

			return blockera_core_icon_apply_wrapper_classes(
				$this->cleanupBlockElementHTML($rootElement->outerhtml),
				$block
			);
		} catch (\Exception $e) {
			return blockera_core_icon_apply_wrapper_classes($this->dom->outerhtml, $block);
		}
	}

	/**
	 * Apply size/color/transform and a11y attributes to core/icon SVG markup.
	 *
	 * @param string $iconHTML  SVG markup.
	 * @param array  $block     Block data.
	 * @param string $ariaLabel Core aria label attribute.
	 *
	 * @return string
	 */
	protected function applyCoreIconPresentationStyles( string $iconHTML, array $block, string $ariaLabel): string {
		$properties = [];

		$iconSize = blockera_get_icon_size_attr_value($block);

		if (! empty($iconSize)) {
			$properties['width']  = $iconSize;
			$properties['height'] = $iconSize;
		}

		$iconColor = blockera_get_block_attr_value($block, 'blockeraIconColor');

		if ('' !== $iconColor) {
			$properties['color'] = $iconColor;

			$icon_value = blockera_get_blockera_icon_attr_value($block);
			$library    = $icon_value['library'] ?? '';

			if (! blockera_is_stroke_icon_library($library) && ! blockera_is_stroke_svg_markup($iconHTML)) {
				$properties['fill'] = $iconColor;
			}
		}

		$transform = blockera_build_icon_transform($block);

		if ('' !== $transform) {
			$properties['transform'] = $transform;
		}

		if (! empty($properties)) {
			$cssString = implode(
				'; ',
				array_map(
					static function ( $property, $propertyValue) {
						return $property . ': ' . $propertyValue;
					},
					array_keys($properties),
					$properties
				)
			);

			$iconHTML = str_replace('style="width: 1em; height: 1em;"', '', $iconHTML);
			$iconHTML = $this->updateStyleAttribute($iconHTML, 'svg', $cssString);
		}

		if (empty($ariaLabel)) {
			$iconHTML = preg_replace('/\s*role="img"/i', '', $iconHTML);
			$iconHTML = preg_replace(
				'/<svg/i',
				'<svg aria-hidden="true" focusable="false"',
				$iconHTML,
				1
			);
		}

		return $iconHTML;
	}

	/**
	 * Inject SVG into a core/icon wrapper div without relying on the DOM parser.
	 *
	 * @param string $html     Original block HTML.
	 * @param string $iconHTML SVG markup to inject.
	 * @param array  $block    The block data.
	 *
	 * @return string
	 */
	protected function injectCoreIconIntoWrapperHtml( string $html, string $iconHTML, array $block): string {
		if (preg_match('/(<div\b[^>]*\bwp-block-icon\b[^>]*>)\s*<\/div>/i', $html, $matches)) {
			$html = $matches[1] . $iconHTML . '</div>';
		} elseif (preg_match('/(<div\b[^>]*>)\s*<\/div>/i', $html, $matches)) {
			$html = $matches[1] . $iconHTML . '</div>';
		} else {
			$html = sprintf(
				'<div class="%s">%s</div>',
				esc_attr(implode(' ', blockera_core_icon_get_wrapper_class_names($block))),
				$iconHTML
			);
		}

		return blockera_core_icon_apply_wrapper_classes($html, $block);
	}

	protected function isValidBlock( array $block, string $html): bool {

		if (empty($block['blockName'])) {
			return false;
		}

		$blockType = \WP_Block_Type_Registry::get_instance()->get_registered($block['blockName']);

		if (! $blockType) {
			return false;
		}

		if (empty($blockType->supports['blockFeatures']['icon'])) {
			return false;
		}

		$iconSupport = $blockType->supports['blockFeatures']['icon'];

		if (! empty($iconSupport['status']) && ! empty($iconSupport['htmlEditable']['status'])) {
			return true;
		}

		return false;
	}

    /**
     * Find the block element in the html.
     *
     * @param array $data The data to find the block element.
     * @return SimpleHtmlDom|null The block element or null if not found.
     */
    protected function findBlockElement( array $data): ?SimpleHtmlDom {

        if (empty($data['dom'])) {
            return null;
        }

        [
            'dom'          => $dom,
			'htmlEditable' => $htmlEditable,
        ] = $data;

		$this->dom = $dom;

		if (empty($htmlEditable['selector'])) {
			return null;
		}

        $blockElement = $this->dom->findOne($htmlEditable['selector']);

        if (empty($blockElement) || empty($blockElement->innerhtml)) {
            return null;
        }

        return $blockElement;
    }

    /**
     * Clean up the block element html.
     *
     * @param string $html The html to clean up.
     *
     * @return string The cleaned up html.
     */
    protected function cleanupBlockElementHTML( string $html): string {

        if (false === strpos($html, 'wrapper-link')) {
            $html = preg_replace(
                [
                    '#\bdefault:svg\b#',
                    '#\bdefault:path\b#',
                    '#\bxmlns:default\b#',
                ],
                [
                    'svg',
                    'path',
                    'xmlns',
                ],
                $html
            );
        }

        return $html;
    }

    /**
     * Append the icon to the block element.
     *
     * @param string         $html The original html.
     * @param \SimpleHtmlDom $blockElement The block element.
     * @param array          $block The block data.
     *
     * @return string The html with the icon appended.
     */
    protected function appendIcon( string $html, SimpleHtmlDom $blockElement, array $block): string {
        if (empty($block['attrs']['blockeraIcon']['value'])) {
            return $blockElement->innerhtml;
        }

        $value    = $block['attrs']['blockeraIcon']['value'];
        $iconHTML = $this->getIconHTML($value);

        if (empty($iconHTML)) {
            return $blockElement->innerhtml;
        }

        $iconPosition = $block['attrs']['blockeraIconPosition']['value'] ?? 'start';
		$properties   = [];

		// Handle icon size.
		$iconSizeValue        = blockera_get_icon_size_attr_value($block);
		$properties['width']  = ! empty($iconSizeValue) ? $iconSizeValue : '1.33em';
		$properties['height'] = ! empty($iconSizeValue) ? $iconSizeValue : '1.33em';

        // Handle icon position and gap.
		$properties[ 'start' === $iconPosition ? 'margin-right' : 'margin-left' ] = $block['attrs']['blockeraIconGap']['value'] ?? '0.5em';

		// Handle icon rotate.
		$rotate = $block['attrs']['blockeraIconRotate']['value'] ?? '';
		if (! empty($rotate)) {
			$properties['--blockera--icon--rotate'] = $rotate . 'deg';
		}

		// Handle icon flip horizontal.
		$flipHorizontal = $block['attrs']['blockeraIconFlipHorizontal']['value'] ?? '';
		if (! empty($flipHorizontal)) {
			$properties['--blockera--icon--flip-horizontal'] = $flipHorizontal ? '-1' : '1';
		}

		// Handle icon flip vertical.
		$flipVertical = $block['attrs']['blockeraIconFlipVertical']['value'] ?? '';
		if (! empty($flipVertical)) {
			$properties['--blockera--icon--flip-vertical'] = $flipVertical ? '-1' : '1';
		}

        // Convert properties array to CSS string.
        $cssString = implode(
            '; ',
            array_map(
                function( $value, $property) {
                    return $property . ': ' . $value;
                },
                $properties,
                array_keys($properties)
            )
        );
        
		// update style attribute.
		$iconHTML = str_replace('style="width: 1em; height: 1em;"', '', $iconHTML);
        $iconHTML = $this->updateStyleAttribute($iconHTML, 'svg', $cssString);

        // Handle icon link.
        if (! empty($block['attrs']['blockeraIconLink']['value'])) {

            [
                'link'       => $link,
                'target'     => $target,
                'nofollow'   => $isNofollow,
                'label'      => $label,
                'attributes' => $attributes,
            ] = $block['attrs']['blockeraIconLink']['value'];

            if ($link) {

                $iconHTML = sprintf(
                    '<a href="%1$s" rel="%3$s" aria-label="%4$s" target="%5$s">%2$s</a>',
                    $link,
                    $iconHTML,
                    $isNofollow ? 'nofollow' : 'alternate',
                    $label,
                    $target ? '_blank' : '_self'
                );

                foreach ($attributes as $attribute) {

                    if (empty($attribute['value']) || ( empty($attribute['__key']) && empty($attribute['key']) )) {

                        continue;
                    }

                    $iconHTML = str_replace(
                        '<a',
                        sprintf(
                            '<a %s="%s"',
                            $attribute['__key'],
                            $attribute['value']
                        ),
                        $iconHTML
                    );
                }
            }
        }

		$combinedContent = '';
		$originalContent = $blockElement->innerHTML();

		if (empty($iconPosition) || 'start' === $iconPosition) {
			$combinedContent = sprintf(
				'%s%s',
				$iconHTML,
				$originalContent
			);
		} elseif ('end' === $iconPosition) {
			$combinedContent = sprintf(
				'%s%s',
				$originalContent,
				$iconHTML
			);
		}

		// Parse the combined HTML fragment to ensure it's valid.
		$parsed = $this->dom::str_get_html($combinedContent);

		if ($parsed) {
			$blockElement->innerhtml = $parsed->innerHtml();
		}

		return $blockElement->innerHTML();
    }

    /**
     * Get the icon html.
     *
     * @param array $value The icon value.
     *
     * @return string The icon html.
     */
	/**
	 * Decode blockeraIcon.renderedIcon (matches editor btoa(unescape(encodeURIComponent(svg)))).
	 *
	 * @param mixed $encoded Encoded icon payload.
	 *
	 * @return string
	 */
	protected function decodeRenderedIconInput( $encoded): string {
		if (! is_string($encoded)) {
			return '';
		}

		$encoded = trim($encoded);

		if ('' === $encoded) {
			return '';
		}

		if (str_starts_with($encoded, '<')) {
			return $encoded;
		}

		$binary = base64_decode($encoded, true);

		if (false === $binary || '' === $binary) {
			$binary = base64_decode($encoded);
		}

		if (false === $binary || '' === $binary) {
			return '';
		}

		if (function_exists('mb_convert_encoding')) {
			$utf8 = mb_convert_encoding($binary, 'UTF-8', 'ISO-8859-1');

			if (is_string($utf8) && '' !== $utf8) {
				return $utf8;
			}
		}

		return $binary;
	}

    public function getIconHTML( array $value, array $args = [
		'title' => '',
		'role' => '',
	]): string {
		$icon         = isset($value['icon']) ? (string) $value['icon'] : '';
		$library      = isset($value['library']) ? (string) $value['library'] : '';
		$renderedIcon = $value['renderedIcon'] ?? '';

		$title = isset($args['title']) ? (string) $args['title'] : '';
		$role  = isset($args['role']) ? (string) $args['role'] : '';

		$iconHTML = '';

		if (! empty($renderedIcon)) {
			$iconHTML = $this->decodeRenderedIconInput($renderedIcon);

			// Fix serialized xmlns quirks from the block editor (e.g. xmlns:default).
			if ('' !== $iconHTML && 1 === preg_match('/\w"\w/', $iconHTML, $matches)) {
				$replacement = str_replace('"', '" ', $matches[0]);
				$iconHTML    = str_replace($matches[0], $replacement, $iconHTML);
			}

			$iconHTML = blockera_normalize_stroke_icon_svg($iconHTML, $library);
		}

		if ('' === $iconHTML && '' !== $icon && '' !== $library) {
			$iconData = IconsManager::getIcon($icon, $library);
			$iconHTML = is_array($iconData) ? (string) ( $iconData['icon'] ?? '' ) : '';
		}

        if (empty($iconHTML)) {
            return '';
        }

        // Add role="img" to SVG tag for accessibility (only if not already present).
		if (! empty($role)) {
        	$iconHTML = preg_replace('/<svg((?![^>]*role="img")[^>]*?)>/i', '<svg$1 role="' . $role . '">', $iconHTML);
		}

        // Add title to SVG tag for accessibility (only if not already present).
		if (! empty($title)) {
        	$iconHTML = preg_replace('/<svg((?![^>]*title=)[^>]*?)>/i', '<svg$1 title="' . $title . '">', $iconHTML);
		}

        return preg_replace(
            [
                '#<(\w+)([^>]*?)\s*\/>#i',
                '#xmlns="http://www.w3.org/2000/svg"#',
            ],
            [
                '<$1$2></$1>',
                '',
            ],
            $iconHTML
        );
    }

    /**
     * Append or update style attribute in an HTML tag.
     *
     * @param string $html The HTML content.
     * @param string $tag The tag to modify (e.g., 'svg', 'a').
     * @param string $newStyle The new style to add.
     *
     * @return string The HTML with updated style attribute.
     */
    protected function updateStyleAttribute( string $html, string $tag, string $newStyle): string {
        // Pattern to match the opening tag with or without existing style attribute.
        $pattern = sprintf('/<%s([^>]*?)>/i', preg_quote($tag, '/'));
        
        return preg_replace_callback(
            $pattern,
            function( $matches) use ( $newStyle, $tag) {
				$attributes = $matches[1];
            
				// Check if style attribute already exists.
				if (preg_match('/\bstyle\s*=\s*["\']([^"\']*)["\']/i', $attributes, $styleMatch)) {
					// Style attribute exists, append new style to existing one.
					$existingStyle = $styleMatch[1];
					$updatedStyle  = rtrim($existingStyle, '; ') . '; ' . $newStyle;
                
					// Replace the existing style attribute.
					return preg_replace(
                        '/\bstyle\s*=\s*["\'][^"\']*["\']/i',
                        sprintf('style="%s"', $updatedStyle),
                        $matches[0]
					);
				} else {
					// No style attribute exists, add new one.
					return sprintf('<%s%s style="%s">', $tag, $attributes, $newStyle);
				}
			},
            $html
        );
    }
}
