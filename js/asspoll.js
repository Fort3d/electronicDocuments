var poll_time_update=0;  		/*глобальная переменная времени обновления сервера*/
var poll_temp_time_update=0;  	/*временная переменная времени обновления сервера*/
var poll_count=0;		  		/*переменная количества заявок/запросов*/
var poll_temp_count=0;  		/*временная переменная количества заявок/запросов*/

/*таймер после проверки на загрузку*/
document.addEventListener("DOMContentLoaded", pollStart); //проверка загрузилась страница или нет

/*параметры для запуска*/
function pollStart(){
	window.setInterval(pollTimer60S, 60000); //пуск таймера раз в 60 секунд 
	window.setInterval(pollTimer120S, 120000); //пуск таймера раз в 120 секунд 
	 
}

/*таймер */
function pollTimer60S(){
	pollCheckUpdateTime(); //проверка даты обновления стендбая
	if(type==1 || type==2 || type==4 || type==5)pollCheckUpdateCoun(); //проверка на изменение количества заявок/запросов
}

/*таймер */
function pollTimer120S(){
	pollUpdateStatMen(); //обновление статистики
}

/*функция вызова обновленных данных*/
function pollUpdateData(){
if(poll_time_update<(unix_time_dist+120))return false;//если обновление сервера раньше переназначения то не обновляем
	if(type==0 || type==1 || type==2)window.setTimeout('pollUpdateAjaxDopy()',100);//получение допов (запрет для отдела токаревой ОКУ №9)
	if(type==4 || type==5 || type==6)window.setTimeout('pollUpdateAjaxZaprosy("full")',100);//получение списка запросов 
	if(type==4 && right==0){//получение вкладок запросов экстер,мфц,портал(только для отдела токаревой ОКУ №9)
		window.setTimeout('pollUpdateAjaxZaprosy("ekster")',100);
		window.setTimeout('pollUpdateAjaxZaprosy("portal")',100);
		window.setTimeout('pollUpdateAjaxZaprosy("mfc")',100);
	}
	if((type==1 || type==2) && document.getElementById('otdelname').innerHTML != 'Выбрать отдел:')return false;//если учетный отдел подглядывает ^_^
	if(type!=6)window.setTimeout('pollUpdateAjaxMsg()',100);//вызов получения заявок
}
/*функция перерисовки страницы*/
function pollUpdateAsinh(a){
//a - имя вкладки
	if(a==status && $('#'+a+' .radio1:checkbox:checked').length==0){
		document.getElementById('label_'+a).click();
	}
}
/*функции получения обновленных данных*/
/*заявки*/
function pollUpdateAjaxMsg(){
	$.ajax({
				type: 'post',
				url: 'server.php',
				async: true,
				data: {'type':type,'right':right,'otdel':otdel,'user_id':user_id},
				cache: false,
				success: function(response){ 
					try {
					obj = jQuery.parseJSON(response); //парсим полученные данные
					pollUpdateAsinh('home');//вызовем обновление отрисованной страницы
						viewStiker('Обновлены заявки');
						} catch (e) {viewStiker(response,'hold');viewStiker(e,'hold');}
				},
				error: function(XMLHttpRequest, textStatus, errorThrown){
					viewStiker("MOE Error: " + textStatus + "(" + errorThrown +")",'hold');				
				}
	});
}
/*приостановки*/
function pollUpdateAjaxDopy(){
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
							document.getElementById('label_dopy').innerHTML='Приостановки: <span id="obj_dopy_length" style="color:#ff7e66; font-weight:bold; font-size: 16px;" >'+FilterDopyHead(obj_dopy).length+'</span> Все: <input type="checkbox" onclick="asinh();" id="check_all_dopy" class="radio"><div id="buttonpages_dopy"></div>';//вывод количества приостановок
							}else{document.getElementById('label_dopy').innerHTML='Приостановки<div id="buttonpages_dopy"></div>';}
						pollUpdateAsinh('dopy');//вызовем обновление отрисованной страницы
						viewStiker('Обновлены приостановки');
						} catch (e) {viewStiker(response,'hold');viewStiker(e,'hold');}
				},
				error: function(XMLHttpRequest, textStatus, errorThrown){               
					viewStiker("MOE Error: " + textStatus + "(" + errorThrown +")",'hold');
				}
	});
}
/*запросы*/
function pollUpdateAjaxZaprosy(a){
// a - тип запросов (общие,портал,экстер,мфц)
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
							case 'full':obj_zaprosy_full=' '; obj_zaprosy_full = jQuery.parseJSON(response);pollUpdateAsinh('zaprosy_full');viewStiker('Обновлены запросы');break;
							case 'ekster':obj_zaprosy_ekster=' '; obj_zaprosy_ekster = jQuery.parseJSON(response);pollUpdateAsinh('zaprosy_ekster');viewStiker('Обновлены запросы экстер');break;
							case 'portal':obj_zaprosy_portal=' '; obj_zaprosy_portal = jQuery.parseJSON(response);pollUpdateAsinh('zaprosy_portal');viewStiker('Обновлены запросы портал');break;
							case 'mfc':obj_zaprosy_mfc=' '; obj_zaprosy_mfc = jQuery.parseJSON(response);pollUpdateAsinh('zaprosy_mfc');viewStiker('Обновлены запросы мфц');break;
						}
						} catch (e) {viewStiker(response,'hold');viewStiker(e,'hold');}
				},
				error: function(XMLHttpRequest, textStatus, errorThrown){               
					viewStiker("MOE Error: " + textStatus + "(" + errorThrown +")",'hold');
				}
	});
}
/*функция обновления статистики по людям*/
function pollUpdateStatMen(){
var a=status;
if(status=="search")return false;
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
				/*обновляем данные*/						
					$.each(obj_statMen, function() {    // обрабатываем полученные данные					
							
					$(".stat_"+a).find("#"+this.user_id).parent().next().find("img").attr('src', 'theme/img/'+this.online_status+'.gif');//онлайн
					$(".stat_"+a).find("#"+this.user_id).parent().next().next().next().next().text(this.count);	//количество в работе
						
					});
					viewStiker('Обновлена статистика');
				},
				error: function(XMLHttpRequest, textStatus, errorThrown){               
                 viewStiker("MOE Error: " + textStatus + "(" + errorThrown +")",'hold');
				}
			});
}
/*функция проверки и даты обновления сервера*/
function pollCheckUpdateTime(){
	$.ajax({
			type: 'post',
			url: 'server_check_update.php',
			async: true,
			data: {'tip':'server', 'otdel':otdel},
			cache: false,
			success: function(response){ 
					try {
							poll_temp_time_update = Math.ceil(+response);
							if(poll_time_update==0)poll_time_update=poll_temp_time_update;
							if(poll_time_update<poll_temp_time_update && poll_temp_time_update!=0){
								poll_time_update=poll_temp_time_update;
								pollUpdateData(); 
							}
						} catch (e) {viewStiker(response,'hold');viewStiker(e,'hold');}
			},
			error: function(XMLHttpRequest, textStatus, errorThrown){               
				viewStiker("MOE Error: " + textStatus + "(" + errorThrown +")",'hold');
			}
	});
}
/*функция проверки количества заявок/запросов*/
function pollCheckUpdateCoun(){
	$.ajax({
			type: 'post',
			url: 'server_check_update.php',
			async: true,
			data: {'tip':'coun', 'otdel':otdel},
			cache: false,
			success: function(response){ 
					try {
							poll_temp_count = Math.ceil(+response);
							if(poll_count==0)poll_count=poll_temp_count;
							if(poll_count!=poll_temp_count && poll_count!=0){
								poll_count=poll_temp_count;
								pollUpdateData();
							}
						} catch (e) {viewStiker(response,'hold');viewStiker(e,'hold');}
			},
			error: function(XMLHttpRequest, textStatus, errorThrown){               
				viewStiker("MOE Error: " + textStatus + "(" + errorThrown +")",'hold');
			}
	});
}