// @flow

import type { MixedElement } from 'react';

export type UpgradePromptProductId = 'blockera-site-editor';

export type LockedFeatureSpec = {|
	title: string,
	description?: string | MixedElement,
	icon?: string | MixedElement,
|};

export type ProHighlightSpec = {|
	icon?: MixedElement,
	title: string,
	description?: string,
|};
