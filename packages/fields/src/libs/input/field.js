/**
 * WordPress dependencies
 */
import { useContext } from '@wordpress/element';

/**
 * Publisher dependencies
 */
import { BlockEditContext } from '@publisher/extensions';
import {
	InputControl,
	CssInputControl,
	LabelControl,
	RangeControl,
} from '@publisher/controls';
import { fieldsClassNames, fieldsInnerClassNames } from '@publisher/classnames';

export function InputField({ name, label, settings, ...props }) {
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
					/>
				)}

				{'text' === settings?.type && (
					<InputControl
						{...props}
						{...settings}
						{...blockProps}
						blockName={name}
					/>
				)}

				{'css' === settings?.type && (
					<CssInputControl
						{...props}
						{...{ ...settings, type: 'css' }}
						{...blockProps}
						blockName={name}
					/>
				)}
			</div>
		</div>
	);
}
