window.onload = function(){

	//验证用户名
	/*
	验证用户名
	get
		guestbook/index.php
			m : index
			a : verifyUserName
			username : 要验证的用户名
		返回
			{
				code : 返回的信息代码 0 = 没有错误，1 = 有错误
				message : 返回的信息 具体返回信息
			}
	*/
	/*
	用户注册
	get/post
		guestbook/index.php
			m : index
			a : reg
			username : 要注册的用户名
			password : 注册的密码
		返回
			{
				code : 返回的信息代码 0 = 没有错误，1 = 有错误
				message : 返回的信息 具体返回信息
			}
	*/
	/*
	用户登陆
	get/post
		guestbook/index.php
			m : index
			a : login
			username : 要登陆的用户名
			password : 登陆的密码
		返回
			{
				code : 返回的信息代码 0 = 没有错误，1 = 有错误
				message : 返回的信息 具体返回信息
			}
	*/
	/*
	用户退出
	get/post
		guestbook/index.php
			m : index
			a : logout
		返回
			{
				code : 返回的信息代码 0 = 没有错误，1 = 有错误
				message : 返回的信息 具体返回信息
			}
	*/

	/*
	留言
	post
		guestbook/index.php
			m : index
			a : send
			content : 留言内容
		返回
			{
				code : 返回的信息代码 0 = 没有错误，1 = 有错误
				data : 返回成功的留言的详细信息
					{
						cid : 留言id	
						content : 留言内容 
						uid : 留言人的id
						username : 留言人的名称
						dateline : 留言的时间戳(秒)
						support : 当前这条留言的顶的数量
						oppose : 当前这条留言的踩的数量
					}
				message : 返回的信息 具体返回信息
			}
	*/
	/*
		初始化留言列表
		get
			guestbook/index.php
				m : index
				a : getList
				page : 获取的留言的页码，默认为1
				n : 每页显示的条数，默认为10
			返回
				{
					code : 返回的信息代码 0 = 没有错误，1 = 有错误
					data : 返回成功的留言的详细信息
						{
							cid : 留言id	
							content : 留言内容 
							uid : 留言人的id
							username : 留言人的名称
							dateline : 留言的时间戳(秒)
							support : 当前这条留言的顶的数量
							oppose : 当前这条留言的踩的数量
						}
					message : 返回的信息 具体返回信息
				}
		*/
	var oUsername1 = document.getElementById('username1');
	var oUsername2 = document.getElementById('username2');
	var oPassword1 = document.getElementById('password1');
	var oPassword2 = document.getElementById('password2');
	var oVerifyUserNameMsg = document.getElementById('verifyUserNameMsg');
	var oBtnReg = document.getElementById('btnReg');
	var oBtnLogin = document.getElementById('btnLogin');
	var oUser = document.getElementById('user');
	var oReg = document.getElementById('reg');
	var oLogin = document.getElementById('login');
	var oUserinfo = document.getElementById('userinfo');
	var oLogout = document.getElementById('logout');
	var oContent = document.getElementById('content');
	var oBtnPost = document.getElementById('btnPost');
	var oList = document.getElementById('list');
	var oShowMore = document.getElementById('showMore');
	var iPage = 1;

	updateUserStatus();

	function updateUserStatus(){
		var uid = getCookie('uid');
		var username = getCookie('username');

		if(uid){
			oUser.style.display = 'block';
			oUserinfo.innerHTML = username;
			oReg.style.display = 'none';
			oLogin.style.display = 'none';
		}else{
			oUser.style.display = 'none';
			oUserinfo.innerHTML = '';
			oReg.style.display = 'block';
			oLogin.style.display = 'block';
		}

	}


	oUsername1.onblur = function(){
		ajax('get','guestbook/index.php','m=index&a=verifyUserName&username='+this.value,function(data){
			var d = JSON.parse(data);
			oVerifyUserNameMsg.innerHTML = d.message;

			if(d.code){
				oVerifyUserNameMsg.style.color = 'red';
			}else{
				oVerifyUserNameMsg.style.color = 'green';
			}
		});
	}

	oBtnReg.onclick = function(){
		ajax('get','guestbook/index.php','m=index&a=reg&username='+encodeURI(oUsername1.value)+'&password='+oPassword1.value,function(data){
			var d = JSON.parse(data);
			alert(d.message);
		})
	}

	oBtnLogin.onclick = function() {
		ajax('post', 'guestbook/index.php', 'm=index&a=login&username='+encodeURI(oUsername2.value)+'&password=' + oPassword2.value, function(data) {
			var d = JSON.parse(data);
			alert(d.message);

			if(!d.code){
				updateUserStatus();
			}
		})
	}

	oLogout.onclick = function() {
		ajax('post', 'guestbook/index.php', 'm=index&a=logout', function(data) {
			var d = JSON.parse(data);
			alert(d.message);

			if(!d.code){
				updateUserStatus();
			}
		})
		return false;
	}

	oBtnPost.onclick = function() {
		ajax('post', 'guestbook/index.php', 'm=index&a=send&content='+encodeURI(oContent.value), function(data) {
			var d = JSON.parse(data);
			alert(d.message);

			if(!d.code){
				createList(d.data,true);

			}
		})
	}

	function createList(data,insert){
		var oDl = document.createElement('dl');
		var oDt = document.createElement('dt');
		var oDd1 = document.createElement('dd');
		var oDd2 = document.createElement('dd');
		var oStrong = document.createElement('strong');
		var oA1 = document.createElement('a');
		var oA2 = document.createElement('a');

		oStrong.innerHTML = data.username;
		oDd1.innerHTML = data.content;
		oDd2.className = 't';
		oA1.innerHTML = '顶(<span>'+data.support+'</span>)';
		oA2.innerHTML = '踩(<span>'+data.oppose+'</span>)';

		oDd2.appendChild(oA1);
		oDd2.appendChild(oA2);

		oDt.appendChild(oStrong);

		oDl.appendChild(oDt);
		oDl.appendChild(oDd1);
		oDl.appendChild(oDd2);

		if(insert && oList.children[0]){
			oList.insertBefore(oDl,oList.children[0]);
		}else{
			oList.appendChild(oDl);

		}
		
	}

	showList();

	function showList(){
		ajax('get', 'guestbook/index.php', 'm=index&a=getList&n=10&page='+iPage, function(data) {
			var d = JSON.parse(data);
			var data = d.data;

			if(data){
				for(var i=0;i<data.list.length;i++){

					if(!d.code){
						createList(data.list[i]);
					}
				}
			}else{
				if(iPage == 1){
					oList.innerHTML = '现在还没有留言，快来抢沙发......';
				}
				oShowMore.style.display = 'none';
			}

			

		})
	}

	oShowMore.onclick = function(){

		iPage++;
		showList();
	}

}
function getCookie(key){
	var arr1 = document.cookie.split('; ');
	for(var i=0;i<arr1.length;i++){
		
		var arr2 = arr1[i].split('=');
		if(arr2[0] == key){
			return arr2[1];
		}

		
	}
}















