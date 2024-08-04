<?php

return [
	[
		'separatelyCss' => [
			[
				'.blockera-test:hover' => [
					'transition' => 'all 2000ms ease 0ms',
				],
				'.blockera-test'       => [
					'opacity' => '50%',
				],
			],
			[
				'.blockera-test' => [
					'background-color' => '#ed9537 !important',
				],
			],
		],
		'expected'      => [
			'.blockera-test:hover' => [
				'transition' => 'all 2000ms ease 0ms',
			],
			'.blockera-test'       => [
				'opacity'          => '50%',
				'background-color' => '#ed9537 !important',
			],
		],
	],
	[
		'separatelyCss' => [
			[
				'.blockera-test:hover a'       => [
					'transition' => 'all 2000ms ease 0ms',
				],
				'.blockera-test:hover a:hover' => [
					'color' => 'red',
				],
				'.blockera-test'               => [
					'opacity' => '50%',
				],
			],
			[
				'.blockera-test:hover a' => [
					'background-color' => 'transparent',
				],
				'.blockera-test'         => [
					'background-color' => '#ed9537 !important',
				],
			],
		],
		'expected'      => [
			'.blockera-test:hover a'       => [
				'transition'       => 'all 2000ms ease 0ms',
				'background-color' => 'transparent',
			],
			'.blockera-test:hover a:hover' => [
				'color' => 'red',
			],
			'.blockera-test'               => [
				'opacity'          => '50%',
				'background-color' => '#ed9537 !important',
			],
		],
	]
];
