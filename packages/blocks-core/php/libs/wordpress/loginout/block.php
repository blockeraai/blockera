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
				'blockera/elements/form'        => [
					'root' => 'form',
				],
				'blockera/elements/input-label' => [
					'root' => ':is(.login-password, .login-username) label',
				],
				'blockera/elements/input'       => [
					'root' => ':is(.login-password, .login-username) input',
				],
				'blockera/elements/remember'    => [
					'root' => '.login-remember label',
				],
				'blockera/core/button'          => [
					'root' => '.login-submit .button.button-primary',
				],
			]
		),
	]
);
