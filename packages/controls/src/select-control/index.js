/**
 * WordPress dependencies
 */
import { useContext } from '@wordpress/element';
import { SelectControl as WPSelectControl } from '@wordpress/components';

/**
 * External dependencies
 */
import { controlClassNames } from '@publisher/classnames';
import { BlockEditContext } from '@publisher/extensions';

/**
 * Internal dependencies
 */
import { renderSelectNativeOption } from './utils';

const SelectControl = ({
	options,
	children,
	attribute,
	initValue = '',
	className,
}) => {
	const { attributes, setAttributes } = useContext(BlockEditContext);

	return (
		<>
			<WPSelectControl
				className={controlClassNames(
					'select',
					'native-select',
					className
				)}
				value={attributes[attribute] || initValue}
				onChange={(selection) => {
					setAttributes({
						...attributes,
						[attribute]: selection,
					});
				}}
				__nextHasNoMarginBottom
			>
				{options.map(renderSelectNativeOption)}
				{children}
			</WPSelectControl>
		</>
	);
};

export default SelectControl;
