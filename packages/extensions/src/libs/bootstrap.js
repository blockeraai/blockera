/**
 * Internal dependencies
 */
import { bootstrap as bootstrapSizeExtension } from './size';
import { bootstrap as bootstrapPositionExtension } from './position';
import { bootstrap as bootstrapBackgroundExtension } from './background';
import { bootstrap as bootstrapBorderAndShadowExtension } from './border-and-shadow';
import { bootstrap as bootstrapTypographyExtension } from './typography';
import { bootstrap as bootstrapInnerBlocksExtension } from './inner-blocks';

export function blockeraExtensionsBootstrap() {
	bootstrapSizeExtension();
	bootstrapPositionExtension();
	bootstrapBackgroundExtension();
	bootstrapBorderAndShadowExtension();
	bootstrapTypographyExtension();
	bootstrapInnerBlocksExtension();
}
