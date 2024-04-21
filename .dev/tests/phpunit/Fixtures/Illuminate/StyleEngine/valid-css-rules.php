<?php

return [
	[
		'css'      => [
			'.publisher-core-test:hover' => [
				'transition' => 'all 2000ms ease 0ms',
			],
			'.publisher-core-test'       => [
				'opacity'          => '50%',
				'background-color' => '#ed9537 !important',
			],
		],
		'expected' => [
			'.publisher-core-test:hover' => 'transition: all 2000ms ease 0ms;',
			'.publisher-core-test'       => 'opacity: 50%;background-color: #ed9537 !important;'
		],
	],
	[
		'css'      => [
			'.publisher-core-test:hover' => [
				'transition' => 'all 2000ms ease 0ms',
				'padding-top' => '15px',
			],
			'.publisher-core-test'       => [
				'opacity'          => '50%',
				'background-color' => '#ed9537 !important',
				'padding'          => '10px 15px 10px 15px',
			],
		],
		'expected' => [
			'.publisher-core-test:hover' => 'transition: all 2000ms ease 0ms;padding-top: 15px;',
			'.publisher-core-test'       => 'opacity: 50%;background-color: #ed9537 !important;padding: 10px 15px 10px 15px;'
		],
	]
];
