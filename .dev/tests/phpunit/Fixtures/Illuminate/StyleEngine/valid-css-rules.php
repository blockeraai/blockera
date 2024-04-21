<?php

return [
	[
		'css'      => [
			'.blockera-core-test:hover' => [
				'transition' => 'all 2000ms ease 0ms',
			],
			'.blockera-core-test'       => [
				'opacity'          => '50%',
				'background-color' => '#ed9537 !important',
			],
		],
		'expected' => [
			'.blockera-core-test:hover' => 'transition: all 2000ms ease 0ms;',
			'.blockera-core-test'       => 'opacity: 50%;background-color: #ed9537 !important;'
		],
	],
	[
		'css'      => [
			'.blockera-core-test:hover' => [
				'transition' => 'all 2000ms ease 0ms',
				'padding-top' => '15px',
			],
			'.blockera-core-test'       => [
				'opacity'          => '50%',
				'background-color' => '#ed9537 !important',
				'padding'          => '10px 15px 10px 15px',
			],
		],
		'expected' => [
			'.blockera-core-test:hover' => 'transition: all 2000ms ease 0ms;padding-top: 15px;',
			'.blockera-core-test'       => 'opacity: 50%;background-color: #ed9537 !important;padding: 10px 15px 10px 15px;'
		],
	]
];
