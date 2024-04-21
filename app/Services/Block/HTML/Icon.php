<?php

namespace Blockera\Framework\Services\Block\HTML;

class Icon extends BlockHTML {

	public function manipulate( array $request ): void {

		[
			'block'        => $block,
			'blockElement' => $blockElement,
		] = $request;

		if ( false === strpos( $blockElement->innerhtml, 'wrapper-link' ) ) {
			$blockElement->innerHTML = preg_replace(
				'/<div\sclass="wrapper-link".*?>.*?<\/div>/si',
				'',
				$blockElement->innerHTML
			);
		}

		if ( ! empty( $block['attrs']['blockeraIcon'] ) ) {

			[
				'icon'    => $icon,
				'library' => $library,
			] = $block['attrs']['blockeraIcon'];

			$gap = $block['attrs']['blockeraIconGap'] ?? '5px';

			//FIXME: how to add styles into icon element.
			$iconHTML = sprintf(
				'<i class="%1$s %2$s"></i>',//style="font-size: %3$s;width: %3$s;height: %3$s;fill:%4$s;color:%4$s;margin-left: %5$s;margin-right: %5$s;"
				$library,
				$this->getIcon( $icon ),
//				$block['attrs']['blockeraIconSize'] ?? '',
//				$block['attrs']['blockeraIconColor'] ?? '',
//				$gap
			);

			if (strpos($blockElement->innerHTML , $iconHTML) !== false){
				return;
			}

			//Handle icon link
			if ( ! empty( $block['attrs']['blockeraIconLink'] ) ) {

				[
					'link'       => $link,
					"target"     => $target,
					"nofollow"   => $isNofollow,
					"label"      => $label,
					"attributes" => $attributes,
				] = $block['attrs']['blockeraIconLink'];

				if ( $link ) {

					$iconHTML = sprintf(
						'<a href="%1$s" rel="%3$s" aria-label="%4$s" target="%5$s">%2$s</a>',
						$link,
						$iconHTML,
						$isNofollow ? 'nofollow' : 'alternate',
						$label,
						$target ? '_blank' : '_self'
					);

					foreach ( $attributes as $attribute ) {

						if ( empty( $attribute['value'] ) || ( empty( $attribute['__key'] ) && empty( $attribute['key'] ) ) ) {

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

			//When icon position was not set default append left side
			if ( empty( $block['attrs']['blockeraIconPosition'] ) || 'left' === $block['attrs']['blockeraIconPosition'] ) {

				$blockElement->innerhtml = sprintf(
					'%1$s %2$s %3$s %4$s',
					'<div class="wrapper-link">',
					$iconHTML,
					$blockElement->innerhtml,
					'</div>'
				);
			} elseif ( 'right' === $block['attrs']['blockeraIconPosition'] ) {

				$blockElement->innerhtml = sprintf(
					'%1$s %2$s %3$s %4$s',
					'<div class="wrapper-link">',
					$blockElement->innerhtml,
					$iconHTML,
					'</div>'
				);
			}


		}

		parent::manipulate( $request );
	}

}
