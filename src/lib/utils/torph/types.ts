import type { TextMorphOptions } from './internal';

export interface TextMorphProps extends Omit<TextMorphOptions, 'element'> {
	text: string;
	class?: string;
	style?: string;
	as?: string;
}
