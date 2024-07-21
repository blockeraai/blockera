// @flow

/**
 * External dependencies
 */
import { __ } from '@wordpress/i18n';
import { select } from '@wordpress/data';
import type { MixedElement } from 'react';

/**
 * Blockera dependencies
 */
import { Flex } from '@blockera/controls';
import { classNames } from '@blockera/classnames';

/**
 * Internal dependencies
 */
import type { InnerBlockModel, InnerBlocks } from '../types';

export const AvailableBlocksAndElements = ({
	blocks,
	elements,
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
	const { getCategories } = select('core/blocks');

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
					category === innerBlock?.category
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

							return (
								<div
									key={index}
									onClick={() => {
										let id = name;
										const inners = getBlockInners(clientId);

										// Assume, in advance exists picked inner block name on inners stack.
										if (inners[name]) {
											// We do add exceptions for picked inner block identifier in here.
											if ('core/heading' === name) {
												id = `${name}-${settings?.level}`;
											}
										}

										setBlockClientInners({
											clientId,
											inners: {
												...inners,
												[id]: innerBlock,
											},
										});

										setCurrentBlock(id);
									}}
									aria-label={name}
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
			<CategorizedItems
				items={elements}
				category={'elements'}
				title={__('Elements', 'blockera')}
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
