/**
 * WordPress dependencies
 */
import { useContext } from '@wordpress/element';

/**
 * Publisher dependencies
 */
import { BlockEditContext } from '@publisher/extensions';
import { LabelControl, ColorControl } from '@publisher/controls';
import { fieldsClassNames, fieldsInnerClassNames } from '@publisher/classnames';

export function ColorField({ name, label, settings, ...props }) {
	const { name: blockName, ...blockProps } = useContext(BlockEditContext);

	return (
		<div
			className={fieldsClassNames(
				'color',
				label !== '' ? 'columns-2' : 'columns-1'
			)}
		>
			{label && (
				<div className={fieldsInnerClassNames('label')}>
					<LabelControl label={label} />
				</div>
			)}

			<div className={fieldsInnerClassNames('control')}>
				<ColorControl
					{...props}
					{...settings}
					{...blockProps}
					blockName={name}
				/>
			</div>
		</div>
	);
}
