/**
 * @others dependencies
 */
import classnames from 'classnames';

/**
 * 背景画像のソース
 */
export const BgImage = ({ attributes }) => {
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
		style.objectPosition = `${pX}% ${pY}%`;
	}

	const styleSP = {};
	if (!!focalPointSP) {
		const pX = (focalPointSP.x * 100).toFixed();
		const pY = (focalPointSP.y * 100).toFixed();
		styleSP.objectPosition = `${pX}% ${pY}%`;
	}

	let imgClass = 'ark-block-section__bg u-obf-cover';
	if (mediaUrlSP) {
		imgClass = classnames(imgClass, 'u-only-pc');
	}
	if (mediaId) {
		imgClass = classnames(imgClass, `wp-image-${mediaId}`);
	}

	let imgClassSP = 'ark-block-section__bg u-obf-cover u-only-sp';
	if (mediaIdSP) {
		imgClassSP = classnames(imgClassSP, `wp-image-${mediaIdSP}`);
	}

	const mediaForPC =
		'video' === mediaType ? (
			<video
				// controls=''
				autoPlay
				loop
				playsinline
				muted
				src={mediaUrl}
				className={imgClass}
				width={mediaWidth || null}
				height={mediaHeight || null}
				data-for='pc'
				style={style || null}
			/>
		) : (
			<img
				src={mediaUrl}
				className={imgClass}
				alt=''
				width={mediaWidth || null}
				height={mediaHeight || null}
				data-for='pc'
				style={style}
			/>
		);

	let mediaForSP = null;
	if (mediaUrlSP) {
		mediaForSP =
			'video' === mediaTypeSP ? (
				<video
					// controls=''
					autoPlay
					loop
					playsinline
					muted
					src={mediaUrlSP}
					className={imgClassSP}
					width={mediaWidthSP || null}
					height={mediaHeightSP || null}
					data-for='sp'
					style={styleSP || null}
				/>
			) : (
				<img
					src={mediaUrlSP}
					className={imgClassSP}
					alt=''
					width={mediaWidthSP || null}
					height={mediaHeightSP || null}
					data-for='sp'
					style={styleSP}
				/>
			);
	}

	return (
		<>
			{mediaForPC}
			{mediaForSP}
		</>
	);
};
