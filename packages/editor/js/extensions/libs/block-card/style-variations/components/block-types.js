// @flow

/**
 * External dependencies
 */
import type { MixedElement } from 'react';
import { __, sprintf } from '@wordpress/i18n';
import { select, dispatch } from '@wordpress/data';
import { useEntityProp } from '@wordpress/core-data';
import { useState, useCallback, useEffect } from '@wordpress/element';
import { Icon as WordPressIconComponent, Fill } from '@wordpress/components';
import { registerBlockStyle, unregisterBlockStyle } from '@wordpress/blocks';

/**
 * Blockera dependencies
 */
import { isString, mergeObject } from '@blockera/utils';
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
import { blockHasStyle } from './use-block-style-item/helpers';

export const BlockTypes = ({
	items,
	style,
	blockName,
	blockTitle,
	handleOnUsageForMultipleBlocks,
}: {
	items: Object,
	style: Object,
	blockName: string,
	blockTitle: string,
	handleOnUsageForMultipleBlocks: (
		style: Object,
		action: 'add' | 'delete'
	) => void,
}): MixedElement => {
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
	const [forceDisableICurrentBlock, setForceDisableICurrentBlock] =
		useState(false);
	const [action, setAction] = useState(null);
	const [blocksState, setBlocksState] = useState({
		all: false,
		items:
			globalStyles?.blockeraMetaData?.variations?.[
				style.name
			]?.enabledIn?.filter((blockType) => {
				const disabledIn =
					globalStyles?.blockeraMetaData?.variations?.[style.name]
						?.disabledIn;

				return !disabledIn?.includes(blockType);
			}) || enabledItems,
	});

	useEffect(() => {
		if (!action) {
			return;
		}

		const timeoutId = setTimeout(() => {
			if ('disable-all' === action) {
				validItems.forEach((blockType) => {
					if (
						!forceDisableICurrentBlock &&
						blockType.name === blockName
					) {
						return;
					}

					unregisterBlockStyle(blockType.name, style.name);
				});

				deleteStyleVariationBlocks(style.name, false);

				if (forceDisableICurrentBlock) {
					handleOnUsageForMultipleBlocks(style, 'delete');
				}
			} else if ('enable-all' === action) {
				validItems.forEach((blockType) => {
					registerBlockStyle(blockType.name, style);
				});
				setStyleVariationBlocks(
					style.name,
					validItems.map((blockType) => blockType.name)
				);
				handleOnUsageForMultipleBlocks(style, 'add');
			} else if ('single-enable' === action) {
				handleOnUsageForMultipleBlocks(style, 'add');
			} else if (
				'single-disable' === action &&
				forceDisableICurrentBlock
			) {
				handleOnUsageForMultipleBlocks(style, 'delete');
			}

			setAction(null);
		}, 1000);

		return () => clearTimeout(timeoutId);
	}, [
		action,
		style,
		blockName,
		validItems,
		setStyleVariationBlocks,
		forceDisableICurrentBlock,
		deleteStyleVariationBlocks,
		handleOnUsageForMultipleBlocks,
	]);

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

			if ('disable-all' === action) {
				disabledIn = validItems
					.map((blockType) => {
						if (
							!forceDisableICurrentBlock &&
							blockType.name === blockName
						) {
							return null;
						}

						return blockType.name;
					})
					.filter(Boolean);
				enabledIn = [];
				setAction('disable-all');
			} else if ('enable-all' === action) {
				disabledIn = [];
				enabledIn = validItems.map((blockType) => blockType.name);
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
				setStyleVariationBlocks(style.name, enabledIn);
				registerBlockStyle(blockType, style);
			} else if ('single-disable' === action) {
				if (!forceDisableICurrentBlock && blockType === blockName) {
					return;
				}

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
				deleteStyleVariationBlocks(style.name, true, blockType);
				unregisterBlockStyle(blockType, style.name);
			}

			const { blockeraGlobalStylesMetaData } = window;
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
				}
			);

			window.blockeraGlobalStylesMetaData =
				newGlobalStyles.blockeraMetaData;

			setGlobalStyles(newGlobalStyles);
		},
		[
			style,
			setAction,
			blockName,
			validItems,
			globalStyles,
			setGlobalStyles,
			setStyleVariationBlocks,
			forceDisableICurrentBlock,
			deleteStyleVariationBlocks,
		]
	);

	if (!items || !itemsCount) {
		return <></>;
	}

	return (
		<>
			<Fill name="usage-for-multiple-blocks-force-disable-current-block">
				<ControlContextProvider
					value={{
						name: `${blockName}-${style.name}-force-disable-current-block`,
						value: forceDisableICurrentBlock,
					}}
				>
					<ToggleControl
						labelType="self"
						label={
							<span style={{ color: 'red' }}>
								{sprintf(
									/* translators: $1%s is a block title. */
									__(
										'Permanently disable and delete the style from the current selected “%1$s” block.',
										'blockera'
									),
									blockTitle
								)}
							</span>
						}
						onChange={(newValue: boolean) => {
							setForceDisableICurrentBlock(newValue);
						}}
					/>
				</ControlContextProvider>
			</Fill>
			<Fill name="usage-for-multiple-blocks-actions">
				<Button
					variant="secondary"
					contentAlign="left"
					disabled={null !== action && 'disable-all' !== action}
					className={controlInnerClassNames('action-button')}
					onClick={() => {
						setBlocksState({ all: false, items: [] });
						setGlobalData('disable-all');
					}}
				>
					{'disable-all' === action
						? __('Disabling…', 'blockera')
						: __('Disable all', 'blockera')}
				</Button>

				<Button
					variant="secondary"
					contentAlign="left"
					disabled={null !== action && 'enable-all' !== action}
					className={controlInnerClassNames('action-button')}
					onClick={() => {
						setBlocksState({
							all: true,
							items: validItems.map((item) => item.name),
						});
						setGlobalData('enable-all');
					}}
				>
					{'enable-all' === action
						? __('Enabling…', 'blockera')
						: __('Enable all', 'blockera')}
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
					{validItems
						.sort((a, b) => {
							const aHasStyle = blockHasStyle(a.name, style.name)
								? 1
								: 0;
							const bHasStyle = blockHasStyle(b.name, style.name)
								? 1
								: 0;

							return bHasStyle - aHasStyle; // Sort enabled items first
						})
						.map((item, index) => (
							<BlockType
								item={item}
								style={style}
								blocksState={blocksState}
								setGlobalData={setGlobalData}
								key={index + '-' + item.name}
								setBlocksState={setBlocksState}
								notAllowed={
									!forceDisableICurrentBlock &&
									item.name === blockName
								}
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
	notAllowed,
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
					<div
						style={
							notAllowed
								? {
										display: 'inline-block',
										opacity: 0.5,
										pointerEvents: 'none',
								  }
								: { display: 'inline-block' }
						}
					>
						<ToggleControl
							labelType={'self'}
							label={' '}
							onChange={(newValue: boolean) => {
								if (notAllowed && !newValue) {
									return;
								}

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
