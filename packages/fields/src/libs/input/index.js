/**
 * WordPress dependencies
 */
import { useContext } from '@wordpress/element';

/**
 * Internal dependencies
 */
import { BlockEditContext } from '@publisher/extensions';
import { InputControl, LabelControl, RangeControl } from '@publisher/controls';
import { fieldsClassNames, fieldsInnerClassNames } from '@publisher/classnames';

export function InputField({ name, label, attribute, settings, ...props }) {
	const { name: blockName, ...blockProps } = useContext(BlockEditContext);

	return (
		<div
			className={fieldsClassNames(
				'input',
				label !== '' ? 'columns-2' : 'columns-1'
			)}
		>
			{label && (
				<div className={fieldsInnerClassNames('label')}>
					<LabelControl label={label} />
				</div>
			)}

			<div className={fieldsInnerClassNames('control')}>
				{'range' === settings?.type && (
					<RangeControl
						{...props}
						{...settings}
						{...blockProps}
						blockName={name}
						withInputField={true}
						attribute={attribute}
					/>
				)}
				{'text' === settings?.type && (
					<InputControl
						{...props}
						{...settings}
						{...blockProps}
						blockName={name}
						attribute={attribute}
					/>
				)}
			</div>
		</div>
	);
}
