<?php
/**
 * RSSリストの出力テンプレート
 *   $args['rss_items'] : 各記事の情報
 *   $args['list_args'] : リストの表示に関する設定値
 */
$rss_items = $args['rss_items'] ?? [];
$list_args = $args['list_args'] ?? [];

if ( empty( $rss_items ) ) return;

// リストタイプ
$list_type = $list_args['list_type'] ?? 'card';

// リストスタイルによって読み込むファイル名を振り分ける
$file_name = ( 'simple' === $list_type ) ? 'simple' : 'normal';

// ループのカウント用変数
$loop_count = 0;

$list_count_pc = $list_args['list_count_pc'] ?? 3;
$list_count_sp = $list_args['list_count_sp'] ?? 3;

$min        = min( $list_count_pc, $list_count_sp );
$max        = max( $list_count_pc, $list_count_sp );
$list_class = $min === $list_count_pc ? 'u-only-sp' : 'u-only-pc';

?>
<ul class="p-postList -type-<?php echo esc_attr( $list_type ); ?> is-rss">
	<?php
	foreach ( $rss_items as $feed_data ) {
		$loop_count++;

		if ( $max < $loop_count ) {
			break;
		} elseif ( $min < $loop_count ) {
			$list_args['list_class'] = $list_class;
		}

		$list_args['count'] = $loop_count;

		\Arkhe_Blocks::get_part( 'rss/' . $file_name, [
			'list_args' => $list_args,
			'feed_data' => $feed_data,
		] );
	}
?>
</ul>
