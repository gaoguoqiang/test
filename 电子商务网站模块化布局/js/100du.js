$(function(){
	//搜索切换
	(function(){
		var aLi = $('.menu li');
		var oText = $('#search').find('.form .text');
		var attrText = [
			'例如：荷棠鱼坊烤鱼 或 樱花日本料理',
			'例如：1234434 或 65646434',
			'例如：廊坊市看了 或 房东三四错阿瓦',
			'例如：荷棠双方 或 樱花阿生料理',
			'例如：发生坊烤鱼 或 樱花阿双方理',
		];
		var iNow = 0;
		oText.val(attrText[iNow]);
		aLi.each(function(index){
			$(this).click(function(){
				iNow = index;
				aLi.attr('class','gradient');
				$(this).attr('class','active');
				oText.val(attrText[iNow]);
			})
		})
		oText.focus(function(){
			if($(this).val() == attrText[iNow]){
				$(this).val('');
			}
		})
		oText.blur(function(){
			if($(this).val() == ''){
				$(this).val(attrText[iNow]);
			}
		})
	})();
	//update文字滚动
	(function(){
		var upDate = $('.update');
		var oUl = $('.update ul');
		var oBtnUp = $('#update_up');
		var oBtnDown = $('#update_down');
		var iH = 0;
		var iNow = 0;
		var arrData = [
			{'name':'萱萱','time':1,'title':'那些灿烂华美的瞬间','url':'http://www.baidu.com'},
			{'name':'萱萱','time':2,'title':'那些灿烂华美的瞬间','url':'http://www.baidu.com'},
			{'name':'萱萱','time':3,'title':'那些灿烂华美的瞬间','url':'http://www.baidu.com'},
			{'name':'萱萱','time':4,'title':'那些灿烂华美的瞬间','url':'http://www.baidu.com'},
			{'name':'萱萱','time':5,'title':'那些灿烂华美的瞬间','url':'http://www.baidu.com'},
			{'name':'萱萱','time':6,'title':'那些灿烂华美的瞬间','url':'http://www.baidu.com'},
			{'name':'萱萱','time':7,'title':'那些灿烂华美的瞬间','url':'http://www.baidu.com'},
			{'name':'萱萱','time':8,'title':'那些灿烂华美的瞬间','url':'http://www.baidu.com'},
			{'name':'萱萱','time':9,'title':'那些灿烂华美的瞬间','url':'http://www.baidu.com'},
			{'name':'萱萱','time':10,'title':'那些灿烂华美的瞬间','url':'http://www.baidu.com'}
		]
		var str = '';
		var timer = null;
		for(var i=0;i<arrData.length;i++){
			str += '<li><a href="'+arrData[i].url+'"><strong>'+arrData[i].name+'</strong> <span>'+arrData[i].time+'分钟前</span> 写了一篇新文章：'+arrData[i].title+'...</a></li>';
		}
		oUl.html(str);
		iH = oUl.find('li').height();
		
		oBtnUp.click(function(){
			doMove(-1);
		})
		oBtnDown.click(function(){
			doMove(1);
		})
		upDate.hover(function(){
			clearInterval(timer);
		},autoPlay)
		function autoPlay(){
			timer = setInterval(function(){
				doMove(-1);
			},2000)
		}
		autoPlay();
		function doMove(num){
			iNow += num;
			if(Math.abs(iNow)>arrData.length-1){
				iNow = 0;
			}
			if(iNow>0){
				iNow = -(arrData.length-1);
			}
			oUl.stop().animate({'top':iH*iNow},2000,'elasticOut');
		}
	})();
	//options选项卡切换
	(function(){
		fnTab($('.tabNav1'),$('.tabCon1'),'click');
		fnTab($('.tabNav2'),$('.tabCon2'),'click');
		fnTab($('.tabNav3'),$('.tabCon3'),'mouseover');
		fnTab($('.tabNav4'),$('.tabCon4'),'mouseover');
		function fnTab(oNav,aCon,sEvent){
			var aElem = oNav.children();
			aCon.hide().eq(0).show();

			aElem.each(function(index){
				$(this).on(sEvent,function(){
					aElem.removeClass('active').addClass('gradient');
					$(this).removeClass('gradient').addClass('active');
					aElem.find('a').attr('class','triangle_down_gray');
					$(this).find('a').attr('class','triangle_down_red');
					aCon.hide().eq(index).show();
				})
			})
		}
	})();
	//焦点图
	(function(){
		var oDiv = $('#fade');
		var aUlLi = oDiv.find('ul li');
		var aOlLi = oDiv.find('ol li');
		var oP = oDiv.find('p');
		var arr = ['爸爸去哪啦？','人像摄影中的光影感','娇柔妩媚、美艳大方'];
		var iNow = 0;
		var timer = null;

		fnFade();
		autoPlay();
		aOlLi.click(function(){
			iNow = $(this).index();
			fnFade();
		})
		oDiv.hover(function(){
			clearInterval(timer);
		},autoPlay)
		function autoPlay(){
			timer = setInterval(function(){
				iNow++;
				iNow %= arr.length;
				fnFade();
			},3000)
		}

		function fnFade(){
			aUlLi.each(function(i){
				if(i != iNow){
					aUlLi.eq(i).fadeOut().css('zIndex',1);
					aOlLi.eq(i).removeClass('active');
				}else{
					aUlLi.eq(i).fadeIn().css('zIndex',2);
					aOlLi.eq(i).addClass('active');
				}
			})
			oP.text(arr[iNow]);
		}
	})();
	//日历
	(function(){
		var oDiv = $('.calendar');
		var aSpan = oDiv.find($('h3 span'));
		var aImg = oDiv.find($('.img'));
		var oPrompt = oDiv.find($('.today_info'));
		var oImg = oPrompt.find($('img'));
		var oStrong = oPrompt.find($('strong'));
		var oP = oPrompt.find($('p'));

		aImg.hover(function(){
			var iTop = $(this).parent().position().top-30;
			var iLeft = $(this).parent().position().left+50;
			var index = $(this).parent().index()%aSpan.size();
			oPrompt.show().css({'left':iLeft,'top':iTop});
			oImg.attr('src',$(this).attr('src'));
			oP.text($(this).attr('info'));
			oStrong.text(aSpan.eq(index).text());

			
		},function(){
			oPrompt.hide();
		})
	})();
	//BBS高亮显示
	(function(){
		var bbs = $('.bbs');
		var aLi = bbs.find('ol li');
		aLi.mouseover(function(){
			aLi.removeClass('active');
			$(this).addClass('active')
		})
	})();
	//HOT鼠标提示
	(function(){
		var arr = [
			'',
			'用户1<br />人气1',
			'用户名：性感宝贝<br />区域：朝阳CBD<br />人气：124987',
			'用户3<br />人气3',
			'用户4<br />人气4',
			'用户5<br />人气5',
			'用户6<br />人气6',
			'用户7<br />人气7',
			'用户8<br />人气8',
			'用户9<br />人气9',
			'用户10<br />人气10'
		];
		$('.hot_area li').mouseover(function(){
			if($(this).index() == 0)return;
			$('.hot_area li p').remove();
			var iW = $(this).width()-12;
			var iH = $(this).height()-12;
			$(this).append('<p style="width:'+iW+'px;height:'+iH+'px">'+arr[$(this).index()]+'</p>');
		})
	})();
})