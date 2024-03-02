// @flow

/**
 * External dependencies
 */
import type { MixedElement } from 'react';

/**
 * Publisher dependencies
 */
import { Button } from '@publisher/components';

/**
 * Internal dependencies
 */
import AddIcon from '../icons/add';
import type { TAddButtonProps } from '../types';

export const AddButton = ({
	type,
	gridTemplate,
	onClick,
	columnGap,
	rowGap,
}: TAddButtonProps): MixedElement => {
	return (
		<Button
			size="extra-small"
			style={{
				gridRow:
					type === 'column'
						? '1/2'
						: `${gridTemplate.length + 1}/${
								gridTemplate.length + 2
						  }`,
				gridColumn:
					type === 'column'
						? `${gridTemplate.length + 1}/${
								gridTemplate.length + 2
						  }`
						: '1/2',
				position: 'absolute',
				bottom: type === 'row' && '-36px',
				right: type === 'column' && '-36px',
				left: type === 'row' && '0px',
				top: type === 'column' && '0px',
				marginLeft: type === 'row' && columnGap && '-10px',
				marginTop: type === 'column' && rowGap && '-10px',
			}}
			onClick={onClick}
			className="add-btn"
		>
			<AddIcon />
		</Button>
	);
};
