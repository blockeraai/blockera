/**
 * Internal dependencies
 */
import wp from './wp';
import far from './far';
import fas from './fas';
import publisher from './publisher';
import wpIcons from '../../../icon-library/wp/icons.json';
import farIcons from '../../../icon-library/far/icons.json';
import fasIcons from '../../../icon-library/fas/icons.json';
import publisherIcons from '../../../icon-library/publisher/icons.json';

const Providers = {
	wp: [wp, wpIcons],
	far: [far, farIcons],
	fas: [fas, fasIcons],
	publisher: [publisher, publisherIcons],
};

export default Providers;
