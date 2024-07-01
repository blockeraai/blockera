<?php

return [
	[
		'css'      => [
			'.blockera-test:hover' => [
				'transition' => 'all 2000ms ease 0ms',
			],
			'.blockera-test'       => [
				'opacity'          => '50%',
				'background-color' => '#ed9537 !important',
			],
		],
		'expected' => [
			'.blockera-test:hover' => 'transition: all 2000ms ease 0ms;',
			'.blockera-test'       => 'opacity: 50%;background-color: #ed9537 !important;'
		],
	],
	[
		'css'      => [
			'.blockera-test:hover' => [
				'transition' => 'all 2000ms ease 0ms',
				'padding-top' => '15px',
			],
			'.blockera-test'       => [
				'opacity'          => '50%',
				'background-color' => '#ed9537 !important',
				'padding'          => '10px 15px 10px 15px',
			],
		],
		'expected' => [
			'.blockera-test:hover' => 'transition: all 2000ms ease 0ms;padding-top: 15px;',
			'.blockera-test'       => 'opacity: 50%;background-color: #ed9537 !important;padding: 10px 15px 10px 15px;'
		],
	]
];
