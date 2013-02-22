jQuery(document).ready(function(){

	var selectedTile;
	var relativeTile;
	var cols;
	var rows;
	var tileCount = 0;

	function make_user_key(length)
	{
		var text = "";
		var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

		for( var i=0; i < length; i++ )
			text += possible.charAt(Math.floor(Math.random() * possible.length));

		return text;
	}

	getImages();
	jQuery('#assets').append('<div class="texture clearBlock" rel="'+tileCount+'" style="width:32px; height:32px; " />');
	function getImages(){
		jQuery('#assets').html('');
		jQuery.ajax({
			url: 'lib/getFolderContents.php',
			dataType: 'json',
			success: function(data) {
				for(var i = 0; i < data.length; i++){
					
					var image = data[i]['image'].substr(3);
					var imgdata = JSON.parse(data[i]['data']);

					for(var ii = 0; ii < imgdata.sc; ii++){
						tileCount++;
						jQuery('#assets').append('<div class="texture" rel="'+tileCount+'" style="width:'+imgdata.sw+'px; height:'+imgdata.sh+'px; background-image: url('+image+'); background-position: -'+imgdata.sx+'px -'+imgdata.sy+'px;"></div>');
						imgdata.sx = +imgdata.sx + +imgdata.sw;
					}
					jQuery('.texture').draggable({
						helper : 'clone',
						snap: ".stageblock",
						start: function(){
							if(jQuery(this).hasClass('clearBlock')){
								jQuery(this).css('background', jQuery('#stage_bg').val());
							}
							selectedTile = jQuery(this).attr('style');
							relativeTile = jQuery(this).attr('rel');
						}
					});
				}
			}
		});
	};

	jQuery('#buildstage').click(function(){
		if(jQuery('#stage').length > 0){
			jQuery('#stage').html('');
		}
		var sw = jQuery('#stage_width').val();
		var sh = jQuery('#stage_height').val();
		var bg = jQuery('#stage_bg').val();

		cols = Math.round(sw / 32);
		rows = Math.round(sh / 32);

		jQuery('#stage').css('width', sw)
		.css('height', sh);

		for(var i = 0; i < (cols * rows); i++){
			jQuery('#stage').append('<div class="stageblock" rel="0" style="background: '+bg+';" />');
			jQuery('.stageblock').droppable({ drop: Drop });
		}

		function Drop(event, ui) {
			jQuery(this).attr('style', selectedTile)
			.attr('rel', relativeTile);
		}
	});


	jQuery('#exportLevel').click(function(){
		var exported = '[[';
		var colsrendered = 0;
		var rowsrendered = 0;
		jQuery('#stage div').each(function(){
			
			exported += jQuery(this).attr('rel');

			if(colsrendered < cols-1){
				exported += ',';
				colsrendered++;
			}else if(rowsrendered < rows-1){
				exported += '],['
				colsrendered = 0;
				rowsrendered++;
			}

			
		});
		exported += ']]';

		jQuery('#exportResult').html(exported);
	});

});