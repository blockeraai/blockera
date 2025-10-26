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
import { Icon } from '@blockera/icons';

/**
 * Internal dependencies
 */
import { blockHasStyle } from './use-block-style-item/helpers';

export const BlockTypes = ({
	items,
	style,
	handleOnUsageForMultipleBlocks,
}: {
	items: Object,
	style: Object,
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
	const { setStyleVariationBlocks, deleteStyleVariationBlock } =
		dispatch('blockera/editor');
	const postId = select('core').__experimentalGetCurrentGlobalStylesId();
	const [globalStyles, setGlobalStyles] = useEntityProp(
		'root',
		'globalStyles',
		'styles',
		postId
	);
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
				deleteStyleVariationBlock(style.name, false);
				// FIXME: @ali This is close modal and removed the style variation from list.
				// validItems.forEach((blockType) =>
				// 	unregisterBlockStyle(blockType.name, style.name)
				// );
				// handleOnUsageForMultipleBlocks(style, 'delete');
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
			}
			// FIXME: @ali This is close modal and removed the style variation from list.
			// else if ('single-disable' === action) {
			// 	handleOnUsageForMultipleBlocks(style, 'delete');
			// }

			setAction(null);
		}, 1000);

		return () => clearTimeout(timeoutId);
	}, [
		action,
		style,
		validItems,
		setStyleVariationBlocks,
		deleteStyleVariationBlock,
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
				disabledIn = validItems.map((blockType) => blockType.name);
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
				deleteStyleVariationBlock(style.name, true, blockType);
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
		[style, validItems, globalStyles, setGlobalStyles, setAction]
	);

	if (!items || !itemsCount) {
		return <></>;
	}

	return (
		<>
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
					<Icon icon="attachment" iconSize="24" />
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
					<Icon icon="attachment" iconSize="24" />
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
					{validItems.map((item, index) => (
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
								newValue ? 'single-enable' : 'single-disable',
								name
							);
						}}
					/>
				</ControlContextProvider>
			</Flex>
		</Tooltip>
	);
};
