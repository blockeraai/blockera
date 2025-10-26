// @flow

/**
 * External dependencies
 */
import type { MixedElement } from 'react';
import { __, sprintf } from '@wordpress/i18n';
import { useState } from '@wordpress/element';
import { Icon as WordPressIconComponent, Fill } from '@wordpress/components';
import { registerBlockStyle, unregisterBlockStyle } from '@wordpress/blocks';

/**
 * Blockera dependencies
 */
import { isString } from '@blockera/utils';
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
	itemType = 'state',
}: Object): MixedElement => {
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

	const [blocksState, setBlocksState] = useState({
		all: false,
		items: enabledItems,
	});

	if (!items || !itemsCount) {
		return <></>;
	}

	return (
		<>
			<Fill name="usage-for-multiple-blocks-actions">
				<Button
					variant="secondary"
					contentAlign="left"
					className={controlInnerClassNames('action-button')}
					onClick={() => setBlocksState({ all: false, items: [] })}
				>
					<Icon icon="attachment" iconSize="24" />
					{__('Disable all', 'blockera')}
				</Button>

				<Button
					variant="secondary"
					contentAlign="left"
					className={controlInnerClassNames('action-button')}
					onClick={() =>
						setBlocksState({
							all: true,
							items: validItems.map((item) => item.name),
						})
					}
				>
					<Icon icon="attachment" iconSize="24" />
					{__('Enable all', 'blockera')}
				</Button>
			</Fill>
			<Flex
				direction={'column'}
				className={classNames(
					'blockera-block-inserter',
					`blockera-block-inserter-types-${itemType}`
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
							if (newValue) {
								registerBlockStyle(name, style);
							} else {
								unregisterBlockStyle(name);
							}

							setBlocksState({
								...blocksState,
								items: blocksState.items.includes(name)
									? blocksState.items.filter(
											(item) => item !== name
									  )
									: [...blocksState.items, name],
							});
						}}
					/>
				</ControlContextProvider>
			</Flex>
		</Tooltip>
	);
};
