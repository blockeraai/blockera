<?php

return [
	[
		'separatelyCss' => [
			[
				'.blockera-core-test:hover' => [
					'transition' => 'all 2000ms ease 0ms',
				],
				'.blockera-core-test'       => [
					'opacity' => '50%',
				],
			],
			[
				'.blockera-core-test' => [
					'background-color' => '#ed9537 !important',
				],
			],
		],
		'expected'      => [
			'.blockera-core-test:hover' => [
				'transition' => 'all 2000ms ease 0ms',
			],
			'.blockera-core-test'       => [
				'opacity'          => '50%',
				'background-color' => '#ed9537 !important',
			],
		],
	],
	[
		'separatelyCss' => [
			[
				'.blockera-core-test:hover a'       => [
					'transition' => 'all 2000ms ease 0ms',
				],
				'.blockera-core-test:hover a:hover' => [
					'color' => 'red',
				],
				'.blockera-core-test'               => [
					'opacity' => '50%',
				],
			],
			[
				'.blockera-core-test:hover a' => [
					'background-color' => 'transparent',
				],
				'.blockera-core-test'         => [
					'background-color' => '#ed9537 !important',
				],
			],
		],
		'expected'      => [
			'.blockera-core-test:hover a'       => [
				'transition'       => 'all 2000ms ease 0ms',
				'background-color' => 'transparent',
			],
			'.blockera-core-test:hover a:hover' => [
				'color' => 'red',
			],
			'.blockera-core-test'               => [
				'opacity'          => '50%',
				'background-color' => '#ed9537 !important',
			],
		],
	]
];
