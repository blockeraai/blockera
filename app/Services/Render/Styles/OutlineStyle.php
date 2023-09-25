<?php

namespace Publisher\Framework\Services\Render\Styles;

use Publisher\Framework\Exceptions\BaseException;

class OutlineStyle extends RepeaterStyle {

	protected function getId(): string {

		return 'publisherOutline';
	}

	protected function getCssProp(): string {

		return 'outline';
	}

	protected function generate( array $settings, string $selector ): array {

		$this->definition->setSettings( $settings );

		try {

			$properties = $this->definition->getProperties();

		} catch ( BaseException $handler ) {

			throw new BaseException( __( 'invalid css properties, ' . $handler->getMessage(), 'publisher-core' ) );
		}

		$block_attributes = array(
			'style' => array(
				$this->getId() => [
					$this->getCssProp() . '-offset' => implode( ', ', array_filter( $properties['offset'] ) ),
					$this->getCssProp()             => implode( ', ', array_filter( $properties['outlines'] ) ),
				],
			),
		);

		return getStyles(
			$block_attributes['style'],
			array(
				'selector' => $selector,
				'context'  => 'block-supports',
			)
		);
	}

}

