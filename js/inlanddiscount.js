/*
 * @Author: zhengwei
 * @Date:   2016-10-24 22:14:54
 * @Last Modified by:   zhengwei
 * @Last Modified time: 2016-11-28 21:23:36
 */

'use strict';
$(function() {
    // $(document).height()  整个文档的高度
    // $(window).scrollTop()  滚动条距离顶部的高度
    // window.screen.availHeight 可视窗口的高度,也就是手机屏幕的高度
    //为实现懒加载,用于临时存放数据的对象
    var newData = {
        result:[]
    }
    //存放从服务器一次性拿回来的所有数据
    var totalData = [];
    //页面高度与可视窗口的高度差
    var height;
    $.ajax({
        url: "http://mmb.ittun.com/api/getinlanddiscount",
        success: function (data) {
            //将拿回来的数据存放到本地
            totalData = totalData.concat(data.result)
            //取出4条数据,存放到临时缓存当中.用于渲染页面
            for(var i  = 0 ; i < 4; i++){
                newData.result.push(totalData[i]);
            }
            //拼接模板
            var view = template("discountProductTmp", newData);
            //将拼接好的模板,渲染页面上
            $('.inland-discount-list').html(view);
            //隐藏加载动画
            $(".loading").hide()
            //重新计算页面高度与可视窗口的高度差
            height = $(document).height()-window.screen.availHeight;

        }
    })

   /*
    监听滚动条滚动事件
   * */
    $(window).on('scroll',function(){
        // 判断是否到达底部
        if(height==$(window).scrollTop()){
            console.log('到底了')
            //展示加载动画
            $(".loading").show();
            //判断是否加载完所有数据,当加载完所有数据时,不在添加数据并隐藏加载动画
            if(newData.result.length==totalData.length){
                console.log('没有数据了')
                $(".loading").hide();
                return;
            }else{
                //如果还没有架子啊完全部数据,则据需添加数据,并渲染
                // settimeout是为了让加载动画展示出来,额外添加的延迟.否则因为数据添加太快,会看不到动画
                setTimeout(function(){
                    for(var j = 0 ; j < 4; j++){
                        //因为每一个添加之后,newData.result的length会增加,所以不需要加 J
                        newData.result.push(totalData[newData.result.length]);
                    }
                    var view = template("discountProductTmp", newData);
                    $('.inland-discount-list').html(view);
                    $(".loading").hide();
                    // 渲染完成之后,重新计算高度差
                    height = $(document).height()-window.screen.availHeight;
                },1000)

            }

        }

    })
});
