function resetDesign(){
	let designTrophy = getParameterByName('trophy-id');
	if(designTrophy&&designTrophy!==''){
		$.ajax({
            url:domain+"item_trophies",
            header:{
                "content-type": "application/x-www-form-urlencoded"
            },
            method:"GET",
            data:{
                item_trophy_id:designTrophy
            },
            success (res) {
                if(parseInt(res['code'])===0&&res['msg'].trim()==='ok'){
                	let newTrophy = res['data']['DataItems'][0];
                    let trophyData = {
				        id:newTrophy['ID'],
				        pname:newTrophy['Name'],
				        length:newTrophy['Length'],
				        width:newTrophy['Width'],
				        height:newTrophy['Height'],
				        image:newTrophy['Images'][0]
				    };

				    previewingTrophy = {
				        id:trophyData['id'],
				        name:trophyData['pname'],
				        length:trophyData['length'],
				        width:trophyData['width'],
				        height:trophyData['height'],
				        image:trophyData['image'],
				    }

				    $('.trophy-title').text(previewingTrophy['name']);
				    $('#size-txt').text(previewingTrophy['length']+'x'+previewingTrophy['width']+'x'+previewingTrophy['height']);   
                }
            }
        });
	}
}

function setDesignParameter(options){
	editingObject = options;
	$('#iText-input').val('');
	$("#iText-font-family").val($("#iText-font-family option:first").val());

	let currText = options.target.text;
	let currFontFamily = options.target.fontFamily
	$('#iText-input').val(currText);
	$.each($('#iText-font-family').children('option'),function(k,v){
		if($(this).val()===currFontFamily){
			$(this).prop('selected',true);
		}
		else{
			$(this).prop('selected',false);
		}
	})
}

function renewText(){
	let newText = $('#iText-input').val();
	let newFontFamily = $("#iText-font-family").val();
	let canvasObjs = canvas.getObjects();
  	canvasObjs.forEach(function(obj){
    	if(obj && obj.id===editingTextId){
      		obj.set('text',newText);
      		obj.fontFamily = newFontFamily;
       		canvas.renderAll();
    	}
  	});
	$('#text-window').hide();
}