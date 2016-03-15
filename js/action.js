/*логика работы фильтра по заявкам*/
function FilterMsg(){
	returnedData='';
	returnedData=obj;
	
	returnedData = $.grep(returnedData, function (element, index) {return element.id != undefined;}); //удаление пустых строк
	
	/*фильтруем по дате*/
	if(document.getElementById('input_date').value){
		if(document.getElementById('date_2').checked){
			returnedData = $.grep(returnedData, function (element, index) {
					return upgradeDate(document.getElementById('input_date2').value) <= element.date_reg_unix && element.date_reg_unix <= upgradeDate(document.getElementById('input_date').value);
				});
		}else{
			returnedData = $.grep(returnedData, function (element, index) {
							if(element.date_registration.indexOf(document.getElementById('input_date').value) + 1) { //поиск позиции возвращает 0 поэтому +1
								return element.date_registration;
							}
				});
		}
	}
	
	/*фильтруем по фамилии*/
	if($('.stat_home .radio1:checkbox:checked').length > 0){
		returnedData = $.grep(returnedData, function (element, index) {
					var flag;
						$('.stat_home .radio1:checkbox:checked').each(function(){
							if(this.id == element.fio)flag=true;					
						});
					if(flag)return element.fio;
			});
	}
	
	/*фильтруем по типам заявок*/
	if(document.getElementById('select_type').value!=0){
			returnedData = $.grep(returnedData, function (element, index) {
					var flag;
						$('#select_type option:selected').each(function(){
							if(element.request_type==this.value) flag=true;
						});
					if(flag)return element.request_type;
			});
	}
	
	/*фильтруем по состояниям*/
	if(document.getElementById('select_state').value!=0){
			returnedData = $.grep(returnedData, function (element, index) {
						return element.state_code == document.getElementById('select_state').value;
			});
	}
	
	/*чекбоксы считалок*/
	if(document.getElementById('check_new').checked==true){
		returnedData = $.grep(returnedData, function (element, index) {
				if(type==0){return element.date_end_otdel == "1" && element.fio == "";}
				if(type==1 || type==2){return element.date_end_otdel == "1"}
				});
		}
	if(document.getElementById('check_noassigned').checked==true){
		returnedData = $.grep(returnedData, function (element, index) {return element.fio == "";});
		}
	if(document.getElementById('check_assigned').checked==true){
		returnedData = $.grep(returnedData, function (element, index) {return element.fio != "";});
		}
	if(document.getElementById('check_warn').checked==true){
		returnedData = $.grep(returnedData, function (element, index) {return element.color_date_end_otdel == "#ffe15c";});
		}
	if(document.getElementById('check_ahtung').checked==true){
		returnedData = $.grep(returnedData, function (element, index) {return element.color_date_end_otdel == "#FF8A65";});
		}

	/*сортируем списки*/
	if(varsort){
		switch(varsort){
			case 'request_name': returnedData.sort(function(a, b) {
									if (a.request_name < b.request_name) return -1;
									if (a.request_name > b.request_name) return 1;
									return 0;
								});
								break;
			case 'date_registration': returnedData.sort(function(a, b) {
									  return b.date_reg_unix-a.date_reg_unix; 
								});
								break;
			case 'request_number': returnedData.sort(function(a, b) {
									if (a.request_number < b.request_number) return -1;
									if (a.request_number > b.request_number) return 1;
									return 0;
								});
								break;
			case 'status_name': returnedData.sort(function(a, b) {
									if (a.status_name < b.status_name) return -1;
									if (a.status_name > b.status_name) return 1;
									return 0;
								});
								break;		
			case 'fio': returnedData.sort(function(a, b) {
									if (a.fio < b.fio) return -1;
									if (a.fio > b.fio) return 1;
									return 0;
								});
								break;						
			case 'object_count': returnedData.sort(function(a, b) {
									  return a.object_count-b.object_count; 
								});
								break;
			case 'date_end_otdel': returnedData.sort(function(a, b) {
									  return a.date_end_otdel-b.date_end_otdel; 
								});
								break;
			case 'date_end': returnedData.sort(function(a, b) {
									  return a.date_end-b.date_end; 
								});
								break;	
			case 'merge_type': returnedData.sort(function(a, b) {
									if (b.merge_type < a.merge_type) return -1;
									if (b.merge_type > a.merge_type) return 1;
									return 0; 
								});
								break;
			case 'comments': returnedData.sort(function(a, b) {
									if (b.comments < a.comments) return -1;
									if (b.comments > a.comments) return 1;
									return 0; 
								});
								break;
		}
	}
	if(status=='home')AllCount(status);//вызываем считалки 
}

/*Логика работы фильтра по допам*/
/*фильтр чекбокса в шапке таба*/
function FilterDopyHead(a){
//a - массив приостановок для фильтра
	if(!document.getElementById('check_all_dopy').checked){
		a = $.grep(a, function (element, index) {return element.reqdopdate_unix > element.stop_date_unix;});
		}else{
			a = $.grep(a, function (element, index) {return element.reqdopdate_unix <= element.stop_date_unix || element.reqdopdate == "";});
		}
	return a;
}
/*основной фильтр приостановок*/
function FilterDopy(){
	returnedDopy='';
	returnedDopy=obj_dopy;
	
	returnedDopy = $.grep(returnedDopy, function (element, index) {return element.id != undefined;}); //удаление пустых строк
	
	/*фильтр чекбокса в шапке таба*/
	returnedDopy=FilterDopyHead(returnedDopy);
	
	/*лично для приостановок счетчик в шапке вкладки*/
	document.getElementById('obj_dopy_length').innerHTML = returnedDopy.length;	
	
	/*фильтруем по фамилии*/
	if($('.stat_dopy .radio1:checkbox:checked').length > 0){
		returnedDopy = $.grep(returnedDopy, function (element, index) {
					var flag;
						$('.stat_dopy .radio1:checkbox:checked').each(function(){
							if(this.id == element.fio)flag=true;					
						});
					if(flag)return element.fio;
			});
	}
		
	/*фильтруем по дате*/
	if(document.getElementById('input_date').value){
		if(document.getElementById('date_2').checked){
			returnedDopy = $.grep(returnedDopy, function (element, index) {
					return upgradeDate(document.getElementById('input_date2').value) <= element.date_reg_unix && element.date_reg_unix <= upgradeDate(document.getElementById('input_date').value);
				});
		}else{
			returnedDopy = $.grep(returnedDopy, function (element, index) {
							if(element.reqdopdate.indexOf(document.getElementById('input_date').value) + 1) { //поиск позиции возвращает 0 поэтому +1
								return element.reqdopdate;
							}
				});
		}
	}
		
	/*фильтруем по типам заявок*/
	if(document.getElementById('select_type').value!=0){
			returnedDopy = $.grep(returnedDopy, function (element, index) {
					var flag;
						$('#select_type option:selected').each(function(){
							if(element.request_type==this.value) flag=true;
						});
					if(flag)return element.request_type;
			});
	}

	/*чекбоксы считалок*/
	if(document.getElementById('check_new').checked==true){
		returnedDopy = $.grep(returnedDopy, function (element, index) {
				return element.date_end == "1"
				});
		}
	if(document.getElementById('check_noassigned').checked==true){
		returnedDopy = $.grep(returnedDopy, function (element, index) {return element.fio == "";});
		}
	if(document.getElementById('check_assigned').checked==true){
		returnedDopy = $.grep(returnedDopy, function (element, index) {return element.fio != "";});
		}
	if(document.getElementById('check_warn').checked==true){
		returnedDopy = $.grep(returnedDopy, function (element, index) {return element.color_date_end_otdel == "#ffe15c";});
		}
	if(document.getElementById('check_ahtung').checked==true){
		returnedDopy = $.grep(returnedDopy, function (element, index) {return element.color_date_end_otdel == "#FF8A65";});
		}
	
	/*сортируем списки*/
	if(varsortdopy){
		switch(varsortdopy){
			case 'request_name': returnedDopy.sort(function(a, b) {
									if (a.request_name < b.request_name) return -1;
									if (a.request_name > b.request_name) return 1;
									return 0;
								});
								break;
			case 'stop_date': returnedDopy.sort(function(a, b) {
									  return b.stop_date-a.stop_date; 
								});
								break;
			case 'request_number': returnedDopy.sort(function(a, b) {
									if (a.request_number < b.request_number) return -1;
									if (a.request_number > b.request_number) return 1;
									return 0;
								});
								break;
			case 'reqdopdate': returnedDopy.sort(function(a, b) {
									  return b.reqdopdate-a.reqdopdate; 
								});
								break;					
			case 'reqnumdop': returnedDopy.sort(function(a, b) {
									if (a.reqnumdop < b.reqnumdop) return -1;
									if (a.reqnumdop > b.reqnumdop) return 1;
									return 0;
								});
								break;	
			case 'status_name': returnedDopy.sort(function(a, b) {
									if (a.status_name < b.status_name) return -1;
									if (a.status_name > b.status_name) return 1;
									return 0;
								});
								break;
			case 'fio': returnedDopy.sort(function(a, b) {
									if (a.fio < b.fio) return -1;
									if (a.fio > b.fio) return 1;
									return 0;
								});
								break;						
			case 'object_count': returnedDopy.sort(function(a, b) {
									  return a.object_count-b.object_count; 
								});
								break;
			case 'date_end_otdel': returnedDopy.sort(function(a, b) {
									  return a.date_end_otdel-b.date_end_otdel; 
								});
								break;
			case 'date_end': returnedDopy.sort(function(a, b) {
									  return a.date_end-b.date_end; 
								});
								break;	
			case 'comments': returnedDopy.sort(function(a, b) {
									if (a.comments < b.comments) return -1;
									if (a.comments > b.comments) return 1;
									return 0; 
								});
								break;
		}
	}
	if(status=='dopy')AllCount(status);//вызываем считалки 
}

/*логика работы фильтра по запросам*/
function FilterZaprosy(a){
//a - тип запроса
returnedZaprosy=' ';

if(a=="full")returnedZaprosy=obj_zaprosy_full;
if(a=="ekster")returnedZaprosy=obj_zaprosy_ekster;
if(a=="portal")returnedZaprosy=obj_zaprosy_portal;
if(a=="mfc")returnedZaprosy=obj_zaprosy_mfc;

	returnedZaprosy = $.grep(returnedZaprosy, function (element, index) {return element.id != undefined;}); //удаление пустых строк
	
	/*фильтруем по фамилии*/
	if($('.stat_zaprosy_'+a+' .radio1:checkbox:checked').length > 0){
		returnedZaprosy = $.grep(returnedZaprosy, function (element, index) {
					var flag;
						$('.stat_zaprosy_'+a+' .radio1:checkbox:checked').each(function(){
							if(this.id == element.fio)flag=true;					
						});
					if(flag)return element.fio;
			});
	}
	
	/*фильтруем по состояниям*/
	if(document.getElementById('select_state').value!=0){
			returnedZaprosy = $.grep(returnedZaprosy, function (element, index) {
						return element.state_code == document.getElementById('select_state').value;
			});
	}
	
	/*фильтруем по дате*/
	if(document.getElementById('input_date').value){
		if(document.getElementById('date_2').checked){
			returnedZaprosy = $.grep(returnedZaprosy, function (element, index) {
					return upgradeDate(document.getElementById('input_date2').value) <= element.date_reg_unix && element.date_reg_unix <= upgradeDate(document.getElementById('input_date').value);
				});
		}else{
			returnedZaprosy = $.grep(returnedZaprosy, function (element, index) {
								return upgradeDate(document.getElementById('input_date').value) == element.date_reg_unix;
					});
		}
	}
	
	/*фильтруем по типам запросов*/
	if(document.getElementById('select_type_zaprosy').value!=0){
			returnedZaprosy = $.grep(returnedZaprosy, function (element, index) {
					var flag;
						$('#select_type_zaprosy option:selected').each(function(){
							if(element.request_type==this.value) flag=true;
						});
					if(flag)return element.request_type;
			});
	}
	
	/*чекбоксы считалок*/
	if(document.getElementById('check_new').checked==true){
		returnedZaprosy = $.grep(returnedZaprosy, function (element, index) {
				return element.date_end == "0" && element.fio == "";
				});
		}
	if(document.getElementById('check_noassigned').checked==true){
		returnedZaprosy = $.grep(returnedZaprosy, function (element, index) {return element.fio == "";});
		}
	if(document.getElementById('check_assigned').checked==true){
		returnedZaprosy = $.grep(returnedZaprosy, function (element, index) {return element.fio != "";});
		}
	if(document.getElementById('check_warn').checked==true){
		returnedZaprosy = $.grep(returnedZaprosy, function (element, index) {return element.color_date_end_otdel == "#ffe15c";});
		}
	if(document.getElementById('check_ahtung').checked==true){
		returnedZaprosy = $.grep(returnedZaprosy, function (element, index) {return element.color_date_end_otdel == "#FF8A65";});
		}

	/*сортируем списки*/
	if(varsort){
		switch(varsort){
			case 'request_name': returnedZaprosy.sort(function(a, b) {
									if (a.request_name < b.request_name) return -1;
									if (a.request_name > b.request_name) return 1;
									return 0;
								});
								break;
			case 'date_registration': returnedZaprosy.sort(function(a, b) {
									  return b.date_reg_unix-a.date_reg_unix; 
								});
								break;
			case 'request_number': returnedZaprosy.sort(function(a, b) {
									if (a.request_number < b.request_number) return -1;
									if (a.request_number > b.request_number) return 1;
									return 0;
								});
								break;
			case 'cad_num': returnedZaprosy.sort(function(a, b) {
									if (a.cad_num < b.cad_num) return -1;
									if (a.cad_num > b.cad_num) return 1;
									return 0;
								});
								break;		
			case 'fio': returnedZaprosy.sort(function(a, b) {
									if (a.fio < b.fio) return -1;
									if (a.fio > b.fio) return 1;
									return 0;
								});
								break;						
			case 'status_name': returnedZaprosy.sort(function(a, b) {
									if (a.status_name < b.status_name) return -1;
									if (a.status_name > b.status_name) return 1;
									return 0;
								});
								break;
			case 'date_end_otdel': returnedZaprosy.sort(function(a, b) {
									  return a.date_end_otdel-b.date_end_otdel; 
								});
								break;
			case 'date_end': returnedZaprosy.sort(function(a, b) {
									  return a.date_end-b.date_end; 
								});
								break;	
			case 'comments': returnedZaprosy.sort(function(a, b) {
									if (b.comments < a.comments) return -1;
									if (b.comments > a.comments) return 1;
									return 0; 
								});
								break;
		}
	}

	if(a=="full")returnedZaprosy_full=returnedZaprosy;
	if(a=="ekster")returnedZaprosy_ekster=returnedZaprosy;
	if(a=="portal")returnedZaprosy_portal=returnedZaprosy;
	if(a=="mfc")returnedZaprosy_mfc=returnedZaprosy;
	
	if(status.indexOf("zaprosy")==0)AllCount('zaprosy_'+a);//вызываем считалки 
}
/*логика работы фильтра по поиску*/
function FilterSearch(){
	returnedSearch='';
	returnedSearch=obj_search;

	returnedSearch = $.grep(returnedSearch, function (element, index) {return element.id != undefined;}); //удаление пустых строк
	
	/*фильтруем по дате*/
	if(document.getElementById('input_date').value){
		if(document.getElementById('date_2').checked){
			returnedSearch = $.grep(returnedSearch, function (element, index) {
					return upgradeDate(document.getElementById('input_date2').value) <= element.date_reg_unix && element.date_reg_unix <= upgradeDate(document.getElementById('input_date').value);
				});
		}else{
			returnedSearch = $.grep(returnedSearch, function (element, index) {
							if(element.date_registration.indexOf(document.getElementById('input_date').value) + 1) { //поиск позиции возвращает 0 поэтому +1
								return element.date_registration;
							}
				});
		}
	}
	
	/*фильтруем по типам заявок*/
	if(document.getElementById('select_type').value!=0){
			returnedSearch = $.grep(returnedSearch, function (element, index) {
					var flag;
						$('#select_type option:selected').each(function(){
							if(element.request_type==this.value) flag=true;
						});
					if(flag)return element.request_type;
			});
	}
	
	/*фильтруем по состояниям*/
	if(document.getElementById('select_state').value!=0){
			returnedSearch = $.grep(returnedSearch, function (element, index) {
						return element.state_code == document.getElementById('select_state').value;
			});
	}
	
	/*чекбоксы считалок*/
	if(document.getElementById('check_new').checked==true){
		returnedSearch = $.grep(returnedSearch, function (element, index) {
				if(type==0){return element.date_end_otdel == "1" && element.fio == "";}
				if(type==1 || type==2){return element.date_end_otdel == "1"}
				});
		}
	if(document.getElementById('check_noassigned').checked==true){
		returnedSearch = $.grep(returnedSearch, function (element, index) {return element.fio == "";});
		}
	if(document.getElementById('check_assigned').checked==true){
		returnedSearch = $.grep(returnedSearch, function (element, index) {return element.fio != "";});
		}
	if(document.getElementById('check_warn').checked==true){
		returnedSearch = $.grep(returnedSearch, function (element, index) {return element.color_date_end_otdel == "#ffe15c";});
		}
	if(document.getElementById('check_ahtung').checked==true){
		returnedSearch = $.grep(returnedSearch, function (element, index) {return element.color_date_end_otdel == "#FF8A65";});
		}

	if(status=='search')AllCount(status);//вызываем считалки 
}

/*функция Считалочки*/
function AllCount(b){
//b - идентификатор вкладки
	var a;
	if(b=='search'){if(window.obj_search !== undefined){a=returnedSearch;}else{return false;}}
	
	if(b=='home'){
		a = returnedData;
		document.getElementById('count_new').innerHTML = $.grep(a, function (element, index) 
																			{
																			return element.date_end_otdel == "0" && element.fio == "";
																			}).length; //вывод общего числа новых 
		}
	if(b=='dopy'){
		a=returnedDopy;
		document.getElementById('count_new').innerHTML = $.grep(a, function (element, index) 
																			{
																			{return element.date_end == "1";}
																			}).length; //вывод общего числа новых 
		}
	if(b.indexOf("zaprosy")==0){
		/*смотрим какие именно запросы считать*/
		if(b.indexOf("full")!=-1)a=returnedZaprosy_full;
		if(b.indexOf("ekster")!=-1)a=returnedZaprosy_ekster;
		if(b.indexOf("portal")!=-1)a=returnedZaprosy_portal;
		if(b.indexOf("mfc")!=-1)a=returnedZaprosy_mfc;
		
		document.getElementById('count_new').innerHTML = $.grep(a, function (element, index) 
																			{
																			{return element.date_end == "0" && element.fio == "";}
																			}).length; //вывод общего числа новых 
		}
	
		document.getElementById('count_noassigned').innerHTML = $.grep(a, function (element, index) 
																			{
																			return element.fio == "";
																			}).length; //вывод общего числа НЕ назначенных 
		
		document.getElementById('count_assigned').innerHTML = $.grep(a, function (element, index) 
																			{
																			return element.fio != "";
																			}).length; //вывод общего числа назначенных 																	
																			
		document.getElementById('count_warn').innerHTML = $.grep(a, function (element, index) 
																			{
																			return element.color_date_end_otdel == "#ffe15c";
																			}).length; //вывод общего числа просроченных 																	
		document.getElementById('count_ahtung').innerHTML = $.grep(a, function (element, index) 
																			{
																			return element.color_date_end_otdel == "#FF8A65";
																			}).length; //вывод общего числа ахтунг 
		document.getElementById('count_all').innerHTML = a.length; //вывод общего числа 
}

/*логика отрисовки таблицы заявок*/
function OutMsg(){
FilterMsg();//применение фильтра
MultiPages('home', returnedData);//вызываем построение страниц

	document.getElementById('home').innerHTML = '';//удаляем старые данные
										
					$('#home').prepend($('<table  id="table-1"/>').addClass('bordered')).fadeIn();
					$('#table-1').append($('<thead />').append($('<tr>').addClass('trclass')
					.append($('<th />').append($('<input id="selAll_table-1">').attr('type',"checkbox").attr('class',"radio").attr('onclick',"selectAll('table-1');")))
					.append($('<th id="head_request_name" />').append($('<a />').attr('href',"#").attr('onclick',"selectSort('request_name');").text("Тип заявки")))
					.append($('<th id="head_date_registration" />').append($('<a />').attr('href',"#").attr('onclick',"selectSort('date_registration');").text("Дата регистрации")))
					.append($('<th id="head_request_number" />').append($('<a />').attr('href',"#").attr('onclick',"selectSort('request_number');").text("Номер")))
					.append($('<th id="head_status_name" />').append($('<a />').attr('href',"#").attr('onclick',"selectSort('status_name');").text("Состояние")))
					.append($('<th id="head_fio" />').append($('<a />').attr('href',"#").attr('onclick',"selectSort('fio');").text("Исполнитель")))
					.append($('<th id="head_object_count" />').append($('<a />').attr('href',"#").attr('onclick',"selectSort('object_count');").text("Объекты")))
					.append($('<th id="head_date_end_otdel" />').append($('<a />').attr('href',"#").attr('onclick',"selectSort('date_end_otdel');").text("Срок отдел")))
					.append($('<th id="head_date_end" />').append($('<a />').attr('href',"#").attr('onclick',"selectSort('date_end');").text("Срок закон")))
					.append($('<th id="head_merge_type" />').append($('<a />').attr('href',"#").attr('onclick',"selectSort('merge_type');").text("Подтип")))
					.append($('<th id="head_comments" />').append($('<a />').attr('href',"#").attr('onclick',"selectSort('comments');").text("Заметка")))
					)).fadeIn();
					
					var i=0; //счетчик для чекбоксов
					$.each(returnedData, function() {    // обрабатываем полученные данные рисуем таблицу					
					i++;//счетчик для чекбоксов	
							$('#table-1')
							.append($('<tr style="cursor: pointer;" id="tr_'+this.id+'">').attr('onclick',"WaitForMoreInfo("+this.id+");")
							.append($('<td />').html('<div style="display:flex;vertical-align:middle;"><input id="check_'+i+'" type="checkbox" class="radio1" onclick="SelectCheckbox(\''+i+'\',\'table-1\');"><img src="./theme/img/drop_out_menu.gif" onclick="openStatusMsg(\''+this.id+'\');"></div>'))
							.append($('<td />').html(this.request_name))
							.append($('<td />').html(this.date_registration))
							.append($('<td id="rn_'+this.id+'"/>').html(this.request_number))
							.append($('<td />').attr('bgcolor',this.date_close).html(this.status_name))
							.append($('<td '+this.stopped+' onclick="copyBuf();"/>').attr('bgcolor',this.color_send_fio).html(this.fio))
							.append($('<td />').html(this.object_count))
							.append($('<td />').attr('bgcolor',this.color_date_end_otdel).html(this.date_end_otdel))
							.append($('<td />').attr('bgcolor',this.color_date_end).html(this.date_end))
							.append($('<td />').html(this.merge_type))
							.append($('<td />').attr('bgcolor',this.req_send).html(this.comments))
							).fadeIn();
						
					});
	darkCat(-1); //убираем затемнение экрана
	if(varsort){document.getElementById('head_'+varsort).style.backgroundImage= "-moz-linear-gradient(center top , #CCCCFF, #8A4B08)"; //подсвечиваем сортируемую ячейку шапки фаерфокс
				document.getElementById('head_'+varsort).style.backgroundImage= "-ms-radial-gradient(center top , #CCCCFF, #8A4B08)";} //подсвечиваем сортируемую ячейку шапки интернет эксплорер
}

/*логика отрисовки допов*/
function OutDopy(){

FilterDopy();//применение фильтра
MultiPages('dopy', returnedDopy);//вызываем построение страниц

	document.getElementById('dopy').innerHTML = '';//удаляем старые данные
										
					$('#dopy').prepend($('<table  id="table-2"/>').addClass('bordered_stopping')).fadeIn();
					$('#table-2').append($('<thead />').append($('<tr>').addClass('trclass')
					.append($('<th />').append($('<input id="selAll_table-2">').attr('type',"checkbox").attr('class',"radio").attr('onclick',"selectAll('table-2');")))
					.append($('<th id="headDopy_request_name" />').append($('<a />').attr('href',"#").attr('onclick',"selectSort('request_name');").text("Тип заявки")))
					.append($('<th id="headDopy_stop_date" />').append($('<a />').attr('href',"#").attr('onclick',"selectSort('stop_date');").text("Дата приостановки")))
					.append($('<th id="headDopy_request_number" />').append($('<a />').attr('href',"#").attr('onclick',"selectSort('request_number');").text("Номер")))
					.append($('<th id="headDopy_reqdopdate" />').append($('<a />').attr('href',"#").attr('onclick',"selectSort('reqdopdate');").text("Дата допа")))
					.append($('<th id="headDopy_reqnumdop" />').append($('<a />').attr('href',"#").attr('onclick',"selectSort('reqnumdop');").text("Номер допа")))
					.append($('<th id="headDopy_status_name" />').append($('<a />').attr('href',"#").attr('onclick',"selectSort('status_name');").text("Состояние")))
					.append($('<th id="headDopy_fio" />').append($('<a />').attr('href',"#").attr('onclick',"selectSort('fio');").text("Исполнитель")))
					.append($('<th id="headDopy_object_count" />').append($('<a />').attr('href',"#").attr('onclick',"selectSort('object_count');").text("Объекты")))
					.append($('<th id="headDopy_date_end_otdel" />').append($('<a />').attr('href',"#").attr('onclick',"selectSort('date_end_otdel');").text("Срок отдел")))
					.append($('<th id="headDopy_date_end" />').append($('<a />').attr('href',"#").attr('onclick',"selectSort('date_end');").text("Срок закон")))
					.append($('<th id="headDopy_comments" />').append($('<a />').attr('href',"#").attr('onclick',"selectSort('comments');").text("Заметка")))
					)).fadeIn();
					
					var i=0; //счетчик для чекбоксов
					$.each(returnedDopy, function() {    // обрабатываем полученные данные рисуем таблицу					
					i++;//счетчик для чекбоксов	
							$('#table-2')
							.append($('<tr style="cursor: pointer;" id="tr_'+this.id+'">').attr('onclick',"WaitForMoreInfo("+this.id+");")
							.append($('<td />').html('<div style="display:flex;vertical-align:middle;"><input id="check_'+i+'" type="checkbox" class="radio1" onclick="SelectCheckbox(\''+i+'\',\'table-2\');"><img src="./theme/img/drop_out_menu.gif" onclick="openStatusMsg(\''+this.id+'\');"></div>'))
							.append($('<td />').html(this.request_name))
							.append($('<td />').html(this.stop_date))
							.append($('<td id="rn_'+this.id+'"/>').html(this.request_number))
							.append($('<td />').html(this.reqdopdate))
							.append($('<td />').html(this.reqnumdop))
							.append($('<td />').html(this.status_name))
							.append($('<td />').attr('bgcolor',this.color_send_fio).html(this.fio))
							.append($('<td />').html(this.object_count))
							.append($('<td />').attr('bgcolor',this.color_date_end_otdel).html(this.date_end_otdel))
							.append($('<td />').attr('bgcolor',this.color_date_end).html(this.date_end))
							.append($('<td />').html(this.comments))
							).fadeIn();
						
					});
	darkCat(-1); //убираем затемнение экрана
	if(varsortdopy){document.getElementById('headDopy_'+varsortdopy).style.backgroundImage= "-moz-linear-gradient(center top , #CCCCFF, #8A4B08)"; //подсвечиваем сортируемую ячейку шапки фаерфокс
				document.getElementById('headDopy_'+varsortdopy).style.backgroundImage= "-ms-radial-gradient(center top , #CCCCFF, #8A4B08)";} //подсвечиваем сортируемую ячейку шапки интернет эксплорер
}

/*логика отрисовки запросов*/
function OutZaprosy(a){
//a - тип запросов (общие, экстерры, портал, мфц)
FilterZaprosy(a);//применение фильтра
MultiPages('zaprosy_'+a, returnedZaprosy);//вызываем построение страниц
	
	document.getElementById('zaprosy_'+a).innerHTML = '';//удаляем старые данные
										
					$('#zaprosy_'+a).prepend($('<table id="table-'+a+'"/>').addClass('bordered_zaprosy')).fadeIn();
					$('#table-'+a).append($('<thead />').append($('<tr>').addClass('trclass')
					.append($('<th />').append($('<input id="selAll_table-'+a+'">').attr('type',"checkbox").attr('class',"radio").attr('onclick',"selectAll('table-"+a+"');")))
					.append($('<th id="headZaprosy_request_name" />').append($('<a />').attr('href',"#").attr('onclick',"selectSort('request_name');").text("Тип запросы")))
					.append($('<th id="headZaprosy_date_registration" />').append($('<a />').attr('href',"#").attr('onclick',"selectSort('date_registration');").text("Дата регистрации")))
					.append($('<th id="headZaprosy_request_number" />').append($('<a />').attr('href',"#").attr('onclick',"selectSort('request_number');").text("Номер")))
					.append($('<th id="headZaprosy_cad_num" />').append($('<a />').attr('href',"#").attr('onclick',"selectSort('cad_num');").text("Кадастровый номер")))
					.append($('<th id="headZaprosy_status_name" />').append($('<a />').attr('href',"#").attr('onclick',"selectSort('status_name');").text("Состояние")))
					.append($('<th id="headZaprosy_fio" />').append($('<a />').attr('href',"#").attr('onclick',"selectSort('fio');").text("Исполнитель")))
					.append($('<th id="headZaprosy_date_end" />').append($('<a />').attr('href',"#").attr('onclick',"selectSort('date_end');").text("Срок")))
					.append($('<th id="headZaprosy_pdate_end" />').append($('<a />').attr('href',"#").attr('onclick',"selectSort('pdate_end');").text("Дата завершения")))
					.append($('<th id="headZaprosy_date_send" />').append($('<a />').attr('href',"#").attr('onclick',"selectSort('date_send');").text("Дата передачи")))
					.append($('<th id="headZaprosy_comments" />').append($('<a />').attr('href',"#").attr('onclick',"selectSort('comments');").text("Правка")))
					.append($('<th id="headZaprosy_user_send" />').append($('<a />').attr('href',"#").attr('onclick',"selectSort('comments');").text("НБД")))
					)).fadeIn();
					
					var i=0; //счетчик для чекбоксов
					$.each(returnedZaprosy, function() {    // обрабатываем полученные данные рисуем таблицу					
					i++;//счетчик для чекбоксов	
							$('#table-'+a)
							.append($('<tr style="cursor: pointer;" id="tr_'+this.id+'">').attr('onclick',"WaitForMoreInfo("+this.id+");")
							.append($('<td />').html('<div style="display:flex;vertical-align:middle;"><input id="check_'+i+'" type="checkbox" class="radio1" onclick="SelectCheckbox(\''+i+'\',\'table-'+a+'\');"><img src="./theme/img/drop_out_menu.gif" onclick="openStatusMsg(\''+this.id+'\');"></div>'))
							.append($('<td />').html(this.request_name))
							.append($('<td />').html(this.date_registration))
							.append($('<td id="rn_'+this.id+'"/>').attr('bgcolor',this.priznak).html(this.locked+this.request_number))
							.append($('<td />').html(this.cad_num))
							.append($('<td />').html(this.status_name))
							.append($('<td />').attr('bgcolor',this.color_send_fio).html(this.fio))
							.append($('<td />').attr('bgcolor',this.color_date_end).html(this.date_end))
							.append($('<td />').html(this.pdate_end))
							.append($('<td />').html(this.date_send))
							.append($('<td />').html(this.comments))
							.append($('<td />').html(this.user_send))
							).fadeIn();
					});
	darkCat(-1); //убираем затемнение экрана
	if(varsortzaprosy){document.getElementById('headZaprosy_'+varsortzaprosy).style.backgroundImage= "-moz-linear-gradient(center top , #CCCCFF, #8A4B08)"; //подсвечиваем сортируемую ячейку шапки фаерфокс
				document.getElementById('headZaprosy_'+varsortzaprosy).style.backgroundImage= "-ms-radial-gradient(center top , #CCCCFF, #8A4B08)";} //подсвечиваем сортируемую ячейку шапки интернет эксплорер
}

/*логика отрисовки результатов поиска*/
function OutSearch(){
FilterSearch();//применение фильтра
MultiPages('search', returnedSearch);//вызываем построение страниц

	document.getElementById('search').innerHTML = '';//удаляем старые данные
										
					$('#search').prepend($('<table id="table-search"/>').addClass('bordered')).fadeIn();
					$('#table-search').append($('<thead />').append($('<tr>').addClass('trclass')
					.append($('<th />').append($('<input id="selAll_table-search">').attr('type',"checkbox").attr('class',"radio").attr('onclick',"selectAll('table-search');")))
					.append($('<th id="headSearch_request_name" />').append($('<a />').attr('href',"#").attr('onclick',"selectSort('request_name');").text("Тип заявки")))
					.append($('<th id="headSearch_date_registration" />').append($('<a />').attr('href',"#").attr('onclick',"selectSort('date_registration');").text("Дата регистрации")))
					.append($('<th id="headSearch_request_number" />').append($('<a />').attr('href',"#").attr('onclick',"selectSort('request_number');").text("Номер")))
					.append($('<th id="headSearch_status_name" />').append($('<a />').attr('href',"#").attr('onclick',"selectSort('status_name');").text("Состояние")))
					.append($('<th id="headSearch_fio" />').append($('<a />').attr('href',"#").attr('onclick',"selectSort('fio');").text("Исполнитель")))
					.append($('<th id="headSearch_object_count" />').append($('<a />').attr('href',"#").attr('onclick',"selectSort('object_count');").text("Объекты")))
					.append($('<th id="headSearch_date_end_otdel" />').append($('<a />').attr('href',"#").attr('onclick',"selectSort('date_end_otdel');").text("Срок отдел")))
					.append($('<th id="headSearch_date_end" />').append($('<a />').attr('href',"#").attr('onclick',"selectSort('date_end');").text("Срок закон")))
					.append($('<th id="headSearch_merge_type" />').append($('<a />').attr('href',"#").attr('onclick',"selectSort('merge_type');").text("Подтип")))
					.append($('<th id="headSearch_comments" />').append($('<a />').attr('href',"#").attr('onclick',"selectSort('comments');").text("Заметка")))
					)).fadeIn();
					
					var i=0; //счетчик для чекбоксов
					$.each(returnedSearch, function() {    // обрабатываем полученные данные рисуем таблицу					
					i++;//счетчик для чекбоксов	
							$('#table-search')
							.append($('<tr style="cursor: pointer;" id="tr_'+this.id+'">').attr('onclick',"WaitForMoreInfo("+this.id+");")
							.append($('<td />').html('<div style="display:flex;vertical-align:middle;"><input id="check_'+i+'" type="checkbox" class="radio1" onclick="SelectCheckbox(\''+i+'\',\'table-search\');"><img src="./theme/img/drop_out_menu.gif" onclick="openStatusMsg(\''+this.id+'\');"></div>'))
							.append($('<td />').html(this.request_name))
							.append($('<td />').html(this.date_registration))
							.append($('<td id="rn_'+this.id+'"/>').html(this.request_number))
							.append($('<td />').attr('bgcolor',this.date_close).html(this.status_name))
							.append($('<td '+this.stopped+' onclick="copyBuf();"/>').attr('bgcolor',this.color_send_fio).html(this.fio))
							.append($('<td />').html(this.object_count))
							.append($('<td />').attr('bgcolor',this.color_date_end_otdel).html(this.date_end_otdel))
							.append($('<td />').attr('bgcolor',this.color_date_end).html(this.date_end))
							.append($('<td />').html(this.merge_type))
							.append($('<td />').attr('bgcolor',this.req_send).html(this.comments))
							).fadeIn();
						
					});
	darkCat(-1); //убираем затемнение экрана
	if(varsortsearch){document.getElementById('headSearch_'+varsortsearch).style.backgroundImage= "-moz-linear-gradient(center top , #CCCCFF, #8A4B08)"; //подсвечиваем сортируемую ячейку шапки фаерфокс
				document.getElementById('headSearch_'+varsortsearch).style.backgroundImage= "-ms-radial-gradient(center top , #CCCCFF, #8A4B08)";} //подсвечиваем сортируемую ячейку шапки интернет эксплорер
}