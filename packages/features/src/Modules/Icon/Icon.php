<?php

namespace Blockera\Features\Modules\Icon;

use Blockera\Icons\IconManager;
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
		$config_file = dirname(__DIR__, 2) . '/js/icon/allowed-blocks.json';

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
			'dom'          => $dom,
			'html'         => $html,
            'block'        => $block,
			'unique_class_name' => $unique_class_name,
        ] = $data;

		$selector = $this->config['config'][ $block['blockName'] ]['selector'] ?? '{{ BLOCK_SELECTOR }}';
		$selector = str_replace('{{ BLOCK_SELECTOR }}', $unique_class_name, $selector);

		$blockElement = $dom->findOne($selector);

		if (empty($blockElement)) {
			return $html;
		}

		$original_html = $blockElement->outerhtml;

        if (false === strpos($blockElement->innerhtml, 'wrapper-link')) {
            $blockElement->innerhtml = preg_replace(
                [
					'#<div\sclass="wrapper-link".*?>.*?</div>#si',
					'#\bdefault:svg\b#',
					'#\bdefault:path\b#',
				],
                [
					'',
					'svg',
					'path',
				],
                $blockElement->innerhtml
            );
        }

        if (! empty($block['attrs']['blockeraIcon']['value'])) {
            $value = $block['attrs']['blockeraIcon']['value'];

            [
				'icon'    => $icon,
                'library' => $library,
				'renderedIcon' => $renderedIcon,
            ] = $value;

			if (! empty($renderedIcon)) {
				$iconHTML = $renderedIcon;
			} else {
				$iconHTML = IconManager::getIcon($icon, $library)['icon'];
			}

			$gap = $block['attrs']['blockeraIconGap']['value'] ?? '0';

            $iconHTML = str_replace(
                '<span',
                sprintf('<span style="margin-left: %s; margin-right: %s;"', $gap, $gap),
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

			// If icon already exists in the block element html, return.
			if (strpos($blockElement->innerhtml, $iconHTML) !== false) {
                return $html;
            }

			$iconPosition = $block['attrs']['blockeraIconPosition']['value'] ?? 'right';

            // When icon position was not set default append left side.
            if (empty($iconPosition) || 'left' === $iconPosition) {

                $blockElement->innerhtml = sprintf(
                    '%1$s %2$s %3$s %4$s',
                    '<div class="wrapper-link">',
                    $iconHTML,
                    $blockElement->innerhtml,
                    '</div>'
                );
            } elseif ('right' === $iconPosition) {

                $blockElement->innerhtml = sprintf(
                    '%1$s %2$s %3$s %4$s',
                    '<div class="wrapper-link">',
                    $blockElement->innerhtml,
                    $iconHTML,
                    '</div>'
                );
            }
        }
		
		return str_replace($original_html, $blockElement->outerhtml, $html);
    }
}
