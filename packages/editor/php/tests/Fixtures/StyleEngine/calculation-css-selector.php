<?php

return [
	// It should retrieve root selector of "core/sample" block but rewrite root selector with blockera unique selector for block type.
	[
		'featureId'  => 'root',
		'fallbackId' => '',
		'expected'   => '.blockera-block.blockera-block--phggmy.wp-block-sample, .blockera-block.blockera-block--phggmy.wp-block-sample .first-child, .blockera-block.blockera-block--phggmy.wp-block-sample .second-child, .wp-block-sample.blockera-block.blockera-block--phggmy, .wp-block-sample.blockera-block.blockera-block--phggmy .first-child, .wp-block-sample.blockera-block.blockera-block--phggmy .second-child',
	],
	// It should retrieve root selector of "core/sample" block while feature identify is invalid.
	[
		'featureId'  => 'invalid-feature-id',
		'fallbackId' => '',
		'expected'   => '.blockera-block.blockera-block--phggmy.wp-block-sample, .blockera-block.blockera-block--phggmy.wp-block-sample .first-child, .blockera-block.blockera-block--phggmy.wp-block-sample .second-child, .wp-block-sample.blockera-block.blockera-block--phggmy, .wp-block-sample.blockera-block.blockera-block--phggmy .first-child, .wp-block-sample.blockera-block.blockera-block--phggmy .second-child',
	],
	// It should retrieve root selector of "core/sample" block but rewrite root selector with blockera unique selector for block type.
	[
		'featureId'  => 'blockera/elements/link',
		'fallbackId' => '',
		'expected'   => 'a:not(.wp-element-button)',
	],
	// It should retrieve root selector of "blockera/elements/link" of "core/sample" block but rewrite root selector with blockera unique selector for block type.
	[
		'featureId'  => 'blockeraWidth',
		'fallbackId' => [ 'blockera/elements/link', 'width' ],
		'expected'   => '.blockera-block.blockera-block--phggmy.wp-block-sample a, .wp-block-sample.blockera-block.blockera-block--phggmy a',
	],
];
