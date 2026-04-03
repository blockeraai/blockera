// @flow

/**
 * External dependencies
 */
import type { MixedElement } from 'react';
import { __, _n, sprintf } from '@wordpress/i18n';
import { applyFilters } from '@wordpress/hooks';
import { select, useSelect } from '@wordpress/data';
import { useEntityProp } from '@wordpress/core-data';
import {
	Fill,
	Animate,
	Icon as WordPressIconComponent,
	ToggleControl as WPToggleControl,
} from '@wordpress/components';
import { useState, useCallback, useEffect, useMemo } from '@wordpress/element';

/**
 * Blockera dependencies
 */
import { Icon } from '@blockera/icons';
import { isString, mergeObject, isEquals, cloneObject } from '@blockera/utils';
import {
	classNames,
	controlInnerClassNames,
	controlClassNames,
} from '@blockera/classnames';
import { Flex, Grid, Button, Tooltip } from '@blockera/controls';

/**
 * Internal dependencies
 */
import { getBlockeraGlobalStylesMetaData } from '../../helpers';
import { blockHasStyle } from './use-block-style-item/helpers';
import { getNormalizedStyle, useGlobalStylesPanelContext } from '../context';

const UPGRADE_PRO_URL = 'https://blockera.ai/products/site-builder/pricing/';

export const BlockTypes = ({
	items,
	style,
	blockName,
	enabledItems,
	// eslint-disable-next-line no-unused-vars -- Passed by parent, used by handleOnSaveUsageForMultipleBlocks
	handleOnUsageForMultipleBlocks,
	handleOnSaveUsageForMultipleBlocks,
	setIsOpenUsageForMultipleBlocks,
}: {
	items: Object,
	style: Object,
	blockName: string,
	blockTitle: string,
	enabledItems: Array<string>,
	handleOnUsageForMultipleBlocks: (
		style: Object,
		action: 'add' | 'delete'
	) => void,
	handleOnSaveUsageForMultipleBlocks: (params: Object) => void,
	setIsOpenUsageForMultipleBlocks: (isOpen: boolean) => void,
}): MixedElement => {
	const {
		defaultStyles,
		style: currentStyleValue,
		currentBlockStyleVariation,
	} = useGlobalStylesPanelContext();
	const { getSelectedBlockStyle } = select('blockera/editor');
	const [isShowPromotion, setIsShowPromotion] = useState(false);
	const selectedBlockStyle = getSelectedBlockStyle();
	const itemsCount = Array.isArray(items)
		? items.length
		: Object.keys(items || {}).length;

	// Filter out any null or undefined items
	const validItems = Array.isArray(items)
		? items.filter(
				(item) =>
					item !== null &&
					item !== undefined &&
					item.attributes.hasOwnProperty('blockeraPropsId')
			)
		: items;
	const postId = select('core').__experimentalGetCurrentGlobalStylesId();
	const [globalStyles] = useEntityProp(
		'root',
		'globalStyles',
		'styles',
		postId
	);
	const [isSaving, setIsSaving] = useState(false);
	const [action, setAction] = useState(null);
	const savedEnabledItems = useMemo(() => {
		return globalStyles?.blockeraMetaData?.variations?.[style.name]
			?.enabledIn;
	}, [globalStyles, style]);
	const initBlocksState = useMemo(
		() => ({
			items:
				savedEnabledItems &&
				Array.isArray(savedEnabledItems) &&
				savedEnabledItems.length > 0
					? [
							...new Set([
								...enabledItems,
								...(savedEnabledItems?.filter((blockType) => {
									const disabledIn =
										globalStyles?.blockeraMetaData
											?.variations?.[style.name]
											?.disabledIn;

									return !disabledIn?.includes(blockType);
								}) || []),
							]),
						]
					: enabledItems,
			primitiveItems: validItems.sort((a, b) => {
				const aHasStyle = blockHasStyle(a.name, style.name) ? 1 : 0;
				const bHasStyle = blockHasStyle(b.name, style.name) ? 1 : 0;

				return bHasStyle - aHasStyle; // Sort enabled items first
			}),
		}),
		// items is source of validItems/enabledItems; when items changes (e.g. search), recompute
		// eslint-disable-next-line react-hooks/exhaustive-deps -- validItems/enabledItems derived from items
		[items, savedEnabledItems, globalStyles, style]
	);
	const [blocksState, setBlocksState] = useState(initBlocksState);
	const [state, setState] = useState({
		enabledIn: [],
		disabledIn: [],
		blockType: null,
		newGlobalStyles: globalStyles,
	});
	const [isModified, setIsModified] = useState(false);

	// Sync blocksState when items change (e.g. search completes) or initBlocksState updates
	useEffect(() => {
		if (isEquals(blocksState, initBlocksState)) {
			return;
		}

		setBlocksState(initBlocksState);
		// eslint-disable-next-line react-hooks/exhaustive-deps -- blocksState intentionally excluded to avoid overwriting user toggles
	}, [items, initBlocksState]);

	// Inserter category list from core/blocks (order matches block library). Some
	// stacks return an array; others a keyed object — normalize once for stable mapping.
	const blockCategories = useSelect((dataSelect) => {
		const raw = dataSelect('core/blocks').getCategories();

		if (!raw) {
			return [];
		}

		return Array.isArray(raw) ? raw : Object.values(raw);
	}, []);

	// Memoized so we only rebuild section structure when the visible block list or
	// registered categories change, not on every toggle/save UI update.
	const categorySections = useMemo(() => {
		const buckets: { [string]: Array<Object> } = {};

		for (const item of blocksState.primitiveItems) {
			const slug = item?.category || 'uncategorized';

			if (!buckets[slug]) {
				buckets[slug] = [];
			}

			buckets[slug].push(item);
		}

		const ordered: Array<{
			slug: string,
			title: string,
			items: Array<Object>,
		}> = [];
		const seen = new Set<string>();

		for (const cat of blockCategories) {
			const slug = cat.slug;
			const sectionItems = buckets[slug];

			if (sectionItems?.length) {
				ordered.push({ slug, title: cat.title, items: sectionItems });
				seen.add(slug);
			}
		}

		// Custom / unknown category slugs and synthetic "uncategorized" (no core row).
		for (const slug of Object.keys(buckets)) {
			if (seen.has(slug)) {
				continue;
			}

			const title =
				slug === 'uncategorized'
					? __('Uncategorized', 'blockera')
					: slug;

			ordered.push({ slug, title, items: buckets[slug] });
		}

		return ordered;
	}, [blocksState.primitiveItems, blockCategories]);

	const setGlobalData = useCallback(
		(
			action:
				| 'disable-all'
				| 'enable-all'
				| 'single-enable'
				| 'single-disable',
			blockType: string,
			selectedItems: Array<string>
		) => {
			let disabledIn: Array<string> = [];
			let enabledIn: Array<string> = [];
			const allBlockTypes = validItems.reduce(
				(acc, blockType) => [...acc, blockType.name],
				[]
			);
			let blocks: { [key: string]: any } = {};

			let copyGlobalStyles = cloneObject(globalStyles);

			const blockeraGlobalStylesMetaData =
				getBlockeraGlobalStylesMetaData();

			const cleanupGlobalStyles = (
				blockName: string,
				obj: Object
			): Object => {
				const _obj = cloneObject(obj);

				delete _obj?.blocks?.[blockName]?.variations?.[style.name];

				if (
					!Object.keys(_obj?.blocks?.[blockName]?.variations || {})
						.length
				) {
					delete _obj?.blocks?.[blockName]?.variations;

					if (!Object.keys(_obj?.blocks?.[blockName] || {}).length) {
						delete _obj?.blocks?.[blockName];
					}
				}
				// Delete "blocks" property while new settings not contains any styles for blocks.
				if (!Object.keys(_obj?.blocks).length) {
					delete _obj.blocks;
				}

				return _obj;
			};

			if ('disable-all' === action) {
				const blockToKeep = selectedItems?.[0] || blockName;
				disabledIn = allBlockTypes.filter((b) => b !== blockToKeep);
				enabledIn = blockToKeep ? [blockToKeep] : [];
				setAction('disable-all');

				if (!Object.keys(blocks).length) {
					for (const key in copyGlobalStyles?.blocks || {}) {
						copyGlobalStyles = cleanupGlobalStyles(
							key,
							copyGlobalStyles
						);
					}
				}
			} else if ('enable-all' === action) {
				disabledIn = [];
				const enableAllBlocks =
					selectedItems?.length > 0 ? selectedItems : allBlockTypes;
				enabledIn = enableAllBlocks;
				blocks = {
					...Object.fromEntries(
						enableAllBlocks.map((block: string) => [
							block,
							{
								variations: {
									[style.name]: currentBlockStyleVariation
										? getNormalizedStyle(
												currentStyleValue,
												defaultStyles
											)
										: getNormalizedStyle(
												currentStyleValue?.variations?.[
													style.name
												] || {},
												defaultStyles
											),
								},
							},
						])
					),
				};
				setAction('enable-all');
			} else if ('single-enable' === action) {
				if (state.newGlobalStyles?.blockeraMetaData) {
					disabledIn =
						state.newGlobalStyles?.blockeraMetaData?.variations?.[
							style.name
						]?.disabledIn?.filter((type) => type !== blockType) ||
						[];
				} else {
					disabledIn =
						copyGlobalStyles?.blockeraMetaData?.variations?.[
							style.name
						]?.disabledIn?.filter((type) => type !== blockType) ||
						[];
				}
				if (!disabledIn.length) {
					enabledIn = selectedItems;
				} else {
					enabledIn = validItems
						.filter((block) => !disabledIn.includes(block.name))
						.map((block) => block.name);
				}
				blocks = {
					...(state?.newGlobalStyles?.blocks || {}),
					[blockType]: {
						variations: {
							[style.name]: currentBlockStyleVariation
								? getNormalizedStyle(
										currentStyleValue,
										defaultStyles
									)
								: getNormalizedStyle(
										currentStyleValue?.variations?.[
											style.name
										] || {},
										defaultStyles
									),
						},
					},
				};

				// Cleanup global styles final object.
				for (const key in copyGlobalStyles?.blocks || {}) {
					copyGlobalStyles = cleanupGlobalStyles(
						key,
						copyGlobalStyles
					);
				}

				setAction('single-enable');
			} else if ('single-disable' === action) {
				if (state.newGlobalStyles?.blockeraMetaData) {
					enabledIn =
						state.newGlobalStyles?.blockeraMetaData?.variations?.[
							style.name
						]?.enabledIn?.filter((type) => type !== blockType) ||
						[];
				} else {
					enabledIn =
						copyGlobalStyles?.blockeraMetaData?.variations?.[
							style.name
						]?.enabledIn?.filter((type) => type !== blockType) ||
						[];
				}

				if (!enabledIn.length) {
					enabledIn = selectedItems;
				}

				disabledIn = validItems
					.filter((block) => !enabledIn.includes(block.name))
					.map((block) => block.name);

				// Cleanup global styles final object.
				if (!Object.keys(blocks).length) {
					copyGlobalStyles = cleanupGlobalStyles(
						blockType,
						copyGlobalStyles
					);
				}
				setAction('single-disable');
			}

			const blocksMetaDataForSelected = (selectedItems || []).reduce(
				(acc: { [key: string]: any }, blockTypeName: string) => {
					const hasVariation =
						copyGlobalStyles?.blockeraMetaData?.blocks?.[
							blockTypeName
						]?.variations?.[style.name] ||
						blockeraGlobalStylesMetaData?.blocks?.[blockTypeName]
							?.variations?.[style.name];
					if (hasVariation) {
						acc[blockTypeName] = {
							variations: {
								[style.name]: {
									isDeleted: undefined,
								},
							},
						};
					}
					return acc;
				},
				({}: { [key: string]: any })
			);

			const newGlobalStyles = mergeObject(
				{
					...copyGlobalStyles,
					...(!copyGlobalStyles?.blockeraMetaData
						? { blockeraMetaData: blockeraGlobalStylesMetaData }
						: {}),
				},
				{
					blockeraMetaData: {
						variations: {
							[style.name]: {
								...style,
								enabledIn,
								disabledIn,
							},
						},
						...(Object.keys(blocksMetaDataForSelected).length
							? { blocks: blocksMetaDataForSelected }
							: {}),
					},
					...(Object.keys(blocks).length ? { blocks } : {}),
				},
				{
					forceUpdated: ['isDeleted'],
					deletedProps: ['isDeleted'],
				}
			);

			setState({
				enabledIn,
				disabledIn,
				blockType,
				newGlobalStyles,
			});

			setIsModified(true);
		},
		[
			style,
			state,
			setState,
			setAction,
			validItems,
			globalStyles,
			defaultStyles,
			currentStyleValue,
			currentBlockStyleVariation,
			blockName,
		]
	);

	const handleOnSave = useCallback(() => {
		handleOnSaveUsageForMultipleBlocks({
			style,
			action,
			enabledIn: state.enabledIn,
			disabledIn: state.disabledIn,
			blockType: state.blockType,
			newGlobalStyles: state.newGlobalStyles,
			validItems,
			selectedBlockStyle,
		});
	}, [
		state,
		style,
		action,
		validItems,
		selectedBlockStyle,
		handleOnSaveUsageForMultipleBlocks,
	]);

	if (!items || !itemsCount) {
		return <></>;
	}

	const maxSelectableBlocks = applyFilters(
		'blockera.globalStyles.usageForMultipleBlocks.maxBlocks',
		2
	);
	const remainingBlocks =
		maxSelectableBlocks !== -1
			? Math.max(0, maxSelectableBlocks - blocksState.items.length)
			: null;

	return (
		<>
			<Fill name="usage-for-multiple-blocks-save-cancel-actions">
				<Flex justifyContent="space-between">
					{!isSaving && (
						<Button
							data-test="save-usage-for-multiple-blocks-button"
							disabled={
								!isModified &&
								isEquals(blocksState, initBlocksState)
							}
							variant="primary"
							onClick={() => {
								setIsSaving(true);
								setTimeout(() => {
									handleOnSave();
									// Clear action state.
									setAction(null);
									setIsOpenUsageForMultipleBlocks(false);
								}, 10);
							}}
						>
							{__('Save', 'blockera')}
						</Button>
					)}
					{isSaving && (
						<Button variant="primary">
							<Animate type="loading">
								{({ className: animateClassName }) => (
									<Flex
										className={classNames(
											'message',
											animateClassName
										)}
										direction="row"
										gap={5}
										alignItems="center"
										style={{
											fontSize: '14px',
											marginRight: '5px',
										}}
									>
										<Icon icon={'cloud'} library="wp" />

										{__('Saving…', 'blockera')}
									</Flex>
								)}
							</Animate>
						</Button>
					)}

					<Button
						data-test="cancel-usage-for-multiple-blocks-button"
						variant="tertiary"
						onClick={() => setIsOpenUsageForMultipleBlocks(false)}
					>
						{__('Cancel', 'blockera')}
					</Button>
				</Flex>
			</Fill>
			<Fill name="usage-for-multiple-blocks-actions">
				<Button
					variant="secondary"
					contentAlign="left"
					className={controlInnerClassNames('action-button')}
					onClick={() => {
						const blockToKeep = selectedBlockStyle || blockName;
						const keepItems = blockToKeep ? [blockToKeep] : [];
						setBlocksState({
							items: keepItems,
							primitiveItems: blocksState.primitiveItems,
						});
						setGlobalData('disable-all', '', keepItems);
					}}
				>
					{__('Disable all', 'blockera')}
				</Button>
				<Button
					variant="secondary"
					contentAlign="left"
					className={controlInnerClassNames('action-button')}
					onClick={() => {
						let enableItems;
						if (
							-1 !== maxSelectableBlocks &&
							blocksState.items.length >= maxSelectableBlocks
						) {
							setIsShowPromotion(true);
							return;
						}
						if (maxSelectableBlocks === -1) {
							enableItems = validItems.map((item) => item.name);
						} else {
							const toAdd = validItems.filter(
								(v) => !blocksState.items.includes(v.name)
							);
							const addCount = Math.min(
								remainingBlocks ?? 0,
								toAdd.length
							);
							enableItems = [
								...blocksState.items,
								...toAdd.slice(0, addCount).map((v) => v.name),
							];
						}
						if (enableItems.length === 0) {
							return;
						}
						setBlocksState({
							items: enableItems,
							primitiveItems: blocksState.primitiveItems,
						});
						setGlobalData('enable-all', '', enableItems);
					}}
				>
					{__('Enable all', 'blockera')}
				</Button>
				<Flex>
					{remainingBlocks !== null && (
						<span>
							{sprintf(
								/* translators: %d: number of remaining blocks user can select */
								_n(
									'%d remaining block',
									'%d remaining blocks',
									remainingBlocks,
									'blockera'
								),
								remainingBlocks
							)}
						</span>
					)}
					{isShowPromotion && (
						<>
							{' - '}
							<a
								href={UPGRADE_PRO_URL}
								target="_blank"
								rel="noopener noreferrer"
							>
								{__('Upgrade to PRO', 'blockera')}
							</a>
						</>
					)}
				</Flex>
			</Fill>
			<Flex
				direction={'column'}
				className={classNames(
					'blockera-block-inserter',
					`blockera-block-inserter-types`
				)}
				gap="20px"
			>
				{categorySections.map(
					({ slug, title, items: sectionItems }) => (
						<Flex
							key={slug}
							direction="column"
							gap="8px"
							className="blockera-search-block-types-category-group"
						>
							<h2
								className={classNames(
									'blockera-block-styles-category'
								)}
							>
								{title}
							</h2>
							<Grid
								gridTemplateColumns={'repeat(3, 1fr)'}
								gap={'8px'}
								className={`blockera-features-types blockera-feature-wrapper`}
							>
								{sectionItems.map((item) => (
									<BlockType
										item={item}
										blockName={blockName}
										blocksState={blocksState}
										setGlobalData={setGlobalData}
										key={`${slug}-${item.name}`}
										setBlocksState={setBlocksState}
										maxSelectableBlocks={
											maxSelectableBlocks
										}
										setIsShowPromotion={setIsShowPromotion}
									/>
								))}
							</Grid>
						</Flex>
					)
				)}
			</Flex>
		</>
	);
};

const BlockType = ({
	item,
	blockName,
	blocksState,
	setGlobalData,
	setBlocksState,
	maxSelectableBlocks,
	setIsShowPromotion,
}: Object): MixedElement => {
	const {
		name,
		title,
		icon: { src: icon },
	} = item || {
		name: '',
		title: '',
		description: '',
		icon: { src: '' },
	};

	const id = name;

	const nameSplitted = name ? name.split('/') : [];

	// Check if item is null or undefined.
	if (!item) {
		return <></>;
	}

	return (
		<Tooltip
			text={
				<>
					<h5>{sprintf('%s Block', title)}</h5>

					<code style={{ margin: '5px 0' }}>
						{nameSplitted.length === 2 ? (
							<>
								<span
									style={{
										opacity: '0.7',
									}}
								>
									{nameSplitted[0]}
								</span>
								<span
									style={{
										opacity: '0.7',
										margin: '0 3px',
									}}
								>
									/
								</span>
								{nameSplitted[1]}
							</>
						) : (
							<>{name}</>
						)}
					</code>
				</>
			}
			width="220px"
			delay={1500}
		>
			<Flex
				data-test={id}
				aria-label={name}
				alignItems="center"
				className={classNames('blockera-feature-type', 'is-item')}
			>
				{icon && (
					<div className={classNames('blockera-feature-icon')}>
						{isString(icon) ? (
							<WordPressIconComponent icon={icon} />
						) : (
							icon
						)}
					</div>
				)}

				<div className={classNames('blockera-feature-label')}>
					{title}
				</div>

				<div style={{ marginLeft: 'auto' }}>
					<WPToggleControl
						label={' '}
						checked={blocksState.items.includes(name)}
						disabled={name === blockName}
						className={controlClassNames('toggle', 'size-normal')}
						onChange={(newValue: boolean) => {
							if (name === blockName && !newValue) {
								return;
							}
							if (newValue) {
								if (
									-1 !== maxSelectableBlocks &&
									blocksState.items.length >=
										maxSelectableBlocks
								) {
									setIsShowPromotion(true);
									return;
								}
							} else {
								setIsShowPromotion(false);
							}

							// Use functional update to avoid stale state on rapid toggles
							let nextItems;
							setBlocksState((prev) => {
								nextItems = prev.items.includes(name)
									? prev.items.filter((item) => item !== name)
									: [...prev.items, name];
								return { ...prev, items: nextItems };
							});

							setGlobalData(
								newValue ? 'single-enable' : 'single-disable',
								name,
								nextItems
							);
						}}
					/>
				</div>
			</Flex>
		</Tooltip>
	);
};
