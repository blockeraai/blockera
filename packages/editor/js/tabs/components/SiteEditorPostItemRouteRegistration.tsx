/**
 * Site Editor `post-item` route registration.
 *
 * Background, constraints, and pitfalls: `../site-editor-post-item-route.md`.
 *
 * External dependencies
 */
import type { ReactNode } from 'react';

/**
 * WordPress dependencies
 */
import { Button, __experimentalVStack as VStack } from '@wordpress/components';
import { useEntityRecords } from '@wordpress/core-data';
import { useRegistry } from '@wordpress/data';
import { decodeEntities } from '@wordpress/html-entities';
import { useLayoutEffect } from '@wordpress/element';
import { __ } from '@wordpress/i18n';
import { addQueryArgs } from '@wordpress/url';

const EDIT_SITE_STORE_NAME = 'core/edit-site';

let didRegister = false;

type SiteData = { currentTheme?: { is_block_theme?: boolean } };

type PageItemRoute = {
	name: string;
	areas: {
		mobile: (args: { siteData: SiteData }) => ReactNode;
		preview: (args: { siteData: SiteData }) => ReactNode;
	};
};

type PostListEntity = {
	id: number;
	title?: { rendered?: string } | string;
};

type DataRegistryWithStores = {
	stores?: Record<
		string,
		{
			store?: {
				dispatch?: (action: { type: string; route?: unknown }) => void;
				getState?: () => { routes?: unknown[] };
			};
		}
	>;
};

function getEditSiteReduxStore(registry: unknown) {
	return (registry as DataRegistryWithStores).stores?.[EDIT_SITE_STORE_NAME]
		?.store;
}

function PostItemSidebar({ siteData }: { siteData: SiteData }) {
	const isBlockTheme = siteData.currentTheme?.is_block_theme;
	const { records } = useEntityRecords('postType', 'post', {
		per_page: 50,
		status: 'any',
	});

	if (!isBlockTheme) {
		return (
			<p className="blockera-post-item-route__unsupported">
				{__(
					'A block theme is required to edit posts in the site editor.',
					'blockera'
				)}
			</p>
		);
	}

	return (
		<VStack spacing={2} className="blockera-post-item-route__sidebar">
			<strong>{__('Posts', 'blockera')}</strong>
			{(records as PostListEntity[] | undefined)?.map((post) => {
				const title =
					post.title &&
					typeof post.title === 'object' &&
					'rendered' in post.title
						? decodeEntities(post.title.rendered)
						: __('(no title)', 'blockera');

				return (
					<Button
						key={post.id}
						variant="link"
						href={addQueryArgs(window.location.href, {
							p: `/post/${post.id}`,
						})}
					>
						{title}
					</Button>
				);
			})}
		</VStack>
	);
}

export default function SiteEditorPostItemRouteRegistration(): null {
	const registry = useRegistry();

	useLayoutEffect(() => {
		if (didRegister) {
			return;
		}
		if (typeof window === 'undefined') {
			return;
		}
		if (!window.location.pathname.includes('site-editor.php')) {
			return;
		}

		const tryRegister = (): boolean => {
			const reduxStore = getEditSiteReduxStore(registry);
			const routes = reduxStore?.getState?.()?.routes ?? [];
			const pageItem = routes.find(
				(r: { name?: string }) => r?.name === 'page-item'
			) as PageItemRoute | undefined;

			if (!pageItem?.areas?.mobile || !pageItem?.areas?.preview) {
				return false;
			}

			if (typeof reduxStore?.dispatch !== 'function') {
				return false;
			}

			reduxStore.dispatch({
				type: 'REGISTER_ROUTE',
				route: {
					name: 'post-item',
					path: '/post/:postId',
					areas: {
						sidebar: ({ siteData }: { siteData: SiteData }) => (
							<PostItemSidebar siteData={siteData} />
						),
						mobile: pageItem.areas.mobile,
						preview: pageItem.areas.preview,
					},
				},
			});
			didRegister = true;
			return true;
		};

		if (tryRegister()) {
			return;
		}

		const unsubscribe = registry.subscribe(() => {
			if (tryRegister()) {
				unsubscribe();
			}
		});

		return () => {
			unsubscribe();
		};
	}, [registry]);

	return null;
}
