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
import { search } from '../search-items';
import type { TCategoriesProps } from '../types/categories';
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
				className={classNames('blockera-inner-blocks-inserter')}
				gap="10px"
			>
				<h2 className={classNames('blockera-inner-block-category')}>
					{title}
				</h2>

				<Flex
					gap={'0'}
					flexWrap={'wrap'}
					justifyContent={'flex-start'}
					className={`blockera-inner-block-types blockera-inner-${category}-wrapper`}
				>
					{items.map(
						(
							innerBlock: InnerBlockModel,
							index: number
						): MixedElement => {
							const { name, type, icon, label, settings } =
								innerBlock;

							let id = name || type;

							// We skip force blocks in regenerating id process.
							if (!settings?.force) {
								// We do add exceptions for picked inner block identifier in here.
								// Usually use instanceId of block settings to re-generate identifier for that. any way, we do support "level" number for heading instances.
								if ('core/heading' === name) {
									id = `${name}-${settings?.level}`;
								} else if (settings?.instanceId) {
									id = `${name}-${settings?.instanceId}`;
								}
							}

							return (
								<div
									key={index}
									onClick={() => {
										if (name) {
											const inners =
												getBlockInners(clientId);

											setBlockClientInners({
												clientId,
												inners: {
													...inners,
													[id]: innerBlock,
												},
											});

											setCurrentBlock(id);
										} else if (type) {
											const newStates = {
												...savedStates,
												[type]: {
													...states[type],
													isSelected: true,
												},
											};
											setBlockState(newStates);
										}
									}}
									aria-label={id}
									data-test={'blockera-inner-block-type'}
									className={classNames(
										'blockera-inner-block-type'
									)}
								>
									<div
										className={classNames(
											'blockera-inner-block-icon'
										)}
									>
										{icon}
									</div>
									<div
										className={classNames(
											'blockera-inner-block-label'
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
					className={'blockera-inner-blocks-inserter-search'}
					onChange={(newValue) => {
						setSearchTerm(newValue);

						if (!newValue) {
							setBlocks(_blocks);
							setElements(_elements);

							return;
						}

						const filteredItems = search(
							[...elements, ...blocks, ...Object.values(states)],
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
		</>
	);
};
