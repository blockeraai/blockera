/**
 * WordPress dependencies
 */
import { memo } from '@wordpress/element';
import { __ } from '@wordpress/i18n';

/**
 * Publisher dependencies
 */
import { controlInnerClassNames } from '@publisher/classnames';
import { ColorIndicator } from '@publisher/components';

/**
 * Internal dependencies
 */
import { default as TypeImageIcon } from '../icons/type-image';
import { default as TypeLinearGradientIcon } from '../icons/type-linear-gradient';
import { default as TypeRadialGradientIcon } from '../icons/type-radial-gradient';
import { getBackgroundItemBGProperty } from '../utils';

const Header = ({ item, isOpen, setOpen, children, isOpenPopoverEvent }) => {
	let label, icon, preview;

	const itemBGProperty = getBackgroundItemBGProperty(item);

	switch (item.type) {
		case 'image':
			label = __('Image', 'publisher-core');
			preview = <ColorIndicator type="image" value={itemBGProperty} />;
			icon = <TypeImageIcon />;
			break;

		case 'linear-gradient':
			label = __('Linear Gradient', 'publisher-core');
			preview = (
				<ColorIndicator type="linear-gradient" value={itemBGProperty} />
			);
			icon = <TypeLinearGradientIcon />;
			break;

		case 'radial-gradient':
			label = __('Radial Gradient', 'publisher-core');
			preview = (
				<ColorIndicator type="radial-gradient" value={itemBGProperty} />
			);
			icon = <TypeRadialGradientIcon />;
			break;
	}

	return (
		<div
			className={controlInnerClassNames('repeater-group-header')}
			onClick={(event) => isOpenPopoverEvent(event) && setOpen(!isOpen)}
		>
			<span className={controlInnerClassNames('header-icon')}>
				{icon}
			</span>

			<span className={controlInnerClassNames('header-label')}>
				{label}
			</span>

			<span className={controlInnerClassNames('header-values')}>
				{preview}
			</span>

			{children}
		</div>
	);
};

export default memo(Header);
