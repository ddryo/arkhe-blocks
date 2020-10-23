/**
 * @WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { registerBlockType } from '@wordpress/blocks';
import { RichText, InnerBlocks, __experimentalBlock as Block } from '@wordpress/block-editor';

/**
 * @Internal dependencies
 */
import { ArkheIcon } from '@components/ArkheIcon';
import { iconColor } from '@blocks/config';
import BlockControls from './_controls';
import blockIcon from './_icon';
import metadata from './block.json';

/**
 * @Others dependencies
 */
// import classnames from 'classnames';

/**
 * metadata
 */
const blockName = 'ark-block-timeline';
const { name, category, supports, parent } = metadata;

/**
 * ステップ項目
 */
registerBlockType(name, {
	title: __('Timeline item', 'arkhe-blocks'),
	icon: {
		foreground: iconColor,
		src: blockIcon,
	},
	category,
	parent,
	supports,
	attributes: metadata.attributes,

	edit: (props) => {
		const { attributes, setAttributes } = props;
		const { title, label, isFill, icon, color } = attributes;

		let shapeClass = `${blockName}__shape`;
		if (isFill) {
			shapeClass += ' -is-fill';
		}
		if (icon) {
			shapeClass += ' -has-icon';
		}

		const shapeStyle = color ? { color } : null;

		return (
			<>
				<BlockControls {...props} />
				<Block.div className={`${blockName}__item`}>
					<div className={`${blockName}__head`}>
						<span className={shapeClass} role='presentation' style={shapeStyle}>
							<ArkheIcon icon={icon} className={`${blockName}__icon`} />
						</span>
						<RichText
							placeholder={__('Enter text', 'arkhe-blocks') + '...'}
							className={`${blockName}__label`}
							tagName='span'
							value={label}
							onChange={(val) => setAttributes({ label: val })}
						/>
					</div>
					<RichText
						placeholder={__('Enter text', 'arkhe-blocks') + '...'}
						className={`${blockName}__title`}
						tagName='div'
						value={title}
						onChange={(val) => setAttributes({ title: val })}
					/>
					<div className={`${blockName}__body`}>
						<InnerBlocks
							__experimentalTagName='div'
							__experimentalPassedProps={{
								className: 'ark-keep-mt--s',
							}}
						/>
					</div>
				</Block.div>
			</>
		);
	},
	save: ({ attributes }) => {
		const { title, label, isFill, icon, color } = attributes;

		let shapeClass = `${blockName}__shape`;
		if (isFill) {
			shapeClass += ' -is-fill';
		}
		if (icon) {
			shapeClass += ' -has-icon';
		}

		const shapeStyle = color ? { color } : null;

		return (
			<div className={`${blockName}__item`}>
				<div className={`${blockName}__head`}>
					<span className={shapeClass} role='presentation' style={shapeStyle}>
						<ArkheIcon icon={icon} className={`${blockName}__icon`} />
					</span>
					<span className={`${blockName}__label`}>
						<RichText.Content value={label} />
					</span>
				</div>
				<div className={`${blockName}__title`}>
					<RichText.Content value={title} />
				</div>
				<div className={`${blockName}__body ark-keep-mt--s`}>
					<InnerBlocks.Content />
				</div>
			</div>
		);
	},
});
