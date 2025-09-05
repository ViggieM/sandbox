import type { LayoutLoad } from './$types';

export const load: LayoutLoad = () => {
	return {
		mainClassName: 'flex flex-col',
		footerClassName: 'hidden md:flex'
	};
};
