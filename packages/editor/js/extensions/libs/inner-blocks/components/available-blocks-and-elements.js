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
} from '@blockera/controls';
import { Icon } from '@blockera/icons';
import { classNames } from '@blockera/classnames';

/**
 * Internal dependencies
 */
import { isElement } from '../helpers';
import { searchBlockItems } from '../search-items';
import type { InnerBlockModel, InnerBlocks } from '../types';

export const AvailableBlocksAndElements = ({
	blocks: _blocks,
	elements: _elements,
	clientId,
	getBlockInners,
	setCurrentBlock,
	setBlockClientInners,
}: {
	clientId: string,
	blocks: InnerBlocks,
	elements: InnerBlocks,
	setBlockClientInners: (args: Object) => void,
	setCurrentBlock: (currentBlock: string) => void,
	getBlockInners: (clientId: string) => InnerBlocks,
}): MixedElement => {
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
		if (limited) {
			items = items.filter(
				(innerBlock: InnerBlockModel): boolean =>
					category ===
					(innerBlock?.category ||
						getBlockType(innerBlock?.name)?.category)
			);
		}

		if (!Object.keys(items).length) {
			return <></>;
		}

		return (
			<Flex
				direction={'column'}
				className={classNames('blockera-inner-blocks-inserter')}
			>
				<h2 className={classNames('blockera-inner-block-category')}>
					{title}
				</h2>
				<Flex
					gap={'30px 11px'}
					flexWrap={'wrap'}
					justifyContent={'flex-start'}
					className={`blockera-inner-block-types blockera-inner-${category}-wrapper`}
				>
					{items.map(
						(
							innerBlock: InnerBlockModel,
							index: number
						): MixedElement => {
							const { name, icon, label, settings } = innerBlock;

							let id = name;

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
										const inners = getBlockInners(clientId);

										setBlockClientInners({
											clientId,
											inners: {
												...inners,
												[id]: innerBlock,
											},
										});

										setCurrentBlock(id);
									}}
									aria-label={id}
									data-id={'blockera-inner-block-type'}
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

						const filteredItems = searchBlockItems(
							[...elements, ...blocks],
							getCategories(),
							getCollections(),
							newValue
						);

						const newBlocks = [];
						const newElements = [];

						filteredItems.forEach((item: Object) => {
							if (isElement(item)) {
								newElements.push(item);
							} else {
								newBlocks.push(item);
							}
						});

						setBlocks(newBlocks);
						setElements(newElements);
					}}
					placeholder={__('Search', 'blockera')}
				/>
			</ControlContextProvider>
			{!elements.length && !blocks.length && (
				<>
					<Flex
						alignItems={'center'}
						direction={'column'}
						justifyContent={'space-between'}
					>
						<Icon icon={'block-default'} library={'wp'} />
						<p data-id={'not-found-text'}>
							{__('No results found.', 'blockera')}
						</p>
					</Flex>
				</>
			)}
			<CategorizedItems
				items={elements}
				category={'elements'}
				title={__('Virtual Blocks', 'blockera')}
			/>
			{Object.values(getCategories() || {}).map(
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
