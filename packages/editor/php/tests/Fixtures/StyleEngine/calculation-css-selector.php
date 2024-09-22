<?php

return [
	// It should retrieve root selector of "core/sample" block but rewrite root selector with blockera unique selector for block type.
	[
		'blockType' => 'master',
		'featureId'  => 'root',
		'fallbackId' => '',
		'expected'   => '.blockera-block.blockera-block--phggmy.wp-block-sample, .wp-block-sample.blockera-block.blockera-block--phggmy, .blockera-block.blockera-block--phggmy.wp-block-sample .first-child, .wp-block-sample.blockera-block.blockera-block--phggmy .first-child, .blockera-block.blockera-block--phggmy.wp-block-sample .second-child, .wp-block-sample.blockera-block.blockera-block--phggmy .second-child',
	],
	// It should retrieve root selector of "core/sample" block while feature identify is invalid.
	[
		'blockType' => 'master',
		'featureId'  => 'invalid-feature-id',
		'fallbackId' => '',
		'expected'   => '.blockera-block.blockera-block--phggmy.wp-block-sample, .wp-block-sample.blockera-block.blockera-block--phggmy, .blockera-block.blockera-block--phggmy.wp-block-sample .first-child, .wp-block-sample.blockera-block.blockera-block--phggmy .first-child, .blockera-block.blockera-block--phggmy.wp-block-sample .second-child, .wp-block-sample.blockera-block.blockera-block--phggmy .second-child',
	],
	// It should retrieve root selector of "core/sample" block but rewrite root selector with blockera unique selector for block type.
	[
		'blockType' => 'blockera/elements/link',
		'featureId'  => 'blockera/elements/link',
		'fallbackId' => '',
		'expected'   => '.blockera-block.blockera-block--phggmy a:not(.wp-element-button)',
	],
	// It should retrieve root selector of "blockera/elements/link" of "core/sample" block but rewrite root selector with blockera unique selector for block type.
	[
		'blockType' => 'master',
		'featureId'  => 'blockeraWidth',
		'fallbackId' => [ 'blockera/elements/link', 'width' ],
		'expected'   => '.blockera-block.blockera-block--phggmy.wp-block-sample a, .wp-block-sample.blockera-block.blockera-block--phggmy a',
	],
];
