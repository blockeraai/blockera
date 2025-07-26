<?php
/**
 * Configure block all arguments.
 *
 * @var array $args the block arguments!
 *
 * @package blockera/packages/blocks/php/third-party/blocksy-contact-info
 */

return array_merge(
	$args,
	[
		'selectors'  => array_merge(
			$args['selectors'] ?? [],
			[
				'blockera/elements/text'   => [
					'root' => '.contact-title, .contact-text, .contact-text a',
				],
				'blockera/elements/titles'   => [
					'root' => '.contact-title',
				],
				'blockera/elements/contents'   => [
					'root' => '.contact-text',
				],
				'blockera/elements/icons'   => [
					'root' => '.ct-icon-container',
				],
				'blockera/elements/link'   => [
					'root' => '.contact-text.contact-text a',
				],
			]
		),
	]
);
