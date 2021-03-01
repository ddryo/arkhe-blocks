<?php
namespace Arkhe_Blocks\Menu;

defined( 'ABSPATH' ) || exit;

// PAGE_NAME
$db_name   = 'format';
$page_name = \Arkhe_Blocks::MENU_PAGE_PREFIX . $db_name;


\Arkhe_Blocks::add_menu_section( [
	'title'      => __( 'カスタム書式', 'arkhe-blocks' ),
	'key'        => 'custom_format',
	'page_name'  => $page_name,
	'db'         => $db_name,
	'page_cb'    => '\Arkhe_Blocks\Menu\cb_custom_format',
	'section_cb' => function() {
		echo '<p>' . esc_html__( 'ブロックツールバーから適用できる書式フォーマットを定義できます。', 'arkhe-blocks' ) . '</p>';
	},
] );

function cb_custom_format( $args ) {

	for ( $i = 1; $i < 4; $i++ ) {
		echo '<div class="arkhe-menu__customFormat">';
			echo '<div class="h3 __label">カスタム書式 - ' . esc_html( $i ) . '</div>';
			\Arkhe_Blocks::output_text_field([
				'db'    => $args['db'],
				'key'   => 'format_title_' . $i,
				'label' => __( '表示名', 'arkhe-blocks' ),
			]);
			\Arkhe_Blocks::output_text_field([
				'db'    => $args['db'],
				'key'   => 'format_class_' . $i,
				'label' => __( 'クラス名', 'arkhe-blocks' ),
			]);
		echo '</div>';
	}

	echo '<p class="arkhe-menu__help">実際の出力時にクラス名は<code>arkb-{入力したクラス名}</code>となります</p>';

}


\Arkhe_Blocks::add_menu_section( [
	'title'      => __( 'カスタム書式用CSS', 'arkhe-blocks' ),
	'key'        => 'custom_format_css',
	'page_name'  => $page_name,
	'db'         => $db_name,
	'page_cb'    => '\Arkhe_Blocks\Menu\cb_custom_format_css',
	'section_cb' => function() {
		echo '<p>' . esc_html__( 'ここに記述したCSSは、フロント側とエディター側の両方で読み込まれます。', 'arkhe-blocks' ) . '</p>';
	},
] );

function cb_custom_format_css( $args ) {
	$key  = $args['section_key'];
	$name = \Arkhe_Blocks::DB_NAMES[ $args['db'] ] . '[' . $key . ']';
	$val  = \Arkhe_Blocks::get_data( $args['db'], $key );
?>
	<div class="arkhe-menu__field -codemirror">
		<textarea id="<?=esc_attr( $key )?>" cols="60" rows="30" name="<?=esc_attr( $name )?>" id="<?=esc_attr( $name )?>" class="arkb-css-editor" ><?php echo esc_textarea( $val ); ?></textarea>
	</div>
	<?php
}
