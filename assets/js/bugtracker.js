$(function () {
    $('.bugtracker-tab').scrollbar();

    /*$('.bugtracker-id,.bugtracker-close').click(function(e){
        $('.bugtracker').toggleClass('open');
        e.preventDefault();
    });*/

    $('.bugtracker-nav > a').click(function(e){
        var bt = $('.bugtracker');
        var ind = $(this).index();

        bt.find('.bugtracker-nav .active,.bugtracker-content .active').removeClass('active');
        $(this).addClass('active');
        bt.find('.bugtracker-content > .bugtracker-tab').eq(ind).addClass('active');
        e.preventDefault();
    });

    $('.bugtracker-id').click(function(e){
        var text = $(this).find('b').text();

        var ta = document.createElement('textarea');
        ta.style.width = 0;
        ta.style.height = 0;
        ta.value = text;
        document.body.appendChild(ta);
        ta.select();

        try{
            document.execCommand('copy');
        }catch(er){
            console.log(er.message);
        }finally{
            document.body.removeChild(ta);
        }

        e.preventDefault();
    });
});