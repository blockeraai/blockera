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
					'root' => '.login-password label, .login-username label',
				],
				'blockera/elements/input'       => [
					'root' => '.login-password input, .login-username input',
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
