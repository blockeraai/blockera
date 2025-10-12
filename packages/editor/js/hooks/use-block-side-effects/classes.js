// @flow

export const classes = [
	// Position block section
	{
		parent: '.components-tools-panel.block-editor-block-inspector__position',
	},
	// Layout block section
	{
		parent: '.components-panel__body',
		children: [
			'.components-panel__body .block-editor-hooks__flex-layout-justification-controls',
			'.components-panel__body .block-editor-hooks__flex-layout-orientation-controls',
		],
		childrenCheck: 'first',
	},
	// Settings block section
	{
		parent: '.components-tools-panel',
		children: [
			'.components-tools-panel:not(.block-editor-bindings__panel,.block-editor-block-inspector__position) .components-tools-panel-header',
		],
		exclude: [
			'core/archives',
			'core/categories',
			'core/columns',
			'core/details',
			'core/latest-comments',
			'core/latest-posts',
			'core/loginout',
			'core/media-text',
			'core/navigation-link',
			'core/navigation-submenu',
			'core/page-list',
			'core/post-author-name',
			'core/post-date',
			'core/post-excerpt',
			'core/post-featured-image',
			'core/query-pagination',
			'core/query-pagination-numbers',
			'core/query-title',
			'core/read-more',
			'core/site-title',
			'core/social-link',
			'core/social-links',
			'core/table',
			'core/tag-cloud',
			'core/video',
			'core/image',
			'core/file',
			'outermost/icon-block',
		],
	},
	// "core/avatar" - Hide range control for image size
	{
		parent: '.components-range-control',
		children: [
			'.components-panel__body .components-range-control .components-base-control__label',
		],
		include: ['core/avatar'],
	},
	// "core/image" - Hide aspect ratio select
	{
		parent: '.components-tools-panel-item',
		children: [
			'.components-tools-panel select.components-select-control__input option[value="auto"]',
			'.components-tools-panel select.components-select-control__input option[value="1"]',
			'.components-tools-panel select.components-select-control__input option[value="4/3"]',
		],
		include: ['core/image'],
	},
	// "core/image" - Hide width & height select
	{
		parent: '.components-tools-panel-item',
		children: ['.components-tools-panel .components-input-control__input'],
		childrenCheck: 'all',
		include: ['core/image'],
	},
	// "core/image" - Hide scale control
	{
		parent: '.components-tools-panel-item',
		children: [
			'.components-tools-panel button[value="cover"]',
			'.components-tools-panel button[value="contain"]',
		],
		include: ['core/image'],
	},
	// "blockera/icon" - Hide ratio
	{
		parent: '.components-tools-panel-item',
		children: ['.components-tools-panel-item select'],
		include: ['blockera/icon'],
	},
	// "blockera/icon" - Hide width & height
	{
		parent: '.components-tools-panel-item',
		children: [
			'.components-tools-panel-item .components-input-control__input',
		],
		include: ['blockera/icon'],
		childrenCheck: 'all',
	},
];
