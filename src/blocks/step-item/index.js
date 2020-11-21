/**
 * @WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { registerBlockType } from '@wordpress/blocks';
import { RichText, InnerBlocks, __experimentalBlock as Block } from '@wordpress/block-editor';

/**
 * @Internal dependencies
 */
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
const blockName = 'ark-block-step';
const { name, category, supports, parent } = metadata;

/**
 * ステップ項目
 */
registerBlockType(name, {
	title: __('Step item', 'arkhe-blocks'),
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
		const { title, numColor, stepLabel, theLabel, theNum, isHideLabel, isHideNum } = attributes;

		// ステップ番号の色設定
		let numStyle = null;
		let numClass = `${blockName}__number`;
		if (numColor) {
			numStyle = { '--ark-step_color': numColor };
			numClass += ' -has-color';
		}

		const thisStepLabel = isHideLabel ? '' : theLabel || stepLabel;
		const thisStepNum = isHideNum ? '' : theNum || null;
		return (
			<>
				<BlockControls {...props} />
				<Block.div className={`${blockName}__item`}>
					<div className={`${blockName}__head`}>
						<div
							className={`${numClass}`}
							style={numStyle}
							data-num={thisStepNum}
							// data-hide={isHideNum ? '1' : null}
						>
							{thisStepLabel ? (
								<span className='__label'>{thisStepLabel}</span>
							) : null}
						</div>
						<RichText
							placeholder={__('Enter text', 'arkhe-blocks') + '...'}
							className={`${blockName}__title`}
							tagName='div'
							value={title}
							onChange={(val) => setAttributes({ title: val })}
						/>
					</div>
					<div className={`${blockName}__body`}>
						<InnerBlocks
							template={[['core/paragraph']]}
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
		const { title, numColor, stepLabel, theLabel, theNum, isHideLabel, isHideNum } = attributes;

		// ステップ番号の色設定
		let numStyle = null;
		let numClass = `${blockName}__number`;
		if (numColor) {
			numStyle = { '--ark-step_color': numColor };
			numClass += ' -has-color';
		}

		const thisStepLabel = isHideLabel ? '' : theLabel || stepLabel;
		const thisStepNum = isHideNum ? '' : theNum || null;

		return (
			<div className={`${blockName}__item`}>
				<div className={`${blockName}__head`}>
					<div
						className={`${numClass}`}
						style={numStyle}
						data-num={thisStepNum}
						// data-hide={isHideNum ? '1' : null}
					>
						{thisStepLabel ? <span className='__label'>{thisStepLabel}</span> : null}
					</div>

					{!!title && (
						<div className={`${blockName}__title`}>
							<RichText.Content value={title} />
						</div>
					)}
				</div>
				<div className={`${blockName}__body ark-keep-mt--s`}>
					<InnerBlocks.Content />
				</div>
			</div>
		);
	},
});
