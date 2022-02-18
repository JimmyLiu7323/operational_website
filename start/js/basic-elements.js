$(document).ready(function(){
    $('.list-trophies').bind('mousewheel', function(e){
        if($(this).scrollTop() + $(this).innerHeight() >= $(this)[0].scrollHeight - 80) {
            if(!loadingTrophies){
                loadingTrophies = true;
                let currentPage = trophyPage;
                currentPage++;
                trophyPage = currentPage;
                $.ajax({
                    url:domain+"item_trophies",
                    header:{
                        "content-type": "application/x-www-form-urlencoded"
                    },
                    method:"GET",
                    data:{
                        page:currentPage,
                        page_size:5
                    },
                    success (res) {
                        if(parseInt(res['code'])===0&&res['msg'].trim()==='ok'){
                            if(res['data']['DataItems']['length']>0){
                                let trophyProduct = "";
                                res['data']['DataItems'].forEach(trophy=>{
                                    trophyProduct = "";
                                    trophyProduct += "<div class='trophy-item' onclick='previewTrophy(this)' ";
                                    trophyProduct += "data-trophyid='"+trophy['ID']+"'";
                                    trophyProduct += "data-trophyid='"+trophy['ID']+"'";
                                    trophyProduct += "data-pname='"+trophy['Name']+"'";
                                    trophyProduct += "data-length='"+trophy['Length']+"'";
                                    trophyProduct += "data-width='"+trophy['Width']+"'";
                                    trophyProduct += "data-height='"+trophy['Height']+"'";
                                    trophyProduct += "data-image='"+trophy['Images'][0]+"'>";

                                    trophyProduct += "<img class='trophy-first-image' src='"+domain+trophy['Images'][0]+"' />";
                                    trophyProduct += "<text class='trophy-price'>¥"+trophy['CostPrice']+"</text>";
                                    trophyProduct += "<text class='trophy-name'>"+trophy['Name']+"</text>";
                                    trophyProduct += "</div>";

                                    $('#append-list-trophies').append(trophyProduct);
                                })
                            }
                            else{
                                currentPage--;
                                trophyPage = currentPage;
                                nomoreTrophies = true;
                            }
                            loadingTrophies = false;
                        }
                    },
                    error(){
                        loadingTrophies = false;
                    }
                });
            }
        }
    });
})

function previewTrophies(){
	$.ajax({
		url:domain+"item_trophies",
		header:{
            "content-type": "application/x-www-form-urlencoded"
        },
        method:"GET",
        data:{
        	page:defaultPreviewPage,
            page_size:5
        },
        success (res) {
            if(parseInt(res['code'])===0&&res['msg'].trim()==='ok'){
                let previewTrophies = res['data']['DataItems'];
                let newTrophy = '';
                let newTrophyName = '';

                let trophyProduct = '';
                if(previewTrophies.length>0){
                    let iframeHeight = $('.iframe_typesetting').css('height');
                    $('.iframe_typesetting').attr('src','trophy_typesetting.html?height='+iframeHeight+'&trophy-id='+previewTrophies[0]['ID']);
                }

                previewTrophies.forEach(trophy=>{
                    newTrophy = "";
                    newTrophy += "<div class='trophy-preview-image' onclick='previewTrophy(this)' ";
                    newTrophy += "data-trophyid='"+trophy['ID']+"'";
                    newTrophy += "data-pname='"+trophy['Name']+"'";
                    newTrophy += "data-length='"+trophy['Length']+"'";
                    newTrophy += "data-width='"+trophy['Width']+"'";
                    newTrophy += "data-height='"+trophy['Height']+"'";
                    newTrophy += "data-image='"+trophy['Images'][0]+"'>";

                    newTrophy += "<img src='"+domain+trophy['Images'][0]+"' />";
                    newTrophy += "</div>";
                    $('#preview-images').append(newTrophy);

                    newTrophyName = "<text class='trophy-name'>"+trophy['Name']+"</text>";
                    $('.trophies-preview-names').append(newTrophyName);

                    trophyProduct = "";
                    trophyProduct += "<div class='trophy-item' onclick='previewTrophy(this)' ";
                    trophyProduct += "data-trophyid='"+trophy['ID']+"'";
                    trophyProduct += "data-trophyid='"+trophy['ID']+"'";
                    trophyProduct += "data-pname='"+trophy['Name']+"'";
                    trophyProduct += "data-length='"+trophy['Length']+"'";
                    trophyProduct += "data-width='"+trophy['Width']+"'";
                    trophyProduct += "data-height='"+trophy['Height']+"'";
                    trophyProduct += "data-image='"+trophy['Images'][0]+"'>";

                    trophyProduct += "<img class='trophy-first-image' src='"+domain+trophy['Images'][0]+"' />";
                    trophyProduct += "<text class='trophy-price'>¥"+trophy['CostPrice']+"</text>";
                    trophyProduct += "<text class='trophy-name'>"+trophy['Name']+"</text>";
                    trophyProduct += "</div>";

                    $('#append-list-trophies').append(trophyProduct);
                });
            }
        }
	})
}

function expandTrophies(elem){
    $(elem).children('img').toggleClass('expanding');
    $('.list-trophies-container').toggle();
}

function previewTrophy(elem){
    let iframeHeight = $('.iframe_typesetting').css('height');
    $('.iframe_typesetting').attr('src','trophy_typesetting.html?height='+iframeHeight+'&trophy-id='+$(elem).attr('data-trophyid'));
}