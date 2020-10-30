<?php
namespace Arkhe_Blocks;

defined( 'ABSPATH' ) || exit;

/**
 * 投稿リストブロック
 */
$block_name = 'post-list';

register_block_type_from_metadata(
	ARKHE_BLOCKS_PATH . 'src/blocks/' . $block_name,
	[
		'render_callback'  => '\Arkhe_Blocks\cb_post_list',
	]
);


function cb_post_list( $attrs, $content ) {
	// ここでは defined('REST_REQUEST')  = true になる //サーバーサイドレンダー？

	// リスト表示用データ
	$list_args = [
		'list_type'      => $attrs['listType'],
		'show_cat'       => $attrs['showCat'],
		'show_date'      => $attrs['showDate'],
		'show_modified'  => $attrs['showModified'],
		'show_author'    => $attrs['showAuthor'],
		'h_tag'          => $attrs['hTag'],
	];

	// クエリ生成用データ
	$query_args = [
		'post_type'      => $attrs['postType'],
		'order'          => $attrs['order'],
		'orderby'        => $attrs['orderby'],
		'posts_per_page' => (int) $attrs['listCount'],
		'no_found_rows'  => true,
	];

	$more_url  = $attrs['moreUrl'];
	$more_text = $attrs['moreText'];

	if ( $attrs['postID'] ) {

		// 投稿IDで直接指定されている場合
		$query_args['post__in'] = array_map( 'intval', explode( ',', $attrs['postID'] ) );

	} else {

		// 投稿IDでの指定がなければ、ターム条件を生成
		$tax_query = [];

		// カテゴリーの指定
		$cat_id = $attrs['catID'];
		if ( $cat_id ) {
			// int化して配列に
			$cat_array = array_map( 'intval', explode( ',', $cat_id ) );

			// tax_query追加
			$tax_query[] = [
				'taxonomy'         => 'category',
				'field'            => 'id',
				'terms'            => $cat_array,
				'operator'         => $attrs['catRelation'],
				'include_children' => ! $attrs['exCatChildren'],
			];

			// $more_url = $more_url ?: get_category_link( $cat_array[0] ); // moreURLなければ自動取得
		}

		// タグの指定
		$tag_id = $attrs['tagID'];
		if ( $tag_id ) {

			$tag_array   = array_map( 'intval', explode( ',', $tag_id ) );
			$tax_query[] = [
				'taxonomy'         => 'post_tag',
				'field'            => 'id',
				'terms'            => $tag_array,
				'operator'         => $attrs['tagRelation'],
				'include_children' => false,
			];

			// $more_url = $more_url ?: get_tag_link( $tag_array[0] ); // moreURLなければ自動取得
		}

		// タクソノミーの指定
		$taxonomy = $attrs['taxName'];
		$term_id  = $attrs['termID'];

		if ( $taxonomy && $term_id ) {

			$term_array  = array_map( 'intval', explode( ',', $term_id ) );
			$tax_query[] = [
				'taxonomy' => $taxonomy,
				'field'    => 'id',
				'terms'    => $term_array,
				'operator' => $attrs['termRelation'],
			];

			// $more_url = $more_url ?: get_term_link( $term_array[0], $taxonomy ); // moreURLなければ自動取得
		}

		// tax_query あればさらに追加
		if ( ! empty( $tax_query ) ) {
			$tax_query['relation']   = $attrs['queryRelation'];
			$query_args['tax_query'] = $tax_query;
		}
	}

	// 除外ID
	$exc_id = $attrs['excID'];
	if ( $exc_id ) {
		$query_args['post__not_in'] = array_map( 'intval', explode( ',', $exc_id ) );
	}

	// 著者での絞り込み
	$author_id = $attrs['authorID'];
	if ( $author_id ) {
		$query_args['author'] = $author_id;
	}

	// 抜粋文の文字数
	if ( isset( $attrs['excerptLength'] ) ) {
		$list_args['excerpt_length'] = $attrs['excerptLength'];
	}

	// リストを囲むクラス名
	$list_wrapper_class = 'ark-block-postList';
	if ( $attrs['className'] ) {
		$list_wrapper_class .= ' ' . $attrs['className'];
	}

	ob_start();
	echo '<div class="' . esc_attr( $list_wrapper_class ) . '">';

	// 投稿リスト
	\Arkhe::get_parts( 'post_list/sub_query', [
		'query_args' => $query_args,
		'list_args'  => $list_args,
	] );

	// MOREボタン (テキストがあれば表示)
	if ( '' !== $more_text && '' !== $more_url ) {

		// 相対URLの時
		if ( strpos( $more_url, '://' ) === false ) {
			$more_url = home_url( $more_url );
		}

		echo '<div class="is-style-more_btn">' .
			'<a href="' . esc_url( $more_url ) . '" class="btn_text">' . esc_html( $more_text ) . '</a>' .
		'</div>';
	}

	echo '</div>';
	return ob_get_clean();
}
