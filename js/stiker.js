// ----------------------------------------------------------------------------
// Stikr, jQuery plugin
// v 1.0
// ----------------------------------------------------------------------------
// Copyright (C) 2010 recens
// http://recens.ru/jquery/plugin_stickr.html
// ----------------------------------------------------------------------------
(function($) {
	$.stickr = function(o) {
		var o = $.extend({   // настройки по умолчанию
			time:5000, // количество мс, которое отображается сообщение
			speed:'slow', // скорость исчезания
			note:null, // текст сообщения
			className:null, // класс, добавляемый к сообщению
			sticked:false, // не выводить кнопку закрытия сообщения
			position:{bottom:0,right:25} // позиция по умолчанию - справа сверху
		}, o);
		var stickers = $('#jquery-stickers'); // начинаем работу с главным элементом
		if (!stickers.length) { // если его ещё не существует
			$('body').prepend('<div id="jquery-stickers"></div>'); // добавляем его
			var stickers = $('#jquery-stickers');
		}
		stickers.css('position','fixed').css({right:'auto',left:'auto',top:'auto',bottom:'auto'}).css(o.position); // позиционируем
		var stick = $('<div class="stick"></div>'); // создаём стикер
		stickers.append(stick); // добавляем его к родительскому элементу
		if (o.className) stick.addClass(o.className); // если необходимо, добавляем класс
        stick.html(o.note); // вставляем сообщение
		if (o.sticked) { // если сообщение закреплено
			var exit = $('<div class="exit"></div>');  // создаём кнопку выхода
			stick.prepend(exit); // вставляем её перед сообщением
			exit.click(function(){  // при клике
				stick.fadeOut(o.speed,function(){ // скрываем стикер
					$(this).remove(); // по окончании анимации удаляем его
				})
			});
		} else { // если же нет
			setTimeout(function(){ // устанавливаем таймер на необходимое время
				stick.fadeOut(o.speed,function(){ // затем скрываем стикер
					$(this).remove(); // по окончании анимации удаляем его
				});
			}, o.time);
		}
	};
})(jQuery);