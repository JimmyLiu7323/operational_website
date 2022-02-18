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
    elem: '#LAY-product-manage',
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
      ,{field: 'ID', width: 200, title: '编号', sort: true}
      ,{field: 'Name', width: 100, title: '名称'}
      ,{field: 'CategoryName', title: '类目名称', width: 100}
      ,{field: 'Suppliers', width: 300, title: '供应商', templet:function(d){
         var  text = '';
         for (var i = 0; i < d.Suppliers.length; i++) {
            text += d.Suppliers[i][1] + ' ';
         }
         return text;
        }
      }
      ,{field: '设计ID ', title: '设计ID ', toolbar: '#table-userproduct-design'}
      ,{field:'Images', title:'图像', templet: function(d) {
        var imgLink = (d.Images.length != 0) ? d.Images[0].substring(1) : '';
        return'<div onclick="show_img(this)" ><img src="http://apitestserverjike.fhlxgzs.cn'+  imgLink +'" '+' alt="" width="50px" height="50px"></a></div>';
      }}
      ,{title: '操作', width: 300, align:'center', fixed: 'right', toolbar: '#table-userproduct-webuser'}
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
  table.on('tool(LAY-product-manage)', function(obj){
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
                layui.table.reload('LAY-product-manage'); //重载表格
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
                  layui.table.reload('LAY-product-manage'); //重载表格
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
                    layui.table.reload('LAY-product-manage'); //重载表格
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
                   layui.table.reload('LAY-product-manage'); //重载表格
                   layer.close(index); //执行关闭 
                }                
              });
              layui.table.reload('LAY-product-manage'); //重载表格
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
              layui.table.reload('LAY-product-manage'); //重载表格
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
              layui.table.reload('LAY-product-manage'); //重载表格
              layer.close(index); //执行关闭 
            });
          });
        }
      });
    }
  });

  exports('userproduct', {})
});