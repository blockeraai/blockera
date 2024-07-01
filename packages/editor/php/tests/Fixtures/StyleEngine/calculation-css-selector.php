<?php

return [
	[
		'selectors' => [
			'root' => '.a',
		],
		'featureId' => 'invalid-feature-id',
		'fallbackId' => '',
		'expected'  => '.a',
	],
	[
		'selectors' => [],
		'featureId' => 'invalid-feature-id',
		'fallbackId' => '',
		'expected'  => '',
	],
	[
		'selectors' => [
			'dimensions' => [
				'aspectRatio' => '.a',
			],
		],
		'featureId' => 'aspect-ratio',
		'fallbackId' => 'dimensions.aspectRatio',
		'expected'  => '.a',
	],
	[
		'selectors' => [
			'dimensions' => [
				'aspectRatio' => '.a',
			],
		],
		'featureId' => 'aspect-ratio',
		'fallbackId' => 'dimensions.aspectRatio',
		'expected'  => '.a',
	],
];
