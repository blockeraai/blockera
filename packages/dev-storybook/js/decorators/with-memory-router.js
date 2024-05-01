/**
 * External dependencies
 */
import { MemoryRouter } from 'react-router-dom';

export const WithMemoryRouter = (Story) => (
	<MemoryRouter>
		<Story />
	</MemoryRouter>
);
