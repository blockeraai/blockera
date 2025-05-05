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
import { search } from '../search-items'; // TODO: Import getNormalizedCssSelector helper from appropriate location to enable custom-class state rendering when search has no results!
import { getTooltipStyle } from '../utils';

// Define the order of categories
const CATEGORY_ORDER = [
	'special',
	'interactive-states',
	'structural-selectors',
	'content-inserts',
];

// Type for categorized states
type CategorizedStatesType = {
	[key: string]: Array<Object>,
};

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
	// const [customSelector, setCustomSelector] = useState(
	// 	_states['custom-class']
	// );
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
		// customSelector,
		setCurrentBlock,
		setBlockClientInners,
	};

	// Function to group states by category
	const getStatesByCategory = (): CategorizedStatesType => {
		// Filter out the 'normal' state
		const statesList = Object.values(states).filter(
			(state) => state.type !== 'normal'
		);
		const categorizedStates: CategorizedStatesType = {};

		// Initialize categories
		CATEGORY_ORDER.forEach((category) => {
			categorizedStates[category] = [];
		});

		// Group states by their category
		statesList.forEach((state) => {
			const category = state.category || 'other';

			if (!categorizedStates[category]) {
				categorizedStates[category] = [];
			}

			categorizedStates[category].push(state);
		});

		return categorizedStates;
	};

	// Get all state categories from states
	const getStateCategories = (): Array<string> => {
		const statesList = Object.values(states);
		const categories = new Set<string>();

		statesList.forEach((state) => {
			if (state.category) {
				categories.add(state.category);
			}
		});

		return Array.from(categories);
	};

	// Get states grouped by category
	const categorizedStates = getStatesByCategory();

	// Get all categories from states
	const stateCategories = getStateCategories();

	// Sort categories with other categories first, then the specified order
	const sortedCategories = [
		...stateCategories.filter(
			(category) => !CATEGORY_ORDER.includes(category)
		),
		...CATEGORY_ORDER.filter((category) =>
			stateCategories.includes(category)
		),
	];

	// Get tooltip text for a category
	const getCategoryTooltipText = (
		categoryId: string
	): string | MixedElement => {
		switch (categoryId) {
			case 'interactive-states':
				return (
					<>
						<h5>{__('Interactive States', 'blockera')}</h5>
						<p>
							{__(
								'Change block design when user interacting with block like hovering, clicking, focusing, etc.',
								'blockera'
							)}
						</p>
						<p>
							{__(
								'Use these to design responsive feedback like button glows or link highlights.',
								'blockera'
							)}
						</p>
					</>
				);
			case 'structural-selectors':
				return (
					<>
						<h5>{__('Structural Selectors', 'blockera')}</h5>
						<p>
							{__(
								'Target blocks by their spot in the parent block. For example, the current block is the first or last block in the parent.',
								'blockera'
							)}
						</p>
						<p>
							{__(
								'Perfect for clean spacing and alternating patterns.',
								'blockera'
							)}
						</p>
					</>
				);
			case 'content-inserts':
				return (
					<>
						<h5>{__('Content Inserts', 'blockera')}</h5>
						<p style={{ fontSize: '13px', opacity: 0.8 }}>
							[ {__('Pseudo-Elements', 'blockera')} ]
						</p>
						<p>
							{__(
								'Add extra decoration or text inside a block without editing its content.',
								'blockera'
							)}
						</p>
						<p>
							{__(
								'Idea for adding icons before block content, ribbons on cards, or custom list bullets.',
								'blockera'
							)}
						</p>
					</>
				);
			case 'special':
				return (
					<>
						<h5>{__('Spacial', 'blockera')}</h5>
						<p>
							{__(
								'Special states or selectors for current block.',
								'blockera'
							)}
						</p>
					</>
				);
			case 'advanced':
				return __(
					'Advanced states provide more complex selection capabilities.',
					'blockera'
				);
			default:
				return __(
					'These states are used to describe the state of a block.',
					'blockera'
				);
		}
	};

	return (
		<Flex direction={'column'} gap={'15px'}>
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

						// Ensure all items are valid objects to prevent errors during search
						const validElements = (_elements || []).filter(
							(item) => item !== null && item !== undefined
						);
						const validBlocks = (_blocks || []).filter(
							(item) => item !== null && item !== undefined
						);
						const validStates = Object.values(_states || {}).filter(
							(item) => item !== null && item !== undefined
						);
						// TODO: Implement custom-class state rendering when search has no results!
						// const validCustomSelector = customSelector
						// 	? [customSelector]
						// 	: [];

						try {
							const filteredItems = search(
								[
									...validElements,
									...validBlocks,
									...validStates,
									// TODO: Implement custom-class state rendering when search has no results!
									// ...validCustomSelector,
								],
								getCategories() || [],
								getCollections() || [],
								newValue
							);

							const newBlocks = [];
							const newStates = [];
							const newElements = [];

							filteredItems.forEach((item: Object) => {
								if (item && isElement(item)) {
									newElements.push(item);
								} else if (item && item.type) {
									newStates.push(item);
								} else if (item) {
									newBlocks.push(item);
								}
							});

							// TODO: Implement custom-class state rendering when search has no results!
							// if (
							// 	!newBlocks.length &&
							// 	!newElements.length &&
							// 	!newStates.length &&
							// 	_states['custom-class']
							// ) {
							// 	setCustomSelector({
							// 		..._states['custom-class'],
							// 		'css-class':
							// 			getNormalizedCssSelector(newValue),
							// 	});
							// }

							setBlocks(newBlocks);
							setStates(newStates);
							setElements(newElements);
						} catch (error) {
							/* @debug-ignore */
							console.error('Search error:', error);
							// Fallback to empty results on error
							setBlocks([]);
							setStates({});
							setElements([]);
						}
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

			{Object.values(states)?.length > 0 &&
				sortedCategories.map((category) => {
					if (
						!categorizedStates[category] ||
						categorizedStates[category].length === 0
					) {
						return null;
					}

					let categoryTitle;
					switch (category) {
						case 'interactive-states':
							categoryTitle = __(
								'Interactive States',
								'blockera'
							);
							break;
						case 'structural-selectors':
							categoryTitle = __(
								'Structural Selectors',
								'blockera'
							);
							break;
						case 'content-inserts':
							categoryTitle = __('Content Inserts', 'blockera');
							break;
						case 'special':
							categoryTitle = __('Special', 'blockera');
							break;
						case 'advanced':
							categoryTitle = __('Advanced', 'blockera');
							break;
						default:
							categoryTitle =
								category.charAt(0).toUpperCase() +
								category.slice(1);
					}

					return (
						<CategorizedItems
							key={`state-category-${category}`}
							{...categorizedItemsProps}
							items={categorizedStates[category]}
							category={category}
							title={
								<>
									{categoryTitle}

									<Tooltip
										width="250px"
										style={getTooltipStyle('state')}
										text={getCategoryTooltipText(category)}
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
					);
				})}

			{elements?.length > 0 && (
				<CategorizedItems
					{...categorizedItemsProps}
					itemType={'element'}
					items={elements}
					category={'elements'}
					title={
						<>
							{__('Virtual Blocks', 'blockera')}

							<Tooltip
								width="220px"
								style={getTooltipStyle('element')}
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
						itemType={'inner-block'}
						title={title}
						limited={true}
						items={blocks}
						category={slug}
						key={`${slug}-${index}`}
					/>
				)
			)}

			{/* TODO: Implement custom-class state rendering when search has no results! */}
			{/* {!elements?.length &&
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
				)} */}
		</Flex>
	);
};
