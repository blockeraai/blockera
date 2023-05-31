/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { useContext } from '@wordpress/element';
import { SelectControl as WordPressSelectControl } from '@wordpress/components';

/**
 * External dependencies
 */
import { isObject } from 'lodash';
import { controlClassNames } from '@publisher/classnames';
import { BlockEditContext } from '@publisher/extensions';

const SelectControl = ({
	options,
	children,
	attribute,
	initValue = '',
	isGrouped = false,
	disabledItemLabel = __('--- Select an item ---', 'publisher-core'),
	className,
	...props
}) => {
	const { attributes, setAttributes } = useContext(BlockEditContext);

	const GroupSelect = () => (
		<WordPressSelectControl
			{...props}
			value={attributes[attribute] || initValue}
			onChange={(selection) => {
				setAttributes({
					...attributes,
					[attribute]: selection,
				});
			}}
			className={controlClassNames('select', className)}
			__nextHasNoMarginBottom
		>
			{children}
		</WordPressSelectControl>
	);

	return (
		<>
			{isGrouped && !options && <GroupSelect />}
			{!isGrouped && isObject(options) && (
				<WordPressSelectControl
					{...props}
					value={attributes[attribute] || initValue}
					options={[
						{
							value: '',
							label: disabledItemLabel,
							disable: true,
						},
						...options,
					]}
					onChange={(selection) =>
						setAttributes({
							...attributes,
							[attribute]: selection,
						})
					}
					__nextHasNoMarginBottom
				/>
			)}
		</>
	);
};

export default SelectControl;
