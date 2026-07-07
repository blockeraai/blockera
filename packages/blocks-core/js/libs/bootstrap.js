import {
	bootstrapOutermostIconBlock,
	bootstrapBlocksyBreadcrumbs,
	bootstrapBlocksyAboutMe,
	bootstrapBlocksyContactInfo,
	bootstrapBlocksySocials,
	bootstrapBlocksyShareBox,
	bootstrapBlocksySearch,
} from './third-party/bootstraps';
import {
	bootstrapCoreIconBlock,
	bootstrapSocialLinksCoreBlock,
} from './wordpress/bootstraps';

export function blockeraBootstrapBlocks() {
	bootstrapCoreIconBlock();
	bootstrapSocialLinksCoreBlock();
	bootstrapOutermostIconBlock();
	bootstrapBlocksyBreadcrumbs();
	bootstrapBlocksyAboutMe();
	bootstrapBlocksyContactInfo();
	bootstrapBlocksySocials();
	bootstrapBlocksyShareBox();
	bootstrapBlocksySearch();
}
