<?php
namespace Arkhe_Blocks\Menu;

defined( 'ABSPATH' ) || exit;

// PAGE_NAME
$db_name   = 'format';
$page_name = \Arkhe_Blocks::MENU_PAGE_PREFIX . $db_name;


\Arkhe_Blocks::add_menu_section( [
	'title'      => __( 'Custom format', 'arkhe-blocks' ),
	'key'        => 'custom_format',
	'page_name'  => $page_name,
	'db'         => $db_name,
	'page_cb'    => '\Arkhe_Blocks\Menu\cb_custom_format',
	'section_cb' => function() {
		echo '<p>' . esc_html__( 'You can define formats that can be applied from the block toolbar.', 'arkhe-blocks' ) . '</p>';
	},
] );

function cb_custom_format( $args ) {

	for ( $i = 1; $i < 4; $i++ ) {
		$label = __( 'Custom format', 'arkhe-blocks' ) . ' - ' . $i;

		echo '<div class="arkhe-menu__customFormat">';
			echo '<div class="h3 __label">' . esc_html( $label ) . '</div>';
			echo '<div class="arkhe-menu__field -text">' .
				esc_html__( 'Class name', 'arkhe-blocks' ) .
				' : <code>arkb-format-' . esc_html( $i ) . '</code>' .
			'</div>';
			\Arkhe_Blocks::output_text_field([
				'db'    => $args['db'],
				'key'   => 'format_title_' . $i,
				'label' => __( 'Display name', 'arkhe-blocks' ),
			]);
			// \Arkhe_Blocks::output_text_field([
			// 	'db'    => $args['db'],
			// 	'key'   => 'format_class_' . $i,
			// 	'label' => __( 'クラス名', 'arkhe-blocks' ),
			// ]);
		echo '</div>';
	}
}


\Arkhe_Blocks::add_menu_section( [
	'title'      => __( 'CSS for custom format', 'arkhe-blocks' ),
	'key'        => 'custom_format_css',
	'page_name'  => $page_name,
	'db'         => $db_name,
	'page_cb'    => '\Arkhe_Blocks\Menu\cb_custom_format_css',
	'section_cb' => function() {
		echo '<p>' . esc_html__( 'The CSS written here is loaded on both the front side and the editor side.', 'arkhe-blocks' ) . '</p>';
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
