/**
 * Created by Administrator on 2016/7/16 0016.
 */
$(function(){
    var $start = $('#start'),
        $pause = $('#pause'),
        $alarm = $('#alarm');

    var imer = function(){
        var $minuteSet = $('#minuteSet'),
            $secondSet = $('#secondSet'),
            $minute = $('#minute'),
            $second = $('#second'),
            flag=0,
            timeInterval,
            mValue,
            sValue;
        var timeInterValFn = function(){
            if(mValue == 0 && sValue==20 ){
                $alarm.addClass("alarmYellow");
            }
            if(mValue == 0  && sValue==10 ){
                $alarm.addClass("alarmRed");
            }

            if(sValue){
                sValue--;

            }else{
                if(mValue == 0){
                    $("#timeOut").removeClass("timeDisplay");
                    $("#timeShow").addClass("timeDisplay");
                    clearInterval(timeInterval);
                }else{
                    sValue = 59;
                    mValue--;
                }
            }
            $minute.text(mValue);
            $second.text(sValue);
        };

        return {
            start:function(){
                if(flag){
                    var r = confirm("are you sure to restart time counting");
                    if( r == true){
                        clearInterval(timeInterval);
                        $pause.text("pause");
                        $alarm.removeClass('alarmYellow').removeClass('alarmRed');
                        $("#timeShow").removeClass("timeDisplay");
                        $("#timeOut").addClass("timeDisplay");
                    }
                }else{
                    flag=1;
                    $alarm.removeClass("timeDisplay");
                }
                mValue = $minuteSet.val() ? $minuteSet.val():0;
                sValue = $secondSet.val();
                $minute.text(mValue);
                $second.text(sValue);
                timeInterval =  setInterval(timeInterValFn,1000);
            },
            pause:function(){
                var pauseText = $pause.text();
                if(pauseText == "pause") {
                    clearInterval(timeInterval);
                    $pause.text("resume");
                }else{
                    timeInterval =  setInterval(timeInterValFn,1000);
                    $pause.text("pause");
                }
            }
        }
    };

    var timer = new imer();// 在没有构造函数时，timer中定义的局部变量都是私有的这样导致timeInterval等变量 无法共享
    $start.on('click',timer.start);
    $pause.on('click',timer.pause);
});