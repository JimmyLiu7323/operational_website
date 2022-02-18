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
    elem: '#LAY-supplier-manage',
    headers: { //通过 request 头传递
        'Authorization': 'Bearer ' + layui.data('layuiAdmin').access_token
    },
    url: 'http://apitestserverjike.fhlxgzs.cn/suppliers',
    parseData: function (res) { //res 即为原始返回的数据
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
      ,{field: 'Name', width: 100, title: '供应商名称'}
      ,{field: 'CategoryName', title: '类目名称', width: 100}
      ,{field: 'Contacts', width: 100, title: '联繫人'}
      ,{field: 'ContactNumber', title: '联繫电话', width:500}
      ,{title: '操作', width: 300, align:'center', fixed: 'right', toolbar: '#table-usersupplier-webuser'}
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
  table.on('tool(LAY-supplier-manage)', function(obj){
    var data = obj.data;
    if(obj.event === 'view'){
      admin.popup({
        title: '供应商详情'
        ,area: ['450px', '400px']
        ,id: 'LAY-popup-user-add'
        ,success: function(layero, index){
          view(this.id).render('supplier/viewuserform', data).done(function(){
            form.render(null, 'layuiadmin-form-admin');
              form.on('submit(LAY-supplier-submit)', function(data){
                layui.table.reload('LAY-supplier-manage'); //重载表格
                layer.close(index); //执行关闭 
            });
          });
        }
      })
    } else if(obj.event === 'edit'){
      admin.popup({
        title: '编辑供应商'
        ,area: ['450px', '400px']
        ,id: 'LAY-popup-user-add'
        ,success: function(layero, index){
          view(this.id).render('supplier/userform', data).done(function(){
            form.render(null, 'layuiadmin-form-supplier');
            //console.log(data);
            //监听提交
            form.on('submit(LAY-supplier-submit)', function(data){
              //提交 Ajax 成功后，关闭当前弹层并重载表格
              //$.ajax({});
              data.field.CategoryID = parseInt(data.field.CategoryID);
              var json = JSON.stringify(data.field);   
              console.log('json');
              console.log(json);
              //提交 Ajax 成功后，关闭当前弹层并重载表格
              //$.ajax({});
              $.ajax({
                  headers: { //通过 request 头传递
                    'Authorization': 'Bearer ' + layui.data('layuiAdmin').access_token
                  },
                  url: 'http://apitestserverjike.fhlxgzs.cn/suppliers/' + data.field.ID,
                  dataType: 'json',
                  data: json,                  
                  type: "put",                
                  success: function (response) {
                    console.log(response);
                    layer.alert('Supplier ' + response.data.Name + ' has been successfully updated');
                    layui.table.reload('LAY-supplier-manage'); //重载表格
                    layer.close(index); //执行关闭 
                },
                error: function(response, textStatus, errorThrown) {
                   console.log(response);
                   layer.alert('Something went wrong when saving the record! Please contact Administrator');
                   layui.table.reload('LAY-supplier-manage'); //重载表格
                   layer.close(index); //执行关闭 
                }
              });
              layui.table.reload('LAY-supplier-manage'); //重载表格
              layer.close(index); //执行关闭 
            });
          });
        }
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
              layui.table.reload('LAY-user-back-manage'); //重载表格
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
              layui.table.reload('LAY-user-back-role'); //重载表格
              layer.close(index); //执行关闭 
            });
          });
        }
      });
    }
  });

  exports('usersupplier', {})
});