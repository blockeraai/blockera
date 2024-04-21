<?php

return [
	[
		'separatelyCss' => [
			[
				'.publisher-core-test:hover' => [
					'transition' => 'all 2000ms ease 0ms',
				],
				'.publisher-core-test'       => [
					'opacity' => '50%',
				],
			],
			[
				'.publisher-core-test' => [
					'background-color' => '#ed9537 !important',
				],
			],
		],
		'expected'      => [
			'.publisher-core-test:hover' => [
				'transition' => 'all 2000ms ease 0ms',
			],
			'.publisher-core-test'       => [
				'opacity'          => '50%',
				'background-color' => '#ed9537 !important',
			],
		],
	],
	[
		'separatelyCss' => [
			[
				'.publisher-core-test:hover a'       => [
					'transition' => 'all 2000ms ease 0ms',
				],
				'.publisher-core-test:hover a:hover' => [
					'color' => 'red',
				],
				'.publisher-core-test'               => [
					'opacity' => '50%',
				],
			],
			[
				'.publisher-core-test:hover a' => [
					'background-color' => 'transparent',
				],
				'.publisher-core-test'         => [
					'background-color' => '#ed9537 !important',
				],
			],
		],
		'expected'      => [
			'.publisher-core-test:hover a'       => [
				'transition'       => 'all 2000ms ease 0ms',
				'background-color' => 'transparent',
			],
			'.publisher-core-test:hover a:hover' => [
				'color' => 'red',
			],
			'.publisher-core-test'               => [
				'opacity'          => '50%',
				'background-color' => '#ed9537 !important',
			],
		],
	]
];
