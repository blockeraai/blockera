// @flow

/**
 * External dependencies
 */
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import type { FeatureStatus } from '../types';

type Props = {
	status: FeatureStatus,
};

const FeatureLabel = ({ status }: Props): React$Element<'span'> => {
	const getLabelText = () => {
		switch (status) {
			case 'alpha':
				return __('Alpha Feature', 'blockera');
			case 'beta':
				return __('Beta Feature', 'blockera');
			case 'pre-release':
				return __('Pre Release Feature', 'blockera');
			case 'stable':
				return __('Stable Feature', 'blockera');
			default:
				return __('Experimental Feature', 'blockera');
		}
	};

	return (
		<span className={'section-title-badge ' + status + '-badge'}>
			{getLabelText()}
		</span>
	);
};

export default FeatureLabel;
