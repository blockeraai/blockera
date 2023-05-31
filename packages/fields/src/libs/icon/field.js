/**
 * Internal dependencies
 */
import { IconControl, LabelControl } from '@publisher/controls';
import { fieldsClassNames, fieldsInnerClassNames } from '@publisher/classnames';

export function IconField({ attribute, label, ...props }) {
	return (
		<div className={fieldsClassNames('icon', 'columns-1')}>
			{label && (
				<div className={fieldsInnerClassNames('label')}>
					<LabelControl label={label} />
				</div>
			)}

			<div className={fieldsInnerClassNames('control')}>
				<IconControl
					{...{
						...props,
						attribute,
					}}
				/>
			</div>
		</div>
	);
}
