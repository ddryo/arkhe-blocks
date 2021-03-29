import { __ } from '@wordpress/i18n';
import { mediaIcon, richIcon } from './_icon';

/**
 * バリエーション
 */
const variations = [
	{
		name: 'media-slider',
		title: __('Media Slider', 'arkhe-blocks'),
		description: __('Slider that can place only media', 'arkhe-blocks'), //メディアだけを配置できるスライダー
		attributes: { variation: 'media' },
		icon: mediaIcon,
		scope: ['block'],
		isActive: (blockAttributes, variationAttributes) => {
			return blockAttributes.variation === variationAttributes.variation;
		},
	},
	{
		name: 'rich-slider',
		title: __('Rich Slider', 'arkhe-blocks'),
		description: __('Slider that allows you to place free content', 'arkhe-blocks'), //自由なコンテンツを配置できるスライダー
		attributes: { variation: 'rich' },
		icon: richIcon,
		isDefault: true,
		scope: ['block'],
		isActive: (blockAttributes, variationAttributes) => {
			return blockAttributes.variation === variationAttributes.variation;
		},
	},
];

export default variations;
