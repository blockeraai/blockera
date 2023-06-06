/**
 * WordPress dependencies
 */
import { memo } from '@wordpress/element';
import { __ } from '@wordpress/i18n';

/**
 * Publisher dependencies
 */
import { controlInnerClassNames } from '@publisher/classnames';

/**
 * Internal dependencies
 */
import { default as TypeImageIcon } from '../icons/type-image';
import { default as TypeLinearGradientIcon } from '../icons/type-linear-gradient';
import { default as TypeRadialGradientIcon } from '../icons/type-radial-gradient';
import { default as ItemPreview } from './item-preview';

const Header = ({ item, isOpen, setOpen, children }) => {
	let label, icon, preview;

	switch (item.type) {
		case 'image':
			label = __('Image', 'publisher-core');
			preview = <ItemPreview {...item} />;
			icon = <TypeImageIcon />;
			break;

		case 'linear-gradient':
			label = __('Linear Gradient', 'publisher-core');
			preview = <ItemPreview {...item} />;
			icon = <TypeLinearGradientIcon />;
			break;

		case 'radial-gradient':
			label = __('Radial Gradient', 'publisher-core');
			preview = <ItemPreview {...item} />;
			icon = <TypeRadialGradientIcon />;
			break;
	}

	return (
		<div
			className={controlInnerClassNames('repeater-group-header')}
			onClick={() => setOpen(!isOpen)}
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
