<?php

namespace Blockera\Features\Modules\Icon;

use voku\helper\SimpleHtmlDom;
use Blockera\Icons\IconsManager;
use Blockera\Features\Traits\Singleton;
use Blockera\Features\Contracts\FeatureInterface;

class Icon implements FeatureInterface {

    use Singleton;

	/**
	 * Store the configuration.
	 *
	 * @var array $config The configuration.
	 */
	protected array $config;

    public function register(): void {
		$config_file = __DIR__ . '/icon.schema.json';

		if (! file_exists($config_file)) {
			return;
		}

		$this->config = json_decode(file_get_contents($config_file), true);
    }

    public function boot(): void {
        // TODO: boot the icon feature functionalities.
    }

    public function isEnabled(): bool {
        return true;
    }

    /**
     * Manipulating html content of received element.
     *
     * @param array $data The data to manipulate.
     *
     * @return string the manipulated html.
     */
    public function htmlManipulate( array $data): string {
        [
			'html'         => $html,
            'block'        => $block,
        ] = $data;

		$blockElement = $this->findBlockElement($data);

		if (! $blockElement) {
			return $html;
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
	protected function findBlockElement( array $data): SimpleHtmlDom {
		[
			'dom'          => $dom,
			'html'         => $html,
            'block'        => $block,
			'unique_class_name' => $unique_class_name,
		] = $data;

		$selector = $this->config['blocks'][ $block['blockName'] ]['selector'] ?? '{{ BLOCK_SELECTOR }}';
		$selector = str_replace('{{ BLOCK_SELECTOR }}', $unique_class_name, $selector);

		$blockElement = $dom->findOne($selector);

		if (empty($blockElement) || empty($blockElement->innerhtml)) {
			return $html;
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
		$iconPosition = $block['attrs']['blockeraIconPosition']['value'] ?? 'right';
		
		if (! empty($iconPosition)) {
			
			$iconHTML = str_replace(
				'<svg',
				'left' === $iconPosition ?
							sprintf('<svg style="margin-right: %s;"', $gap) :
							sprintf('<svg style="margin-left: %s;"', $gap),
				$iconHTML
			);
		}

		$iconHTML = $block['attrs']['blockeraIconColor']['value'] ?
			str_replace(
				empty($iconPosition) ? '<svg' : '<svg style="',
				sprintf('<svg style="fill: %s;', $block['attrs']['blockeraIconColor']['value']),
				$iconHTML
			) :
			$iconHTML;

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

		// When icon position was not set default append left side.
		if (empty($iconPosition) || 'left' === $iconPosition) {

			$blockElement->innerhtml = sprintf(
				'%s%s',
				$iconHTML,
				$blockElement->innerhtml
			);
		} elseif ('right' === $iconPosition) {

			$blockElement->innerhtml = sprintf(
				'%s%s',
				$blockElement->innerhtml,
				$this->cleanupBlockElementHTML($iconHTML)
			);
		}

		return $blockElement->innerhtml;
	}

	/**
	 * Get the icon html.
	 *
	 * @param array $value The icon value.
	 * 
	 * @return string The icon html.
	 */
	protected function getIconHTML( array $value): string {
		[
			'icon'    => $icon,
			'library' => $library,
			'renderedIcon' => $renderedIcon,
		] = $value;

		if (! empty($renderedIcon) && 'wp' === $library) {
			$iconHTML = $renderedIcon;
		} else {
			$iconData = IconsManager::getIcon($icon, $library);
			$iconHTML = $iconData['icon'] ?? '';
		}

		if (empty($iconHTML)) {
			return '';
		}
		
		return $iconHTML;
	}
}
