// @flow

/**
 * External dependencies
 */
import type { MixedElement } from 'react';
import { __, sprintf } from '@wordpress/i18n';
import { select, dispatch } from '@wordpress/data';
import { useEntityProp } from '@wordpress/core-data';
import {
	Fill,
	Animate,
	Icon as WordPressIconComponent,
} from '@wordpress/components';
import { registerBlockStyle, unregisterBlockStyle } from '@wordpress/blocks';
import { useState, useCallback, useEffect, useMemo } from '@wordpress/element';

/**
 * Blockera dependencies
 */
import { Icon } from '@blockera/icons';
import { isString, mergeObject, isEquals } from '@blockera/utils';
import { classNames, controlInnerClassNames } from '@blockera/classnames';
import {
	Flex,
	Grid,
	Button,
	Tooltip,
	ToggleControl,
	ControlContextProvider,
} from '@blockera/controls';

/**
 * Internal dependencies
 */
import {
	getBlockeraGlobalStylesMetaData,
	setBlockeraGlobalStylesMetaData,
} from '../../helpers';
import { blockHasStyle } from './use-block-style-item/helpers';
import { getNormalizedStyle, useGlobalStylesPanelContext } from '../context';

export const BlockTypes = ({
	items,
	style,
	handleOnUsageForMultipleBlocks,
	setIsOpenUsageForMultipleBlocks,
}: {
	items: Object,
	style: Object,
	blockName: string,
	blockTitle: string,
	handleOnUsageForMultipleBlocks: (
		style: Object,
		action: 'add' | 'delete'
	) => void,
	setIsOpenUsageForMultipleBlocks: (isOpen: boolean) => void,
}): MixedElement => {
	const {
		defaultStyles,
		style: currentStyleValue,
		currentBlockStyleVariation,
	} = useGlobalStylesPanelContext();
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
	const enabledItems = validItems
		.filter((item) => blockHasStyle(item.name, style.name))
		.map((item) => item.name);
	const { setStyleVariationBlocks, deleteStyleVariationBlocks } =
		dispatch('blockera/editor');
	const postId = select('core').__experimentalGetCurrentGlobalStylesId();
	const [globalStyles, setGlobalStyles] = useEntityProp(
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
							...enabledItems,
							...(savedEnabledItems?.filter((blockType) => {
								const disabledIn =
									globalStyles?.blockeraMetaData
										?.variations?.[style.name]?.disabledIn;

								return !disabledIn?.includes(blockType);
							}) || []),
					  ]
					: enabledItems,
			primitiveItems: validItems.sort((a, b) => {
				const aHasStyle = blockHasStyle(a.name, style.name) ? 1 : 0;
				const bHasStyle = blockHasStyle(b.name, style.name) ? 1 : 0;

				return bHasStyle - aHasStyle; // Sort enabled items first
			}),
		}),
		// eslint-disable-next-line react-hooks/exhaustive-deps
		[]
	);
	const [blocksState, setBlocksState] = useState(initBlocksState);
	const [state, setState] = useState({
		enabledIn: [],
		disabledIn: [],
		blockType: null,
		newGlobalStyles: globalStyles,
	});
	const [isModified, setIsModified] = useState(false);

	useEffect(() => {
		if (isEquals(blocksState, initBlocksState)) {
			return;
		}

		setBlocksState(initBlocksState);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [items]);

	const setGlobalData = useCallback(
		(
			action:
				| 'disable-all'
				| 'enable-all'
				| 'single-enable'
				| 'single-disable',
			blockType: string
		) => {
			let disabledIn: Array<string> = [];
			let enabledIn: Array<string> = [];
			const allBlockTypes = validItems.reduce(
				(acc, blockType) => [...acc, blockType.name],
				[]
			);
			let blocks: { [key: string]: any } = {};

			if ('disable-all' === action) {
				disabledIn = allBlockTypes;
				enabledIn = [];
				setAction('disable-all');
			} else if ('enable-all' === action) {
				disabledIn = [];
				enabledIn = allBlockTypes;
				blocks = {
					...Object.fromEntries(
						allBlockTypes.map((block: Object) => [
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
				disabledIn =
					globalStyles?.blockeraMetaData?.variations?.[
						style.name
					]?.disabledIn?.filter((type) => type !== blockType) || [];
				enabledIn = [
					...new Set([
						...(globalStyles?.blockeraMetaData?.variations?.[
							style.name
						]?.enabledIn || []),
						blockType,
					]),
				];
				blocks = {
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
				setAction('single-enable');
			} else if ('single-disable' === action) {
				disabledIn = [
					...new Set([
						...(globalStyles?.blockeraMetaData?.variations?.[
							style.name
						]?.disabledIn || []),
						blockType,
					]),
				];
				enabledIn =
					globalStyles?.blockeraMetaData?.variations?.[
						style.name
					]?.enabledIn?.filter((type) => type !== blockType) || [];
				setAction('single-disable');
			}

			const blockeraGlobalStylesMetaData =
				getBlockeraGlobalStylesMetaData();
			const newGlobalStyles = mergeObject(
				{
					...globalStyles,
					...(!globalStyles?.blockeraMetaData
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
					},
					blocks,
				}
			);

			setBlockeraGlobalStylesMetaData(newGlobalStyles.blockeraMetaData);

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
			setState,
			setAction,
			validItems,
			globalStyles,
			currentStyleValue,
			currentBlockStyleVariation,
		]
	);

	const handleOnSave = useCallback(() => {
		if ('disable-all' === action) {
			deleteStyleVariationBlocks(style.name, false);
			validItems.map((item) => {
				// Compatible with WordPress core/blocks store api.
				unregisterBlockStyle(item.name, style.name);

				return item.name;
			});
			handleOnUsageForMultipleBlocks(style, 'delete');
		} else if ('enable-all' === action) {
			setStyleVariationBlocks(
				style.name,
				validItems.map((item) => {
					// Compatible with WordPress core/blocks store api.
					registerBlockStyle(item.name, style);

					return item.name;
				})
			);
			handleOnUsageForMultipleBlocks(style, 'add');
		} else if ('single-enable' === action) {
			handleOnUsageForMultipleBlocks(style, 'add');
			setStyleVariationBlocks(style.name, state.enabledIn);
			registerBlockStyle(state.blockType, style);
		} else if ('single-disable' === action) {
			handleOnUsageForMultipleBlocks(style, 'delete');
			deleteStyleVariationBlocks(style.name, true, state.blockType);
			unregisterBlockStyle(state.blockType, style.name);
		}

		setGlobalStyles(state.newGlobalStyles);
	}, [
		state,
		style,
		action,
		validItems,
		setGlobalStyles,
		setStyleVariationBlocks,
		deleteStyleVariationBlocks,
		handleOnUsageForMultipleBlocks,
	]);

	if (!items || !itemsCount) {
		return <></>;
	}

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
						setBlocksState({
							items: [],
							primitiveItems: blocksState.primitiveItems,
						});
						setGlobalData('disable-all');
					}}
				>
					{__('Disable all', 'blockera')}
				</Button>

				<Button
					variant="secondary"
					contentAlign="left"
					className={controlInnerClassNames('action-button')}
					onClick={() => {
						setBlocksState({
							items: validItems.map((item) => item.name),
							primitiveItems: blocksState.primitiveItems,
						});
						setGlobalData('enable-all');
					}}
				>
					{__('Enable all', 'blockera')}
				</Button>
			</Fill>
			<Flex
				direction={'column'}
				className={classNames(
					'blockera-block-inserter',
					`blockera-block-inserter-types`
				)}
				gap="10px"
			>
				<Grid
					gridTemplateColumns={'repeat(3, 1fr)'}
					gap={'8px'}
					className={`blockera-features-types blockera-feature-wrapper`}
				>
					{blocksState.primitiveItems.map((item, index) => (
						<BlockType
							item={item}
							style={style}
							blocksState={blocksState}
							setGlobalData={setGlobalData}
							key={index + '-' + item.name}
							setBlocksState={setBlocksState}
						/>
					))}
				</Grid>
			</Flex>
		</>
	);
};

const BlockType = ({
	item,
	style,
	blocksState,
	setGlobalData,
	setBlocksState,
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
				justifyContent="space-between"
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

				<ControlContextProvider
					value={{
						name: `${name}-${style.name}-toggle`,
						value: blocksState.items.includes(name),
					}}
				>
					<div>
						<ToggleControl
							labelType={'self'}
							label={' '}
							onChange={(newValue: boolean) => {
								setBlocksState({
									...blocksState,
									items: blocksState.items.includes(name)
										? blocksState.items.filter(
												(item) => item !== name
										  )
										: [...blocksState.items, name],
								});
								setGlobalData(
									newValue
										? 'single-enable'
										: 'single-disable',
									name
								);
							}}
						/>
					</div>
				</ControlContextProvider>
			</Flex>
		</Tooltip>
	);
};
