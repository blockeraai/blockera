// @flow

/**
 * Blockera dependencies
 */
import { getValueAddonRealValue } from '@blockera/controls';
import { prepare } from '@blockera/data-editor';
import { isEquals } from '@blockera/utils';

/**
 * Internal dependencies
 */
import type { StylesProps } from '../types';
import { isActiveField } from '../../api/utils';
import type { CssRule } from '../../../style-engine/types';
import {
	getCompatibleBlockCssSelector,
	computedCssDeclarations,
} from '../../../style-engine';
import { getBlockSupportCategory, getBlockSupportFallback } from '../../utils';
import {
	getHorizontalGapForGrid,
	getGridLayoutCssProperties,
} from './grid-css';

const supports = getBlockSupportCategory('layout');

/**
 * Block attributes are usually `{ value: T }` (see blocks-core attributes.php) but some
 * code paths pass the raw scalar. Match dev-cypress `getSelectedBlock` unwrap logic so
 * grid math sees the real min width / column count.
 */
function unwrapBlockeraAttr(mixed: mixed): mixed {
	if (mixed && typeof mixed === 'object' && 'value' in mixed) {
		return mixed.value;
	}

	return mixed;
}

function getLayoutDisplayValue(display: mixed): string {
	if (display === undefined || display === null) {
		return '';
	}
	if (typeof display === 'string') {
		return display;
	}
	if (
		typeof display === 'object' &&
		display !== null &&
		typeof display.value === 'string'
	) {
		return display.value;
	}

	return '';
}

export const LayoutStyles = ({
	state,
	config,
	clientId,
	blockName,
	masterState,
	currentBlock,
	activeDeviceType,
	styleEngineConfig,
	supports: blockSupports,
	selectors: blockSelectors,
	defaultAttributes: attributes,
	attributes: currentBlockAttributes,
	...props
}: StylesProps): Array<CssRule> => {
	const {
		blockeraDisplay,
		blockeraGap,
		blockeraFlexWrap,
		blockeraAlignContent,
		blockeraGridMinimumColumnWidth,
		blockeraGridColumnCount,
	} = config.layoutConfig;

	const blockProps = {
		state,
		clientId,
		blockName,
		currentBlock,
		attributes: currentBlockAttributes,
	};
	const { attributes: _attributes } = blockProps;
	const sharedParams = {
		...props,
		state,
		clientId,
		blockName,
		masterState,
		currentBlock,
		blockSelectors,
		activeDeviceType,
		supports: blockSupports,
		className: currentBlockAttributes?.className,
	};
	const staticDefinitionParams = {
		type: 'static',
		options: {
			important: true,
		},
	};
	const styleGroup: Array<CssRule> = [];

	// Flag for removing `margin-block-start` for `gap` property and the `columns` block
	let removeMarginBlockStart = false;

	if (isActiveField(blockeraDisplay) && _attributes.blockeraDisplay !== '') {
		const pickedSelector = getCompatibleBlockCssSelector({
			...sharedParams,
			query: 'blockeraDisplay',
			support: 'blockeraDisplay',
			fallbackSupportId: getBlockSupportFallback(
				supports,
				'blockeraDisplay'
			),
		});

		styleGroup.push({
			selector: pickedSelector,
			declarations: computedCssDeclarations(
				{
					blockeraDisplay: [
						{
							...staticDefinitionParams,
							properties: {
								display: _attributes.blockeraDisplay,
							},
						},
					],
				},
				blockProps,
				pickedSelector
			),
		});
	}

	// Prefer current-breakpoint display; fall back to inherited base display for
	// flex/grid gates (mirrors PHP WithDisplayValueTrait). Do not use inherited
	// display for emitting the `display` property itself.
	const layoutDisplay =
		getLayoutDisplayValue(_attributes.blockeraDisplay) ||
		getLayoutDisplayValue(props?.inheritedDisplay);

	const gridMinFieldActive = isActiveField(blockeraGridMinimumColumnWidth);
	const gridCountFieldActive = isActiveField(blockeraGridColumnCount);

	// Mirror PHP GridLayout: derive template from both attrs; emit when either control is
	// enabled for the block (min-only, count-only, or both). Requiring both `isActiveField`
	// calls prevented any grid-template output when only one sidebar control existed.
	if (
		layoutDisplay === 'grid' &&
		(gridMinFieldActive || gridCountFieldActive)
	) {
		const minRaw = unwrapBlockeraAttr(
			_attributes.blockeraGridMinimumColumnWidth
		);
		const minW = typeof minRaw === 'string' ? minRaw.trim() : '';

		const rawC = unwrapBlockeraAttr(_attributes.blockeraGridColumnCount);
		let colCount = 0;
		if (typeof rawC === 'number' && rawC > 0) {
			colCount = rawC;
		} else if (rawC !== '' && rawC !== undefined && rawC !== null) {
			const p = parseInt(String(rawC), 10);
			if (Number.isFinite(p) && p > 0) {
				colCount = p;
			}
		}

		const hGap = getHorizontalGapForGrid(_attributes.blockeraGap);
		const gridProps = getGridLayoutCssProperties(minW, colCount, hGap);

		if (gridMinFieldActive) {
			const pickedSelector = getCompatibleBlockCssSelector({
				...sharedParams,
				query: 'blockeraGridMinimumColumnWidth',
				support: 'blockeraGridMinimumColumnWidth',
				fallbackSupportId: getBlockSupportFallback(
					supports,
					'blockeraGridMinimumColumnWidth'
				),
			});

			styleGroup.push({
				selector: pickedSelector,
				declarations: computedCssDeclarations(
					{
						blockeraGridMinimumColumnWidth: [
							{
								...staticDefinitionParams,
								properties: gridProps,
							},
						],
					},
					blockProps,
					pickedSelector
				),
			});
		} else {
			const pickedSelector = getCompatibleBlockCssSelector({
				...sharedParams,
				query: 'blockeraGridColumnCount',
				support: 'blockeraGridColumnCount',
				fallbackSupportId: getBlockSupportFallback(
					supports,
					'blockeraGridColumnCount'
				),
			});

			styleGroup.push({
				selector: pickedSelector,
				declarations: computedCssDeclarations(
					{
						blockeraGridColumnCount: [
							{
								...staticDefinitionParams,
								properties: gridProps,
							},
						],
					},
					blockProps,
					pickedSelector
				),
			});
		}
	}

	if (
		layoutDisplay === 'flex' &&
		_attributes?.blockeraFlexLayout !== undefined
	) {
		const flexLayout = unwrapBlockeraAttr(_attributes?.blockeraFlexLayout);

		if (
			flexLayout &&
			typeof flexLayout === 'object' &&
			flexLayout?.direction
		) {
			const pickedSelector = getCompatibleBlockCssSelector({
				...sharedParams,
				query: 'blockeraFlexLayout.direction',
				fallbackSupportId: getBlockSupportFallback(
					supports,
					'blockeraFlexLayout'
				),
			});

			styleGroup.push({
				selector: pickedSelector,
				declarations: computedCssDeclarations(
					{
						blockeraFlexLayout: [
							{
								...staticDefinitionParams,
								properties: {
									'flex-direction': flexLayout.direction,
								},
							},
						],
					},
					blockProps,
					pickedSelector
				),
			});

			// remove the `margin-block-start` for `columns` block children items
			// block editor adds it and we need to remove it
			if (blockName === 'core/columns') {
				removeMarginBlockStart = true;
			}
		}

		if (
			flexLayout &&
			typeof flexLayout === 'object' &&
			flexLayout?.alignItems
		) {
			const pickedSelector = getCompatibleBlockCssSelector({
				...sharedParams,
				query: 'blockeraFlexLayout.alignItems',
				fallbackSupportId: getBlockSupportFallback(
					supports,
					'blockeraFlexLayout'
				),
			});

			styleGroup.push({
				selector: pickedSelector,
				declarations: computedCssDeclarations(
					{
						blockeraFlexLayout: [
							{
								...staticDefinitionParams,
								properties: {
									'align-items': flexLayout.alignItems,
								},
							},
						],
					},
					blockProps,
					pickedSelector
				),
			});
		}

		if (
			flexLayout &&
			typeof flexLayout === 'object' &&
			flexLayout?.justifyContent
		) {
			const pickedSelector = getCompatibleBlockCssSelector({
				...sharedParams,
				query: 'blockeraFlexLayout.justifyContent',
				fallbackSupportId: getBlockSupportFallback(
					supports,
					'blockeraFlexLayout'
				),
			});

			styleGroup.push({
				selector: pickedSelector,
				declarations: computedCssDeclarations(
					{
						blockeraFlexLayout: [
							{
								...staticDefinitionParams,
								properties: {
									'justify-content':
										flexLayout.justifyContent,
								},
							},
						],
					},
					blockProps,
					pickedSelector
				),
			});
		}
	}

	if (
		layoutDisplay === 'flex' &&
		isActiveField(blockeraFlexWrap) &&
		!isEquals(
			_attributes.blockeraFlexWrap,
			attributes.blockeraFlexWrap.default
		)
	) {
		let value = _attributes.blockeraFlexWrap?.val;

		if (
			_attributes.blockeraFlexWrap?.val === 'wrap' &&
			_attributes.blockeraFlexWrap?.reverse
		) {
			value += '-reverse';
		}

		const pickedSelector = getCompatibleBlockCssSelector({
			...sharedParams,
			query: 'blockeraFlexWrap',
			support: 'blockeraFlexWrap',
			fallbackSupportId: getBlockSupportFallback(
				supports,
				'blockeraFlexWrap'
			),
		});

		styleGroup.push({
			selector: pickedSelector,
			declarations: computedCssDeclarations(
				{
					blockeraFlexWrap: [
						{
							...staticDefinitionParams,
							properties: {
								'flex-wrap': value,
							},
						},
					],
				},
				blockProps,
				pickedSelector
			),
		});
	}

	if (
		layoutDisplay === 'flex' &&
		isActiveField(blockeraAlignContent) &&
		_attributes.blockeraAlignContent !==
			attributes.blockeraAlignContent.default
	) {
		const pickedSelector = getCompatibleBlockCssSelector({
			...sharedParams,
			query: 'blockeraAlignContent',
			support: 'blockeraAlignContent',
			fallbackSupportId: getBlockSupportFallback(
				supports,
				'blockeraAlignContent'
			),
		});

		styleGroup.push({
			selector: pickedSelector,
			declarations: computedCssDeclarations(
				{
					blockeraAlignContent: [
						{
							...staticDefinitionParams,
							properties: {
								'align-content':
									_attributes.blockeraAlignContent,
							},
						},
					],
				},
				blockProps,
				pickedSelector
			),
		});
	}

	/**
	 * Gap styles
	 */
	if (
		isActiveField(blockeraGap) &&
		_attributes.blockeraGap !== attributes.blockeraGap.default
	) {
		let gapSuffixClass = '';

		// Detect gap type for block
		const gapType = prepare('gap-type', styleEngineConfig);

		switch (gapType) {
			case 'margin':
				gapSuffixClass = '.is-layout-constrained > * + *';
				break;

			case 'gap-and-margin':
				if (!['flex', 'grid'].includes(layoutDisplay)) {
					gapSuffixClass = '.is-layout-constrained > * + *';
				}
				break;
		}

		if (_attributes.blockeraGap?.lock) {
			const gap = getValueAddonRealValue(_attributes.blockeraGap?.gap);

			// gap
			if (gap) {
				const pickedSelector = getCompatibleBlockCssSelector({
					...sharedParams,
					query: 'blockeraGap',
					support: 'blockeraGap',
					fallbackSupportId: getBlockSupportFallback(
						supports,
						'blockeraGap'
					),
					...(gapSuffixClass ? { suffixClass: gapSuffixClass } : {}),
				});

				const gapProperty: string = gapSuffixClass
					? 'margin-block-start'
					: 'gap';

				styleGroup.push({
					selector: pickedSelector,
					declarations: computedCssDeclarations(
						{
							blockeraGap: [
								{
									...staticDefinitionParams,
									properties: {
										[gapProperty]: gap,
									},
								},
							],
						},
						blockProps,
						pickedSelector
					),
				});

				/**
				 * If gap type is `gap-and-margin` and the current display is flex or grid
				 * then we use gap property to but still WP is creating gap with `margin-block-start` and we have to remove it.
				 */
				if (
					gapType === 'gap-and-margin' &&
					['flex', 'grid'].includes(layoutDisplay)
				) {
					removeMarginBlockStart = true;
				}
			}
		} else {
			/**
			 * Rows gap
			 */
			const rows = getValueAddonRealValue(_attributes.blockeraGap?.rows);

			if (rows) {
				const pickedSelector = getCompatibleBlockCssSelector({
					...sharedParams,
					query: 'blockeraGap.rows',
					fallbackSupportId: getBlockSupportFallback(
						supports,
						'blockeraGap'
					),
					...(gapSuffixClass ? { suffixClass: gapSuffixClass } : {}),
				});

				const rowsProperty: string = gapSuffixClass
					? 'margin-block-start'
					: 'row-gap';

				styleGroup.push({
					selector: pickedSelector,
					declarations: computedCssDeclarations(
						{
							blockeraGap: [
								{
									...staticDefinitionParams,
									properties: {
										[rowsProperty]: rows,
									},
								},
							],
						},
						blockProps,
						pickedSelector
					),
				});

				/**
				 * If gap type is `gap-and-margin` and the current display is flex or grid
				 * then we use gap property to but still WP is creating gap with `margin-block-start` and we have to remove it.
				 */
				if (
					gapType === 'gap-and-margin' &&
					['flex', 'grid'].includes(layoutDisplay)
				) {
					removeMarginBlockStart = true;
				}
			}

			/**
			 * Columns gap
			 */
			const columns = getValueAddonRealValue(
				_attributes.blockeraGap?.columns
			);

			// if there is gapSuffixClass it means the gap is by margin that that does not supports columns gap
			if (columns && !gapSuffixClass) {
				const pickedSelector = getCompatibleBlockCssSelector({
					...sharedParams,
					query: 'blockeraGap.columns',
					fallbackSupportId: getBlockSupportFallback(
						supports,
						'blockeraGap'
					),
					...(gapSuffixClass ? { suffixClass: gapSuffixClass } : {}),
				});

				styleGroup.push({
					selector: pickedSelector,
					declarations: computedCssDeclarations(
						{
							blockeraGap: [
								{
									...staticDefinitionParams,
									properties: {
										'column-gap': columns,
									},
								},
							],
						},
						blockProps,
						pickedSelector
					),
				});
			}
		}
	}

	/**
	 * If gap type is both and the current display is flex or grid
	 * then we use `gap` property to but still WP is creating gap with `margin-block-start` and we have to remove it.
	 *
	 * Or if the current block is `columns` and the `blockeraDisplay` is `flex`.
	 *
	 * This variable is false by default but it will be enabled if the style clearing is needed.
	 */
	if (removeMarginBlockStart) {
		const pickedSelector = getCompatibleBlockCssSelector({
			...sharedParams,
			query: 'blockeraGap',
			support: 'blockeraGap',
			fallbackSupportId: getBlockSupportFallback(supports, 'blockeraGap'),
			suffixClass:
				blockName === 'core/columns'
					? '.is-layout-constrained > *'
					: '.is-layout-constrained > * + *',
		});

		styleGroup.push({
			selector: pickedSelector,
			declarations: computedCssDeclarations(
				{
					blockeraGap: [
						{
							...staticDefinitionParams,
							properties: {
								'margin-block-start': '0',
							},
						},
					],
				},
				blockProps,
				pickedSelector
			),
		});
	}

	return styleGroup;
};
