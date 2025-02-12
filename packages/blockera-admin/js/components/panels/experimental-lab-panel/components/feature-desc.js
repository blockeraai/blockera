// @flow

/**
 * External dependencies
 */
import { __ } from '@wordpress/i18n';

type FeatureStatus = 'alpha' | 'beta' | 'pre-release' | 'stable';

type Props = {
	status: FeatureStatus,
};

const FeatureDesc = ({ status }: Props): React$Element<'p'> => {
	console.log('status', status);
	const getDescText = () => {
		switch (status) {
			case 'alpha':
				return __(
					'Early stage feature and may have bugs. Use with caution and share feedback!',
					'blockera'
				);
			case 'beta':
				return __(
					'Usable feature, but may have minor issues. Let us know!',
					'blockera'
				);
			case 'pre-release':
				return __(
					'Ready for release feature. Let us know if you find any issues!',
					'blockera'
				);
			case 'stable':
				return __(
					'Fully tested and ready for production feature. Enjoy!',
					'blockera'
				);
			default:
				return __(
					'Experimental feature. Let us know if you find any issues!',
					'blockera'
				);
		}
	};

	return (
		<p
			className={
				'blockera-settings-general section-desc section-desc-status ' +
				status +
				'-status'
			}
		>
			{getDescText()}
		</p>
	);
};

export default FeatureDesc;
