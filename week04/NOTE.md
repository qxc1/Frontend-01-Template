2020年4月30日 课程总结

-----------

* JavaScript | 结构化

>事件循环

    

        感性认识就是宿主环境执行js代码的一种机制，这个宿主可能是node也可能是浏览器，js引擎本身是没有事件循环这件事的，它是一个单线程的运行机制。

        宿主环境每次执行的js代码都会形成一个宏任务层次，在每个宏任务中，js代码都可能产生代码，无论是同步代码还是异步代码，都是由js引擎发起的微任务，这些微任务聚合在一起，组成了一个宏任务。

        宏任务有优先级之说，但在同一个宏任务内的微任务，只按入队的顺序来执行，微任务没有优先级之说。

>如何分析一段js代码的异步执行顺序：

        1、首先分析有多少段宏任务
        2、在每个宏任务中，分析有多少个微任务
        3、根据初始化阶段，确定宏任务中的微任务的执行阶段
        4、根据宏任务的触发规则和初始化，确定宏任务的执行顺序
        5、确定整个代码的执行预定

>宏任务

        1、脚本，渲染事件（如解析DOM，计算布局，布局）
        2、mousemove等UI事件，用户互动事件（如鼠标点击，滚动页面，放大缩小等）
        3、setTimeout / setInterval当JS引擎忙于执行宏任务时，宏任务就会形成一个
        副本，直到上一个宏任务执行完成，才会继续执行宏任务标题中的任务。例如，当
        JS、引擎忙于执行外部脚本脚本时，此时界面触发了鼠标移动事件，然后又触发了计
        时器，这时候，鼠标移动事件和计时器会形成宏任务变量，等待执行。
        4、JavaScript脚本执行事件；网络请求完成，文件读写完成事件。为了协调这些任务有条不扭曲地在主线程上执行，页面进程重新启动消息事件和事件循环机制，渲染内部会维护多个消息变量，而不连续进行。然后将主线程采用一个进行循环，不断地从这些任务中取任务并执行任务。我们把这些消息本身的任务称为宏任务。

>微任务

        微任务就是一个需要异步执行的函数，执行时机是在主函数执行结束之后，当前宏任
        务结束之前。
        1、微任务和宏任务是绑定的，每个宏任务在执行时，会创建自己的微任务副本
        2、一些一个宏任务在执行过程中，产生了100个微任务，执行每个微任务的时间是10
           毫秒，那么执行这100个微任务的时间。就是1000毫秒，也可以说这100个微任务
           让宏任务的执行时间延长了1000毫秒。所以你在写代码的时候一定要注意控制微
           任务的执行时长。
        3、在一个宏任务中，分别创建一个用于替代的宏任务和微任务，无论什么情况下，
           微任务都早于宏任务执行
