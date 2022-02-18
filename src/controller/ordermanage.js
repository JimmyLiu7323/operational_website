/**

 @Name：layuiAdmin 用户管理 管理员管理 角色管理
 @Author：star1029
 @Site：http://www.layui.com/admin/
 @License：LPPL
    
 */


layui.define(['table', 'form'], function(exports){
  var $ = layui.$
  ,admin = layui.admin
  ,view = layui.view
  ,table = layui.table
  ,form = layui.form;

  //用户管理
  table.render({
    elem: '#LAY-order-manage',
    height: 312,
    headers: { //通过 request 头传递
        'Authorization': 'Bearer ' + layui.data('layuiAdmin').access_token
    },
    url: 'http://apitestserverjike.fhlxgzs.cn/item_trophies?more_info=Suppliers,CategoryName',  
    parseData: function (res) { //res 即为原始返回的数据
      console.log('res');
      console.log(res);
      return {
        "code": res.code, //解析接口状态
        "msg": res.msg, //解析提示文本
        "count": res.data.Total, //解析数据长度
        "data": res.data.DataItems //解析数据列表
      };
    },    

    cols: [[
      {type: 'checkbox', fixed: 'left'}
      ,{field: '', width: 500, height: 500 , title: '订单内容', templet:function(d){
        return'<div class="layui-card-body"><div class="layui-collapse" lay-filter="component-panel"><div class="layui-colla-item"><h2 class="layui-colla-title">为什么JS社区大量采用未发布或者未广泛支持的语言特性？</h2><div class="layui-colla-content"><p>有不少其他答案说是因为JS太差。我下面的答案已经说了，这不是根本性的原因。但除此之外，我还要纠正一些对JS具体问题的误解。JS当初是被作为脚本语言设计的，所以某些问题并不是JS设计得差或者是JS设计者的失误。比如var的作用域问题，并不是“错误”，而是当时绝大部分脚本语言都是这样的，如perl/php/sh等。模块的问题也是，脚本语言几乎都没有模块/命名空间功能。弱类型、for-in之类的问题也是，只不过现在用那些老的脚本语言的人比较少，所以很多人都误以为是JS才有的坑。另外有人说JS是半残语言，满足不了开发需求，1999年就该死。半残这个嘛，就夸张了。JS虽然有很多问题，但是设计总体还是优秀的。——来自知乎@贺师俊</p></div></div></div></div>';
       }
     }  
      ,{field: '', width: 100, title: '数量'}
      ,{field: '', title: '收货人', width: 100}   
      ,{field: '', title: '总额', width: 100}   
      ,{field: '', title: '状态', width: 100}   
    
      ,{title: '操作', width: 300, align:'center', fixed: 'right', toolbar: '#table-ordermanage-webuser'}
    ]]
    ,request: {
        pageName: 'page', //页码的参数名称，默认：page
        limitName: 'page_size' //每页数据量的参数名，默认：limit
      },
    page: true
    , page: { curr: 1 }
    , limit: 10    
    ,height: 'full-320'
    ,text: '对不起，加载出现异常！'
  });

  //监听工具条
  table.on('tool(LAY-order-manage)', function(obj){
    var data = obj.data;
    console.log('data');
    console.log(data);
    if(obj.event === 'view'){
      admin.popup({
        title: '商品详情'
        ,area: ['550px', '700px']
        ,id: 'LAY-popup-user-add'
        ,success: function(layero, index){
          view(this.id).render('product/productViewForm', data).done(function(){
            form.render(null, 'layuiadmin-form-userproduct');
              form.on('submit(LAY-product-submit)', function(data){
                layui.table.reload('LAY-order-manage'); //重载表格
                layer.close(index); //执行关闭 
                console.log('close');
            });
          });
        },
        end: function () {//点睛之笔，此端代码便是精髓之处，layui监听到弹窗3的销毁（窗口关闭）之后回调了一个end函数，通过这个end函数我们就能刷新弹窗2的数据
            console.log('---end');
            window.parent.location.reload()
        }, 
      })
    }
    else if(obj.event === 'design'){
        admin.popup({
          title: '商品设计'
          ,area: ['600px', '700px']
          ,id: 'LAY-popup-user-design'
          ,success: function(layero, index){
            view(this.id).render('product/trophy_typesetting_index', data).done(function(){
              form.render(null, 'layuiadmin-form-userproductdesign');
                form.on('submit(LAY-product-submit)', function(data){
                  layui.table.reload('LAY-order-manage'); //重载表格
                  layer.close(index); //执行关闭 
                  console.log('close');
              });
            });
          },
          end: function () {//点睛之笔，此端代码便是精髓之处，layui监听到弹窗3的销毁（窗口关闭）之后回调了一个end函数，通过这个end函数我们就能刷新弹窗2的数据
              console.log('---end');
              window.parent.location.reload()
          }, 
      })
    }
    else if(obj.event === 'edit'){
      admin.popup({
        title: '编辑商品'
        ,area: ['550px', '700px']
        ,id: 'LAY-popup-user-edit'
        ,success: function(layero, index){
          view(this.id).render('product/productAddForm', data).done(function(){
            form.render(null, 'layuiadmin-form-userproduct');
            //console.log(data);
            //监听提交
            form.on('submit(LAY-product-submit)', function(data){
              var json = JSON.stringify(data.field);   
              console.log('edit');
              console.log(json);
              var ID = data.field.ID; 
              var Name = data.field.Name; 
              delete data.field.file;
              delete data.field.ID;     
              delete data.field.CategoryID;
              data.field.Length = parseInt(data.field.Length);
              data.field.Width = parseInt(data.field.Width);
              data.field.Height = parseInt(data.field.Height);  
              data.field.CostPrice = parseInt(data.field.CostPrice);              
              var imgArr = data.field.Images.split(",");              
              data.field.Images=imgArr;        
              var supplierIdArr = data.field.SupplierIDs.split(",");    
              data.field.SupplierIDs=supplierIdArr; 
              //console.log(data.field);
           
              var json2 = JSON.stringify(data.field);               
              console.log('json2');
              console.log(json2);
              //提交 Ajax 成功后，关闭当前弹层并重载表格
              //$.ajax({});
               $.ajax({
                  headers: { //通过 request 头传递
                    'Authorization': 'Bearer ' + layui.data('layuiAdmin').access_token
                  },
                  url: 'http://apitestserverjike.fhlxgzs.cn/item_trophies/' +ID,
                  dataType: 'json',
                  contentType: 'application/json',
                  data: json2,                  
                  type: "put",                
                  success: function (response) {
                    console.log('response');
                    console.log(response.data);
                    //layer.alert('Product ' + Name + ' has been successfully updated');
                    layer.open({
                      content: 'Product ' + Name + ' has been successfully updated'
                      ,btn: ['Confirm']
                      ,yes: function(index, layero){
                        //按钮【按钮一】的回调
                          console.log('1 clicked');
                          window.parent.location.reload();
                      }
                      ,cancel: function(){ 
                        //右上角关闭回调
                           console.log('cancel clicked');
                           window.parent.location.reload();
                        //return false 开启该代码可禁止点击该按钮关闭
                      }
                    });
                    layui.table.reload('LAY-order-manage'); //重载表格
                    layer.close(index); //执行关闭 
                },
                error: function(response, textStatus, errorThrown) {  
                   console.log(response);                   
                   
                   layer.open({
                      content: '{"status":"' + response.status + '","readyState":"' + response.readyState + '","textStatus":"' +response.statusText + '"}'
                      ,btn: ['Confirm']
                      ,yes: function(index, layero){
                        //按钮【按钮一】的回调
                          console.log('1 clicked');
                          window.parent.location.reload();
                      }
                      ,cancel: function(){ 
                        //右上角关闭回调
                           window.parent.location.reload();
                        //return false 开启该代码可禁止点击该按钮关闭
                      }
                    });
                   layui.table.reload('LAY-order-manage'); //重载表格
                   layer.close(index); //执行关闭 
                }                
              });
              layui.table.reload('LAY-order-manage'); //重载表格
              layer.close(index); //执行关闭 
            });
          });        
        },         
      });
    }
  });

  //管理员管理
  table.render({
    elem: '#LAY-user-back-manage'
    ,url: './json/useradmin/mangadmin.js' //模拟接口
    ,cols: [[
      {type: 'checkbox', fixed: 'left'}
      ,{field: 'id', width: 80, title: 'ID', sort: true}
      ,{field: 'loginname', title: '登录名'}
      ,{field: 'telphone', title: '手机'}
      ,{field: 'email', title: '邮箱'}
      ,{field: 'role', title: '角色'}
      ,{field: 'jointime', title: '加入时间', sort: true}
      ,{field: 'check', title:'审核状态', templet: '#buttonTpl', minWidth: 80, align: 'center'}
      ,{title: '操作', width: 150, align: 'center', fixed: 'right', toolbar: '#table-useradmin-admin'}
    ]]
    ,text: '对不起，加载出现异常！'
  });
  
  //监听工具条
  table.on('tool(LAY-user-back-manage)', function(obj){
    var data = obj.data;
    if(obj.event === 'del'){
      layer.prompt({
        formType: 1
        ,title: '敏感操作，请验证口令'
      }, function(value, index){
        layer.close(index);
        layer.confirm('确定删除此管理员？', function(index){
          console.log(obj)
          obj.del();
          layer.close(index);
        });
      });
    }else if(obj.event === 'edit'){
      admin.popup({
        title: '编辑管理员'
        ,area: ['420px', '450px']
        ,id: 'LAY-popup-user-add'
        ,success: function(layero, index){
          view(this.id).render('user/administrators/adminform', data).done(function(){
            form.render(null, 'layuiadmin-form-admin');
            
            //监听提交
            form.on('submit(LAY-user-back-submit)', function(data){
              var field = data.field; //获取提交的字段

              //提交 Ajax 成功后，关闭当前弹层并重载表格
              //$.ajax({});
              layui.table.reload('LAY-order-manage'); //重载表格
              layer.close(index); //执行关闭 
            });
          });
        }
      });
    }
  });

  //角色管理
  table.render({
    elem: '#LAY-user-back-role'
    ,url: './json/useradmin/role.js' //模拟接口
    ,cols: [[
      {type: 'checkbox', fixed: 'left'}
      ,{field: 'id', width: 80, title: 'ID', sort: true}
      ,{field: 'rolename', title: '角色名'}
      ,{field: 'limits', title: '拥有权限'}
      ,{field: 'descr', title: '具体描述'}
      ,{title: '操作', width: 150, align: 'center', fixed: 'right', toolbar: '#table-useradmin-admin'}
    ]]
    ,text: '对不起，加载出现异常！'
  });
  
  //监听工具条
  table.on('tool(LAY-user-back-role)', function(obj){
    var data = obj.data;
    if(obj.event === 'del'){
      layer.confirm('确定删除此角色？', function(index){
        obj.del();
        layer.close(index);
      });
    }else if(obj.event === 'edit'){
      admin.popup({
        title: '添加新角色'
        ,area: ['500px', '480px']
        ,id: 'LAY-popup-user-add'
        ,success: function(layero, index){
          view(this.id).render('user/administrators/roleform', data).done(function(){
            form.render(null, 'layuiadmin-form-role');
            
            //监听提交
            form.on('submit(LAY-user-role-submit)', function(data){
              var field = data.field; //获取提交的字段

              //提交 Ajax 成功后，关闭当前弹层并重载表格
              //$.ajax({});
              layui.table.reload('LAY-order-manage'); //重载表格
              layer.close(index); //执行关闭 
            });
          });
        }
      });
    }
  });

  exports('ordermanage', {})
});