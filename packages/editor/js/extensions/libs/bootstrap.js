/**
 * Internal dependencies
 */
import { bootstrap as bootstrapSpacingExtension } from './spacing/bootstrap';
import { bootstrap as bootstrapSizeExtension } from './size/bootstrap';
import { bootstrap as bootstrapPositionExtension } from './position/bootstrap';
import { bootstrap as bootstrapBackgroundExtension } from './background/bootstrap';
import { bootstrap as bootstrapBorderAndShadowExtension } from './border-and-shadow/bootstrap';
import { bootstrap as bootstrapTypographyExtension } from './typography/bootstrap';
import { bootstrap as bootstrapInnerBlocksExtension } from './inner-blocks/bootstrap';
import { bootstrap as bootstrapLayoutExtension } from './layout/bootstrap';

export function blockeraExtensionsBootstrap() {
	bootstrapSpacingExtension();
	bootstrapSizeExtension();
	bootstrapPositionExtension();
	bootstrapBackgroundExtension();
	bootstrapBorderAndShadowExtension();
	bootstrapTypographyExtension();
	bootstrapInnerBlocksExtension();
	bootstrapLayoutExtension();
}
