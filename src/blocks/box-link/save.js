/**
 * @WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { RawHTML } from '@wordpress/element';
import { RichText, InnerBlocks, useBlockProps } from '@wordpress/block-editor';

/**
 * @Internal dependencies
 */
import { ArkheIconOnSave } from '@components/ArkheIcon';

/**
 * @Others dependencies
 */
import classnames from 'classnames';

const blockName = 'ark-block-boxLink';
export default function ({ attributes }) {
	const {
		align,
		useIcon,
		icon,
		iconSize,
		iconHtml,
		layout,
		imgId,
		imgUrl,
		imgAlt,
		// imgSize,
		imgW,
		imgH,
		fixRatio,
		ratio,
		title,
		htag,
		href,
		rel,
		isNewTab,
		more,
		showMoreArrow,
	} = attributes;

	const blockClass = classnames(blockName, 'arkb-boxLink', 'arkb-columns__item', '-' + layout, {
		'has-text-align-center': 'center' === align,
	});

	// 縦並びか横並びかを変数化
	const isVertical = 'vertical' === layout;

	const attrClass = attributes.className || '';
	const isBannerStyle = -1 !== attrClass.indexOf('is-style-banner');

	// アイコン
	const iconStyle = !iconSize
		? null
		: {
				'--arkb-boxlink_icon_size': iconSize + 'px',
		  };
	let iconContent = null;
	if (useIcon && !!iconHtml) {
		iconContent = (
			<figure className='arkb-boxLink__figure -icon -html' style={iconStyle}>
				<RawHTML>{iconHtml}</RawHTML>
			</figure>
		);
	} else if (useIcon) {
		iconContent = (
			<figure className='arkb-boxLink__figure -icon' style={iconStyle}>
				<ArkheIconOnSave icon={icon} className={`arkb-boxLink__icon`} />
			</figure>
		);
	}

	// 画像
	const img = (
		<img
			className={`arkb-boxLink__img u-lb-off wp-image-${imgId}`}
			src={imgUrl}
			alt={imgAlt}
			width={imgW || null}
			height={imgH || null}
		/>
	);

	let figure = '';
	if (isBannerStyle) {
		figure = (
			<>
				{imgUrl && <figure className='arkb-boxLink__bg'>{img}</figure>}
				{iconContent}
			</>
		);
	} else if (useIcon) {
		figure = iconContent;
	} else if (imgUrl) {
		// figure の style
		let figureStyle = null;
		if (isVertical) {
			figureStyle = ratio ? { paddingTop: `${ratio}%` } : null;
		} else {
			figureStyle = ratio ? { flexBasis: `${ratio}%` } : null;
		}

		figure = (
			<figure
				className={classnames('arkb-boxLink__figure', { 'is-fixed-ratio': fixRatio })}
				style={figureStyle}
			>
				{img}
			</figure>
		);
	}

	const blockProps = useBlockProps.save({
		className: blockClass,
	});
	const InnerTag = !!href ? 'a' : 'div';

	return (
		<div {...blockProps}>
			<InnerTag
				href={href}
				className='arkb-boxLink__inner'
				rel={rel}
				target={isNewTab ? '_blank' : null}
			>
				{figure}

				<div className='arkb-boxLink__body'>
					{!RichText.isEmpty(title) && (
						<RichText.Content
							tagName={htag}
							className='arkb-boxLink__title'
							value={title}
						/>
					)}

					<div className='arkb-boxLink__content ark-keep-mt--s'>
						<InnerBlocks.Content />
					</div>
					{more && (
						<div className='arkb-boxLink__more'>
							<span className={`arkb-boxLink__more__text`}>{more}</span>

							{showMoreArrow && (
								<svg
									className='arkb-boxLink__more__svg'
									width='16'
									height='16'
									viewBox='0 0 32 32'
									role='img'
									focusable='false'
								>
									<path d='M30.4,15.5l-4.5-4.5l-1.1,1.1l3.4,3.4H1.6v1.6h28.8V15.5z' />
								</svg>
							)}
						</div>
					)}
				</div>
			</InnerTag>
		</div>
	);
}
