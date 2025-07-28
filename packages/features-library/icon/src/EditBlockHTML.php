<?php

namespace Blockera\Feature\Icon;

use voku\helper\SimpleHtmlDom;
use Blockera\Icons\IconsManager;
use Blockera\Utils\Adapters\DomParser;
use Blockera\Block\Icon\Block as IconBlock;
use Blockera\Setup\Traits\AssetsLoaderTrait;
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
		
		$this->setContext('feature');
		$this->enqueueAssets($data['plugin_base_path'], $data['plugin_base_url'], $data['plugin_version']);

        $blockElement = $this->findBlockElement($data);

        if (! $blockElement) {
            return $app->make(IconBlock::class)->render($html, $this, $data);
        }

        $original_html           = $blockElement->outerhtml;
        $blockElement->innerhtml = $this->cleanupBlockElementHTML($blockElement->innerhtml);
        $blockElement->innerhtml = $this->appendIcon($html, $blockElement, $block);

        return str_replace($original_html, $blockElement->outerhtml, $html);
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

        $gap          = $block['attrs']['blockeraIconGap']['value'] ?? '0';
        $iconPosition = $block['attrs']['blockeraIconPosition']['value'] ?? 'left';

        if (! empty($iconPosition)) {

            $iconHTML = str_replace(
                '<svg',
                'left' === $iconPosition ?
                            sprintf('<svg style="margin-right: %s;"', $gap) :
                            sprintf('<svg style="margin-left: %s;"', $gap),
                $iconHTML
            );
        }

        // Handle icon color.
        
		$iconHTML = str_replace(
            empty($iconPosition) ? '<svg' : '<svg style="',
            sprintf(
                '<svg style="fill: %s; color: %s;',
                $block['attrs']['blockeraIconColor']['value'] ?? 'currentColor',
                $block['attrs']['blockeraIconColor']['value'] ?? 'inherit'
            ),
            $iconHTML
        );

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

		if (empty($iconPosition) || 'left' === $iconPosition) {
			$combinedContent = sprintf(
				'%s%s',
				$iconHTML,
				$originalContent
			);
		} elseif ('right' === $iconPosition) {
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
    public function getIconHTML( array $value): string {
        [
            'icon'    => $icon,
            'library' => $library,
            'renderedIcon' => $renderedIcon,
        ] = $value;

        if (! empty($renderedIcon) && 'wp' === $library) {
            $renderedIcon = base64_decode($renderedIcon);

            preg_match('/\w"\w/', $renderedIcon, $matches);

            if (! empty($matches)) {
                $replacement  = str_replace('"', '" ', $matches[0]);
                $renderedIcon = str_replace($matches[0], $replacement, $renderedIcon);
            }

            $iconHTML = $renderedIcon;
        } else {
            $iconData = IconsManager::getIcon($icon, $library);
            $iconHTML = $iconData['icon'] ?? '';
        }

        if (empty($iconHTML)) {
            return '';
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
}
