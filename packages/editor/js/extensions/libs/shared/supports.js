// @flow

import { supports as sizeSupports } from '../size';
import { supports as mouseSupports } from '../mouse';
import { supports as layoutSupports } from '../layout';
import { supports as effectsSupports } from '../effects';
import { supports as spacingSupports } from '../spacing';
import { supports as positionSupports } from '../position';
import { supports as flexChildSupports } from '../flex-child';
import { supports as typographySupports } from '../typography';
import { supports as backgroundSupports } from '../background';
import { supports as customStyleSupports } from '../custom-style';
import { supports as borderAndShadowSupports } from '../border-and-shadow';

export const supports = {
	...sizeSupports,
	...mouseSupports,
	...layoutSupports,
	...effectsSupports,
	...spacingSupports,
	...positionSupports,
	...flexChildSupports,
	...typographySupports,
	...backgroundSupports,
	...customStyleSupports,
	...borderAndShadowSupports,
};
