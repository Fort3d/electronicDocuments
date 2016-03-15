var flag_data=false;		/*переменная для проверки нажатия кпопки получения списков*/	
var varsort;				/*переменная для типа сортировки*/
var varsortdopy;			/*переменная для типа сортировок допов*/
var varsortzaprosy;			/*переменная для типа сортировок запросов*/
var varsortsearch;			/*переменная для типа сортировок поиска*/
var status;					/*Включенная вкладка*/
var obj;					/*полученные с сервера заявки*/
var obj_info;				/*история по заявке*/
var obj_dopy;				/*полученные допы с сервера*/
var obj_zaprosy_full;		/*полученные запросы с сервера*/
var obj_zaprosy_ekster;		/*полученные запросы экстер с сервера*/
var obj_zaprosy_portal;		/*полученные запросы портал с сервера*/
var obj_zaprosy_mfc;		/*полученные запросы мфц с сервера*/
var obj_search;				/*полученные результаты поиска с сервера*/
var returnedData;			/*отфильтрованные заявки*/
var returnedDopy;			/*отфильтрованные допы*/
var returnedZaprosy;		/*отфильтрованные запросы переменная для работы функции вывода*/
var returnedZaprosy_full;	/*отфильтрованные запросы все*/
var returnedZaprosy_ekster;	/*отфильтрованные запросы экстер*/
var returnedZaprosy_portal;	/*отфильтрованные запросы портал*/
var returnedZaprosy_mfc;	/*отфильтрованные запросы мфц*/
var returnedSearch;			/*отфильтрованные результаты поиска*/
var colorName;  			/*номер ид заявки для отжатия подсветки*/
var blockTime=10; 			/*время блокировки кнопки получения заявок в секундах*/
var selectId=0;				/*ид последнего нажатого чекбокса*/
var shifted;				/*содержит информацию нажата кнопка шифт или нет*/
var dark_number=0;			/*значение для котика*/
var max_string=500;			/*максимальное количество строк на страницу*/
var unix_time_dist=0;		/*юникс время последнего назначения*/

/*Обработка нажатия кнопки получить заявки */
function WaitForData(a){
	if( getCookie('blockTime') > 0 ){alert('Подождите: '+getCookie('blockTime')+' сек.');return false;}
	flag_data=true; //меняем флаг нажали кнопку
	if(type!=6)window.setTimeout('WaitForMsg('+a+')',100);//вызов получения заявок
	if(type==0 || type==1 || type==2)window.setTimeout('WaitForDopy()',100);//получение допов (запрет для отдела токаревой ОКУ №9)
	if(type==4 || type==5 || type==6)window.setTimeout('WaitForZaprosy("full")',100);//получение списка запросов 
	if(type==4 && right==0){//получение вкладок запросов экстер,мфц,портал(только для отдела токаревой ОКУ №9)
		window.setTimeout('WaitForZaprosy("ekster")',100);
		window.setTimeout('WaitForZaprosy("portal")',100);
		window.setTimeout('WaitForZaprosy("mfc")',100);
	}
	blockButtonMsg(blockTime);//блокируем множественные запросы при обновлении страницы
	/*НЕ ЗАБЫВАЕМ ОБНОВЛЯТЬ СЕРВИС ОНЛАЙНА!!!!!!!!!!*/
}
/*функция котика*/
function darkCat(a){
//a - значения для преобразования
	dark_number=dark_number+a;
	if(dark_number<=0)dark_number=0;
	if(dark_number>0)document.getElementById('comments').style.visibility = 'visible'; //включаем котика
	if(dark_number==0)document.getElementById('comments').style.visibility = 'hidden'; //убираем котика
}
/*выполнение функций при загрузке страницы*/
document.addEventListener("DOMContentLoaded", ready); //проверка загрузилась страница или нет
function ready(){
modal();//открытие модального окна с инфой
status='home';//выставляем домашнюю вкладку
if(type==6)status='zaprosy_full';//выставляем домашнюю вкладку для архива
 if( getCookie('blockTime') > 0 ){
			blockButtonMsg(getCookie('blockTime')); //проверка блокировки кнопки получения заявок
			}else{
			WaitForData(otdel);		//разовое получение заявок
			}
	if(type==1 || type==2)WaitForWnum(); 		//разовое получение количества человек в отделе
}
/*функция получения юникс время*/
function unixTime(){
	return parseInt(new Date().getTime()/1000)
}
/*функция открытия модального окна*/
function modal(){
	$('#exampleModal').arcticmodal();//модальное окно
	viewStiker('Здравствуйте '+username+'!');
}
/*функция стикера*/
function viewStiker(a,b){
//a- текст сообщения b- режим стикера
if(b=='hold'){$.stickr({note:a,className:'classic error',sticked:true}); return false;}
	$.stickr({note:a,className:'classic'});
}

/*отправка по нажатию enter*/
$(document).keypress(function(e) {
    if(e.keyCode == 13) {
	 if (document.getElementById('textmess') && document.getElementById('textmess').value) {
			document.getElementById('inputbtn').click();
		}
	if (document.getElementById('input_wnum') && document.getElementById('input_wnum').value) {
			document.getElementById('button_wnum').click();
		}
	if (document.getElementById('input_date') && document.getElementById('input_date').value) {
			document.getElementById('input_date_btn').click();
		}
	if (document.getElementById('input_search') && document.getElementById('input_search').value) {
			document.getElementById('input_search_btn').click();
			document.getElementById('label_search').click();
		}
	}
});

/*функция смены вкладок*/
function changeTab(a){
 status=a;
 if(flag_data){
	switch(a){
		case 'home':document.getElementById('head_count').innerHTML="Заявки";break;
		case 'dopy':document.getElementById('head_count').innerHTML="Приостановки";break;
		case 'zaprosy_full':document.getElementById('head_count').innerHTML="Запросы";break;
		case 'zaprosy_ekster':document.getElementById('head_count').innerHTML="Экстерры";break;
		case 'zaprosy_portal':document.getElementById('head_count').innerHTML="Портал";break;
		case 'zaprosy_mfc':document.getElementById('head_count').innerHTML="МФЦ";break;
		case 'search':document.getElementById('head_count').innerHTML="Результаты поиска";break;
	}
	changeStat();//вызываем смену вкладок статистики по людям
	asinh();//вызываем тормоза ^_^
 }
}

/*функция смены экранов статистики*/
function changeStat(){
 $('#moreinfoin2 section').each(function(){
		this.style.display = 'none';
	});
 $('.stat_'+status).css('display', 'block');
}

/*функция временного смена отдела*/
function changeOtdel(a,b){
if(status!='home'){alert('Перейдите во вкладку заявки!');return false;}
	document.getElementById('otdelname').innerHTML=b;
	WaitForMsg(a);
}

/*функция преобразования дат*/
function upgradeDate(a){
	//a - получение даты для апгрейда
	var	arr_a = a.split('.');
	var msUTC = Date.parse(arr_a[2]+'-'+arr_a[1]+'-'+arr_a[0])/1000; //получаем юникс время в милисекундах и делим на 1000 для секунд
return	msUTC; 
}

/*функция рассинхронизации затемнения экрана*/
function asinh(){
	if(flag_data){
		if(status=="home"){window.setTimeout('OutMsg()',100);darkCat(+1);}
		if(status=="search" && window.obj_search !== undefined){window.setTimeout('OutSearch()',100);darkCat(+1);}
		if(type!=4 && type!=5 && status=="dopy" && window.obj_dopy !== undefined){window.setTimeout('OutDopy()',200);darkCat(+1);}//отрисовка допов (запрет для отдела токаревой ОКУ №9)
		if((type==4 || type==5 || type==6) && status=="zaprosy_full"){window.setTimeout('OutZaprosy("full")',200);darkCat(+1);}//отрисовка запросов (только для отдела токаревой ОКУ №9)
		if(type==4 && right==0){//получение вкладок запросов экстер,мфц,портал(только для отдела токаревой ОКУ №9)
			if(status=="zaprosy_ekster"){window.setTimeout('OutZaprosy("ekster")',200);darkCat(+1);}
			if(status=="zaprosy_portal"){window.setTimeout('OutZaprosy("portal")',200);darkCat(+1);}
			if(status=="zaprosy_mfc"){window.setTimeout('OutZaprosy("mfc")',200);darkCat(+1);}
		}
	}
}

/*функция мультивыбор для селекта*/
function multiselect(a,b){
	var val_max=0;
	$('#'+b+' option').each(function(){
	   if(this.text.length > val_max)val_max=this.text.length;
	});

	switch(a){
		case 'focus':document.getElementById(b).size=$("select[id="+b+"] option").size();
					 document.getElementById(b).style.width=val_max*7;
			break;
		case 'blur':document.getElementById(b).size=2;
					document.getElementById(b).style.width='';
					asinh();
			break;
		}	
}

/*Выделение чекбоксов с использованием шифта*/
$(document).keydown(function (e) {shifted=e.shiftKey;});
$(document).keyup(function (e) {shifted=e.shiftKey;});

function SelectCheckbox(a,b){
	var o=document.getElementById(b),i;
	o=o.getElementsByTagName('input');
	if (shifted && selectId<a) {
		for (i=selectId; i<a; i++) {
			if (o[i].type=='checkbox' && o[a].checked == true){o[i].checked=true;}
			if (o[i].type=='checkbox' && o[a].checked == false){o[i].checked=false;}
			}
    }  
    if (shifted && selectId>a) {
		for (i=a; i<=selectId; i++) {
			if (o[i].type=='checkbox' && o[a].checked == true){o[i].checked=true;}
			if (o[i].type=='checkbox' && o[a].checked == false){o[i].checked=false;}
			}
    }
	selectId=a;
}

/*выделение всех заявок по единому чекбоксу*/
function selectAll(a){
	$('#'+a+' .radio1:checkbox').each(function(){
		this.checked=document.getElementById('selAll_'+a).checked;
	});
}

/*выделение всех фамилий по единому чекбоксу*/
function selectAllstat(){
	$('.stat_'+status+' .radio:checkbox').each(function(){
		this.checked=document.getElementById('selAll_stat_'+status).checked;
	});
}

/*Подсветка выбранной заявки при её выборе*/
function WaitForMoreInfoColor(a){
		document.getElementById('tr_'+a).style.backgroundColor= "#4ab1f0";
		if(document.getElementById('tr_'+colorName) && colorName && colorName!=a){
			document.getElementById('tr_'+colorName).style.backgroundColor= "";
		}
		colorName=a;
}

/*блокировка получения заявок*/
function getCookie(name) {
  var matches = document.cookie.match(new RegExp(
    "(?:^|; )" + name.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, '\\$1') + "=([^;]*)"
  ));
  return matches ? decodeURIComponent(matches[1]) : undefined;
}
function blockButtonMsg(a){
	if(a>=1){a--;
			document.cookie = "blockTime="+a;
			window.setTimeout('blockButtonMsg('+a+')',1000);
		}else{document.cookie = "blockTime="+a;}
}

/*включение отключение сортировок*/
function selectSort(a){
	switch(status){
		case 'home':if(varsort==a){varsort = '';}else{varsort=a;}break;
		case 'dopy':if(varsortdopy==a){varsortdopy = '';}else{varsortdopy=a;}break;
		case 'search':if(varsortsearch==a){varsortsearch = '';}else{varsortsearch=a;}break;
		case 'zaprosy_full':
		case 'zaprosy_ekster':
		case 'zaprosy_portal':
		case 'zaprosy_mfc':	if(varsortzaprosy==a){varsortzaprosy = '';}else{varsortzaprosy=a;}break;
	}
	asinh();
}
/*функция передачи заявок между отделами */
	/*функция поиска родительского элемента*/
function getParent(el, parentTagName) {
    var a = el;
    while (a.tagName !== parentTagName) {
        a = a.parentNode;
    }
    return a;
}
	/*отправка на сервер*/
function sendTiket(){
	var ar_tiket = [],a,b,c;
	if(status=='home'){a='table-1';b=returnedData;}
	if(status.indexOf("zaprosy")==0){
		/*смотрим какие именно запросы*/
		if(status.indexOf("full")!=-1){a='table-full';b=returnedZaprosy_full;c=obj_zaprosy_full;}
		if(status.indexOf("ekster")!=-1){a='table-ekster';b=returnedZaprosy_ekster;c=obj_zaprosy_ekster;}
		if(status.indexOf("portal")!=-1){a='table-portal';b=returnedZaprosy_portal;c=obj_zaprosy_portal;}
		if(status.indexOf("mfc")!=-1){a='table-mfc';b=returnedZaprosy_mfc;c=obj_zaprosy_mfc;}
	}
	/*проверка на запреты*/
	if(status=='dopy'){alert('Приостановки нельзя передать!'); return false;}
	if(status=='search'){alert('Действие запрещено!');  return false;}
	if( (type==5 || type==4) && status=='home'){alert('Вам разрешено передавать только запросы!'); return;}
	//if(document.getElementById('select_tiket').value==0 || temp_otdel!=otdel || document.getElementById('select_tiket').value==otdel){
	//			alert('Вы пытаетесь передать заявки не своего отдела или не выбрали пункт назначения!');return false;
	//}
	
	/*перебор чекбоксов*/
	$('#'+a+' .radio1:checkbox:checked').each(function(){
		ar_tiket.push({
			"tiket" : getParent(this, 'TR').id.replace(/[^0-9]/g, "")
		});
	});
	/*выкидываем заявки не принадлежащие отделу*/
	if(status=='home'){	ar_tiket = $.grep(ar_tiket, function (element, index) {
							var flag;
								for(var ArrVal in b) { //охеренный перебор ассациативного массива
									if(element.tiket==b[ArrVal].id && b[ArrVal].otdel==otdel) flag=true;
								}
							if(flag)return element.tiket;
							});
	}
	if(Array.prototype.slice.call( ar_tiket, 0 ).length == 0){alert('Не выбраны ни одной заявки на передачу!');return false;}//проверка не пустой ли массив отправляемых заявок
	
	if (!confirm('Передать в '+$("#select_tiket option:selected").text()+' заявок '+ar_tiket.length+' шт.?'))return false;   //спросим точно ли отдать
	
	/*удалим переданные заявки из массива*/
	if(status=='home'){obj = $.grep(obj, function (element, index) {
							var flag=true;
								for(var ArrVal in ar_tiket) { 
									if(element.id==ar_tiket[ArrVal].tiket) flag=false;
								}
							if(flag)return element;
							});
					}
	/*если запросы токаревой то перекрасим в другой цвет */
	if(status.indexOf("zaprosy")==0 && type==4){
		c = $.grep(c, function (element, index) {
							var flag;
								for(var ArrVal in ar_tiket) { 
									if(element.id==ar_tiket[ArrVal].tiket) flag=true;
								}
							if(flag)element.priznak="#fcf172";
							return element;
							});
	/*обновим массив запросов*/
	switch(status){
			case 'zaprosy_full':obj_zaprosy_full=c;break;
			case 'zaprosy_ekster':obj_zaprosy_ekster=c;break;
			case 'zaprosy_mfc':obj_zaprosy_mfc=c;break;
			case 'zaprosy_portal':obj_zaprosy_portal=c;break;
		}
	}
	/*если запросы нбд то удалим*/
	if(status.indexOf("zaprosy")==0 && type==5){
		obj_zaprosy_full = $.grep(obj_zaprosy_full, function (element, index) {
							var flag=true;
								for(var ArrVal in ar_tiket) { 
									if(element.id==ar_tiket[ArrVal].tiket) flag=false;
								}
							if(flag)return element;
							});
	}
	
	ajaxSendTiket(ar_tiket);//отправляем заявки
}

/*функция экспорта в Excel*/
function exportExcel(){
	var ar_tiket = [],a,b,c;
	if(status=='home'){a='table-1',b=returnedData;c=obj;}
	if(status=='dopy'){a='table-2',b=returnedDopy;c=obj_dopy;}
	if(status.indexOf("zaprosy")==0){
		/*смотрим какие именно запросы*/
		if(status.indexOf("full")!=-1){a='table-full';b=returnedZaprosy_full;c=obj_zaprosy_full;}
		if(status.indexOf("ekster")!=-1){a='table-ekster';b=returnedZaprosy_ekster;c=obj_zaprosy_ekster;}
		if(status.indexOf("portal")!=-1){a='table-portal';b=returnedZaprosy_portal;c=obj_zaprosy_portal;}
		if(status.indexOf("mfc")!=-1){a='table-mfc';b=returnedZaprosy_mfc;c=obj_zaprosy_mfc;}
	}
	if(status=='search'){a='table-search';b=returnedSearch;c=obj_search;}
	
	if(document.getElementById(a)){
	/*перебор чекбоксов*/
		$('#'+a+' .radio1:checkbox:checked').each(function(){
			ar_tiket.push({
				"tiket" : getParent(this, 'TR').id.replace(/[^0-9]/g, "")
			});
		});
			
	/*отбор выбранных данных*/
		if(Array.prototype.slice.call( ar_tiket, 0 ).length != 0){ //проверка не пустой ли массив отправляемых заявок
			var obj_excel = $.grep(b, function (element, index) {
										if($.grep(ar_tiket, function(element2, index2){
											return element2.tiket==element.id;
										}) != '')return element;
							});
	if($("#selAll_"+a).prop("checked") && ar_tiket.length>=500)if(status=='dopy'){obj_excel=FilterDopyHead(c);}else{obj_excel=c;} //если выбран чекбокс все то экспортировать вообще весь список 
		/*передача данных на сервер*/	
			ajaxExcel(obj_excel);
		}
	}		
}

/*функция переназначить*/
function destinationMen(){
	try{
		var a;
		if(status=='home'){a='table-1',b=returnedData;}
		if(status=='dopy'){a='table-2',b=returnedDopy;}
		if(status.indexOf("zaprosy")==0){
			/*смотрим какие именно запросы*/
			if(status.indexOf("full")!=-1){a='table-full';b=returnedZaprosy_full;}
			if(status.indexOf("ekster")!=-1){a='table-ekster';b=returnedZaprosy_ekster;}
			if(status.indexOf("portal")!=-1){a='table-portal';b=returnedZaprosy_portal;}
			if(status.indexOf("mfc")!=-1){a='table-mfc';b=returnedZaprosy_mfc;}
		}
		if(status=='search'){alert('Действие запрещено!');  return false;}
		
		var arr_z=$('#'+a+' .radio1:checkbox:checked'); //массив выбранных заявок
		var arr_zl=[]; 		/*массив распределенных заявок и людей нужен для переназначения*/
		if($('#'+a+' .radio1:checkbox:checked').length<=0){alert('Не выбраны заявки'); return false;}
		if($('.stat_'+status+' .radio:checkbox:checked').length<=0){alert('Не выбраны сотрудники для назначения'); return false;}
		
		do{
			$('.stat_'+status+' .radio:checkbox:checked').each(function(){
				if(arr_z.length<=0)return false; //проверка не закончились ли заявки 
				var k=Math.floor(Math.random() * (arr_z.length)); //случайное число из массива заявок
				arr_zl.push({
					'tiket' : document.getElementById('rn_'+getParent(arr_z[k], 'TR').id.replace(/[^0-9]/g, "")).innerHTML,
					'user' : this.id
				});
				arr_z.splice(k,1); //удаляем назначенную заявку
			});
		}while(arr_z.length>0);
		
		/*выкидываем заявки не принадлежащие отделу*/
		/*arr_zl = $.grep(arr_zl, function (element, index) {
					var flag;
					for(var ArrVal in b) { //охеренный перебор циативного массива
						if(element.tiket==b[ArrVal].request_number && b[ArrVal].otdel==otdel) flag=true;
					}
					if(flag)return element.tiket;
			});*/
		if(Array.prototype.slice.call(arr_zl, 0 ).length == 0){alert('Вы пытались назначить не свои заявки!');return false;}//проверка не пустой ли массив заявок		
		
		var k = $('.stat_'+status+' .radio:checkbox:checked').length;
		var k2 = $('#'+a+' .radio1:checkbox:checked').length;
		if (!confirm('Распределение завершено!\n\rНа '+k+' специалистa(ов) будет назначено '+k2+' заявок, в среднем '+Math.ceil(k2/k)+' на человека.\n\rПриступить к переназначению?'))return false;    //спросить приступать или нет к назначению
		
		destinationSend(); //запускаем отправку массива
	}catch(e){
		alert('destinationMen: '+e);
	}
		/*функция открытия окна робота*/
		function destinationSend(){
			try{
				document.getElementById('destinationMen').innerHTML='Осталось: '+arr_zl.length+' заявок'; 
				if(arr_zl.length<=0){document.getElementById('destinationMen').innerHTML='Назначить в АИС ГКН </br>(ПРОМ)'; asinh(); return false;}
					var mWindow = window.open('http://r61p-01-app00/reestr/index.php?arr_item="'+arr_zl[0].tiket+'"&arr_user='+arr_zl[0].user+'&arr_oper='+user_id+'', '', 'scrollbars=1,height=500,width=500');	 
					//var mWindow = window.open('http://r61p-01-cm3/reestr/index.php?arr_item="'+arr_zl[0].tiket+'"&arr_user='+arr_zl[0].user+'&arr_oper='+user_id+'', '', 'scrollbars=1,height=500,width=500');	 
					
					destinationFio(arr_zl[0].tiket,arr_zl[0].user);//воткнем фамилию
					unix_time_dist=unixTime(); //время последнего назначения
					arr_zl.splice(0,1);//удаляем переданные данные 
					destinationCheck(mWindow);
			}catch(e){
				alert('destinationSend: '+e);
			}
		}	
		/*функция проверки закрылось или нет окно робота*/
		function destinationCheck(a){
			try{
				if (a.closed){
					destinationSend();
				}else{
				window.setTimeout(function(){destinationCheck(a)}, 100);
				}
			}catch(e){
				window.setTimeout(function(){destinationCheck(a)}, 100);
			}
		}
		/*функция временного значения фамилии кому назначена*/
		function destinationFio(a,b){
		//a - номер заявки, b - id юзера 
			var fio = $("#"+b).closest("td").next().next().text();/*получаем фамилию*/
			viewStiker(a+'<br>'+fio);//влепим стикер назначения
			/*воткнем фамилию и подсветку*/
			if(status=='home'){
				$.each(obj, function(){ if(this.request_number==a){this.fio=fio;this.color_send_fio="red";return false;}});
			}
			if(status=='dopy'){$.each(obj_dopy, function(){ if(this.request_number==a){this.fio=fio;this.color_send_fio="red";return false;}});}
			if(status.indexOf("zaprosy")==0){
				/*смотрим какие именно запросы*/
				if(status.indexOf("full")!=-1){$.each(obj_zaprosy_full, function(){ if(this.request_number==a){this.fio=fio;this.color_send_fio="red";return false;}});}
				if(status.indexOf("ekster")!=-1){$.each(obj_zaprosy_ekster, function(){ if(this.request_number==a){this.fio=fio;this.color_send_fio="red";return false;}});}
				if(status.indexOf("portal")!=-1){$.each(obj_zaprosy_portal, function(){ if(this.request_number==a){this.fio=fio;this.color_send_fio="red";return false;}});}
				if(status.indexOf("mfc")!=-1){$.each(obj_zaprosy_mfc, function(){ if(this.request_number==a){this.fio=fio;this.color_send_fio="red";return false;}});}
			}	
		}
}
/*функция копирования в буфер обмена*/
function copyBuf(){
	// Получим номер допа 
	var copy_text = document.getElementById('tooltip').innerHTML.split(':');  
	// Получим текстовый узел
	var root = document.getElementById('tooltip').firstChild;
	// и его содержимое
	var content = root.nodeValue;
	//создаем объект Range
	var range = document.createRange();  
	// Ставим верхнюю границу по индексу совпадения,
	range.setStart(root, content.indexOf(copy_text[4]));
	// а нижнюю по индексу + длина текста
	range.setEnd(root, content.indexOf(copy_text[4]) + copy_text[4].length);
	//выделяем текст номера допа
	window.getSelection().addRange(range);  
		
	try {  
		// Теперь, когда мы выбрали текст ссылки, выполним команду копирования
		var successful = document.execCommand('copy');  
		var msg = successful ? 'successful' : 'unsuccessful';  
		console.log('Copy email command was ' + msg);  
	} catch(err) {  
		console.log('Oops, unable to copy');  
	}  
	// Снятие выделения - ВНИМАНИЕ: вы должны использовать
	window.getSelection().removeRange(range);
}

/*функция открытия окна свойст заявки*/
function openStatusMsg(a){
	// a- ид заявки
	var h = 500,
		w = 1000;
	myWindow = window.open('http://r61-gkn-p-as4/requestviewer/default.aspx?subsystem=req&id='+a, '', 'scrollbars=1,height='+Math.min(h, screen.availHeight)+',width='+Math.min(w, screen.availWidth)+',left='+Math.max(0, (screen.availWidth - w)/2)+',top='+Math.max(0, (screen.availHeight - h)/2));
}

/*чатик*/
var myWindow;
function newMyWindow(e) {
  var h = 650,
      w = 780;
 myWindow = window.open(e, '', 'scrollbars=1,height='+Math.min(h, screen.availHeight)+',width='+Math.min(w, screen.availWidth)+',left='+Math.max(0, (screen.availWidth - w)/2)+',top='+Math.max(0, (screen.availHeight - h)/2));
}

jQuery(function($){
   $("#input_date").mask("99.99.9999");
   $("#input_date2").mask("99.99.9999");
	/*всплывающее поле подсказка*/
   $(document).on("mousemove","[data-tooltip]", function (eventObject) {

        $data_tooltip = $(this).attr("data-tooltip");
        
        $("#tooltip").text($data_tooltip)
                     .css({ 
                         "top" : eventObject.pageY + 5,
                        "left" : eventObject.pageX + 5
                     })
                     .show();

    }).on("mouseout","[data-tooltip]", function () {
        $("#tooltip").hide()
                     .text("")
                     .css({
                         "top" : 0,
                        "left" : 0
                     });
    }); 
});

/*функция многостраничности вкладок*/
function MultiPages(a,b){
	var max_pages,pages;
	//a - в какую вкладку строить страницы
	//b - данные для построения
	max_pages = Math.ceil(b.length / max_string);//определяем количество страниц
	if(!document.getElementById('pages_'+a)){pages=1;}else{pages= +document.getElementById('pages_'+a).innerHTML;
															if(pages>max_pages)pages=max_pages;
														}//определяем номер страницы
	document.getElementById('buttonpages_'+a).innerHTML=''; //удалим кнопки если были 
	if (max_pages>1){//впихуем кнопки
			
		document.getElementById('buttonpages_'+a).innerHTML='<input class="angle-double yelow" type="button" onclick="LastPages(\''+a+'\')" value="<"><span id="pages_'+a+'">'+pages+'</span><span>/'+max_pages+'</span><input class="angle-double yelow" type="button" onclick="NextPages(\''+a+'\')" value=">">';
		
		b = b.slice(max_string*(pages-1),max_string*pages); //вырезаем из массива страницу
				
		switch(a){
			case 'home':returnedData=b;break;
			case 'dopy':returnedDopy=b;break;
			case 'zaprosy_full':returnedZaprosy=b;break;
			case 'zaprosy_ekster':returnedZaprosy=b;break;
			case 'zaprosy_mfc':returnedZaprosy=b;break;
			case 'zaprosy_portal':returnedZaprosy=b;break;
		}
	}
}

function NextPages(a){
//a - идентификатор вкладки
	var pages= +document.getElementById('pages_'+a).innerHTML;//определяем номер страницы
	pages=pages+1;
	document.getElementById('pages_'+a).innerHTML=pages;
	asinh();
}

function LastPages(a){
//a - идентификатор вкладки
	var pages= +document.getElementById('pages_'+a).innerHTML;//определяем номер страницы
	pages=pages-1;
	if(pages<=0)pages=1;
	document.getElementById('pages_'+a).innerHTML=pages;
	asinh();
}

/*чекбоксы инструментов*/
function inputDateCheck(){
if (document.getElementById('date_2').checked){document.getElementById('input_date2').style.display='inline';}else{document.getElementById('input_date2').style.display='none';}
}
function inputTypeRequestCheck(){
if (document.getElementById('typerequest').checked){document.getElementById('typerequest1').style.display='inline';}else{document.getElementById('typerequest1').style.display='none';}
}
function inputTypeZaprosCheck(){
if (document.getElementById('typezapros').checked){document.getElementById('typezapros1').style.display='inline';}else{document.getElementById('typezapros1').style.display='none';}
}
function inputTypeSostCheck(){
if (document.getElementById('typesost').checked){document.getElementById('typesost1').style.display='inline';}else{document.getElementById('typesost1').style.display='none';}
}