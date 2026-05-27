// @flow

/**
 * External dependencies
 */
import type { MixedElement } from 'react';
import { __, sprintf } from '@wordpress/i18n';
import {
	store as blockEditorStore,
	useBlockDisplayInformation,
} from '@wordpress/block-editor';
import { symbol } from '@wordpress/icons';
import { useDispatch } from '@wordpress/data';

/**
 * Blockera dependencies
 */
import {
	extensionClassNames,
	extensionInnerClassNames,
} from '@blockera/classnames';
import { Button, Flex } from '@blockera/controls';

/**
 * Internal dependencies
 */
import { default as BlockIcon } from './block-icon';
import { stopPatternContentOnlyEdit } from '../helpers/pattern-edit-section';

export function PatternBlockCard({
	patternClientId,
}: {
	patternClientId: string,
}): MixedElement {
	const patternInformation = useBlockDisplayInformation(patternClientId);
	const { selectBlock } = useDispatch(blockEditorStore);

	const title =
		patternInformation?.name?.length > 0
			? patternInformation.name
			: patternInformation?.title || __('Pattern', 'blockera');

	const handleSelectPattern = () => {
		selectBlock(patternClientId);
	};

	const handleExitPatternEdit = (event: SyntheticMouseEvent<HTMLElement>) => {
		event.stopPropagation();
		stopPatternContentOnlyEdit(__);
	};

	const editingPatternLabel = sprintf(
		/* translators: %s: Pattern title shown in the inspector pattern card. */
		__('Editing pattern: %s', 'blockera'),
		title
	);

	return (
		<div
			className={extensionClassNames('pattern-block-card')}
			data-test="blockera-pattern-block-card"
		>
			<Flex
				className={extensionInnerClassNames('pattern-block-card__row')}
				alignItems="center"
				justifyContent="space-between"
				gap={12}
			>
				<div
					role="button"
					tabIndex={0}
					className={extensionInnerClassNames(
						'pattern-block-card__select'
					)}
					aria-label={editingPatternLabel}
					onClick={handleSelectPattern}
					onKeyDown={(event) => {
						if (event.key === 'Enter' || event.key === ' ') {
							event.preventDefault();
							handleSelectPattern();
						}
					}}
					data-test="blockera-pattern-block-card-select"
				>
					<Flex
						alignItems="center"
						gap={12}
						className={extensionInnerClassNames(
							'pattern-block-card__select-inner'
						)}
					>
						<BlockIcon
							icon={patternInformation?.icon || { src: symbol }}
						/>
						<span
							className={extensionInnerClassNames(
								'pattern-block-card__title'
							)}
						>
							{title}
						</span>
					</Flex>
				</div>

				<Button
					className={extensionInnerClassNames(
						'pattern-block-card__exit',
						'no-border'
					)}
					variant="tertiary"
					size="extra-small"
					onClick={handleExitPatternEdit}
					data-test="blockera-pattern-block-card-exit"
				>
					{__('Exit pattern', 'blockera')}
				</Button>
			</Flex>
		</div>
	);
}
