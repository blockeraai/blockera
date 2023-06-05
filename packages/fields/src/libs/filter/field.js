/**
 * Publisher dependencies
 */
import { FilterControl } from '@publisher/controls';
import { fieldsClassNames, fieldsInnerClassNames } from '@publisher/classnames';

export function FilterField({ config, attribute, label, ...props }) {
	return (
		<div className={fieldsClassNames('filter', 'columns-1')}>
			<div className={fieldsInnerClassNames('control')}>
				<FilterControl
					{...{
						config,
						...props,
						attribute,
					}}
					isPopover={true}
					label={label}
				/>
			</div>
		</div>
	);
}
