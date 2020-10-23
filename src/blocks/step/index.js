/**
 * @WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { registerBlockType } from '@wordpress/blocks';
import { InnerBlocks, __experimentalBlock as Block } from '@wordpress/block-editor';

/**
 * @Internal dependencies
 */
import { iconColor } from '@blocks/config';
import BlockControls from './_controls';
import blockIcon from './_icon';
import example from './_example';
import metadata from './block.json';

/**
 * @Others dependencies
 */
// import classnames from 'classnames';

/**
 * metadata
 */
const blockName = 'ark-block-step';
const { name, category, keywords, supports } = metadata;

/**
 * STEPブロック
 */
registerBlockType(name, {
	title: __('Step', 'arkhe-blocks'),
	description: __('Create step-by-step content.', 'arkhe-blocks'),
	icon: {
		foreground: iconColor,
		src: blockIcon,
	},
	category,
	keywords,
	supports,
	example,
	styles: [
		{ name: 'default', label: 'デフォルト', isDefault: true },
		{ name: 'big', label: 'ビッグ' },
		{ name: 'card', label: 'カード' },
	],
	attributes: metadata.attributes,
	edit: (props) => {
		const { attributes, setAttributes } = props;
		const { className } = attributes;

		// デフォルトクラスを強制セット
		if (!className) setAttributes({ className: 'is-style-default' });

		// console.log(className);

		// 始まり番号
		const startNum = parseInt(attributes.startNum);

		return (
			<>
				<BlockControls {...props} />
				<Block.div
					className={`${blockName} ark-has-guide`}
					style={1 < startNum ? { counterReset: `step ${startNum - 1}` } : null}
				>
					<InnerBlocks
						allowedBlocks={['arkhe-blocks/step-item']}
						templateLock={false}
						template={[['arkhe-blocks/step-item']]}
						__experimentalTagName='div'
					/>
				</Block.div>
			</>
		);
	},

	save: ({ attributes }) => {
		const startNum = parseInt(attributes.startNum);
		return (
			<div
				className={blockName}
				style={1 < startNum ? { counterReset: `step ${startNum - 1}` } : null}
			>
				<InnerBlocks.Content />
			</div>
		);
	},
});
