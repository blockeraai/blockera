import { bootstrapOutermostIconBlock } from './third-party/bootstraps';
import { bootstrapSocialLinksCoreBlock } from './wordpress/bootstraps';

export function blockeraBootstrapBlocks() {
	bootstrapSocialLinksCoreBlock();
	bootstrapOutermostIconBlock();
}
