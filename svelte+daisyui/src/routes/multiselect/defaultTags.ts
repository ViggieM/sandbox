// ABOUTME: Default hierarchical tag data for the TagsMultiSelect component
// ABOUTME: Database format tags with id, parentId, and name structure

export interface TagData {
	id: string;
	parentId: string | null;
	name: string;
}

export const defaultTags: TagData[] = [
	// Root categories
	{ id: 'tech', parentId: null, name: 'Technology' },
	{ id: 'design', parentId: null, name: 'Design' },
	{ id: 'business', parentId: null, name: 'Business' },

	// Technology subcategories
	{ id: 'frontend', parentId: 'tech', name: 'Frontend' },
	{ id: 'backend', parentId: 'tech', name: 'Backend' },
	{ id: 'database', parentId: 'tech', name: 'Database' },

	// Frontend tags
	{ id: 'react', parentId: 'frontend', name: 'React' },
	{ id: 'vue', parentId: 'frontend', name: 'Vue.js' },
	{ id: 'svelte', parentId: 'frontend', name: 'Svelte' },
	{ id: 'angular', parentId: 'frontend', name: 'Angular' },

	// Backend tags
	{ id: 'nodejs', parentId: 'backend', name: 'Node.js' },
	{ id: 'python', parentId: 'backend', name: 'Python' },
	{ id: 'go', parentId: 'backend', name: 'Go' },
	{ id: 'rust', parentId: 'backend', name: 'Rust' },

	// Database tags
	{ id: 'postgresql', parentId: 'database', name: 'PostgreSQL' },
	{ id: 'mongodb', parentId: 'database', name: 'MongoDB' },
	{ id: 'redis', parentId: 'database', name: 'Redis' },

	// Design subcategories
	{ id: 'ui-ux', parentId: 'design', name: 'UI/UX' },
	{ id: 'graphic', parentId: 'design', name: 'Graphic Design' },

	// UI/UX tags
	{ id: 'figma', parentId: 'ui-ux', name: 'Figma' },
	{ id: 'sketch', parentId: 'ui-ux', name: 'Sketch' },
	{ id: 'adobe-xd', parentId: 'ui-ux', name: 'Adobe XD' },

	// Graphic Design tags
	{ id: 'photoshop', parentId: 'graphic', name: 'Photoshop' },
	{ id: 'illustrator', parentId: 'graphic', name: 'Illustrator' },
	{ id: 'canva', parentId: 'graphic', name: 'Canva' },

	// Business subcategories
	{ id: 'marketing', parentId: 'business', name: 'Marketing' },
	{ id: 'finance', parentId: 'business', name: 'Finance' },

	// Marketing tags
	{ id: 'seo', parentId: 'marketing', name: 'SEO' },
	{ id: 'social-media', parentId: 'marketing', name: 'Social Media' },
	{ id: 'content', parentId: 'marketing', name: 'Content Marketing' },

	// Finance tags
	{ id: 'accounting', parentId: 'finance', name: 'Accounting' },
	{ id: 'budgeting', parentId: 'finance', name: 'Budgeting' },
	{ id: 'investing', parentId: 'finance', name: 'Investing' }
];
