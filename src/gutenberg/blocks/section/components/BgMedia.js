/**
 * @others dependencies
 */
import classnames from 'classnames';

const blockName = 'ark-block-section';

/**
 * 背景画像のソース
 */
export const BgMedia = ({ attributes }) => {
	const {
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
		isRepeat,
	} = attributes;

	// console.log('Do getBgImage');
	if (isRepeat) {
		return null;
	}

	if (!mediaUrl) {
		return null;
	}

	const style = {};
	if (!!focalPoint) {
		const pX = (focalPoint.x * 100).toFixed();
		const pY = (focalPoint.y * 100).toFixed();
		// style.objectPosition = `${pX}% ${pY}%`;
		style['--arkb-object-position'] = `${pX}% ${pY}%`;
	}

	// const styleSP = {};
	if (!!focalPointSP) {
		const pX = (focalPointSP.x * 100).toFixed();
		const pY = (focalPointSP.y * 100).toFixed();
		// styleSP.objectPosition = `${pX}% ${pY}%`;
		style['--arkb-object-position--sp'] = `${pX}% ${pY}%`;
	}

	// let mediaClass = 'video' === mediaType ? `${blockName}__video` : `${blockName}__picture`;
	// mediaClass = classnames(mediaClass, 'u-obf-cover', {
	// 	[`wp-image-${mediaId}`]: !!mediaId,
	// });

	let mediaSrc = null;
	if ('video' === mediaType && 'image' !== mediaTypeSP) {
		const mediaClass = classnames(`${blockName}__video`, 'u-obf-cover');
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
		const mediaClass = classnames(`${blockName}__picture`);
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
					alt=''
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

	if (!mediaSrc) return '';

	return <div className={`${blockName}__media arkb-absLayer`}>{mediaSrc}</div>;

	// let imgClass = 'ark-block-section__bg u-obf-cover';
	// if (mediaUrlSP) {
	// 	imgClass = classnames(imgClass, 'u-only-pc');
	// }
	// if (mediaId) {
	// 	imgClass = classnames(imgClass, `wp-image-${mediaId}`);
	// }

	// let imgClassSP = 'ark-block-section__bg u-obf-cover u-only-sp';
	// if (mediaIdSP) {
	// 	imgClassSP = classnames(imgClassSP, `wp-image-${mediaIdSP}`);
	// }

	// const mediaForPC =
	// 	'video' === mediaType ? (
	// 		<video
	// 			// controls=''
	// 			autoPlay
	// 			loop
	// 			playsinline
	// 			muted
	// 			src={mediaUrl}
	// 			className={imgClass}
	// 			width={mediaWidth || null}
	// 			height={mediaHeight || null}
	// 			data-for='pc'
	// 			style={style || null}
	// 		/>
	// 	) : (
	// 		<img
	// 			src={mediaUrl}
	// 			className={imgClass}
	// 			alt=''
	// 			width={mediaWidth || null}
	// 			height={mediaHeight || null}
	// 			data-for='pc'
	// 			style={style}
	// 		/>
	// 	);

	// let mediaForSP = null;
	// if (mediaUrlSP) {
	// 	mediaForSP =
	// 		'video' === mediaTypeSP ? (
	// 			<video
	// 				// controls=''
	// 				autoPlay
	// 				loop
	// 				playsinline
	// 				muted
	// 				src={mediaUrlSP}
	// 				className={imgClassSP}
	// 				width={mediaWidthSP || null}
	// 				height={mediaHeightSP || null}
	// 				data-for='sp'
	// 				style={styleSP || null}
	// 			/>
	// 		) : (
	// 			<img
	// 				src={mediaUrlSP}
	// 				className={imgClassSP}
	// 				alt=''
	// 				width={mediaWidthSP || null}
	// 				height={mediaHeightSP || null}
	// 				data-for='sp'
	// 				style={styleSP}
	// 			/>
	// 		);
	// }

	// return (
	// 	<>
	// 		{mediaForPC}
	// 		{mediaForSP}
	// 	</>
	// );
};
