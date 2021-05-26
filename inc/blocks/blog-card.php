<?php
namespace Arkhe_Blocks\Block\Blog_Card;

defined( 'ABSPATH' ) || exit;

register_block_type_from_metadata(
	ARKHE_BLOCKS_PATH . 'src/gutenberg/blocks/blog-card',
	[
		'render_callback'  => '\Arkhe_Blocks\Block\Blog_Card\cb',
	]
);

function cb( $attrs, $content ) {

	$sc_props      = '';
	$post_id       = $attrs['postId'];
	$caption       = $attrs['caption'];
	$is_newtab     = $attrs['isNewTab'];
	$external_url  = $attrs['externalUrl'];
	$rel           = $attrs['rel'];
	$use_cache     = $attrs['useCache'];
	$show_exerptPC = $attrs['showExerptPC'];
	$show_exerptSP = $attrs['showExerptSP'];
	$show_image    = $attrs['showImage'];

	$is_external = ! empty( $external_url );
	$card_data   = [];

	// キャッシュがあるか調べる
	$cache_key = $is_external ? 'arkhe_blogcard_' . md5( $external_url ) : 'arkhe_blogcard_' . $post_id;
	if ( $use_cache ) {
		$card_data = get_transient( $cache_key ) ?: [];
	} else {
		delete_transient( $cache_key );
	}

	if ( empty( $card_data ) ) {
		if ( $is_external ) {
			$card_data = get_external_blog_card( $external_url );
		} elseif ( $post_id ) {
			$card_data = get_internal_blog_card( $post_id );
		}

		if ( null === $card_data ) {
			return '';
		}

		if ( $use_cache ) {
			$cache_time = apply_filters( 'arkhe_blocks_blogcard_cache_time', DAY_IN_SECONDS * 7 );
			set_transient( $cache_key, $card_data, $cache_time );
		}
	}

	$card_data['is_newtab'] = $is_newtab;
	$card_data['rel']       = $rel;
	$card_data['type']      = $is_external ? 'external' : 'internal';
	$card_data['class']     = $attrs['className'];
	$card_data['anchor']    = $attrs['anchor'];

	// キャプションの設定があれば
	if ( $caption ) {
		$card_data['caption'] = $caption;
	}

	$data_excerpt = '';
	if ( $show_exerptPC && $show_exerptSP ) {
		$data_excerpt = 'both';
	} elseif ( $show_exerptPC ) {
		$data_excerpt = 'pc';
	} elseif ( $show_exerptSP ) {
		$data_excerpt = 'sp';
	} else {
		$data_excerpt = 'none';
	}

	$card_data['show_excerpt'] = $data_excerpt;
	$card_data['show_image']   = $show_image;

	ob_start();
	\Arkhe_Blocks::get_part( 'blog_card', $card_data );
	return ob_get_clean();
}



/**
 * 内部リンクのブログカード化
 */
function get_internal_blog_card( $post_id ) {

	$post_data = get_post( $post_id );
	if ( null === $post_data ) return [];

	// 抜粋分の文字数セット
	$excerpt_length = apply_filters( 'arkhe_blocks_blogcard_excerpt_lengtg', 140 );
	if ( IS_ARKHE_THEME ) {
		\Arkhe::$excerpt_length = $excerpt_length;
	}

	$title   = get_the_title( $post_id );
	$url     = get_permalink( $post_id );
	$excerpt = apply_filters( 'get_the_excerpt', $post_data->post_excerpt, $post_data );

	// タイトルは最大100文字までに制限
	if ( mb_strwidth( $title, 'UTF-8' ) > 100 ) {
		$title = mb_strimwidth( $title, 0, 100, '...', 'UTF-8' );
	}

	if ( IS_ARKHE_THEME ) {

		// リセット
		\Arkhe::$excerpt_length = ARKHE_EXCERPT_LENGTH;

	} elseif ( mb_strwidth( $excerpt, 'UTF-8' ) > $excerpt_length ) {

		// 抜粋文の文字数制御
		$excerpt = mb_strimwidth( $excerpt, 0, $excerpt_length ) . '...';
	}

	$card_data = [
		'url'       => $url,
		'title'     => $title,
		'excerpt'   => $excerpt,
	];

	// サムネイル画像のデータをセット
	if ( has_post_thumbnail( $post_id ) ) {
		$thumb_id   = get_post_thumbnail_id( $post_id );
		$thumb_data = wp_get_attachment_image_src( $thumb_id, 'medium' );
		$thumb_url  = $thumb_data[0];

		$card_data['thumb_id']  = $thumb_id;
		$card_data['thumb_url'] = $thumb_url;
	}

	return $card_data;
}


/**
 * 外部サイトのブログカード
 */
function get_external_blog_card( $url ) {

	// Get_OGP_InWP の読み込み
	require_once ARKHE_BLOCKS_PATH . 'classes/plugins/get_ogp_inwp.php';

	$ogps = \Get_OGP_InWP::get( $url );
	if ( empty( $ogps ) ) return [];

	// 必要なデータを抽出
	$card_data = \Get_OGP_InWP::extract_card_data( $ogps );

	$title       = $card_data['title'];
	$description = $card_data['description'];
	$site_name   = $card_data['site_name'];

	/**
	 * はてなブログの文字化け対策
	 */
	$title_decoded = utf8_decode( $title );  // utf8でのデコード
	if ( mb_detect_encoding( $title_decoded ) === 'UTF-8' ) {
		$title = $title_decoded;

		$description_decoded = utf8_decode( $description );
		if ( mb_detect_encoding( $description_decoded ) === 'UTF-8' ) {
			$description = $description_decoded;
		}

		$site_name_decoded = utf8_decode( $site_name );
		if ( mb_detect_encoding( $site_name_decoded ) === 'UTF-8' ) {
			$site_name = $site_name_decoded;
		}
	}

	// 文字数で切り取り
	if ( mb_strwidth( $title, 'UTF-8' ) > 100 ) {
		$title = mb_strimwidth( $title, 0, 100 ) . '...';
	}
	if ( mb_strwidth( $site_name, 'UTF-8' ) > 32 ) {
		$site_name = mb_strimwidth( $site_name, 0, 32 ) . '...';
	}
	$excerpt_length = apply_filters( 'arkhe_blocks_blogcard_excerpt_lengtg', 140 );
	if ( mb_strwidth( $description, 'UTF-8' ) > $excerpt_length ) {
		$description = mb_strimwidth( $description, 0, $excerpt_length ) . '...';
	}

	return [
		'url'       => $url,
		'title'     => $title,
		'excerpt'   => $description,
		'thumb_url' => $card_data['thumbnail'],
		'icon'      => $card_data['icon'],
		'caption'   => $site_name,
	];
}
