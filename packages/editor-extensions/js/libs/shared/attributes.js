// @flow

/**
 * Internal dependencies
 */
import { attributes as sizeAttributes } from '../size';
import { attributes as mouseAttributes } from '../mouse';
import { attributes as layoutAttributes } from '../layout';
import { attributes as spacingAttributes } from '../spacing';
import { attributes as effectsAttributes } from '../effects';
import { attributes as positionAttributes } from '../position';
import { attributes as flexChildAttributes } from '../flex-child';
import { attributes as typographyAttributes } from '../typography';
import { attributes as backgroundAttributes } from '../background';
import { attributes as innerBlockAttributes } from '../inner-blocks';
import { attributes as customStyleAttributes } from '../custom-style';
import { attributes as blockStatesAttributes } from '../block-states';
import { attributes as styleVariationsAttributes } from '../style-variations';
import { attributes as borderAndShadowAttributes } from '../border-and-shadow';
import { attributes as advancedSettingsAttributes } from '../advanced-settings';

export const attributes = {
	...sizeAttributes,
	...mouseAttributes,
	...layoutAttributes,
	...effectsAttributes,
	...spacingAttributes,
	...positionAttributes,
	...flexChildAttributes,
	...innerBlockAttributes,
	...typographyAttributes,
	...backgroundAttributes,
	...blockStatesAttributes,
	...customStyleAttributes,
	...styleVariationsAttributes,
	...borderAndShadowAttributes,
	...advancedSettingsAttributes,
};
