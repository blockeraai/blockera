/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import {
	TabPanel,
	SearchControl,
	__experimentalHStack as HStack,
	__experimentalGrid as Grid,
	FlexItem,
	Notice,
	__experimentalDivider as Divider,
} from '@wordpress/components';
import { useState, useContext } from '@wordpress/element';
import { wordpress } from '@wordpress/icons';

/**
 * External dependencies
 */
import {
	faCircleHalfStroke,
	faCircle,
} from '@fortawesome/free-solid-svg-icons';
import classnames from 'classnames';

/**
 * Internal dependencies
 */
import { frame, publisher, getIconLibrary } from '@publisher/icons';
import { Icon } from '@publisher/components';
import { getRecommendation } from '../data';
import SizeControl from './size';
import registerIcons from '../register';
import { IconContext } from '../context';

export default function IconTabPanel() {
	const {
		iconInfo: { size },
		handleOnIconClick,
		recommendationList,
	} = useContext(IconContext);
	const [searchInput, setSearchInput] = useState('');
	const [currentTab, setCurrentTab] = useState('all');
	const onSelect = setCurrentTab;
	const [searchData, setSearchData] = useState([]);

	const stack = [];

	function renderIcons(tab) {
		const entries = getIconLibrary(tab.name, searchInput);

		if (!entries?.length) {
			const libraries = Object.values(entries);
			for (const index in libraries) {
				const iconType = Object.keys(entries)[index];
				const library = libraries[index];

				stack.push(
					registerIcons({
						size,
						library,
						iconType,
						handleOnIconClick,
					})
				);
			}

			return stack;
		}

		stack.push(
			registerIcons({
				size,
				library: entries,
				iconType: tab.name,
				handleOnIconClick,
			})
		);

		return stack;
	}

	return (
		<>
			<TabPanel
				className="p-blocks-tab-panel"
				activeClass="active-tab"
				onSelect={onSelect}
				tabs={[
					{
						name: 'all',
						title: (
							<HStack justify="flex-start">
								<FlexItem>
									<Icon icon={frame} size={20} type="wp" />
								</FlexItem>
								<FlexItem>
									{__('All Icons', 'publisher-blocks')}
								</FlexItem>
							</HStack>
						),
						className: classnames(
							'p-blocks-tab',
							'p-blocks-all-icons',
							currentTab === 'all'
								? `p-blocks-current-tab tab-all`
								: 'tab-all'
						),
					},
					{
						name: 'publisher',
						title: (
							<HStack justify="flex-start">
								<FlexItem>
									<Icon
										icon={publisher}
										size={20}
										type="wp"
									/>
								</FlexItem>
								<FlexItem>
									{__('Publisher Icons', 'publisher-blocks')}
								</FlexItem>
							</HStack>
						),
						className: classnames(
							'p-blocks-tab',
							'p-blocks-icons',
							currentTab === 'publisher'
								? `p-blocks-current-tab tab-publisher`
								: 'tab-publisher'
						),
					},
					{
						name: 'wp',
						title: (
							<HStack justify="flex-start">
								<FlexItem>
									<Icon
										icon={wordpress}
										size={20}
										type="wp"
									/>
								</FlexItem>
								<FlexItem>
									{__('WordPress Icons', 'publisher-blocks')}
								</FlexItem>
							</HStack>
						),
						className: classnames(
							'p-blocks-tab',
							'p-blocks-wp-icons',
							currentTab === 'wp'
								? `p-blocks-current-tab tab-wp`
								: 'tab-wp'
						),
					},
					{
						name: 'far',
						title: (
							<HStack justify="flex-start">
								<FlexItem>
									<Icon
										icon={faCircleHalfStroke}
										size={20}
										type="fas"
									/>
								</FlexItem>
								<FlexItem>
									{__(
										'Font Awesome - Regular',
										'publisher-blocks'
									)}
								</FlexItem>
							</HStack>
						),
						className: classnames(
							'p-blocks-tab',
							'p-blocks-fa-regular-icons',
							currentTab === 'far'
								? `p-blocks-current-tab tab-far`
								: 'tab-far'
						),
					},
					{
						name: 'fas',
						title: (
							<HStack justify="flex-start">
								<FlexItem>
									<Icon
										icon={faCircle}
										size={20}
										type="fas"
									/>
								</FlexItem>
								<FlexItem>
									{__(
										'Font Awesome - Solid',
										'publisher-blocks'
									)}
								</FlexItem>
							</HStack>
						),
						className: classnames(
							'p-blocks-tab',
							'p-blocks-solid-icons',
							currentTab === 'fas'
								? `p-blocks-current-tab tab-fas`
								: 'tab-fas'
						),
					},
				]}
			>
				{(tab) => (
					<div className="p-blocks-tab-content">
						<SearchControl
							value={searchInput}
							onChange={(value) => {
								setSearchInput(value);
								setSearchData(
									getRecommendation({
										size,
										handleOnIconClick,
										search: () => searchInput,
									})
								);
							}}
							placeholder={__(
								'Find icons by name…',
								'publisher-blocks'
							)}
						/>

						{!searchInput && (
							<Grid
								className="p-blocks-recommended__icons"
								columns={size >= 36 ? 8 : 10}
								gap={5}
							>
								{recommendationList}
							</Grid>
						)}

						{!searchInput && <Divider />}

						{searchInput && !searchData?.length ? (
							<Notice
								status="error"
								onRemove={() => setSearchInput('')}
							>
								<p>
									{__(
										'404, Not founded icons for: ',
										'publisher-blocks'
									)}
									<code>{searchInput}</code>.
								</p>
							</Notice>
						) : (
							<Grid
								className="p-blocks-overflow-scroll"
								columns={size >= 36 ? 8 : 10}
								gap={5}
							>
								{!searchInput ? renderIcons(tab) : searchData}
							</Grid>
						)}
					</div>
				)}
			</TabPanel>

			<SizeControl />
		</>
	);
}
