// @flow

/**
 * External dependencies
 */
import { __ } from '@wordpress/i18n';
import type { MixedElement } from 'react';

/**
 * Blockera dependencies
 */
import { Flex, Grid } from '@blockera/controls';
import { classNames } from '@blockera/classnames';

/**
 * Internal dependencies
 */
import type { TCategorizedItemsProps } from '../types';
import type { InnerBlockModel } from '../../block-card/inner-blocks/types';
import type { TStates, StateTypes } from '../../block-card/block-states/types';

export const CategorizedItems = ({
	itemType = 'state',
	items,
	title,
	states,
	category,
	clientId,
	savedStates,
	getBlockType,
	setBlockState,
	customSelector,
	getBlockInners,
	limited = false,
	setCurrentBlock,
	setBlockClientInners,
}: TCategorizedItemsProps): MixedElement => {
	// Filtering items while not exists on received category ...
	if (limited && items) {
		items = items.filter(
			(innerBlock: InnerBlockModel): boolean =>
				category ===
				(innerBlock?.category ||
					getBlockType(innerBlock?.name)?.category)
		);
	}

	const itemsCount = Array.isArray(items)
		? items.length
		: Object.keys(items || {}).length;

	if (!items || !itemsCount) {
		return <></>;
	}

	const onClick = (item: Object, id: string) => {
		const { name, type } = item;

		if (name) {
			const inners = getBlockInners(clientId);

			setBlockClientInners({
				clientId,
				inners: {
					...inners,
					// $FlowFixMe
					[id]: item,
				},
			});

			setCurrentBlock(id);
		} else if (type) {
			const newStates: {
				[key: TStates]: StateTypes,
			} = {
				...savedStates,
				[type]: {
					...states[type],
					...(customSelector?.type === type && customSelector),
					isSelected: true,
					selectable: true,
				},
			};

			// Reset isSelected flag for all other states
			Object.keys(newStates).forEach((stateName) => {
				if (stateName !== type) {
					// $FlowFixMe
					newStates[stateName].isSelected = false;
				}
			});

			setBlockState(newStates);
		}
	};

	return (
		<Flex
			direction={'column'}
			className={classNames(
				'blockera-block-inserter',
				`blockera-block-inserter-types-${itemType}`
			)}
			gap="10px"
		>
			<h2 className={classNames('blockera-block-features-category')}>
				{title}
			</h2>

			<Grid
				gridTemplateColumns={'repeat(2, 1fr)'}
				gap={'5px'}
				className={`blockera-features-types blockera-feature-${category}-wrapper`}
			>
				{items.map(
					(
						item: StateTypes | InnerBlockModel,
						index: number
					): MixedElement => {
						const { name, type, icon, label, settings } = item;

						let id = name || type;

						if (
							'custom-class' === item?.type &&
							1 === items.length
						) {
							const style = {
								color: '#147EB8',
								margin: '0 5px',
							};

							return (
								<div
									key={index}
									className={classNames(
										'blockera-custom-css-selector'
									)}
								>
									<div
										onClick={() => onClick(item, id)}
										className={classNames(
											'blockera-custom-css-selector-wrapper',
											{
												'is-item': true,
											}
										)}
									>
										{__('Add', 'blockera')}
										<strong style={style}>
											{(item: any)['css-class']}
										</strong>
										{__('as a custom selector', 'blockera')}
									</div>
									<p>
										{__('You can use', 'blockera')}
										<strong style={style}>&</strong>
										{__(
											'for selecting current block.',
											'blockera'
										)}
										{__('For example:', 'blockera')}
										<strong style={style}>&:hover</strong>
									</p>
								</div>
							);
						}

						// We skip force blocks in regenerating id process.
						if (!settings?.force) {
							// We do add exceptions for picked inner block identifier in here.
							// Usually use instanceId of block settings to re-generate identifier for that. any way, we do support "level" number for heading instances.
							if (
								'core/heading' === name &&
								'undefined' !== typeof settings?.level
							) {
								id = `${name}-${settings?.level}`;
							} else if (name && settings?.instanceId) {
								id = `${name}-${settings?.instanceId}`;
							}
						}

						return (
							<div
								key={index}
								aria-label={id}
								onClick={() => onClick(item, id)}
								data-test={'blockera-feature-type'}
								className={classNames(
									'blockera-feature-type',
									'is-item'
								)}
							>
								{icon && (
									<div
										className={classNames(
											'blockera-feature-icon'
										)}
									>
										{icon}
									</div>
								)}

								<div
									className={classNames(
										'blockera-feature-label'
									)}
								>
									{label}
								</div>
							</div>
						);
					}
				)}
			</Grid>
		</Flex>
	);
};
