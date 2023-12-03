// @flow
/**
 * Publisher dependencies
 */
import { getFontSizes, getGradients } from '@publisher/core-data';

//FIXME: please implements any other available types!
export default function (type: string): Array<Object> {
	switch (type) {
		case 'FONT_SIZE':
			return getFontSizes();

		case 'GRADIENT':
			return getGradients();
	}

	return [];
}
