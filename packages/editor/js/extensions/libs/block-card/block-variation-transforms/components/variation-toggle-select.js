//@flow

/**
 * External dependencies
 */
import { useCallback, useMemo } from '@wordpress/element';
import { __, sprintf } from '@wordpress/i18n';
import type { MixedElement } from 'react';

/**
 * Blockera dependencies
 */
import {
	ControlContextProvider,
	ToggleSelectControl,
} from '@blockera/controls';

/**
 * Internal dependencies
 */
import BlockIcon from '../../components/block-icon';

function VariationsToggleSelectControl({
	className,
	onSelectVariation,
	selectedValue,
	variations,
}: {
	className: string,
	onSelectVariation: (value: string) => void,
	selectedValue: string,
	variations: Array<{
		name: string,
		title: string,
		icon: any,
	}>,
}): MixedElement {
	const handleChange = useCallback(
		(value) => {
			onSelectVariation(value);
		},
		[onSelectVariation]
	);

	const options = useMemo(
		() =>
			variations.map((variation) => ({
				icon: <BlockIcon icon={variation.icon} showColors />,
				value: variation.name,
				label:
					selectedValue === variation.name
						? variation.title
						: sprintf(
								/* translators: %s: Block or block variation name. */
								__('Transform to %s', 'blockera'),
								variation.title
						  ),
				'aria-label': sprintf(
					/* translators: %s: Block or block variation name. */
					__('Transform to %s', 'blockera'),
					variation.title
				),
			})),
		[variations, selectedValue]
	);

	return (
		<div className={className}>
			<ControlContextProvider
				value={{
					name: 'block-variation',
					value: selectedValue,
					attribute: 'variation',
					blockName: 'block-variation',
					type: 'simple',
				}}
			>
				<ToggleSelectControl
					label=""
					onChange={handleChange}
					options={options}
				/>
			</ControlContextProvider>
		</div>
	);
}

export default VariationsToggleSelectControl;
