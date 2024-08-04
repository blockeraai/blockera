<?php
/**
 * Configure block all arguments.
 *
 * @var array $args the block arguments!
 *
 * @package blockera/packages/blocks/js/wordpress/loginout
 */

return array_merge(
	$args,
	[
		'selectors' => array_merge(
			$args['selectors'] ?? [],
			[
				'innerBlocks' => [
					'elements/form'        => [
						'root' => 'form',
					],
					'elements/input-label' => [
						'root' => '.login-password label, .login-username label',
					],
					'elements/input'       => [
						'root' => '.login-password input, .login-username input',
					],
					'elements/remember'    => [
						'root' => '.login-remember label',
					],
					'core/button'          => [
						'root' => '.login-submit .button.button-primary',
					],
				],
			]
		),
	]
);
