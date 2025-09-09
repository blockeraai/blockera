// @flow

/**
 * External dependencies
 */
import { __ } from '@wordpress/i18n';
import type { MixedElement } from 'react';
import { useCallback } from '@wordpress/element';
import { registerBlockStyle } from '@wordpress/blocks';

/**
 * Blockera dependencies
 */
import { Icon } from '@blockera/icons';
import { Button, Flex } from '@blockera/controls';
import { classNames, controlInnerClassNames } from '@blockera/classnames';

export const AddNewStyleButton = ({
	label,
	blockName,
	blockStyles,
	setBlockStyles,
}: {
	label: string,
	blockName: string,
	blockStyles: Array<Object>,
	setBlockStyles: (styles: Array<Object>) => void,
}): MixedElement => {
	const addNew = useCallback(() => {
		// Find first available number by checking existing style names
		let number = blockStyles.length + 1;

		const existingNumbers = blockStyles
			.map((style) => {
				const match = style.name.match(/^style-(\d+)$/);
				return match ? parseInt(match[1]) : null;
			})
			.filter((num) => num !== null);

		// Find first gap in sequence or use next number
		while (existingNumbers.includes(number)) {
			number++;
		}

		const name = `style-${number}`;
		const styleLabel = __('Style', 'blockera') + ' ' + number;

		setBlockStyles([
			...blockStyles,
			{
				name,
				label: styleLabel,
			},
		]);

		registerBlockStyle(blockName, {
			name,
			label: styleLabel,
		});

		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [blockStyles]);

	return (
		<Flex justifyContent={'space-between'}>
			<h2 className={classNames('blockera-block-styles-category')}>
				{label}
			</h2>

			<Button
				size="extra-small"
				className={controlInnerClassNames('btn-add')} // blockera-is-not-active
				onClick={addNew}
				style={{
					width: '24px',
					height: '24px',
					padding: 0,
					marginLeft: 'auto',
				}}
				data-test={'add-new-block-style-variation'}
			>
				<Icon icon="plus" iconSize="20" />
			</Button>
		</Flex>
	);
};
