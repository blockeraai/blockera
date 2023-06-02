/**
 * Internal dependencies
 */
import { BoxShadowControl } from '@publisher/controls';
import { fieldsClassNames, fieldsInnerClassNames } from '@publisher/classnames';

export function BoxShadowField({ config, label, attribute, ...props }) {
	return (
		<div className={fieldsClassNames('box-shadow', 'columns-1')}>
			<div className={fieldsInnerClassNames('control')}>
				<BoxShadowControl
					{...{
						config,
						...props,
						attribute,
					}}
					label={label}
				/>
			</div>
		</div>
	);
}
