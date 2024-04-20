/**
 * Internal dependencies
 */
import { bootstrap as bootstrapSizeExtension } from './size/bootstrap';
import { bootstrap as bootstrapPositionExtension } from './position/bootstrap';
import { bootstrap as bootstrapBackgroundExtension } from './background/bootstrap';
import { bootstrap as bootstrapBorderAndShadowExtension } from './border-and-shadow/bootstrap';
import { bootstrap as bootstrapTypographyExtension } from './typography/bootstrap';
import { bootstrap as bootstrapInnerBlocksExtension } from './inner-blocks/bootstrap';

export function blockeraExtensionsBootstrap() {
	bootstrapSizeExtension();
	bootstrapPositionExtension();
	bootstrapBackgroundExtension();
	bootstrapBorderAndShadowExtension();
	bootstrapTypographyExtension();
	bootstrapInnerBlocksExtension();
}
