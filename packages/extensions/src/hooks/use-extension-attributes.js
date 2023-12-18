// @flow

/**
 * Publisher dependencies
 */
import { isUndefined } from '@publisher/utils';

/**
 * Add custom Publisher props identifier to selected blocks
 *
 * @param {Object} props Block props
 * @return {{}|Object} Block props extended with Publisher Extensions.
 */
export const useAttributes = (props: Object): Object => {
	const extendedProps = { ...props };

	if (isUndefined(extendedProps.attributes.publisherPropsId)) {
		const d = new Date();
		extendedProps.attributes.publisherPropsId =
			'' +
			d.getMonth() +
			d.getDate() +
			d.getHours() +
			d.getMinutes() +
			d.getSeconds() +
			d.getMilliseconds();
	}

	return extendedProps;
};
