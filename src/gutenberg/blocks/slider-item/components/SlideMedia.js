/**
 * @others dependencies
 */
import classnames from 'classnames';

const blockName = 'ark-block-slider';

/**
 * 背景画像のソース
 */
export const SlideMedia = ({ attributes }) => {
	const {
		variation,
		mediaId,
		mediaUrl,
		mediaWidth,
		mediaHeight,
		mediaIdSP,
		mediaUrlSP,
		mediaWidthSP,
		mediaHeightSP,
		mediaType,
		mediaTypeSP,
		focalPoint,
		focalPointSP,
		alt,
	} = attributes;

	if (!mediaUrl) {
		return null;
	}

	const style = {};
	if (!!focalPoint) {
		const pX = (focalPoint.x * 100).toFixed();
		const pY = (focalPoint.y * 100).toFixed();
		style['--arkb-object-position'] = `${pX}% ${pY}%`;
	}
	if (!!focalPointSP) {
		const pX = (focalPointSP.x * 100).toFixed();
		const pY = (focalPointSP.y * 100).toFixed();
		style['--arkb-object-position--sp'] = `${pX}% ${pY}%`;
	}

	let mediaClass = 'video' === mediaType ? `${blockName}__video` : `${blockName}__picture`;
	mediaClass = classnames(mediaClass, 'u-obf-cover', {
		[`wp-image-${mediaId}`]: !!mediaId,
	});

	let mediaSrc = null;
	if ('video' === mediaType && 'image' !== mediaTypeSP) {
		mediaClass = classnames(`${blockName}__video`, 'u-obf-cover');
		mediaSrc = (
			<video
				className={mediaClass}
				autoPlay
				loop
				playsinline
				muted
				width={mediaWidth || null}
				height={mediaHeight || null}
				style={style || null}
			>
				{mediaUrlSP && <source media='(max-width: 999px)' src={mediaUrlSP} />}
				<source src={mediaUrl} className={`${blockName}__source`} />
			</video>
		);
	} else if ('image' === mediaType && 'video' !== mediaTypeSP) {
		mediaClass = classnames(`${blockName}__picture`);
		mediaSrc = (
			<picture className={mediaClass} style={style}>
				{mediaUrlSP && (
					<source
						media='(max-width: 999px)'
						srcSet={mediaUrlSP}
						width={mediaWidthSP || null}
						height={mediaHeightSP || null}
					/>
				)}
				<img
					src={mediaUrl}
					alt={alt}
					className={classnames(`${blockName}__img u-obf-cover`, {
						[`wp-image-${mediaId}`]: !!mediaId,
					})}
					width={mediaWidth || null}
					height={mediaHeight || null}
				/>
			</picture>
		);
	}
	// else if ('video' === mediaType && 'image' === mediaTypeSP) {
	// 	mediaClass = classnames(mediaClass, 'u-only-pc');
	// 	mediaSrc = <></>;
	// }

	const layerClass = classnames(`${blockName}__media`, {
		'arkb-absLayer': 'rich' === variation,
	});

	return <div className={layerClass}>{mediaSrc}</div>;
};
