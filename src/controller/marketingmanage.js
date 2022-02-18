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
    elem: '#LAY-marketing-manage',
    headers: { //通过 request 头传递
        'Authorization': 'Bearer ' + layui.data('layuiAdmin').access_token
    },
    url: 'http://apitestserverjike.fhlxgzs.cn/marketing_trophys',
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
      ,{field: 'Name', width: 150, title: '名称'}
      ,{field: '奖盃', width: 100, title: '类目', templet:function(d){
         var  text = '奖盃';
         return text;
        }
      }
      ,{field: 'UserPlatform', width: 180, title: '用户平台', templet:function(d){
         var text = '';
         if(d.UserPlatform == '1'){
          text = '运营端网站用户';
         }else if (d.UserPlatform == '2'){
          text = '绩刻微信小程序';
         }else if(d.UserPlatform == '3'){
          text = '绩刻百度小程序';
         } 
         return text;
        }
      }
      ,{field: 'CreatedTime', title: '创建时间', width:250}
      ,{field: 'IsActive', title: '状态', width:500, templet:function(d){
         var text = '';
         if(d.IsActive == true){
          text = '活动中';
         }else{
          text = '已下线';
         }
         return text;
        }
      }
      ,{title: '操作', width: 300, align:'center', fixed: 'right', toolbar: '#table-marketingManage-webuser'}
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
  
  var rowData = null;
  //监听工具条
  table.on('tool(LAY-marketing-manage)', function(obj){
    var data = obj.data;
    if(obj.event === 'view'){
      console.log('ready for view');
      admin.popup({
        title: '营销活动管理详情'
        ,area: ['800px', '700px']
        ,id: 'LAY-popup-user-add'
        ,success: function(layero, index){
          view(this.id).render('marketing/viewMarketingActivity', data).done(function(){
            form.render(null, 'layuiadmin-form-addMarketingActivity');
              form.on('submit(LAY-marketing-submit)', function(data){                
                layui.table.reload('LAY-marketing-manage'); //重载表格
                layer.close(index); //执行关闭 
            });
          });
        },
        end: function () {//点睛之笔，此端代码便是精髓之处，layui监听到弹窗3的销毁（窗口关闭）之后回调了一个end函数，通过这个end函数我们就能刷新弹窗2的数据
            console.log('---end');
            window.parent.location.reload()
        }, 
      })
    } else if(obj.event === 'edit'){
      console.log('ready for edit');
      var productCount = 0, skuIDs = [];
      admin.popup({
        title: '编辑营销活动管理'
        ,area: ['800px', '700px']
        ,id: 'LAY-popup-user-add'
        ,success: function(layero, index){
          view(this.id).render('marketing/addMarketingActivity', data).done(function(){
            form.render(null, 'layuiadmin-form-addMarketingActivity');
            console.log('data');
            console.log(data);
            rowData = data;
            //监听提交
            form.on('submit(LAY-marketing-submit)', function(data){
              console.log('submit');
              console.log(data.field);
              var myArr = JSON.parse(data.field['ArrList']);
              var img = JSON.parse(data.field['Image']);
              var productName = JSON.parse(data.field['ProductName']);
              var costPrice = JSON.parse(data.field['CostPrice']);
              var quantity = JSON.parse(data.field['Quantity']);
              var activeStatus = JSON.parse(data.field['ActiveStatus']);
              var adArr = JSON.parse(data.field['AdArr']); 
              var allowDisplayOfAllItemsJumpLink = JSON.parse(data.field['AllowDisplayOfAllItemsJumpLink']); 
              var defaultt = JSON.parse(data.field['Default']); 
              var userPlatform = JSON.parse(data.field['UserPlatform']); 
              var name = data.field['Name']; 

              console.log('myArr');
              console.log(myArr);
              console.log('Image');
              console.log(img);              
              console.log('productName');
              console.log(productName);
              console.log('costPrice');
              console.log(costPrice);
              console.log('quantity');
              console.log(quantity);
              console.log('rowData');              
              console.log(rowData);

              async function update(skuID, sku) { 
                return await 
                    $.ajax({
                        headers: { //通过 request 头传递
                          'Authorization': 'Bearer ' + layui.data('layuiAdmin').access_token
                        },
                        url: 'http://apitestserverjike.fhlxgzs.cn/marketing_trophy_skus/' + skuID,
                        dataType: 'json',
                        data:  JSON.stringify(sku),                  
                        type: 'put',         
                        contentType: "application/json",      
                        success: function (response) {
                          if(response.msg == 'ok'){
                            console.log('update success');  
                            console.log(response)
                            console.log(skuIDs);
                            skuIDs.push(response.data);
                          }                                                     
                        },error: function(error){
                          console.log('error');
                          console.log(error);
                          layer.alert('Something went wrong when update record! Please contact Administrator');
                        }
                    });
              }

              async function add(sku) { 
                return await 
                    $.ajax({
                      headers: { //通过 request 头传递
                        'Authorization': 'Bearer ' + layui.data('layuiAdmin').access_token
                      },
                      url: 'http://apitestserverjike.fhlxgzs.cn/marketing_trophy_skus',
                      dataType: 'json',
                      data:  JSON.stringify(sku),                  
                      type: 'post',         
                      contentType: "application/json",      
                      success: function (response) {
                        if(response.msg == 'ok'){
                          skuIDs.push(response.data);                          
                          console.log('skuIDs123');
                          console.log(skuIDs);
                          console.log('productCount2');
                          console.log(productCount);
                          if(skuIDs.length == productCount){   
                            for (var i = rowData.SkuIDs.length - 1; i >= 0; i--) {
                                skuIDs.splice(0,0,rowData.SkuIDs[i]); 
                            }                                                     
                          }
                          console.log(skuIDs);
                          //isLoopDone = true;
                        }
                      },error: function(error){
                        console.log('error');
                        console.log(error);
                        layer.alert('Something went wrong when update record! Please contact Administrator');
                      }
                    });
              }

              async function run() {
                for(var i = 0; i < myArr.length; i++){
                   if(myArr[i].ItemID != null){
                      var sku = {
                        "ItemID" :myArr[i].ItemID,
                        "ImageUrl" : myArr[i].ImageUrl,
                        "Name" : productName[i],
                        "CostPrice" : costPrice[i],
                        "Quantity" : quantity[i],
                        "InitialDesignID" : "1234"
                      }
                    console.log('skuId');
                    console.log(rowData.SkuIDs[i]);  
                    await update(rowData.SkuIDs[i], sku);
                   }else{
                      productCount++;
                      var sku = {
                        "ItemID" :　myArr[i].ID,
                        "ImageUrl" : img[i],
                        "Name" :  productName[i],
                        "CostPrice" : costPrice[i],
                        "Quantity" : quantity[i],
                        "InitialDesignID" : "1234"
                      }
                      console.log('sku');
                      console.log(sku);
                      await add(sku);
                   }
                  
                }
                console.log('readyToHit');
                console.log('skuIDs');
                console.log(skuIDs);
                console.log('activeStatus');
                console.log(activeStatus);
                console.log('adArr');
                console.log(adArr);
                console.log('allowDisplayOfAllItemsJumpLink');
                console.log(allowDisplayOfAllItemsJumpLink);
                console.log('defaultt');
                console.log(defaultt);
                console.log('userPlatform');
                console.log(userPlatform);
                console.log('name');
                console.log(name);
                console.log('rowData');
                console.log(rowData);
                console.log('rowData.ID');
                console.log(rowData.ID);
                  var obj = {
                    "Name": name,
                    "UserPlatform": userPlatform.toString(),
                    "IsActive": (activeStatus == 1)?true:false,
                    "IsDefault": defaultt,
                    "AllowDisplayOfAllItemsJumpLink": allowDisplayOfAllItemsJumpLink,
                    "SkuIDs": skuIDs,
                    "Advertisements": adArr
                  }
                  console.log('obj');
                  console.log(obj);
                $.ajax({
                  headers: { //通过 request 头传递
                    'Authorization': 'Bearer ' + layui.data('layuiAdmin').access_token
                  },
                  url: 'http://apitestserverjike.fhlxgzs.cn/marketing_trophys/' + rowData.ID,
                  dataType: 'json',
                  data:  JSON.stringify(obj),                  
                  type: 'put',         
                  contentType: "application/json",      
                  success: function (response) {
                    console.log('response');
                    console.log(response);
                    if(response.msg == 'ok'){
                      //layer.alert('The Product has been updated successfully');
                        layer.open({
                        content: 'Product has been successfully updated'
                        ,btn: ['Confirm']
                        ,yes: function(index, layero){
                          //按钮【按钮一】的回调
                            console.log('1 clicked');
                            window.parent.location.reload();
                        }
                        ,cancel: function(){ 
                          //右上角关闭回调
                          console.log('2 clicked');
                          window.parent.location.reload();
                          //return false 开启该代码可禁止点击该按钮关闭
                        }
                      });
                      layui.table.reload('LAY-marketing-manage'); //重载表格
                      //console.log('I am refresh');
                      layer.close(index); //执行关闭 
                    }
                  },
                  error: function(response, textStatus, errorThrown){
                    console.log(response);
                    //layer.alert('Something went wrong');
                      layer.open({
                      content: 'Something went wrong'
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
                  }
                });
              }
              run();                

               layui.table.reload('LAY-marketing-manage'); //重载表格
               layer.close(index); //执行关闭 
               console.log('close');
            });
            console.log('close');
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

  exports('marketingmanage', {})
});