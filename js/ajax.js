/*получение заявок с сервера*/
function WaitForMsg(a)
    {
		WaitForStatMen('home');//вызываем статистику по людям	
		if(otdel==a && document.getElementById('otdelname'))document.getElementById('otdelname').innerHTML = 'Выбрать отдел:'; //сброс заголовка для выбора отдела
		darkCat(+1); //включаем затемнение экрана
		document.getElementById('home').innerHTML = '<img src="./theme/img/load.gif">';
			$.ajax({
				type: 'post',
				url: 'server.php',
				async: true,
				data: {'type':type,'right':right,'otdel':a,'user_id':user_id},
				cache: false,
				success: function(response){ 
					try {
					obj = jQuery.parseJSON(response); //парсим полученные данные
					viewStiker('Получены заявки');
					OutMsg();//вызов вывода
						} catch (e) {viewStiker(response,'hold');viewStiker(e,'hold');}
				},
				error: function(XMLHttpRequest, textStatus, errorThrown){               
					viewStiker("MOE Error: " + textStatus + "(" + errorThrown +")",'hold');
				}
			});
}

/*получение допов для ввода*/
function WaitForDopy(){
document.getElementById('dopy').innerHTML = '<img src="./theme/img/load.gif">';
WaitForStatMen('dopy');//вызываем статистику по людям
	$.ajax({
				type: 'post',
				url: 'server_dopy.php',
				async: true,
				data: {'otdel' : otdel},
				cache: false,
				success: function(response){ 
					try {
						obj_dopy = jQuery.parseJSON(response); //парсим полученные данные
						if(Array.prototype.slice.call( obj_dopy, 0 ).length!=0){
							document.getElementById('label_dopy').innerHTML='Приостановки: <span id="obj_dopy_length" style="color:#ff7e66; font-weight:bold; font-size: 16px;" >0</span> Все: <input type="checkbox" onclick="asinh();" id="check_all_dopy" class="radio"><div id="buttonpages_dopy"></div>';//вывод количества приостановок
							}else{document.getElementById('label_dopy').innerHTML='Приостановки<div id="buttonpages_dopy"></div>';}
						viewStiker('Получены приостановки');
						OutDopy();	//вызов вывода допов
						} catch (e) {viewStiker(response,'hold');viewStiker(e,'hold');}
				},
				error: function(XMLHttpRequest, textStatus, errorThrown){               
					viewStiker("MOE Error: " + textStatus + "(" + errorThrown +")",'hold');
				}
			});
}

/*получение запросов с сервера*/
function WaitForZaprosy(a){
// a - тип запросов (общие,портал,экстер,мфц)
document.getElementById('zaprosy_'+a).innerHTML = '<img src="./theme/img/load.gif">';
WaitForStatMen('zaprosy_'+a);//вызываем статистику по людям
darkCat(+1); //включаем затемнение экрана
	$.ajax({
				type: 'post',
				url: 'server_zaprosy.php',
				async: true,
				data: {'tip':a,'type':type,'right':right,'user_id':user_id},
				cache: false,
				success: function(response){ 
					try {
						//парсим полученные данные
						switch(a){
							case 'full':obj_zaprosy_full=' '; obj_zaprosy_full = jQuery.parseJSON(response);viewStiker('Получены запросы');break;
							case 'ekster':obj_zaprosy_ekster=' '; obj_zaprosy_ekster = jQuery.parseJSON(response);viewStiker('Получены запросы экстер');break;
							case 'portal':obj_zaprosy_portal=' '; obj_zaprosy_portal = jQuery.parseJSON(response);viewStiker('Получены запросы портал');break;
							case 'mfc':obj_zaprosy_mfc=' '; obj_zaprosy_mfc = jQuery.parseJSON(response);viewStiker('Получены запросы мфц');break;
						}
						OutZaprosy(a);	//вызов вывода запросов
						} catch (e) {viewStiker(response,'hold');viewStiker(e,'hold');}
				},
				error: function(XMLHttpRequest, textStatus, errorThrown){               
					viewStiker("MOE Error: " + textStatus + "(" + errorThrown +")",'hold');
				}
			});
}

/*получение данных при клике на заявку*/ 
function WaitForMoreInfo(a)
//a - id заявки по которой получаем инфу
    {
	WaitForMoreInfoColor(a);	 //подсветка нужной строки
		document.getElementById('moreinfo2').innerHTML = '<img src="./theme/img/load.gif">';
		/*вывод истории стадий*/
		$.ajax({
            type: 'post',
            url: 'server_info.php',
			async: true,
			data: {'id':a, 'type':'history'},
            cache: false,
            success: function(response){ 
			       	
					try {
						obj_info = jQuery.parseJSON(response); //парсим полученные данные
						} catch (e) {viewStiker(response,'hold');viewStiker(e,'hold');}
					
					document.getElementById('moreinfo2').innerHTML = '';//удаляем старые данные
										
					$('#moreinfo2').prepend($('<table />').addClass('bordered_info')).fadeIn();
					$('.bordered_info').append($('<tr>').addClass('trclass')
					
					.append($('<th />').text("Дата изменения"))
					.append($('<th />').text("Стадия"))
					.append($('<th />').text("Дата окончания"))
					.append($('<th />').text("Исполнитель"))
					).fadeIn();
					
									
					$.each(obj_info, function() {    // обрабатываем полученные данные					
							
							$('.bordered_info')
							.append($('<tr>')
							.append($('<td />').html(this.datestart))
							.append($('<td />').html(this.comments))
							.append($('<td />').html(this.dateend))
							.append($('<td />').html(this.userdone))
							).fadeIn();
						
					});
				           
            },
            error: function(XMLHttpRequest, textStatus, errorThrown){               
                 viewStiker("MOE Error: " + textStatus + "(" + errorThrown +")",'hold');
            }
            
        });
		/*вывод истории переназначения*/
		document.getElementById('chat').innerHTML = '<img src="./theme/img/load.gif">';
		$.ajax({
				type: 'post',
				url: 'server_reassign.php',
				async: true,
				data: {'id':a},
				cache: false,
				success: function(response){ 
						try {
							var obj_reassign = jQuery.parseJSON(response); //парсим полученные данные
							} catch (e) {viewStiker(response,'hold');viewStiker(e,'hold');}
						
						document.getElementById('moreinfo3').innerHTML = '';//удаляем старые данные
											
						$('#moreinfo3').prepend($('<table id="tabl_reassign"/>').addClass('bordered_chat')).fadeIn();
						$('#tabl_reassign').append($('<tr>').addClass('trclass')
						.append($('<th />').text("Дата"))
						.append($('<th />').text("ФИО"))
						.append($('<th />').text("Заметка"))
						).fadeIn();
						
						$.each(obj_reassign, function() {    // обрабатываем полученные данные					
							$('#tabl_reassign')
								.append($('<tr>')
								.append($('<td />').html(this.text_date))
								.append($('<td />').html(this.fio))
								.append($('<td />').html(this.text))
								).fadeIn();
						});
				},
				error: function(XMLHttpRequest, textStatus, errorThrown){               
					viewStiker("MOE Error: " + textStatus + "(" + errorThrown +")",'hold');
				}
			});
		/*получение коментариев к заявке*/
		document.getElementById('chat').innerHTML = '<img src="./theme/img/load.gif">';
		$.ajax({
				type: 'post',
				url: 'server_comment.php',
				async: true,
				data: {'id':a},
				cache: false,
				success: function(response){ 
						
						try {
							var obj_comment = jQuery.parseJSON(response); //парсим полученные данные
							} catch (e) {viewStiker(response,'hold');viewStiker(e,'hold');}
						
						document.getElementById('chat').innerHTML = '';//удаляем старые данные
						document.getElementById('chat_answer_in2').innerHTML = '';//удаляем старые данные
											
						$('#chat').prepend($('<table />').addClass('bordered_chat')).fadeIn();
						$('.bordered_chat').append($('<tr>').addClass('trclass')
						.append($('<th />').text("Дата"))
						.append($('<th />').text("ФИО"))
						.append($('<th />').text("Заметка"))
						).fadeIn();
						/*рисует кнопку отправить комент*/
						$('.chat_answer_in2').append($('<div />').attr('class',"textmess").append($('<textarea />').attr('type',"text").attr('id',"textmess").attr('name',"textmess").attr('width','100%')
																						)
																						.append($('<input id="inputbtn" onclick="SendMessage('+a+');">')
																						.attr('type','button')
																						.attr('class','submit')
																						)).fadeIn();
						$.each(obj_comment, function() {    // обрабатываем полученные данные					
							$('.bordered_chat')
								.append($('<tr>')
								.append($('<td />').html(this.text_date))
								.append($('<td />').html(this.fio))
								.append($('<td />').html(this.text))
								).fadeIn();
						});
				},
				error: function(XMLHttpRequest, textStatus, errorThrown){               
					viewStiker("MOE Error: " + textStatus + "(" + errorThrown +")",'hold');
				}
			});
}
/*функция гибридного поиска*/
function waitSearch(){
darkCat(+1);//включаем затемнение экрана
		$.ajax({
            type: 'post',
            url: 'server_search.php',
			async: true,
			data: {'text':document.getElementById('input_search').value},
            cache: false,
            success: function(response){ 
					try {
							darkCat(-1);//убираем затемнение экрана
							obj_search = jQuery.parseJSON(response); //парсим полученные данные
							OutSearch();
						} catch (e) {viewStiker(response,'hold');viewStiker(e,'hold');}
		    asinh();//вызов рассинхрона
			},
            error: function(XMLHttpRequest, textStatus, errorThrown){               
                 viewStiker("MOE Error: " + textStatus + "(" + errorThrown +")",'hold');
            }
        });
}

/*отправка коментариев на сервер*/
function SendMessage(a){
	$.ajax({
            type: 'post',
            url: 'server_send_comment.php',
			async: true,
			data: {'user_id':user_id, 'request_id':a, 'textmess':document.getElementById('textmess').value},
            cache: false,
            success: function(response){ 
			       	try {
						WaitForMoreInfo(a);
						} catch (e) {viewStiker(response,'hold');viewStiker(e,'hold');}
			},
			error: function(XMLHttpRequest, textStatus, errorThrown){     
				viewStiker("MOE Error: " + textStatus + "(" + errorThrown +")",'hold');
			}
        });
}

/*получение количества людей в отделе*/
function WaitForWnum(){
	$.ajax({
				type: 'post',
				url: 'server_wnum.php',
				async: true,
				data: {'action':'wait', 'otdel':otdel},
				cache: false,
				success: function(response){ 
						try {
							document.getElementById('text_wnum').innerHTML=response;
							} catch (e) {viewStiker(response,'hold');viewStiker(e,'hold');}
			},
			error: function(XMLHttpRequest, textStatus, errorThrown){     
				viewStiker("MOE Error: " + textStatus + "(" + errorThrown +")",'hold');
			}
		});
}
/*отправка количества людей в отделе*/
function SendWnum(){
	$.ajax({
				type: 'post',
				url: 'server_wnum.php',
				async: true,
				data: {'action':'send', 'otdel':otdel, 'wnum':document.getElementById('input_wnum').value},
				cache: false,
				success: function(response){ 
						try {
							document.getElementById('text_wnum').innerHTML=response;
							} catch (e) {viewStiker(response,'hold');viewStiker(e,'hold');}
			},
			error: function(XMLHttpRequest, textStatus, errorThrown){     
				viewStiker("MOE Error: " + textStatus + "(" + errorThrown +")",'hold');
			}
		});
}

/*получение статистики по людям в отделе*/
function WaitForStatMen(a){
// a - id таба для вывода статистики в нужную секцию 
$(".stat_"+a).html('<img src="./theme/img/load.gif">'); //воткнем анимацию загрузки 
changeStat();//вызываем смену вкладок статистики по людям для скрытия мусора
	$.ajax({
				type: 'post',
				url: 'server_statMen.php',
				async: true,
				data: {'user_id':user_id, 'otdel':otdel, 'status':a},
				cache: false,
				success: function(response){ 
						try {
							var obj_statMen = jQuery.parseJSON(response); //парсим полученные данные
							} catch (e) {viewStiker(response,'hold');viewStiker(e,'hold');}
				
					$(".stat_"+a).html('');//удаляем старые данные
															
					$('.stat_'+a).prepend($('<table id="bordered_stat_'+a+'"/>').addClass('bordered_statmen')).fadeIn();
					$('#bordered_stat_'+a).append($('<tr>').addClass('trclass')
					.append($('<th />').append($('<input id="selAll_stat_'+a+'">').attr('type',"checkbox").attr('class',"selAll_radio").attr('onclick',"selectAllstat();")))
					.append($('<th />').text(""))
					.append($('<th />').text("ФИО"))
					.append($('<th />').text(""))
					.append($('<th />').text("Кол-во заявок в работе"))
					).fadeIn();
										
					$.each(obj_statMen, function() {    // обрабатываем полученные данные					
							
						$('#bordered_stat_'+a)
							.append($('<tr >')
							.append($('<td />').html('<input id="'+this.user_id+'" type="checkbox" class="radio">'))
							.append($('<td />').html('<img src="theme/img/'+this.online_status+'.gif">'))
							.append($('<td />').html(this.fio))
							.append($('<td />').append($('<input id="'+this.fio+'">').attr('type',"checkbox").attr('class',"radio1").attr('onclick',"asinh();")))
							.append($('<td />').html(this.count))
							).fadeIn();
					});
					changeStat();//вызываем смену вкладок статистики по людям для скрытия мусора
				},
				error: function(XMLHttpRequest, textStatus, errorThrown){               
                 viewStiker("MOE Error: " + textStatus + "(" + errorThrown +")",'hold');
				}
			});
}

/*отправка на формирование Excel файла*/
function ajaxExcel(a){
darkCat(+1); 	//включаем затемнение
	$.ajax({
					type: 'post',
					url: 'server_export_excel.php',
					async: true,
					data: {'obj_excel':JSON.stringify(a), 'type':status},
					cache: false,
					success: function(response){ 
							try {
								darkCat(-1); //убираем затемнение
								document.getElementById('under_chat').innerHTML = response;
								} catch (e) {viewStiker(response,'hold');viewStiker(e,'hold');}
			},
			error: function(XMLHttpRequest, textStatus, errorThrown){     
				viewStiker("MOE Error: " + textStatus + "(" + errorThrown +")",'hold');
			}
		});
}

/*отправка заявок на передачу между отделами*/
function ajaxSendTiket(a){
		$.ajax({
			type: 'post',
			url: 'server_send_tiket.php',
			async: true,
			data: {'user_id':user_id, 'otdel':document.getElementById('select_tiket').value, 'ar_tiket':JSON.stringify(a)},
			cache: false,
			success: function(response){ 
					try {
						document.getElementById('select_tiket').value=0; //сбросим список передачи
						asinh();
						viewStiker(response,'hold');//ответ сервера в стикер 
						} catch (e) {viewStiker(response,'hold');viewStiker(e,'hold');}
			},
			error: function(XMLHttpRequest, textStatus, errorThrown){     
				viewStiker("MOE Error: " + textStatus + "(" + errorThrown +")",'hold');
			}
		});
}
/*обработчик кнопки взять в работу у НБД*/
function checkZaprosNbd(a){
//a- id запроса
	$.ajax({
			type: 'post',
			url: 'server_nbd_work.php',
			async: true,
			data: {'user_id':user_id, 'request_id':a},
			cache: false,
			success: function(response){ 
					try {
						viewStiker(response,'server');//ответ сервера в стикер 
						window.setTimeout('WaitForZaprosy("full")',100);//обновим окно запросов 
						} catch (e) {viewStiker(response,'hold');viewStiker(e,'hold');}
			},
			error: function(XMLHttpRequest, textStatus, errorThrown){     
				viewStiker("MOE Error: " + textStatus + "(" + errorThrown +")",'hold');
			}
		});
}