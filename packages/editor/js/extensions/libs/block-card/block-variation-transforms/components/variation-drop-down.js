/**
 * WordPress dependencies
 */
import { useCallback, useMemo } from '@wordpress/element';

/**
 * Blockera dependencies
 */
import { ControlContextProvider, SelectControl } from '@blockera/controls';

export default function VariationsDropdown({
	className,
	onSelectVariation,
	selectedValue,
	variations,
}) {
	const handleChange = useCallback(
		(value) => {
			onSelectVariation(value);
		},
		[onSelectVariation]
	);

	const options = useMemo(
		() =>
			variations.map(({ name, title, description }) => ({
				value: name,
				label: title,
				info: description,
			})),
		[variations]
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
				<SelectControl
					type="custom"
					label=""
					options={options}
					customMenuPosition="bottom end"
					onChange={handleChange}
				/>
			</ControlContextProvider>
		</div>
	);
}
