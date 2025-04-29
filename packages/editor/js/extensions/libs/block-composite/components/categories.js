// @flow

/**
 * External dependencies
 */
import { __ } from '@wordpress/i18n';
import { select } from '@wordpress/data';
import type { MixedElement } from 'react';
import { useState } from '@wordpress/element';

/**
 * Blockera dependencies
 */
import {
	ControlContextProvider,
	Flex,
	SearchControl,
	Tooltip,
} from '@blockera/controls';
import { Icon } from '@blockera/icons';
import { classNames } from '@blockera/classnames';

/**
 * Internal dependencies
 */
import {
	isElement,
	getVirtualInnerBlockDescription,
} from '../../block-card/inner-blocks/helpers';
import type { TCategoriesProps } from '../types/categories';
import { search, getNormalizedCssSelector } from '../search-items';
import type { StateTypes } from '../../block-card/block-states/types';
import type { InnerBlockModel } from '../../block-card/inner-blocks/types';

export const Categories = ({
	states: _states,
	blocks: _blocks,
	elements: _elements,
	clientId,
	savedStates,
	setBlockState,
	getBlockInners,
	setCurrentBlock,
	setBlockClientInners,
}: TCategoriesProps): MixedElement => {
	const [customSelector, setCustomSelector] = useState(
		_states['custom-class']
	);
	const [states, setStates] = useState(_states);
	const [blocks, setBlocks] = useState(_blocks);
	const [elements, setElements] = useState(_elements);
	const [searchTerm, setSearchTerm] = useState('');
	const { getCategories, getBlockType, getCollections } =
		select('core/blocks');

	const CategorizedItems = ({
		items,
		title,
		category,
		limited = false,
	}: Object): MixedElement => {
		// Filtering items while not exists on recieved category ...
		if (limited && items) {
			items = items.filter(
				(innerBlock: InnerBlockModel): boolean =>
					category ===
					(innerBlock?.category ||
						getBlockType(innerBlock?.name)?.category)
			);
		}

		if (!items || !Object.keys(items).length) {
			return <></>;
		}

		return (
			<Flex
				direction={'column'}
				className={classNames('blockera-block-inserter')}
				gap="10px"
			>
				<h2 className={classNames('blockera-block-features-category')}>
					{title}
				</h2>

				<Flex
					gap={'5'}
					flexWrap={'wrap'}
					justifyContent={'flex-start'}
					className={`blockera-features-types blockera-feature-${category}-wrapper`}
				>
					{items.map(
						(
							item: StateTypes | InnerBlockModel,
							index: number
						): MixedElement => {
							const { name, type, icon, label, settings } = item;

							let id = name || type;

							const onClick = () => {
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
									const newStates = {
										...savedStates,
										// $FlowFixMe
										[type]: {
											...states[type],
											...customSelector,
											isSelected: true,
										},
									};
									setBlockState(newStates);
								}
							};

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
											onClick={onClick}
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
											{__(
												'as a custom selector',
												'blockera'
											)}
										</div>
										<p>
											{__('You can use', 'blockera')}
											<strong style={style}>&</strong>
											{__(
												'for selecting current block.',
												'blockera'
											)}
											{__('For example:', 'blockera')}
											<strong style={style}>
												&:hover
											</strong>
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
									onClick={onClick}
									data-test={'blockera-feature-type'}
									className={classNames(
										'blockera-feature-type',
										{
											'is-item': true,
										}
									)}
								>
									<div
										className={classNames(
											'blockera-feature-icon'
										)}
									>
										{icon}
									</div>
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
				</Flex>
			</Flex>
		);
	};

	return (
		<>
			<ControlContextProvider
				value={{
					name: 'search-block-' + clientId,
					value: searchTerm,
				}}
			>
				<SearchControl
					data-id={'search bar'}
					className={'blockera-features-inserter-search'}
					onChange={(newValue) => {
						setSearchTerm(newValue);

						if (!newValue) {
							setBlocks(_blocks);
							setStates(_states);
							setElements(_elements);

							return;
						}

						const filteredItems = search(
							[
								...elements,
								...blocks,
								...Object.values(states),
								...[customSelector],
							],
							getCategories(),
							getCollections(),
							newValue
						);

						const newBlocks = [];
						const newStates = [];
						const newElements = [];

						filteredItems.forEach((item: Object) => {
							if (isElement(item)) {
								newElements.push(item);
							} else if (item?.type) {
								newStates.push(item);
							} else {
								newBlocks.push(item);
							}
						});

						if (
							!newBlocks.length &&
							!newElements.length &&
							!newStates.length
						) {
							setCustomSelector({
								..._states['custom-class'],
								'css-class': getNormalizedCssSelector(newValue),
							});
						}

						setBlocks(newBlocks);
						setStates(newStates);
						setElements(newElements);
					}}
					placeholder={__('Search', 'blockera')}
				/>
			</ControlContextProvider>

			{!elements?.length &&
				!blocks?.length &&
				!Object.values(states)?.length && (
					<>
						<Flex
							alignItems={'center'}
							direction={'column'}
							justifyContent={'space-between'}
							gap="0"
							style={{ padding: '40px 0' }}
						>
							<Icon
								icon={'block-default'}
								library={'wp'}
								style={{ fill: '#949494' }}
							/>

							<p data-test={'not-found-text'}>
								{__('No results found.', 'blockera')}
							</p>
						</Flex>
					</>
				)}

			{Object.values(states)?.length > 0 && (
				<CategorizedItems
					items={Object.values(states)}
					category={'pseudo-states'}
					title={
						<>
							{__('Pseudo States', 'blockera')}

							<Tooltip
								width="220px"
								style={{ padding: '12px' }}
								text={__(
									'Pseudo states are used to describe the state of a block.',
									'blockera'
								)}
							>
								<Icon
									icon="information"
									library="ui"
									iconSize="16"
								/>
							</Tooltip>
						</>
					}
				/>
			)}

			{elements?.length > 0 && (
				<CategorizedItems
					items={elements}
					category={'elements'}
					title={
						<>
							{__('Virtual Blocks', 'blockera')}

							<Tooltip
								width="220px"
								style={{ padding: '12px' }}
								text={getVirtualInnerBlockDescription()}
							>
								<Icon
									icon="information"
									library="ui"
									iconSize="16"
								/>
							</Tooltip>
						</>
					}
				/>
			)}

			{Object.values(getCategories() || {})?.map(
				({ slug, title }, index) => (
					<CategorizedItems
						title={title}
						limited={true}
						items={blocks}
						category={slug}
						key={`${slug}-${index}`}
					/>
				)
			)}

			{!elements?.length &&
				!blocks?.length &&
				!Object.values(states)?.length && (
					<CategorizedItems
						items={[customSelector]}
						category={'custom-selector'}
						title={
							<>
								{__('Custom Selector', 'blockera')}

								<Tooltip
									width="220px"
									style={{ padding: '12px' }}
									text={getVirtualInnerBlockDescription()}
								>
									<Icon
										icon="information"
										library="ui"
										iconSize="16"
									/>
								</Tooltip>
							</>
						}
					/>
				)}
		</>
	);
};
