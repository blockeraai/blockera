// @flow

/**
 * External dependencies
 */
import type { MixedElement } from 'react';
import { __, sprintf } from '@wordpress/i18n';
import { useState, useMemo } from '@wordpress/element';
import { Slot, SlotFillProvider } from '@wordpress/components';

/**
 * Blockera dependencies
 */
import {
	Flex,
	SearchControl,
	ControlContextProvider,
} from '@blockera/controls';
import { Icon } from '@blockera/icons';
import { classNames } from '@blockera/classnames';

/**
 * Internal dependencies
 */
import { BlockTypes } from './block-types';
import { blockHasStyle } from './use-block-style-item/helpers';
import { search } from '../../../../extensions/libs/block-composite/search-items';

export const SearchBlockTypes = ({
	style,
	blockName,
	blockTitle,
	blocks: _blocks,
	handleOnUsageForMultipleBlocks,
	handleOnSaveUsageForMultipleBlocks,
	setIsOpenUsageForMultipleBlocks,
}: Object): MixedElement => {
	const [blocks, setBlocks] = useState(_blocks);
	const [searchTerm, setSearchTerm] = useState('');

	const enabledItems = useMemo(
		() =>
			_blocks
				.filter((item) => blockHasStyle(item.name, style.name))
				.map((item) => item.name),
		[_blocks, style.name]
	);

	return (
		<SlotFillProvider>
			<Flex
				direction={'column'}
				gap={'20px'}
				className={classNames('search-block-types')}
			>
				<p style={{ margin: '0', color: '#707070' }}>
					{__(
						'Select the blocks that should use this style variation.',
						'blockera'
					)}
				</p>
				<p style={{ margin: '0', color: '#707070' }}>
					{sprintf(
						/* translators: %1$s: The style name. */
						__(
							'The selected blocks will share the same design and updates applied to "%1$s".',
							'blockera'
						),
						style.label
					)}
				</p>
				<Flex direction={'row'} gap={'10px'}>
					<ControlContextProvider
						value={{
							name: 'search-block-types',
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

									return;
								}

								// Ensure all items are valid objects to prevent errors during search
								const validBlocks = (_blocks || []).filter(
									(item) =>
										item !== null && item !== undefined
								);

								try {
									const filteredItems = search(
										[...validBlocks],
										[],
										[],
										newValue
									);

									const newBlocks = [];

									filteredItems.forEach((item: Object) => {
										if (item) {
											newBlocks.push(item);
										}
									});

									setBlocks(newBlocks);
								} catch (error) {
									/* @debug-ignore */
									console.error('Search error:', error);
									// Fallback to empty results on error
									setBlocks([]);
								}
							}}
							placeholder={__('Search', 'blockera')}
						/>
					</ControlContextProvider>
					<Slot name="usage-for-multiple-blocks-actions" />
				</Flex>

				{!blocks?.length && (
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

				<BlockTypes
					style={style}
					items={blocks}
					blockName={blockName}
					blockTitle={blockTitle}
					enabledItems={enabledItems}
					handleOnUsageForMultipleBlocks={
						handleOnUsageForMultipleBlocks
					}
					handleOnSaveUsageForMultipleBlocks={
						handleOnSaveUsageForMultipleBlocks
					}
					setIsOpenUsageForMultipleBlocks={
						setIsOpenUsageForMultipleBlocks
					}
				/>
				<Slot name="usage-for-multiple-blocks-save-cancel-actions" />
			</Flex>
		</SlotFillProvider>
	);
};
