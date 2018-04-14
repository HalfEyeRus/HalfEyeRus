// Константы
const BIG_WIDTH = 1365;
const MEDIUM_WIDTH = 767;
const SMALL_WIDTH = 320;

// Убери лишние 2 слеша чтобы подключить модуль
(
    function( $ )
    {
        $.insertRule = function(selector,rules,contxt)
            {
                var context=contxt||document,stylesheet;

                if(typeof context.styleSheets=='object')
                {
                    if(context.styleSheets.length)
                    {
                        stylesheet=context.styleSheets[context.styleSheets.length-1];
                    }
                    if(context.styleSheets.length)
                    {
                        if(context.createStyleSheet)
                        {
                            stylesheet=context.createStyleSheet();
                        }
                        else
                        {
                            context.getElementsByTagName('head')[0].appendChild(context.createElement('style'));
                            stylesheet=context.styleSheets[context.styleSheets.length-1];
                        }
                    }
                    if(stylesheet.addRule)
                    {
                        for(var i=0;i<selector.length;++i)
                        {
                            stylesheet.addRule(selector[i],rules);
                        }
                    }
                    else
                    {
                        stylesheet.insertRule(selector.join(',') + '{' + rules + '}', stylesheet.cssRules.length);
                    }
                }
            };
    }
)( jQuery );
/**
 * Модальное окно
 * Показать: $(modal_selector).modal('show');
 * Скрыть: $(modal_selector).modal('hide');
 * Забиндить по нажатию на ссылку по href: $(link_selector).modal('bindHref');
 * Забиндить по нажатию на ссылку по data: $(link_selector).modal('bindData');
 */

(function ($) {
    const MODAL_POSITION_INNER = 'inner';
    const MODAL_POSITION_OUTER = 'outer';

    var modal_defaults = {
        closePos: MODAL_POSITION_INNER
    };

    var methods = {
        bindHref: function () {
            this.on('click', function (e) {
                $($(this).attr('href')).modal('show');
                e.preventDefault();
            });
        },
        bindData: function () {
            this.on('click', function (e) {
                $($(this).data('modal')).modal('show');
                e.preventDefault();
            });
        },
        show: function (modal) {
            // Ежели нам не дали в функцию модалку - пускай это будет текущий элемент
            if (modal == undefined)
                modal = this;

            // Проверим инициализацию модалки и если не инициализирована - создадим темплейт
            if (!modal.hasClass('modal-initialized')) {
                var $modalTemplate = $('<div class="modal modal-initialized"><div class="modal-container"><div class="modal-overlay"></div></div></div></div>');
                $modalTemplate.find('.modal-container').append(modal.detach());
                var $buttonClose = $('<button class="modal-close"></button>');
                if (modal_defaults.closePos === MODAL_POSITION_INNER)
                    modal.append($buttonClose);
                else
                    modal.parent().append($buttonClose);
                var id = modal.attr('id');
                modal.attr('id', '');
                $modalTemplate.attr('id',id);
                $('body').append($modalTemplate);

                modal = $modalTemplate.fadeIn();
            }

            // Делаем модалку видимой
            modal.addClass('visible');
            // Ищем кнопку закрытия модалки и подложку и вешаем на них событие закрытия модалки
            modal.find('.modal-close, .modal-overlay, .modal-close-alt').click(function (event) {
                modal.modal('hide');
                event.preventDefault();
            });

            // Если высота окна меньше чем высота модалки то запрещаем скроллить html (модалка скроллится)
            if ($(window).height() < modal.find('.modal-container')["0"].clientHeight) {
                $('html').addClass('modal-overflow');
            }
        },
        hide: function (modal) {
            if (modal == undefined)
                modal = this;

            if (!modal.hasClass('modal-initialized')) return;

            var ifr = modal.find('iframe');
            if(ifr.length){
                ifr.parent().append(ifr.detach());
            }

            var vid = modal.find('video');
            if(vid.length){
                vid.get(0).pause();
            }

            // Скрываем модалку
            modal.removeClass('visible');
            // Выключаем слушатели событий нажатия с кнопок и подложки
            modal.find('.modal-close, .modal-overlay').off();
            // Возвращаем возможность скроллинга html
            $('html').removeClass('modal-overflow');
        },
        getScrollbarWidth: function(){
            var documentWidth = parseInt(document.documentElement.clientWidth);
            var windowsWidth = parseInt(window.innerWidth);
            var scrollbarWidth = windowsWidth - documentWidth;
            return scrollbarWidth;
        },
        setOption: function(opt){
            modal_defaults = $.extend(JSON.parse(JSON.stringify(modal_defaults)),opt);
        }
    };

    if($.insertRule != undefined){
        var sbw = methods.getScrollbarWidth();
        $.insertRule(['.modal-overflow'],'padding-right: '+sbw+'px;');
    }

    $.fn.modal = function (method) {
        // логика вызова метода
        if (methods[method]) {
            return methods[method].apply(this, Array.prototype.slice.call(arguments, 1));
        } else {
            $.error('Метод с именем ' + method + ' не существует для jQuery.modal');
        }
    };
})(jQuery);
/**
 * Модуль аккордиона
 */

(function ($) {
    var accordion_defaults = {
        selfClose: true,    // Позволять закрыть текущий элемент (нужно сочитать с multiple)
        multiple: true,     // Если false то нельзя развернуть больше 1 аккордиона
        offFrom: 0,         // Выключать аккордион начиная с этого размера экрана
        offset: 20,         // Отступ от текущего выбранного элемента до верха экрана (при развороте)
        animSpeed: 300,     // Скорость анимации открытия
        offScrollFrom: 720, // Выключить прокрутку, начиная с этого размера экрана (0 - не скроллить вообще)
        rollUpChilds: false // Сворачивать ли детей при свертывании родителя
    };

    $.fn.accordion = function (opt) {
        var options = $.extend(JSON.parse(JSON.stringify(accordion_defaults)),opt);
        var ww = $(window).width();

        this.children('.accordion-header').on('click', function (e) {
            if (options.offFrom > 0 && ww > options.offFrom) {
                e.preventDefault();
                return;
            }

            var $me = $(this).parent();

            if (!options.multiple) {
                var $prev = $me.siblings('.expanded');

                if ($prev.get(0) != $me.get(0)) {
                    $prev.children('.accordion-content').slideUp(options.animSpeed);
                    $prev.removeClass('expanded').trigger('change');
                }
            }

            if (options.selfClose || (!options.selfClose && !$me.hasClass('expanded'))) {
                $me.children('.accordion-content').slideToggle(options.animSpeed);
                var has = $me.toggleClass('expanded').hasClass('expanded');

                if (has && options.offScrollFrom > ww) {
                    $('body').animate(
                        {
                            scrollTop: $me.offset().top - options.offset
                        }, 700
                    );
                }

                if(!has && options.rollUpChilds){
                    $me.find('.accordion.expanded').removeClass('expanded').trigger('change').children('.accordion-content').slideUp(1);
                }

                $me.trigger('change');
            }

            e.preventDefault();
        });
    }
})(jQuery);
////=require components/tabs.js
////=require components/parallax.js
/**
 * Модуль стилизации селектов
 */

(function ($) {
    $.fn.fieldSelect = function () {
        this.each(function(i, v){
            var $field = $(v).addClass('field-select-select');
            var $container = $('<div class="field-select-container"></div>');
            $container.insertAfter($field);
            var $fake = $('<div class="field-select-fake"><span class="field-select-link"></span><div class="field-select-pin"></div></div>');
            var $list = $('<div class="field-select-list"></div>');

            $field.find('option').each(function(ii, vv){
                $vv = $(vv);
                var $opt = $('<div class="field-select-list-link">'+$vv.text()+'</div>');
                $opt.data('value', $vv.val()).click(function(e){
                    $field.val($(this).data('value')).select().trigger('change');

                    e.preventDefault();
                });
                $list.append($opt);

                if($vv.is(':selected')){
                    $fake.find('.field-select-link').text($vv.text());
                }
            });

            $field.on('change select', function(e){
                $fake.find('.field-select-link').text($(this).find('option:selected').text());
            });

            $container.append($field.detach(),$fake,$list);

            $fake.on('tap click',function(e){
                var $targ = $(this).parents('.field-select-container').toggleClass('expand');

                e.preventDefault();

                $(document).click(function(event) {
                    var $trg = $(event.target);
                    if($trg.closest('.field-select-container').get(0) !== $targ.get(0)) {
                        $targ.removeClass("expand");
                    }else if($trg.closest('.field-select-list-link').length){
                        setTimeout(function(){$('.field-select-container').removeClass("expand");},1);
                    }
                });
            });
        });
    }
})(jQuery);
////=require components/anim.js
/**
 * Модуль плавающего хедера с функцией "показать/скрыть" при прокрутке
 */

(function ($) {
    var lst = 0;
    var defaults = {
        offset: 60, // Расстояние от верха страницы до хедера, с которого отключается фиксация.
        offFrom: 0 // Выключать фиксацию хедера начиная (исключая) с этого значения. 0 - не выключать (MobileFirst)
    };

    $.fn.floatHeader = function(opt){
        var options = $.extend(JSON.parse(JSON.stringify(defaults)), opt);
        var $hdr = this;
        var offset = $hdr.height() + options.offset;

        $(window).scroll(function(e){
            var $win = $(this);
            var ww = $win.width();

            if(options.offFrom > 0 && ww <= options.offFrom || options.offFrom == 0){
                var st = $win.scrollTop();
                var delta = lst - st;

                if (st > offset) {
                    $hdr.addClass('fix');
                } else {
                    $hdr.removeClass('fix up down');
                }

                if ($hdr.hasClass('fix')) {
                    if (delta > 0) {
                        $hdr.removeClass('down').addClass('up');

                        if ($(this).scrollTop() < $hdr.height() + offset) {
                            $hdr.removeClass('up').addClass('down');
                        }
                    } else if (delta < 0 && $hdr.hasClass('up')) {
                        $hdr.removeClass('up').addClass('down');
                    }
                }

                lst = st;
            }
        });

        return this;
    }
})(jQuery);
////=require components/tooltip.js
////=require components/inputFile.js

function getWH(){
    return (typeof window.outerHeight != 'undefined')?Math.max(window.outerHeight, $(window).height()):$(window).height();
}

$(function () {
    var $w = $(window);

    // Slick section
    if ($.fn.slick != undefined) {
        // Для добавления в слайдер счётчика слайдов.
        $('.countered').on('init', function (e, slick) {
            $(this).append('<span class="slider-counter">' + ((slick.currentSlide + 1) + ' / ' + slick.$slides.length) + '</span>');
        }).on('beforeChange', function (e, slick, curr, next) {
            $(this).find('.slider-counter').html((next + 1) + ' / ' + (slick.$slides.length));
        });

        $('.top-slider').slick({
            mobileFirst: true,
            arrows: false,
            dots: false,
            responsive: [
                {
                    breakpoint: BIG_WIDTH,
                    settings: {
                        dots: true,
                        arrows: true
                    }
                }
            ]
        });

        $('.partners-slider').slick({
            variableWidth: true,
            adaptiveHeight: false,
            mobileFirst: true,
            slidesToScroll: 1,
            slidesToShow: 5,
            infinite: true,
            dots: false,
            arrows: false,
            centerMode: true,
            autoplay: true,
            autoplaySpeed: 5000,
            responsive: [
                {
                    breakpoint: BIG_WIDTH,
                    settings: {
                        arrows: true
                    }
                }
            ]
        });

        $('.related-items-slider').slick({
            mobileFirst: true,
            slidesToScroll: 1,
            slidesToShow: 2,
            variableWidth: true,
            dots: false,
            arrows: false,
            responsive: [
                {
                    breakpoint: MEDIUM_WIDTH,
                    settings: {
                        slidesToShow: 3
                    }
                },
                {
                    breakpoint: BIG_WIDTH,
                    settings: {
                        slidesToShow: 4,
                        arrows: true
                    }
                }
            ]
        });

        $('.slick-slide').on('touchstart', function(){  });
    }

    if ($.fn.mask != undefined) {
        $('input[type=tel]').mask('+7 (999) 999-99-99');
    }

    $('.page-header').floatHeader(/*{offFrom: BIG_WIDTH}*/);
    $('.accordion').accordion({offScrollFrom: 0, multiple: false});
    $('.accordion-light').accordion({offScrollFrom: 0});

    $('.acc-sect .accordion-light').on('change',function(e){
        var $me = $(this);
        var $sect = $me.parents('.acc-sect');
        var $trig = $sect.prev().find('.acc-trig');
        var $accrds = $sect.children('.accordion-light');

        if($me.hasClass('expanded') && $accrds.filter('.expanded').length == $accrds.length){
            $trig.addClass('toggle');
        }else if($trig.hasClass('toggle')){
            $trig.removeClass('toggle');
        }
    });

    $('.acc-trig').click(function(e){
        var opn = $(this).toggleClass('toggle').hasClass('toggle');
        var $accrd = $(this).parent().next().children('.accordion-light');

        if(opn){
            $accrd.children('.accordion-content').slideDown(300);
            $accrd.addClass('expanded');
        }else{
            $accrd.children('.accordion-content').slideUp(300);
            $accrd.removeClass('expanded');
        }

        e.preventDefault();
    });

    $('.accordion-alt').accordion({offFrom: BIG_WIDTH + 1,offScrollFrom: 0});
    $('a.modal-open').modal('bindHref');
    $('button.modal-open').modal('bindData');
    $('.add-to-cart select,.cart-page select').fieldSelect();

    $(".add-to-cart").bind("DOMSubtreeModified", function(){
        var $sel = $(this).find('select');

        if(!$sel.hasClass('field-select-select')) $sel.fieldSelect();
    });

    $('.page-header .open-menu').click(function (e) {
        $('.page-header').addClass('expanded');

        $(document).on('click',function(ev){
            var $targ = $(ev.target);

            if(!$targ.hasClass('open-menu') && !$targ.hasClass('submenu') && !$targ.parents('.submenu').length){
                $('.page-header').removeClass('expanded');
                $(document).off('click');
            }
        });

        e.preventDefault();
    });

    $('.page-header .close-menu').click(function (e) {
        $('.page-header').removeClass('expanded');
        $(document).off('click');

        e.preventDefault();
    });

    $('.show-text').click(function (e) {
        var $targ = $($(this).attr('href'));
        $targ.toggleClass('visible');
        $(this).toggleClass('expand');

        e.preventDefault();
    });

    if ($.fn.mixItUp !== undefined) {
        $('.mix-main').mixItUp();
    }

    if ($('body').hasClass('catalog-item-page')) {
        var $w = $(window);
        var vw = $w.width();
        var vh = $w.height();
        var $rel = $('.related-items');
        var relp = $rel.offset().top;
        var $desc = $('.text-container');

        if (vw > BIG_WIDTH) {
            $w.on('scroll', function (e) {
                if ($w.scrollTop() + vh > relp) {
                    $desc.addClass('to-bottom');
                } else {
                    $desc.removeClass('to-bottom');
                }
            });
        }
    }

    if ($('body').hasClass('catalog-page')) {
        $('.filter-nav .filter').click(function (e) {
            $('body').animate({
                scrollTop: $('.mix-container').offset().top
            }, 700);
        });
    }

    // Поддержка svg-спрайтов для IE. Должна быть после всех скриптов
    if (navigator.userAgent.match(/Trident\/7.0/i)) {
        var spriteSheetName = "svg-symbols.svg";

        //(function (doc) {
        var xhr = new XMLHttpRequest();
        xhr.onload = function () {
            var body = document.getElementsByTagName('body')[0];
            var div = document.createElement('div');
            div.style.display = 'none';
            div.innerHTML = this.responseText;
            body.appendChild(div);
        };
        xhr.open('get', 'images/' + spriteSheetName, true);
        xhr.send();

        var svgs = document.getElementsByTagNameNS('http://www.w3.org/2000/svg', 'use');

        try {
            for (var v in svgs) {
                svgs[v].setAttributeNS('http://www.w3.org/1999/xlink', 'href', '#' + svgs[v].getAttributeNS('http://www.w3.org/1999/xlink', 'href').split('#')[1]);
            }
        } catch (er) {
            console.log(er.message);
        }
        //})(document);
    }
});

function CommonForm($scope, $http, url, callback) {
    return function () {
        $scope.submitProcess = true;
        $http.post(url, $scope.model)
            .then(function (resp) {
                $scope.resp = resp.data;
                $scope.submitProcess = false;
                if (callback) {
                    callback();
                }
            });
    }
}