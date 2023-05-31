/**
 * Internal dependencies
 */
import { BoxShadowControl, LabelControl } from '@publisher/controls';
import { fieldsClassNames, fieldsInnerClassNames } from '@publisher/classnames';

export function BoxShadowField({ config, label, attribute, ...props }) {
	return (
		<div className={fieldsClassNames('box-shadow', 'columns-1')}>
			{label && (
				<div className={fieldsInnerClassNames('label')}>
					<LabelControl label={label} />
				</div>
			)}
			<div className={fieldsInnerClassNames('control')}>
				<BoxShadowControl
					{...{
						config,
						...props,
						attribute,
					}}
				/>
			</div>
		</div>
	);
}
