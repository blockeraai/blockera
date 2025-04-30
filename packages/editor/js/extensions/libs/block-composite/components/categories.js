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

/**
 * Internal dependencies
 */
import {
	isElement,
	getVirtualInnerBlockDescription,
} from '../../block-card/inner-blocks/helpers';
import { CategorizedItems } from './categorized-items';
import type { TCategoriesProps } from '../types/categories';
import { search, getNormalizedCssSelector } from '../search-items';

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

	const categorizedItemsProps = {
		states,
		clientId,
		savedStates,
		getBlockType,
		setBlockState,
		getBlockInners,
		customSelector,
		setCurrentBlock,
		setBlockClientInners,
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
								...(_elements || []),
								...(_blocks || []),
								...Object.values(_states),
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
					{...categorizedItemsProps}
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
					{...categorizedItemsProps}
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
						{...categorizedItemsProps}
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
						{...categorizedItemsProps}
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
