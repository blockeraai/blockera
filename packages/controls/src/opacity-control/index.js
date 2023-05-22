/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { useState } from '@wordpress/element';

/**
 * Internal dependencies
 */
import RangeControl from '../range-control';
import { controlClassNames } from '@publisher/classnames';

export default function OpacityControl({
	className = 'opacity-control',
	initialValue = 0,
}) {
	const [value, setValue] = useState(initialValue);

	return (
		<RangeControl
			value={value}
			onChange={(val) => setValue(val)}
			label={__('Opacity', 'publisher-core')}
			className={controlClassNames(className)}
		/>
	);
}
