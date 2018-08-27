h5a-tracking
==

1. 复用了 Google Analytics 的加载机制，向页面上注入了一个全局变量 `h5a`
2. 在被实际的埋点代码异步加载并替换之前，它是一个类数组，将事件暂存；初始化时积压的事件会被发送

[UglifyJS 3](https://skalman.github.io/UglifyJS-online/)
