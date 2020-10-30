/**
 * @WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { useSelect } from '@wordpress/data';
import {
	PanelBody,
	TextControl,
	BaseControl,
	CheckboxControl,
	SelectControl,
	ButtonGroup,
	Button,
	TreeSelect,
} from '@wordpress/components';

/**
 * @Internal dependencies
 */
import buildTermsTree from '@src/helper/build-terms-tree';

export default function (props) {
	const { attributes, setAttributes, authors } = props;
	const {
		postID,
		catID,
		tagID,
		taxName,
		termID,
		catRelation,
		tagRelation,
		termRelation,
		queryRelation,
		excID,
		exCatChildren,
		authorID,
		postType,
	} = attributes;
	const catIDs = catID.split(',');
	const tagIDs = tagID.split(',');
	const termIDs = termID.split(',');

	const categoryData = useSelect((select) =>
		select('core').getEntityRecords('taxonomy', 'category', {
			per_page: -1,
		})
	);
	const tagData = useSelect((select) =>
		select('core').getEntityRecords('taxonomy', 'post_tag', {
			per_page: -1,
		})
	);

	const termData = useSelect(
		(select) =>
			select('core').getEntityRecords('taxonomy', taxName, {
				per_page: -1,
			}),
		[taxName]
	);

	// 全ポストタイプを取得
	const postTypes = useSelect((select) => select('core').getPostTypes({ per_page: -1 }), []);
	// console.log( 'postTypes', postTypes );

	const postTypeList = [
		{
			label: __('All', 'swell'),
			value: 'any',
		},
	];
	if (postTypes !== null) {
		for (const pt of postTypes) {
			// publicな投稿タイプかどうか
			const isViewable = pt.viewable;

			const ignoreTypes = ['attachment', 'lp'];
			if (isViewable && ignoreTypes.indexOf(pt.slug) === -1) {
				postTypeList.push({
					label: pt.name,
					value: pt.slug,
				});
			}
		}
	}

	// 著者の選択用セレクトボックスのデータ
	const authorsArray = [{ label: '----', value: 0 }];
	authors.forEach((author) => {
		authorsArray.push({ label: author.name, value: author.id });
	});
	const getTermBtnGroup = (IDs, relation, attrName) => {
		return (
			<ButtonGroup className='ark-btns--small'>
				{1 < IDs.length ? (
					<>
						<Button
							isSecondary={'IN' !== relation}
							isPrimary={'IN' === relation}
							onClick={() => {
								props.setAttributes({
									[attrName]: 'IN',
								});
							}}
						>
							1つでも含む
						</Button>
						<Button
							isSecondary={'AND' !== relation}
							isPrimary={'AND' === relation}
							onClick={() => {
								props.setAttributes({
									[attrName]: 'AND',
								});
							}}
						>
							全て含む
						</Button>
					</>
				) : (
					<Button
						isSecondary={'NOT IN' === relation}
						isPrimary={'NOT IN' !== relation}
						onClick={() => {
							props.setAttributes({
								[attrName]: 'IN',
							});
						}}
					>
						含む
					</Button>
				)}
				<Button
					isSecondary={'NOT IN' !== relation}
					isPrimary={'NOT IN' === relation}
					onClick={() => {
						props.setAttributes({
							[attrName]: 'NOT IN',
						});
					}}
				>
					含まない
				</Button>
			</ButtonGroup>
		);
	};

	return (
		<>
			<PanelBody
				title='投稿IDで絞り込む'
				initialOpen={true}
				className='swell-panel-postList--postid'
			>
				<TextControl
					label='投稿IDを直接指定'
					placeholder='ex) 8,120,272'
					help='※ 複数の場合は , 区切りで入力して下さい。'
					value={postID || ''}
					onChange={(value) => {
						setAttributes({
							postID: value,
						});
					}}
				/>
				<TextControl
					label='除外する投稿ID'
					placeholder='ex) 6,112,264'
					help='※ 複数の場合は , 区切りで入力して下さい。'
					value={excID || ''}
					onChange={(value) => {
						setAttributes({
							excID: value,
						});
					}}
				/>
			</PanelBody>

			{!postID && (
				<>
					<PanelBody
						title='投稿タイプで絞り込む'
						initialOpen={true}
						className='swell-panel-postList--postType'
					>
						<SelectControl
							value={postType}
							options={postTypeList}
							onChange={(val) => {
								setAttributes({ postType: val });
							}}
						/>
					</PanelBody>
					<PanelBody
						title='タクソノミーの条件設定'
						initialOpen={true}
						className='swell-panel-postList--pickup'
					>
						<BaseControl>
							<div className='u-mb-5'>以下の各タクソノミーの条件に...</div>
							<ButtonGroup>
								<Button
									isSecondary={'OR' !== queryRelation}
									isPrimary={'OR' === queryRelation}
									onClick={() => {
										props.setAttributes({
											queryRelation: 'OR',
										});
									}}
								>
									1つでも
								</Button>
								<Button
									isSecondary={'AND' !== queryRelation}
									isPrimary={'AND' === queryRelation}
									onClick={() => {
										props.setAttributes({
											queryRelation: 'AND',
										});
									}}
								>
									全てに
								</Button>
							</ButtonGroup>
							<div className='u-mt-5'>該当する投稿を表示する</div>

							<hr />
						</BaseControl>
						<div className='u-mb-20 u-fz-s'>
							以下、<code>command(Ctrl)</code>
							キーを押しながらクリックすると複数選択できます。
						</div>
						<TreeSelect
							label='カテゴリー'
							// help='command(Ctrl)キーを押しながらクリックすると複数選択できます。'
							className='-category'
							noOptionLabel='----'
							onChange={(val) => {
								setAttributes({ catID: val.join(',') });
							}}
							selectedId={catIDs}
							tree={buildTermsTree(categoryData)}
							multiple
						/>

						<CheckboxControl
							className='-exCatChildren'
							label='子カテゴリのみの記事を除外'
							checked={exCatChildren}
							onChange={(checked) => {
								setAttributes({ exCatChildren: checked });
							}}
						/>

						{catID && (
							<>
								<BaseControl className='swell-control-catRelation'>
									<BaseControl.VisualLabel>
										{__('選択したカテゴリーを…', 'swell')}
									</BaseControl.VisualLabel>
									{getTermBtnGroup(catIDs, catRelation, 'catRelation')}
								</BaseControl>
							</>
						)}

						<TreeSelect
							label='タグ'
							// help='command(Ctrl)キーを押しながらクリックすると複数選択できます。'
							className='-tag'
							noOptionLabel='----'
							onChange={(val) => setAttributes({ tagID: val.join(',') })}
							selectedId={tagIDs}
							tree={buildTermsTree(tagData)}
							multiple
						/>
						{tagID && (
							<BaseControl className='swell-control-tagRelation'>
								<BaseControl.VisualLabel>
									{__('選択したタグを…', 'swell')}
								</BaseControl.VisualLabel>
								{getTermBtnGroup(tagIDs, tagRelation, 'tagRelation')}
							</BaseControl>
						)}

						<TextControl
							label='任意のタクソノミー'
							placeholder='タクソノミー名（slug）を入力'
							// help='※ 複数の場合は , 区切りで入力して下さい。'
							value={taxName || ''}
							onChange={(value) => {
								setAttributes({
									taxName: value,
								});
								if (!value) {
									setAttributes({
										termID: '',
									});
								}
							}}
						/>
						{taxName && (
							<>
								<TreeSelect
									label='ターム'
									// help='command(Ctrl)キーを押しながらクリックすると複数選択できます。'
									className='-term'
									noOptionLabel='----'
									onChange={(val) => {
										setAttributes({
											termID: val.join(','),
										});
									}}
									selectedId={termIDs}
									tree={buildTermsTree(termData)}
									multiple
								/>
								{termID && (
									<BaseControl className='swell-control-termRelation'>
										<BaseControl.VisualLabel>
											{__('選択したタームを…', 'swell')}
										</BaseControl.VisualLabel>
										{getTermBtnGroup(termIDs, termRelation, 'termRelation')}
									</BaseControl>
								)}
							</>
						)}
					</PanelBody>
				</>
			)}
			<PanelBody
				title='著者で絞り込む'
				initialOpen={true}
				className='swell-panel-postList--author'
			>
				<SelectControl
					// label='著者'
					value={authorID}
					options={authorsArray}
					onChange={(val) => {
						setAttributes({ authorID: val });
					}}
				/>
			</PanelBody>
		</>
	);
}
