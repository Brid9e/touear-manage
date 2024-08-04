<template lang="pug">
div
  HeadOperation
    el-input(:prefix-icon="Search" v-model='pageInfo.sno', placeholder='通过学号筛选' @keydown.enter="inquire")
    el-button(:icon="Search" type='primary' @click='inquire') 查询
    el-button(:icon="Refresh" @click="reset") 重置
    template(#right)
      el-button(type="primary" :icon="Plus"  @click="add('添加用户')", :disabled="!state.funcButton.systemUserAddUser") 添加用户
      //- el-button(type="primary" :icon="Refresh"  @click="synchronousPhotos('批量照片同步')" :disabled="!state.funcButton.systemUserSync" ) 批量照片同步
    template(#fold)
      el-form(:label-width="80" :model="pageInfo" inline)
        el-row
          el-col(:xs="12", :sm="12", :md="8", :lg="6", :xl="4")
            el-form-item(label="登录名")
              el-input(v-model='pageInfo.account', placeholder='请输入关键字' @keydown.enter="inquire")
          el-col(:xs="12", :sm="12", :md="8", :lg="6", :xl="4")
            el-form-item(label="姓名")
              el-input(v-model='pageInfo.name', placeholder='请输入关键字' @keydown.enter="inquire")
          el-col(:xs="12", :sm="12", :md="8", :lg="6", :xl="4")
            el-form-item(label="身份证号")
              el-input(v-model='pageInfo.idNumber', placeholder='请输入关键字' @keydown.enter="inquire")
          el-col(:xs="12", :sm="12", :md="8", :lg="6", :xl="4")
            el-form-item(label="手机号")
              el-input(v-model='pageInfo.mobile', placeholder='请输入关键字' @keydown.enter="inquire")
          el-col(:xs="12", :sm="12", :md="8", :lg="6", :xl="4")
            el-form-item(label="邮箱")
              el-input(v-model='pageInfo.email', placeholder='请输入关键字' @keydown.enter="inquire")
          el-col(:xs="12", :sm="12", :md="8", :lg="6", :xl="4")
            el-form-item(label="身份")
              el-select(v-model="pageInfo.identityCode" placeholder="请选择" style="width: 100%")
                el-option(v-for="item in initSelect.identitySelect.data" :key="item.code" :label="item.name", :value="item.code")
          el-col(:xs="12", :sm="12", :md="8", :lg="6", :xl="4")
            el-form-item(label="角色")
              el-select(v-model="pageInfo.roleId" placeholder="请选择" style="width: 100%")
                el-option(v-for="item in initSelect.roleSelect.data" :key="item.roleId" :label="item.roleName", :value="item.roleId")
          el-col(:xs="12", :sm="12", :md="8", :lg="6", :xl="4")
            el-form-item(label="设备")
              el-select(v-model="pageInfo.bindEquipment" placeholder="请选择" style="width: 100%")
                el-option(v-for='(item, i) in bindEAStatus', :label='item.label', :value='item.value', :key='item.value')
          el-col(:xs="12", :sm="12", :md="8", :lg="6", :xl="4")
            el-form-item(label="一卡通")
              el-select(v-model="pageInfo.bindAccount" placeholder="请选择" style="width: 100%")
                el-option(v-for='(item, i) in bindEAStatus', :label='item.label', :value='item.value', :key='item.value')
          //- el-col(:xs="12", :sm="12", :md="8", :lg="6", :xl="4")
          //-   el-form-item
          //-     el-button(:icon="Search" type='primary' @click='inquire') 查询
          //-     el-button(:icon="Refresh" @click="reset") 重置

  el-table(:data="tableData" v-loading="tableLoading")
    //- el-table-column(type="expand")
      template(#default="{ row }")
        el-descriptions(title="更多", :column="2" style="border-left: none;padding: 1rem 2rem")
          el-descriptions-item(label="ID：") {{ row.id }}
          el-descriptions-item(label="性别：") {{ row.sex === 1 ? '男':'女' }}
          el-descriptions-item(label="角色：") {{ useRole?.[row.id] || '暂无'}}
          el-descriptions-item(label="身份：") {{ row.identityNames || '暂无'}}
          el-descriptions-item(label="身份证号：") {{ row?.idNumber?.replace(/^(.{4})(?:\d+)(.{4})$/, "$1************$2") || '暂无'}}
          el-descriptions-item(label="部门：") {{ row.departmentNames || '暂无'}}
          el-descriptions-item(label="专业：") {{ row.professionName || '暂无'}}
          el-descriptions-item(label="邮箱：") {{ row.email || '暂无'}}
          el-descriptions-item(label="创建时间：") {{ row.createTime || '暂无'}}
          el-descriptions-item(label="更新时间：") {{ row.updateTime || '暂无'}}
        //- el-descriptions(title="所属群组", style="border-left: none;padding: 1rem 2rem")
        .el-descriptions__title(style="padding: 0 2rem 1rem 2rem") 所属群组
        el-table(:data='tableGroupData', border, style="margin: 0 2rem 1rem 2rem;width:auto", :stripe="true")
          el-table-column(label='群组ID' prop='id')
          el-table-column(label='群组名称' prop='name')
          el-table-column(prop="status" label="状态")
            template(#default="scope")
              p(v-if="scope.row.status === 1") 正常
              p(v-else) 禁用
          el-table-column(prop="type" label="类型" )
            template(#default="scope")
              p(v-if="scope.row.type === 'user'") 用户
              p(v-if="scope.row.type === 'mercacc'") 商户
              p(v-if="scope.row.type === 'visitor'") 游客
          //- el-table-column(prop="flag0" label="默认群组")
          //-   template(#default="scope")
          //-     p(v-if="scope.row.flag0 === '1'") 是
          //-     p(v-else) 否
          el-table-column(prop="createTime" label="创建时间")
          el-table-column(prop="remark" label="描述" )
    //- el-table-column(label="序号" type="index" align="center" width="56")
    el-table-column(label="编号" prop="id" align="center" width="80")
    //- el-table-column(prop="avatar" label="照片" width="56" )
    //-   template(#default="scope")
    //-     el-image.useavatar(shape="square" :size="30" fit="contain" :src="imageFor + scope.row.avatar")
    //-       template(#error)
    //-         el-icon(:size="20")
    //-           Picture
    el-table-column(prop="name" label="姓名")
    el-table-column(prop="account" label="登录名" show-overflow-tooltip)
    el-table-column(prop="sno" label="学号" show-overflow-tooltip)
    el-table-column( label="手机号" show-overflow-tooltip)
      template(#default="scope")
        //- span {{scope.row.mobile.replace(/^(.{3})(?:\d+)(.{2})$/, "$1*****$2") }}
        span {{scope.row?.mobile?.replace(/^(.{3})(?:\d+)(.{2})$/, "$1*****$2") || ''}}
    el-table-column(prop="status" label="状态" width="100" align="center" v-if="userInfo.account == 'admin'")
      template(#default="scope")
        el-switch(:disabled="!state.funcButton.systemUserEdit",v-model="scope.row.status"  :active-value='1' :inactive-value='0' @change="val => changeStatus(val, scope.row)")
    //- el-table-column( label="一卡通绑定" width="100")
      template(#default="scope")
    //- el-table-column( label="第三方设备绑定" width="130")
      template(#default="scope")
        el-button(:disabled="!state.funcButton.systemUserEquipment",type="primary", link, :href="null", @click="bindEquipment(scope.$index, scope.row)") 绑定
    el-table-column(label="操作" width="200" )
      template(#default="scope")
        //- el-button(type="info", link)
        //- el-dropdown(trigger="hover")
        //-   span.el-dropdown-link 更多操作
        //-   template(#dropdown='')
        //-     el-dropdown-menu
        //-       el-dropdown-item(:disabled="!state.funcButton.systemUserSynchron",@click="synchronousPhoto(scope.$index, scope.row)") 同步信息
        //-       el-dropdown-item(:disabled="!state.funcButton.systemUserBind",divided @click="setAccountUser(scope.$index, scope.row)") 一卡通绑定
        //-       el-dropdown-item(:disabled="!state.funcButton.systemUserEquipment",divided @click="bindEquipment(scope.$index, scope.row)") 第三方绑定
        //- i.el-icon-arrow-down
        el-button(type="primary", link, @click="onExpandsRow(scope.row)") 查看
        el-button(:disabled="!state.funcButton.systemUserEdit",type="primary", link, @click="edit(scope.$index, scope.row)") 编辑
        el-button(:disabled="!state.funcButton.systemUserRemove",type="danger", link, @click="handleRemove(scope.$index, scope.row)") 删除
        MoreHandle
          el-button(:disabled="!state.funcButton.systemUserBind",type="primary", link, :href="null", @click="setAccountUser(scope.$index, scope.row)") 一卡通绑定
          el-button(:disabled="!state.funcButton.systemUserEquipment",type="primary", link, :href="null", @click="bindEquipment(scope.$index, scope.row)") 第三方设备绑定
          el-button(:disabled="!state.funcButton.systemUserSynchron",type="primary", link, @click="synchronousPhoto(scope.$index, scope.row)") 同步信息
          el-button(:disabled="!state.funcButton.systemUserTerminal",type="primary", link, @click="platTypeDebug(scope.$index, scope.row)") 终端调试

  .flex-center
    el-pagination(
      @size-change='handleSizeChange'
      @current-change='handleCurrentChange'
      :current-page='pageInfo.current'
      :page-sizes='[10, 30, 50, 100]'
      :page-size='pageInfo.size'
      layout="total, sizes, prev, pager, next, jumper"
      background
      :total='total')

  //- 查看
  el-drawer(v-model="showDrawer" size="50%")
    template(#title)
      h1 查看
    el-descriptions(:column="2" title="基本信息")
      el-descriptions-item(label="ID") {{ rowItem.id }}
      el-descriptions-item(label="性别") {{ rowItem.sex === 1 ? '男':'女' }}
      el-descriptions-item(label="角色") {{ useRole?.[rowItem.id] || '暂无'}}
      el-descriptions-item(label="身份") {{ rowItem.identityNames || '暂无'}}
      el-descriptions-item(label="身份证号") {{ rowItem?.idNumber?.replace(/^(.{4})(?:\d+)(.{4})$/, "$1************$2") || '暂无'}}
      el-descriptions-item(label="部门") {{ rowItem.departmentNames || '暂无'}}
      el-descriptions-item(label="专业") {{ rowItem.professionName || '暂无'}}
      el-descriptions-item(label="邮箱") {{ rowItem.email || '暂无'}}
      el-descriptions-item(label="创建时间") {{ rowItem.createTime || '暂无'}}
      el-descriptions-item(label="更新时间") {{ rowItem.updateTime || '暂无'}}
    el-descriptions(:column="1" title="所属群组" style="margin-top: 20px;")
    el-table(:data='tableGroupData', :stripe="true")
      el-table-column(label='编号' prop='id' width="80" align="center")
      el-table-column(label='群组名称' prop='name')
      el-table-column(prop="status" label="状态")
        template(#default="scope")
          p(v-if="scope.row.status === 1") 正常
          p(v-else) 禁用
      el-table-column(prop="type" label="类型")
        template(#default="scope")
          p(v-if="scope.row.type === 'user'") 用户
          p(v-if="scope.row.type === 'mercacc'") 商户
          p(v-if="scope.row.type === 'visitor'") 游客
      el-table-column(prop="createTime" label="创建时间")
      el-table-column(prop="remark" label="描述" )
  el-dialog(:title="dialogTit" v-model="showAdd" @closed="closed")
    el-tabs(v-model="activeName"  @tab-click="handleClick" type="card" :class=" isEdit === 1 ?'' :'isAdmin'")
      div(style=" height: 50vh")
        el-scrollbar
          el-tab-pane(label="用户信息" name="first")
            el-form(:model='addUserForm' :rules="formItemRules" ref="formRef" label-width="100px" label-position="right",autocomplete="off",:validate-on-rule-change='false')
              //- el-col(:xs="24" :sm="12" :md="8" :lg="6" :xl="6")
              //- el-form-item(label="照片" prop='avatar')
              //-   .upload-box
              //-     .upload-hd
              //-       el-upload.avatar-uploadered(ref='imgFileRef' v-model="imageFile", action="#", :show-file-list="false", :limit="1",:http-request="httpRequest", :before-upload="avatarBeforeUpload", :on-exceed="avatarHandleExceed",)
              //-         i.avatar-uploadered-icon(v-if="!addUserForm.avatar")
              //-           el-icon(:size="30")
              //-             Plus
              //-           span 点击上传
              //-         .images-box(v-else)
              //-           el-image(:src="addUserForm.avatar", style="width: 100px; height: 100px", :fit="fill")
              //-             template(#error="")
              //-               el-icon(:size="20")
              //-                 Picture
              //-     el-row.handle-bar(:gutter="0", v-if="addUserForm.avatar")
              //-       el-col.text-danger.text-center( :span="24", @click="deleteImg(index)") 删除
              //-   el-alert.avatar-alert(title="上传图片支持 JPG / JPEG / PNG  格式，大小不超过 1M，建议尺寸为 100*100", type="info", show-icon, :closable="false")
              el-form-item(label="学/工号" prop='sno')
                el-input(:disabled="isEdit === 1 ? true : false" v-model="addUserForm.sno", placeholder="请输入学/工号")
              el-form-item(label="姓名" prop='name')
                el-input(v-model="addUserForm.name", placeholder="请输入姓名")
              el-form-item(label="性别" prop='sex')
                el-radio-group(v-model="addUserForm.sex")
                  el-radio-button(label="1" ) 男
                  el-radio-button(label="2") 女
              el-form-item(label="用户名" prop='account')
                el-input(:disabled="isEdit === 1 ? true : false" v-model="addUserForm.account", placeholder="请输入用户名", type="text")
                el-input( style="position: fixed;bottom: -9999px;" type="text")
              el-form-item(v-if="isEdit === 0" label="登录密码" prop='password')
                //- el-input( style="position: fixed;bottom: -9999px;" type="password")
                el-input( style="position: fixed;bottom: -9999px;" type="password")
                el-input(v-model="addUserForm.password", placeholder="请输入登录密码" type="password" show-password autocomplete="new-password")
                PasswordStrengthChecker(:password="addUserForm.password" @backRules="onBackRules")
              el-form-item(v-if="isEdit === 0" label="重复密码" prop='passwordConfirm')
                el-input( v-model="addUserForm.passwordConfirm", placeholder="请再次输入登录密码"  type="password" show-password autocomplete="new-password")
              el-form-item(label="身份" prop='identityCode')
                el-select(v-model="addUserForm.identityCode" placeholder="请选择" style="width: 100%")
                  el-option(v-for="item in initSelect.identitySelect.data" :key="item.code" :label="item.name", :value="item.code")
              el-form-item(label="身份证号" prop='idNumber')
                el-input(v-model="addUserForm.idNumber", placeholder="请输入身份证号" @change='handleChangeidNumber')
              el-form-item(label="手机号" prop='mobile')
                el-input(v-model="addUserForm.mobile", placeholder="请输入手机号"  @change='handleChangemobile')
              el-form-item(label="校区" prop='campusCode')
                el-select(v-model="addUserForm.campusCode" placeholder="请选择校区" style="width: 100%")
                  el-option(v-for="item in campusData" :key="item.code" :label="item.name" :value="item.code")
              el-form-item(label="部门" prop='departmentCode')
                departSelector(v-model="addUserForm.departmentCode" placeholder="请选择部门" style="width: 100%" @change='changeDepartment')
                  //- el-option(v-for="item in departmentData" :key="item.code" :label="item.name" :value="item.code")
              el-form-item(label="邮箱" prop='email')
                el-input(v-model="addUserForm.email", placeholder="请输入邮箱")
              el-form-item(label="状态")
                el-radio-group(v-model="addUserForm.status")
                  el-radio-button(label="0" ) 禁用
                  el-radio-button(label="1") 正常
                //- 新增
                //- el-form-item(v-if="userInfo.account === 'admin'" label="设置角色" prop='email')
                //- el-form-item(label="设置角色" prop='email')
                //-   el-select(v-model="roleIdData" multiple placeholder="请选择角色" style="width: 100%" popper-class="selectStyle")
                //-     el-option(v-for="item in initSelect.roleSelect.data" :key="item.roleId" :label="item.roleName" :value="item.roleId")
              el-form-item(label="分配群组" prop='assignGroup')
                el-select(v-model="assignIdGroup" multiple placeholder="请选择群组" style="width: 100%" placement="top-start")
                  el-option(v-for="item in assignGroupData" :key="item.id" :label="item.name" :value="item.id")
            //- el-button(type="primary" @click="saveRole") 保存

          //- el-tab-pane(v-if="isEdit === 1" label="分配角色" name="second")
            el-checkbox-group(v-model="roleIdData")
              el-checkbox(v-for="item in initSelect.roleSelect.data" :label="item.roleId") {{ item.roleName }}
            el-form-item(width="100%" align="right")
              el-button( @click="cancelU") 取消
              el-button(type="primary" @click="saveRoleData") 保存

          el-tab-pane(v-if="isEdit === 1 && userInfo.account === 'admin'" label="功能权限" name="three")
            el-alert.msg-warning(style="width: 100%; margin-top:0px; margin-bottom:15px" title="温馨提示：支持用户单独分配功能权限(除角色已经分配菜单功能,禁止勾选!)" type="warning" show-icon)
            el-form
              el-form-item(label="过期时间" label-width="90px")
                el-date-picker(v-model='expireTime' type='date' placeholder="设置有效期" value-format="YYYY-DD-MM")
              el-form-item(label="功能菜单" label-width="90px")
                el-table( border :data="menuData", @select="handleSelection", @select-all="handleSelectionAll", @selection-change="handleSelectionChange"  v-loading="hasLoading" ref="limitRef" height="400" row-key="authorityId" default-expand-all :tree-props="{ children: 'children', hasChildren: 'hasChildren' }")
                  el-table-column(type="selection" :reserve-selection="true" align="center")
                  el-table-column(prop="menuName" label="菜单")
                  el-table-column(prop="actionList" label="操作")
                    template(#default="scope")
                      el-checkbox-group(v-model="actSData")
                        el-checkbox(v-if="scope.row.actionList.length > 0" v-for="item in scope.row.actionList" :label="item.authorityId.toString()" :key="item.authorityId.toString()") {{ item.actionName }}

          el-tab-pane(v-if="isEdit === 1 && userInfo.account === 'admin'" label="修改密码" name="four")
            el-form(:model='addUserForm' ref="passwordRef" :rules="formItemRules")
              el-form-item(label="登录名" label-width="110px" prop='account')
                el-input(:disabled="true" v-model="addUserForm.account", placeholder="请输入用户名")
              el-form-item(label="登录密码" label-width="110px"  prop='password')
                el-input(v-model="addUserForm.password", type="password" show-password placeholder="请输入登录密码")
                PasswordStrengthChecker(:password="addUserForm.password" @backRules="onBackRules")
              el-form-item(label="确认密码" label-width="110px" prop='passwordConfirm')
                el-input(v-model="addUserForm.passwordConfirm",type="password" show-password placeholder="请再次输入登录密码")


    template(#footer)
      el-button(v-if="activeName =='first'" @click="cancelU") 取消
      el-button(v-if="activeName =='first'" type="primary" @click="addUser") 保存
      el-button(v-if="activeName =='three'" type="primary" @click="authorize") 确认
      el-button(v-if="activeName == 'four'" @click="cancelU") 取消
      el-button(v-if="activeName == 'four'" type="primary" @click="savePassWord(passwordRef)") 保存

  el-dialog(:title="dialogTitGroup" v-model="showGroup")
    div(style="width: 100%; height: 60vh; overflow-y: auto")
      el-scrollbar
        el-table(:data="tableGroupData" style="width: 1000px")
          el-table-column(prop="id" label="群组ID")
          el-table-column(prop="name" label="群组名称")
          el-table-column(prop="status" label="状态" width="60")
            template(#default="scope")
              p(v-if="scope.row.status === 1") 正常
              p(v-else) 禁用
          el-table-column(prop="type" label="类型" width="60")
            template(#default="scope")
              p(v-if="scope.row.type === 'user'") 用户
              p(v-if="scope.row.type === 'mercacc'") 商户
              p(v-if="scope.row.type === 'visitor'") 游客
          //- el-table-column(prop="flag0" label="默认群组" width="80")
          //-   template(#default="scope")
          //-     p(v-if="scope.row.flag0 === '1'") 是
          //-     p(v-else) 否
          el-table-column(prop="createTime" label="创建时间")
          el-table-column(prop="remark" label="描述" )
  el-dialog(:title="dialogEquipment" v-model="showEquipment")
    div(style="width: 100%; height: 60vh; overflow-y: auto")
      el-scrollbar
        el-table(:data="tableEquipmentData" style="" border v-loading="tableLoading")
          el-table-column(prop="baseEquipment.name" label="设备名称" )
            template(#default="scope")
              p(v-if="scope.row.baseEquipment.name === 'h5'") APP-慧新e校
              p(v-else-if="scope.row.baseEquipment.name === 'pc'") 服务大厅
              p(v-else-if="scope.row.baseEquipment.name === 'app-'") APP-慧新e校
              p(v-else-if="scope.row.baseEquipment.name === 'wechat-mina'") 微信小程序
              p(v-else-if="scope.row.baseEquipment.name === 'wechat-work'") 企业微信
              p(v-else-if="scope.row.baseEquipment.name === 'wechat-mp'") 微信公众号
              p(v-else-if="scope.row.baseEquipment.name === 'wechat-app'") 微信开放平台APP
              p(v-else-if="scope.row.baseEquipment.name === 'alipay-app'") 支付宝移动应用
              p(v-else-if="scope.row.baseEquipment.name === 'alipay-life'") 支付宝生活号
              p(v-else-if="scope.row.baseEquipment.name === 'BCMMiniPro'") 交行小程序
              p(v-else) {{scope.row.baseEquipment.name}}
          el-table-column(prop="equipmentBh" label="设备编号" )
          el-table-column(prop="updateTime" label="绑定时间" )
          el-table-column(label="操作" width="100px" )
            template(#default="scope")
              el-button(size="mini" type="danger" plain @click="UnbindEquipment(scope.$index, scope.row)") 解绑
  el-dialog(title="更多" v-model="more")
    div(style="width: 100%; height: 60vh; overflow-y: auto")
      el-scrollbar
        el-descriptions(class="margin-top" :column="2" border)
          el-descriptions-item
            template(#label)
              span ID
            span {{ moreData.id }}
          //- el-descriptions-item
          //-   template(#label)
          //-     span 性别
          //-   span {{ moreData.sex ==='1'?'男':'女' }}
          el-descriptions-item
            template(#label)
              span 性别
            span(v-if="moreData.sex === 1")|男
            span(v-if="moreData.sex === 2")|女
          el-descriptions-item
            template(#label)
              span 角色
            span {{ moreData.roleId?moreData.roleId:'暂无' }}
          el-descriptions-item
            template(#label)
              span 身份
            span {{ moreData.identityName?moreData.identityName:'暂无' }}
          el-descriptions-item
            template(#label)
              span 身份证号
            span {{ moreData.idNumber?moreData.idNumber:'暂无' }}
          el-descriptions-item
            template(#label)
              span 部门
            span {{ moreData.departmentName?moreData.departmentName:'暂无' }}
          el-descriptions-item
            template(#label)
              span 专业
            span {{ moreData.professionName?moreData.professionName:'暂无' }}

          el-descriptions-item
            template(#label)
              span 邮箱
            span {{ moreData.email?moreData.email: '暂无'}}
          el-descriptions-item
            template(#label)
              span 创建时间
            span {{ moreData.createTime }}
          el-descriptions-item
            template(#label)
              span 更新时间
            span {{ moreData.updateTime }}
  //-  终端调试
  el-dialog(:title="dialogPlatType" v-model="showPlatType" style="width: 600px;")
    el-form(:model="platTypeForm" label-width="110px" :inline="true")
      el-row
        el-col(v-if="platTypeLevel.length>0" v-for="item in platTypeLevel||[]" :key="item.code" :xs="12", :sm="12", :md="12", :lg="12", :xl="12")
          div()
            //- span {{ platTypeLevel }} {{ platTypeForm }}
            el-form-item(:label="item.name ")
              el-switch(v-model="platTypeForm[item.code]" :active-value="1" :inactive-value="0")
        el-empty.dialog-empty(v-else description="暂无可调试终端类型")
    template(#footer)
      el-button(@click="cancelPlat") 取消
      el-button(type="primary" @click="savePlat" :loading='savePlatLoading') 保存
</template>
<script lang="ts">
import {
  defineComponent,
  computed,
  onMounted,
  reactive,
  toRefs,
  ref,
  watch,
  toRef,
  nextTick,
} from 'vue'
import { useStore } from 'vuex'
import { key } from '@/store'
import { Role } from '@/service/manage'
import { SystemConfig } from '@/service/platform'
import { arrayToTree } from '@/assets/scripts/utils'
import { ElMessageBox, ElMessage } from 'element-plus'
import { useRouter } from 'vue-router'
import FilterContent from '@/components/filterContent/index.vue'
import TableTitle from '@/components/tableTitle.vue'
// import SubDialog from '@/components/subDialog.vue'
import { Plus, Refresh, Search, Picture } from '@element-plus/icons-vue'
import { log } from 'console'
import _, { forEach, pullAll } from 'lodash'
import HeadOperation from '@/components/headOperation.vue'
import departSelector from '@/components/departSelector.vue'
import MoreHandle from '@/components/moreHandle.vue'
import { addSyncItem } from '@/assets/scripts/addSyncItem'
import PasswordStrengthChecker from '@/components/passwordStrengthChecker/index.vue'

export default defineComponent({
  components: {
    // accountUser,
    FilterContent,
    TableTitle,
    HeadOperation,
    Plus,
    Picture,
    departSelector,
    MoreHandle,
    PasswordStrengthChecker
    // SubDialog
  },
  data() {
    return {
      color: 'red',
      title: this.$route.meta.title,
      value: '',
    }
  },
  setup() {
    const router = useRouter()
    const limitRef = ref()
    const title = router.currentRoute.value.meta.title
    const store = useStore(key)
    const { state } = store
    const tableHeight = computed(() => {
      return state.tableHeight
    })
    const formRef = ref()
    const more = ref(false)
    const isChanged = ref({ phone: false, idNum: false })
    const activeName = ref('first')
    const loadingCatch = ref(false)
    const hasLoading = ref(false)
    const moreData: any = ref({})
    const imgFileRef: any = ref()
    const showDrawer = ref(false)
    const rowItem = ref()
    const pwdPass = ref(false)
    const passwordRef = ref()

    //自定义验证规则
    const validateIdNumber = (rule: any, value: any, callback: any) => {
      if (isChanged.value.idNum == true) {
        //console.log('改变了-----')
        if (value === '') {
          callback(new Error('身份证号不能为空'))
        } else {
          const regCN =
            /(^\d{8}(0\d|10|11|12)([0-2]\d|30|31)\d{3}$)|(^\d{6}(18|19|20)\d{2}(0\d|10|11|12)([0-2]\d|30|31)\d{3}(\d|X|x)$)/
          if (!regCN.test(value)) {
            callback(new Error('请输入正确的证件号'))
          } else {
            callback()
          }
        }
      } else {
        callback()
      }
    }
    const validateMobile = (rule: any, value: any, callback: any) => {
      if (isChanged.value.phone == true) {
        //console.log('手机号改变了-----')
        if (value === '') {
          callback(new Error('手机号不能为空'))
        } else {
          const regCN = /^1\d{10}$/
          if (!regCN.test(value)) {
            callback(new Error('手机号码格式不正确'))
          } else {
            callback()
          }
        }
      } else {
        callback()
      }
    }
    const validatePassword = (rule: any, value: any, callback: any) => {
      if (!pwdPass.value) {
        return new Error()
      }
      callback()
    }

    const validatePasswordConfirm = (rule: any, value: any, callback: any) => {
      if (table.addUserForm.password !== table.addUserForm.passwordConfirm) {
        return new Error('两次输入密码不一致')
      }
      callback()
    }


    const table = reactive({
      userInfo: store.state.userInfo,
      isExpired: true,
      expireTime: '',
      menuData: [] as any[],
      menuSData: [] as any[],
      menuSQData: [] as any[],
      actSData: [] as any[],
      campusData: [] as Array<string>,
      departmentData: [] as Array<string>,
      showAdd: false,
      showGroup: false,
      showEquipment: false,
      showPlatType: false,
      pageInfo: {
        current: 1,
        size: 10,
        selectLike: true,
        account: '',
        sno: '',
        name: '',
        mobile: '',
        email: '',
        identityCode: '',
        roleId: '',
        idNumber: '',
        bindEquipment: '', //是否绑定设备 0：否 1：是
        bindAccount: '', //是否绑定第三方账号 0：否 1：是
      },
      bindEAStatus: [
        {
          value: '1',
          label: '已绑定', //绑定状态
        },
        {
          value: '0',
          label: '未绑定',
        },
      ],
      // 用户已分配的角色
      roleData: [{ roleId: '' }],
      roleIdData: [] as Array<string>,
      initSelect: {
        // 类型
        userTypeSelect: {
          isShow: true,
          data: [],
        },
        // 身份
        identitySelect: {
          isShow: true,
          data: [
            {
              code: '',
              name: '',
            },
          ],
        },
        // 角色
        roleSelect: {
          isShow: true,
          data: [
            {
              roleId: '',
              roleName: '',
            },
          ],
        },
      },
      assignGroup: [{ id: '' }], //分配群组
      assignIdGroup: [] as Array<string>,
      assignGroupData: [],
      total: 0,
      imageFor: '',
      tableGroupData: [],
      tableEquipmentData: [],
      tableLoading: false,
      accountId: '',
      useRole: {} as any,
      tableData: [],
      authorityMenu: [],
      isEdit: 0, //0是非编辑状态（新建状态）
      dialogTit: '添加用户',
      dialogTitGroup: '所属群组',
      dialogEquipment: '设备管理',
      dialogPlatType: '',
      // avatarData: "",
      imageFile: '',
      addUserForm: {
        id: '',
        sno: '',
        idList: [],
        account: '',
        name: '',
        sex: 1,
        password: '',
        passwordConfirm: '',
        status: 1,
        idNumber: '',
        identityCode: '',
        companyId: '',
        email: '',
        mobile: '',
        userType: 'normal',
        avatar: '',
        grantRoles: [],
        grantActions: [],
        grantMenus: [],
        expireTime: '',
        isExpired: false,
        // imageFile: "",
        campusCode: '', //校区
        departmentCode: '', //部门
        departmentName: '',
      },
      formItemRules: {
        // userType: [{ required: true, message: "用户类型不能为空", trigger: "blur" }],
        identityCode: [
          { required: true, message: '身份不能为空', trigger: 'change' },
        ],
        campusCode: [
          { required: true, message: '校区不能为空', trigger: 'change' },
        ],
        departmentCode: [
          { required: true, message: '部门不能为空', trigger: 'change' },
        ],
        account: [
          { required: true, message: '用户名不能为空', trigger: 'blur' },
          {
            type: 'string',
            max: 50,
            message: '用户名超出长度限制',
            trigger: 'blur',
          },
          // { required: true, validator: validateAccount,  trigger: 'blur' }
        ],
        /*  idNumber: [
          { required: true, message: '身份证号不能为空', trigger: 'blur' },
          {
            pattern: /(^\d{8}(0\d|10|11|12)([0-2]\d|30|31)\d{3}$)|(^\d{6}(18|19|20)\d{2}(0\d|10|11|12)([0-2]\d|30|31)\d{3}(\d|X|x)$)/,
            message: '请输入正确的证件号'
          }
        ], */
        idNumber: [
          // { required: true, message: '身份证号不能为空', trigger: 'blur' },
          { required: true, validator: validateIdNumber, trigger: 'blur' },
        ],
        password: [
          { required: true, message: '密码不能为空', trigger: 'blur' },
          { validator: validatePassword, trigger: 'blur' }],
        passwordConfirm: [
          { required: true, message: '重复密码不能为空', trigger: 'blur' },
          { validator: validatePasswordConfirm, trigger: 'blur' }],
        name: [
          { required: true, message: '姓名不能为空', trigger: 'blur' },
          {
            type: 'string',
            max: 10,
            message: '姓名超出长度限制',
            trigger: 'blur',
          },
        ],
        sno: [
          { required: true, message: '学/工号不能为空', trigger: 'blur' },
          {
            type: 'string',
            max: 100,
            message: '学/工号超出长度限制',
            trigger: 'blur',
          },
          // { required: true, validator: validateSno, trigger: 'blur' }
        ],
        sex: [{ required: true, message: '性别不能为空', trigger: 'blur' }],
        email: [
          {
            required: false,
            type: 'email',
            message: '邮箱格式不正确',
            trigger: 'blur',
          },
          {
            type: 'string',
            max: 100,
            message: '邮箱格式超出长度限制',
            trigger: 'blur',
          },
        ],
        mobile: [
          /*  { required: true, message: '手机号不能为空', trigger: 'blur' }, */
          { required: true, validator: validateMobile, trigger: 'blur' },
          // { pattern: /^1\d{10}$/, message: '手机号码格式不正确', trigger: 'change' }
        ],
      },
      reset: () => {
        // 重置
        // console.log("********");
        // console.log(pageInfoRef.value);
        // (pageInfoRef.value as any)?.resetFields()
        // table.pageInfo. = null;

        table.pageInfo.account = ''
        table.pageInfo.sno = ''
        table.pageInfo.name = ''
        table.pageInfo.mobile = ''
        table.pageInfo.email = ''
        table.pageInfo.identityCode = ''
        table.pageInfo.roleId = ''
        table.pageInfo.idNumber = ''
        table.pageInfo.current = 1
        table.pageInfo.roleId = ''
        table.pageInfo.bindEquipment = ''
        table.pageInfo.bindAccount = ''
      },
      inquire: () => {
        // 查询
        getTableData()
      },
      cancelU: () => {
        // 取消
        table.showAdd = false
        isChanged.value.idNum = false
        isChanged.value.phone = false
        formRef.value.resetFields()
      },

      edit: (index: number, data: any) => {
        /*  isChanged.value.idNum = false
        isChanged.value.phone = false */
        table.isEdit = 1
        table.dialogTit = '编辑用户' + '-' + data.name
        table.accountId = data.id
        // table.addUserForm = data;
        table.addUserForm = Object.assign({}, table.addUserForm, data)
        if (table.addUserForm.avatar !== null) {
          table.addUserForm.avatar = table.imageFor + table.addUserForm.avatar
        }
        //table.addUserForm.password = ''
        table.addUserForm.passwordConfirm = ''
        table.showAdd = true
        table.imageFile = ''
        tabSecond() //获取用户角色
        getGroups()
        listGroupByAccountId() //获取用户群组信息
        console.log('编辑-----', table.addUserForm, table.imageFile)
      },
      // 所属群组
      // handleAccountGroupModal: (index: number, data: any) => {
      //     table.showGroup = true
      //     if (data && data.id && data.name) {
      //         table.dialogTitGroup = "查看用户所属群组信息 - " + data.name
      //         table.accountId = data.id
      //         listGroupByAccountId()
      //     } else {
      //         ElMessage({
      //             showClose: true,
      //             message: "未找到数据",
      //             type: "warning",
      //         })
      //     }
      //     // console.log('qunzu', index, data)
      // },

      // 同步单个用户信息
      synchronousPhoto: (index: number, data: any) => {
        var dataRow = data
        var tit = '确定要同步' + data.name + '的个人信息吗？'
        ElMessageBox.confirm(tit, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
        })
          .then(async () => {
            const params = {
              id: data.id,
            }
            // console.log("synchronousPhoto", params)

            const { code, msg }: any = await Role.synchronousPhoto(
              params,
              'messageBox'
            )
            if (code === 200) {
              ElMessage.success('同步成功')
              getTableData()
            } else {
              ElMessage.error(msg)
            }
          })
          .catch(() => {
            return
          })
        console.log('synchronousPhoto', data)
      },
      // 一卡通绑定
      setAccountUser: (index: number, data: any) => {
        // var dataRow = data;
        router.push({
          name: 'accountUser',
          params: { id: data.id },
          query: { type: data.type },
        })
      },
      authorize: () => {
        //  console.log(table.isExpired)
        //  console.log(table.actSData)
        //  console.log(table.menuSQData)
        if (table.expireTime === '') {
          ElMessage.success('请选择过期时间')
        } else {
          grantAuthorityRoleData()
        }
      },
      handleSelection: (selection: any, row: any) => {
        const hasSelect = selection.some(
          (el: any) => row.authorityId === el.authorityId
        )
        if (hasSelect) {
          row?.actionList.forEach((_val: any) => {
            table.actSData.push(_val.authorityId.toString())
          })
          if (row.children) {
            // 解决子组件没有被勾选到
            table.setChildren(row.children, true)
            row?.children.forEach((val: any) => {
              val.actionList.forEach((_val: any) => {
                table.actSData.push(_val.authorityId.toString())
              })
            })
          }
        } else {
          const _arr: any = []
          row?.actionList.forEach((_val: any) => {
            _arr.push(_val.authorityId.toString())
          })
          table.actSData = pullAll(table.actSData, _arr)
          if (row.children) {
            table.setChildren(row.children, false)
            const arr: any = []
            row.children.forEach((val: any) => {
              val.actionList.forEach((_val: any) => {
                arr.push(_val.authorityId.toString())
              })
            })
            table.actSData = pullAll(table.actSData, arr)
          }
        }
      },
      handleSelectionAll: (selection: any) => {
        // menuData第一层只要有在selection里面就是全选
        const isSelect = selection.some((el: any) => {
          const tableDataIds = table.menuData.map((j: any) => j.authorityId)
          return tableDataIds.includes(el.authorityId)
        })
        // menuData第一层只要有不在selection里面就是全不选
        const isCancel = !table.menuData.every((el: any) => {
          const selectIds = selection.map((j: any) => j.authorityId)
          table.actSData = []
          return selectIds.includes(el.authorityId)
        })
        if (isSelect) {
          table.authorityMenu.forEach((val: any) => {
            val.actionList.forEach((_val: any) => {
              table.actSData.push(_val.authorityId.toString())
            })
          })
          selection.map((el: any) => {
            if (el.children) table.setChildren(el.children, true) // 解决子组件没有被勾选到
          })
        }
        if (isCancel) {
          table.actSData = []
          table.menuData.map((el) => {
            if (el.children) table.setChildren(el.children, false)
          })
        }
      },
      handleSelectionChange: (selection: any) => {
        let arr = selection
        let parArr = []
        for (let item of arr) {
          let { children, ...params } = item
          parArr.push(params)
        }
        table.menuSQData = parArr
      },
      setChildren: (children: any, type: any) => {
        // 编辑多个子层级
        children.map((j: any) => {
          table.toggleSelection(j, type)
          if (j.children) {
            table.setChildren(j.children, type)
          }
        })
      },
      toggleSelection: async (row: any, select: any) => {
        if (row) {
          await nextTick()
          limitRef.value && limitRef.value.toggleRowSelection(row, select)
        }
      },

      // 删除
      handleRemove: (index: number, data: any) => {
        ElMessageBox.confirm('确定要删除此用户?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
        })
          .then(async () => {
            const id = data.id
            const params = {
              id: id,
            }
            const { code, msg }: any = await Role.removeAccount(
              params,
              'messageBox'
            )
            if (code === 200) {
              ElMessage.success('删除成功')
              table.tableData.splice(index, 1)
              // getTableData()
            } else {
              ElMessage.error(msg)
            }
          })
          .catch(() => {
            return
          })
      },
      //确认保存
      addUser: () => {
        if (table.isEdit === 0) {
          formRef.value.validate((valid: any) => {
            // console.log("确认----密码", table.addUserForm, valid)
            // false
            if (valid == true) {
              if (
                table.addUserForm.account &&
                table.addUserForm.account.length > 0
              ) {
                listAccountData()
              }
              if (table.addUserForm.sno && table.addUserForm.sno.length > 0) {
                listSnoData()
              }
              if (
                table.addUserForm.password !== table.addUserForm.passwordConfirm
              ) {
                table.addUserForm.passwordConfirm = ''
                ElMessage({
                  showClose: true,
                  message: '两次输入密码不一致',
                  type: 'warning',
                })
              } else {
                addUserData()
              }
            }
          })
          /*  if (table.addUserForm.account && table.addUserForm.account.length > 0) {
                        listAccountData()
                    }
                    if (table.addUserForm.sno && table.addUserForm.sno.length > 0) {
                        listSnoData()
                    }
                    if (table.addUserForm.password !== table.addUserForm.passwordConfirm) {
                        console.log("确认----密码", table.addUserForm)

                        table.addUserForm.passwordConfirm = ""
                        ElMessage({
                            showClose: true,
                            message: "两次输入密码不一致",
                            type: "warning",
                        })
                    } else {
                        formRef.value.validate((valid: any) => {
                            if (valid) {
                                addUserData()
                            }
                        })
                    } */
        }
        if (table.isEdit === 1) {
          // 修改的保存
          formRef.value.validate((valid: any) => {
            if (valid) {
              upDateUserData()
            }
          })
        }
      },

      // saveRoleData: () => {
      //   var roleIdStr = table.roleIdData.join(',')
      //   addUserRole(roleIdStr)
      // },

      savePassWord: (validRef: any) => {
        validRef.validate((valid: any) => {
          if (valid) {
            updatePassword()
          }
        })
        // if (table.addUserForm.password !== table.addUserForm.passwordConfirm) {
        //   table.addUserForm.passwordConfirm = ''
        //   ElMessage({
        //     showClose: true,
        //     message: '两次输入密码不一致',
        //     type: 'warning',
        //   })
        // } else {
        //   if (table.addUserForm.password === '') {
        //     ElMessage({
        //       showClose: true,
        //       message: '密码不能为空',
        //       type: 'warning',
        //     })
        //   } else {
        //     updatePassword()
        //   }
        // }
      },
      add: () => {
        // 添加用户
        table.isEdit = 0
        table.dialogTit = '添加用户'
        table.showAdd = true
        for (let i in table.addUserForm) {
          ; (table as any).addUserForm[i] = null
        }
        table.addUserForm.account = ''
        table.addUserForm.password = ''
        table.addUserForm.identityCode = ''
        table.roleIdData = []
        table.assignIdGroup = []
        table.addUserForm.sex = 1
        table.addUserForm.status = 1
        isChanged.value.idNum = true
        isChanged.value.phone = true
        table.imageFile = ''
        table.addUserForm.account = ''
        table.addUserForm.password = ''
        table.addUserForm.passwordConfirm = ''
        getGroups() //获取全部群组
        console.log(
          '添加用户*****',
          table.addUserForm,
          table.addUserForm.account,
          table.imageFile
        )
      },

      handleClick: (tab: any) => {
        table.dialogTit = tab.props.label
        if (tab.props.name === 'second') {
          tabSecond()
        } else if (tab.props.name === 'three') {
          if (loadingCatch.value) return
          hasLoading.value = true
          tabThree()
        }
      },

      synchronousPhotos: () => {
        // 批量同步照片
        // var dataRow = data;
        var tit = '确定要根据查询条件从一卡通库批量同步照片吗?'
        ElMessageBox.confirm(tit, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
        })
          .then(async () => {
            // const res = await Role.synPhotos(table.pageInfo)
            const { data: mesid, code, msg }: any = await Role.synPhotos(
              table.pageInfo,
              'messageBox'
            )
            if (code === 200) {
              addSyncItem({
                method: 'post',
                url: '/berserker-ykt-sync/photo/getProgress',
                params: {
                  mesid,
                },
                name: '批量照片同步'
              })
              // ElMessage.success('同步成功')
              // getTableData()
            } else {
              ElMessage.error(msg)
            }
          })
          .catch(() => {
            return
          })
      },
      // table.tableLoading: true,
    })
    //getTableData()

    async function grantAuthorityRoleData() {
      var temp = [] as any[]
      console.log(table.menuSQData, table.actSData)
      table.menuSQData.forEach((element: any) => {
        temp.push(element.authorityId.toString())
      })
      table.actSData.forEach((item: any) => {
        temp.push(item.toString())
      })
      var strId = temp.join(',')
      console.log(strId)
      console.log(table.expireTime)
      var date = new Date(table.expireTime?.replace(/-/, '/'))
      console.log(date.toDateString)
      const params = {
        authorityIds: strId,
        expireTime: table.expireTime ? table.expireTime + ' 00:00:00' : '',
        userId: table.accountId,
      }
      console.log(params)
      const { code, msg }: any = await Role.grantAuthorityUser(
        params,
        'messageBox'
      )
      if (code === 200) {
        table.showAdd = false
        ElMessage.success(msg)
        getTableData()
      } else {
        ElMessage.error(msg)
      }
    }
    const handleSizeChange = (val: number) => {
      table.pageInfo.size = val
      table.pageInfo.current = 1
      getTableData()
    }
    const handleCurrentChange = (val: number) => {
      table.pageInfo.current = val
      getTableData()
    }
    //展开行
    const onExpandsRow = async (props: any) => {
      rowItem.value = props
      showDrawer.value = true
      getUseRole(props)
      const params = {
        accountId: props.id,
        // defaultGroup: 0,
      }
      const res = await Role.listGroupByAccountId(params, 'messageBox')
      if (res?.data) {
        if (res.data.length > 0) {
          table.tableGroupData = res.data
        }
      }
      // console.log('展开defaultGroup', props.id, res.data)
    }
    //获取用户角色
    const getUseRole = async (val: any) => {
      const params = {
        userId: val.id,
      }
      const resRole = await Role.getUserRoles(params, 'messageBox')
      if (resRole && resRole.data) {
        if (resRole.data.length > 0) {
          // val.roleId = resRole.data[0].roleName
          const resRoleARR: any = []
          resRole.data.forEach((element: any) => {
            resRoleARR.push(element.roleName)
          })
          table.useRole[val.id] = resRoleARR.join('/')
          // table.useRole = resRole.data[0].roleName
        } else {
          table.useRole[val.id] = ''
        }
      }
    }
    //修改用户状态
    const changeStatus = (val: any, data: any) => {
      // console.log("改变用户状态-----", data, val)
      table.addUserForm = data
      saveUserStatus(data, val)
    }
    //获取全部群组信息
    const getGroups = async () => {
      const params: any = {
        flag0: 0,
        status: 1,
      }
      const res = await Role.getGroups(params, 'messageBox')
      if (res && res.data) {
        if (res && res.data) {
          // console.log('获取全部群组信息', res)
          table.assignGroupData = res.data
        }
      }
      // console.log('获取群组列表', res)
    }
    //设备管理
    const bindEquipment = (index: number, val: any) => {
      table.showEquipment = true
      if (val && val.id && val.name) {
        table.dialogEquipment = `用户${val.name}的设备列表`
        table.accountId = val.id
        searchBindEquipmentByUser()
      } else {
        ElMessage({
          showClose: true,
          message: '未找到数据',
          type: 'warning',
        })
      }
    }
    //解绑设备
    const UnbindEquipment = (index: number, data: any) => {
      ElMessageBox.confirm('确定要删除此设备吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      })
        .then(async () => {
          const params = {
            equipmentId: data.baseEquipment.bh,
            accountId: data.accountId,
          }
          const res: any = await Role.relieveByUser(params, 'messageBox')
          if (res.code === 200) {
            if (res.data === true) {
              ElMessage.success('解绑成功')
              searchBindEquipmentByUser()
            } else {
              ElMessage.error('解绑失败')
            }
          } else {
            ElMessage.error(res.msg)
          }
          console.log('解绑---', data, params)
        })
        .catch(() => {
          return
        })
    }
    async function saveUserStatus(data: any, status?: any) {
      table.tableLoading = true
      const params = {
        status: status.toString(),
        sno: table.addUserForm.sno,
        account: table.addUserForm.account,
        id: data.id,
      }
      // if (status) {
      //     params.status = status.toString()
      // }
      console.log('修改状态', params, data)
      const { code, msg }: any = await Role.updateUser(params)
      if (code === 200) {
        table.showAdd = false
        ElMessage.success('状态修改成功')
        table.tableLoading = false
        // getTableData()
      } else {
        console.log(msg)
      }
    }

    async function tabSecond() {
      //获取用户角色
      const params = {
        userId: table.accountId,
      }
      const res = await Role.getUserRoles(params)
      if (res && res.data) {
        if (res.data.length > 0) {
          table.roleData = res.data
          // table.roleData.map
          table.roleIdData = []
          for (const key in table.roleData) {
            if (Object.prototype.hasOwnProperty.call(table.roleData, key)) {
              const element = table.roleData[key]
              const roleId = element.roleId
              table.roleIdData.push(roleId)
            }
          }
          console.log('获取用户角色', table.roleIdData)
        } else {
          table.roleIdData = []
        }
      }
    }
    async function tabThree() {
      if (!table.accountId) {
        return
      }
      const params = {
        userId: table.accountId,
      }
      // const res1 = await Role.getAuthorityMenu()
      const res2 = await Role.getAuthorityUser(params)
      if (table.authorityMenu) {
        if (res2 && res2.data) {
          table.menuSData = []
          table.actSData = []
          res2.data.forEach((element: any) => {
            if (
              element.authority.indexOf('MENU_') !== -1 &&
              !table.menuSData.includes(element.authorityId.toString())
            ) {
              table.menuSData.push(element.authorityId.toString())
            }
            if (
              element.authority.indexOf('ACTION_') !== -1 &&
              !table.actSData.includes(element.authorityId.toString())
            ) {
              table.actSData.push(element.authorityId.toString())
              // console.log("table.actSData", table.actSData)
            }
          })
          table.authorityMenu.forEach((element: any) => {
            if (table.menuSData.includes(element.authorityId.toString())) {
              element.ischoice = true
            } else {
              element.ischoice = false
            }
          })
          // 选中的那些
          // console.log('menuSData')
          // console.log(table.menuSData)
          // console.log(table.isExpired)
          // console.log(table.actSData)
        }
        table.menuData = arrayToTree(table.authorityMenu, 0)
        // console.log(table.menuData)
        await treeData(table.menuData)
        loadingCatch.value = true
        hasLoading.value = false
        // 时间
        if (res2.data.length > 0) {
          table.expireTime = res2.data[0].expireTime
          table.isExpired = res2.data[0].isExpired
        }
      }
    }
    async function treeData(item: any) {
      for (let index = 0; index < item.length; index++) {
        const element = item[index]
        if (element.ischoice === true) {
          console.log(element)
          limitRef.value.toggleRowSelection(element, true)
          // console.log()
        }
        if (element.children) {
          if (element.children.length > 0) {
            treeData(element.children)
          }
        }
      }
    }
    async function getTableData() {
      table.tableLoading = true
      let filteredData: any = _.omitBy(table.pageInfo, (value: any) => _.isString(value) && _.isEmpty(value));
      // console.log('getTableData******', table.pageInfo, filteredData)
      const res = await Role.getUserList(filteredData)
      if (res && res.data && res.data.records) {
        table.tableLoading = false
        const data = res.data.records
        // table.tableData = data
        table.total = res.data.total
        const dataArr: any = []
        data.forEach((ele: any) => {
          if (ele.departmentCode && table.departmentData.length !== 0) {
            const val: any = table.departmentData.find((e: any) => {
              return e.code === ele.departmentCode
            })
            if (val) {
              ele.departmentNames = val.name
            } else {
              ele.departmentNames = ''
            }
            // console.log('ele', ele)
          }
          if (
            ele.identityCode &&
            table.initSelect.identitySelect.data.length !== 0
          ) {
            const val: any = table.initSelect.identitySelect.data.find(
              (e: any) => {
                return e.code === ele.identityCode
              }
            )
            if (val) {
              ele.identityNames = val.name
            } else {
              ele.identityNames = ''
            }
          }
          dataArr.push(ele)
        })
        table.tableData = dataArr
        console.log('表格', res.data.records, table.tableData)
      } else {
        table.tableLoading = false
        ElMessage({
          showClose: true,
          message: res.msg,
          type: 'warning',
        })
      }
    }
    async function listAccountData() {
      const params = {
        account: table.addUserForm.account,
      }
      const res = await Role.listAccount(params)
      if (res && res.data) {
        console.log(res.data)
        if (res.data.length > 0) {
          table.addUserForm.account = ''
          ElMessage({
            showClose: true,
            message: '账号已经存在',
            type: 'warning',
          })
          return
        }
      }
    }
    async function listSnoData() {
      const params = {
        sno: table.addUserForm.sno,
      }
      const res = await Role.listSno(params)
      if (res && res.data) {
        console.log(res.data)
        if (res.data.length > 0) {
          table.addUserForm.sno = ''
          ElMessage({
            showClose: true,
            message: '学/工号已经存在',
            type: 'warning',
          })
        }
      }
    }
    async function addUserData() {
      console.log('添加图片', table.imageFile, table.addUserForm)
      if (table.imageFile !== '') {
        await addAvatar()
      }
      const {
        data: res,
        code,
        msg,
      }: any = await Role.addUser(table.addUserForm)
      if (code === 200) {
        // console.log("添加成功", res)
        table.showAdd = false
        ElMessage.success('添加成功')
        const roleIdStr = table.roleIdData.join(',')
        addUserRole(roleIdStr, res.id)
        //分配群组
        const groupIdArr = table.assignIdGroup
        const sonObj = {
          sno: [res.sno],
        }
        groupIdArr.forEach((ele: any, index: number) => {
          const groupIdObj: any = {}
          Reflect.set(groupIdObj, ele, sonObj)
          addUserGroup(groupIdObj)
        })
        getTableData()
      } else {
        ElMessage.warning(msg)
      }
    }
    async function upDateUserData() {
      console.log('编辑用户图片----', table.imageFile)
      if (table.imageFile !== '') {
        await addAvatar()
      }
      // if (table.addUserForm.imageFile !== null) {
      //     await addAvatar()
      // }
      const params: any = {
        ...table.addUserForm,
        departmentNames: '',
      }
      const { code, msg }: any = await Role.updateUser(params)
      if (code === 200) {
        table.showAdd = false
        ElMessage.success('编辑成功')
        getTableData()
        const roleIdStr = table.roleIdData.join(',')
        addUserRole(roleIdStr)

        //分配群组
        console.log('编辑用户群组-----', table.assignIdGroup, table.addUserForm)
        const groupIdArr = table.assignIdGroup
        const sonObj = {
          sno: [table.addUserForm.sno],
        }
        groupIdArr.forEach((ele: any, index: number) => {
          const groupIdObj: any = {}
          Reflect.set(groupIdObj, ele, sonObj)
          addUserGroup(groupIdObj)
        })
      } else {
        console.log(msg)
      }
    }
    async function getForeignAddressImg() {
      const res = await Role.getForeignAddress()
      if (res && res.data) {
        const data = res.data
        table.imageFor = data
      }
    }
    async function listGroupByAccountId() {
      const params = {
        accountId: table.accountId,
        // flag0: 0,
        status: 1,
        defaultGroup: 0,
      }
      const res = await Role.listGroupByAccountId(params)
      if (res && res.data) {
        // console.log(res.data)
        if (res.data.length > 0) {
          table.tableGroupData = res.data
          table.assignGroup = res.data
          table.assignIdGroup = []
          for (const key in table.assignGroup) {
            if (Object.prototype.hasOwnProperty.call(table.assignGroup, key)) {
              const element: any = table.assignGroup[key]
              const id = element.id
              const name = element.name
              // table.assignIdGroup.push(id)
              table.assignIdGroup.push(name)
            }
          }
        } else {
          table.assignIdGroup = []
        }
      }
      console.log('用户群组', params, res, table.assignIdGroup)
    }
    //给用户分配群组 saveGroupExtendInfo
    async function addUserGroup(groupIdObj: any) {
      const params: any = {
        type: 'group',
        removeResource: 'true',
        resourceMap: groupIdObj,
      }
      const { code, msg }: any = await Role.saveGroupExtendInfo(params)
      if (code === 200) {
        console.log('添加成功')
      } else {
        ElMessage.warning(msg)
      }
      // console.log('给用户分配群组', params, groupIdObj)
    }
    //获取设备
    async function searchBindEquipmentByUser() {
      const params = {
        accountId: table.accountId,
        status: 1,
      }
      const res = await Role.searchBindEquipmentByUser(params)
      table.tableEquipmentData = res.data
      // console.log('获取设备', params, res.data)
    }
    async function addUserRole(roleIds: string, userId?: number | string) {
      const params = {
        userId: table.accountId || userId,
        roleIds: roleIds,
      } as any
      const { code, msg }: any = await Role.addUserRoles(params)
      if (code === 200) {
        table.showAdd = false
      } else {
        // console.log(msg)
      }
    }
    //修改密码
    async function updatePassword() {
      const params = {
        userId: table.accountId,
        password: table.addUserForm.password,
      }
      const { code, msg }: any = await Role.updatePassword(params)
      if (code === 200) {
        table.showAdd = false
        ElMessage.success('密码修改成功')
      } else {
        // console.log(msg)
      }
    }
    //监听
    const handleChangeidNumber = (val: any) => {
      console.log('idNumber修改------', val)
      isChanged.value.idNum = true
    }
    const handleChangemobile = (val: any) => {
      console.log('mobile修改------', val)
      isChanged.value.phone = true
    }
    //上传图片
    const httpRequest = (data: any) => {
      table.imageFile = data.file
      table.addUserForm.avatar = URL.createObjectURL(data.file)
    }
    const addAvatar = async () => {
      const formData = new FormData()
      // formData.append("id", "id")
      formData.append('bucketName', 'photo')
      formData.append('file', table.imageFile)
      const { data, msg, code }: any = await Role.updatePhotoByOperator(
        formData
      )
      if (code === 200) {
        // ElMessage.success("照片上传成功")
        //table.addUserForm.avatar = res + "?timestamp=" + new Date().getTime()
        table.addUserForm.avatar = data
      } else {
        ElMessage.error(msg)
      }
    }
    // 删除图片
    const deleteImg = () => {
      table.addUserForm.avatar = ''
    }
    //限制用户上传文件的格式和大小
    const avatarBeforeUpload = (file: any) => {
      const type = ['image/jpeg', 'image/jpg', 'image/png']
      if (type.indexOf(file.type) === -1) {
        ElMessage.error('上传的文件必须是JPG / JPEG / PNG格式!')
        return false
      } else if (file.size / 1024 / 1024 > 1) {
        ElMessage.error('图片大小不能超过1MB!')
        return false
      }
      return true
    }
    const avatarHandleExceed = (val: any) => {
      imgFileRef.value!.clearFiles()
      const file: any = val[0]
      imgFileRef.value!.handleStart(file)
      table.addUserForm.avatar = URL.createObjectURL(file)
      table.imageFile = file
      console.log('cauochu-------', val, file, imgFileRef.value)
    }
    //获取校区
    const getCampus = async () => {
      const res = await Role.getCampus()
      if (res && res.data) {
        table.campusData = res.data
        console.log('获取校区', table.campusData)
      } else {
        // table.tableLoading = false
      }
    }
    //获取部门
    const getDepartmentCode = async () => {
      const res = await Role.getDepartmentCode()
      if (res && res.data) {
        table.departmentData = res.data
        console.log('获取部门', table.departmentData)
      } else {
        // table.tableLoading = false
      }
    }
    /**
     * 初始化下拉框
     */
    async function initSelectData() {
      if (table.initSelect.identitySelect.isShow) {
        // table.tableLoading = true
        const res = await Role.listIdentity()
        if (res && res.data) {
          // table.tableLoading = false
          const data = res.data
          table.initSelect.identitySelect.data = data
        } else {
          // table.tableLoading = false
        }
      }
      if (table.initSelect.roleSelect.isShow) {
        // table.tableLoading = true
        const params: any = {
          status: 1,
        }
        const res = await Role.getAllRoles(params)
        if (res && res.data) {
          // table.tableLoading = false
          const data = res.data
          table.initSelect.roleSelect.data = data
          console.log('全部角色', table.initSelect.roleSelect.data)
        } else {
          // table.tableLoading = false
        }
      }
    }

    onMounted(async () => {
      await getDepartmentCode()
      await getCampus()
      await initSelectData()
      await getTableData()
      const { data: res, code, msg } = await Role.getAuthorityMenu()
      if (code === 200) {
        table.authorityMenu = res
        table.menuData = arrayToTree(table.authorityMenu, 0)
      } else ElMessage.error(msg)

      // initSelectData()
      getForeignAddressImg()
      // console.log("功能按钮", state)
    })

    const moreDialog = (data: any) => {
      more.value = true
      moreData.value = data
      // console.log('更多按钮', state.funcButton)
    }

    const changeDepartment = (data: any) => {
      const val: any = table.departmentData.find((e: any) => {
        return e.code === data
      })
      table.addUserForm.departmentName = val.name
      console.log('单选***', data, table.addUserForm.departmentName)
    }

    const closed = () => {
      hasLoading.value = false
      loadingCatch.value = false
      isChanged.value.idNum = false
      isChanged.value.phone = false
      activeName.value = 'first'
      table.actSData = []
      table.menuSData = []
      table.menuSQData = []
      if (table.isEdit === 1 && table.userInfo.account === 'admin') {
        limitRef.value.clearSelection()
      }
      // formRef.value.resetFields()
    }
    const refTable = toRefs(table)
    function onBackRules(res: any) {
      pwdPass.value = res.value
    }

    //终端调试
    // const platTypeLevel = state.platTypeLevel
    const platTypeForm: any = ref({})
    const currentItem: any = ref(null)
    const platTypeLevel = computed(() => {
      return state?.platTypeLevel.filter((item: any) => item.parentCode === 'mobile') || []
    });
    // const platTypeFiltered: any = ref([])
    const platTypeDebug = (index: number, val: any) => {
      table.showPlatType = true
      if (val && val.id && val.name) {
        table.dialogPlatType = `${val.name}的终端调试`
        currentItem.value = val
        if (val.remark) {
          platTypeForm.value = JSON.parse(val.remark).vconsole !== '0' ? JSON.parse(val.remark).vconsole : {}
          // platTypeFiltered.value = _.filter(platTypeLevel.value, item => Object.keys(platTypeForm.value).includes(item.code));
          // console.log('终端调试', platTypeForm.value, '222', JSON.parse(val.remark), platTypeLevel.value)
        } else {
          platTypeForm.value = {}
          // platTypeFiltered.value = []
        }
      } else {
        ElMessage({
          showClose: true,
          message: '未找到数据',
          type: 'warning',
        })
      }
    }
    const savePlatLoading: any = ref(false)
    const cancelPlat = () => {
      table.showPlatType = false
      table.dialogPlatType = ''
      currentItem.value = null
    }
    const savePlat = async () => {
      savePlatLoading.value = true
      let result = { vconsole: platTypeForm.value }
      const params = {
        id: currentItem.value.id,
        sno: currentItem.value.sno,
        account: currentItem.value.account,
        remark: JSON.stringify(result)
      }
      // console.log('savePlat***', currentItem.value, platTypeForm.value, params)
      try {
        const { data: res, msg, code }: any = await Role.updateUser(params)
        savePlatLoading.value = false
        if (code === 200) {
          ElMessage.success(msg)
          getTableData()
          cancelPlat()
        } else {
          ElMessage.error(msg)
        }
      } catch (error) {
        savePlatLoading.value = false
      }

    }

    return {
      state,
      token: computed(() => state.token),
      token_type: computed(() => state.token_type),
      ...refTable,
      formRef,
      limitRef,
      getTableData,
      handleSizeChange,
      more,
      isChanged,
      moreData,
      hasLoading,
      moreDialog,
      activeName,
      closed,
      handleChangeidNumber,
      handleChangemobile,
      changeStatus,
      validateIdNumber,
      handleCurrentChange,
      onExpandsRow,
      bindEquipment,
      UnbindEquipment,
      Plus,
      Refresh,
      Search,
      getUseRole,
      avatar: () => import('@/assets/images/avatar.png'),
      tableHeight: computed(() => {
        return state.tableHeight
      }),
      getGroups,
      addUserGroup,
      httpRequest,
      addAvatar,
      deleteImg,
      imgFileRef,
      avatarBeforeUpload,
      avatarHandleExceed,
      getCampus,
      getDepartmentCode,
      changeDepartment,
      showDrawer,
      rowItem,
      onBackRules,
      passwordRef,
      platTypeDebug,
      platTypeLevel,
      platTypeForm,
      cancelPlat,
      savePlat,
      savePlatLoading,
      currentItem,
      // platTypeFiltered
    }
  },
})
</script>
<style lang="scss" scoped>
.text {
  color: v-bind (color);
}

.el-table .warning-row {
  background: oldlace;
}

.el-table .success-row {
  background: #f0f9eb;
}

.el-avatar>img {
  display: block;
  height: 100%;
  width: 100%;
  vertical-align: middle;
}

.useavatar {
  display: block;
  width: 36px;
  height: 36px;

  img {
    display: block;
    height: 100%;
    width: 100%;
    vertical-align: middle;
  }
}

.childbox {
  .basedata {
    margin-bottom: 20px;

    p {
      line-height: 180%;
    }
  }

  h3 {
    margin-bottom: 13px;
  }
}

.butdrop {
  ::v-deep .el-dropdown {
    font-size: 12px;
  }

  .el-dropdown-link {
    font-size: 12px;
  }
}

.link-group .el-link {
  margin-right: 8px;
}

.link-group .el-link:last-child {
  margin-right: 0px;
}

:deep(.el-descriptions__cell) {
  border-left: none !important;
}

.isAdmin {
  :deep(.el-tabs__header) {
    display: none;
  }
}

.upload-box {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  width: 100px;
  height: 100px;
  line-height: 100px;
  background-color: #fff;

  .upload-hd {
    display: block;
    height: 100px;
  }

  .avatar-uploadered {
    display: flex;
    justify-content: center;
    align-items: center;
    cursor: pointer;
  }

  .avatar-uploadered-icon {
    display: block;
    // font-size: 28px;
    color: #8c939d;
    width: 100%;
    height: 100px;
    line-height: normal;
    text-align: center;

    .el-icon {
      margin-top: 22px;
    }

    span {
      display: inherit;
      font-style: normal;
      font-size: 5px;
      line-height: normal;
    }
  }

  .handle-bar {
    height: 20px;
    z-index: 5;
    position: absolute;
    width: 100%;
    color: #000;
    background: #f4f4f5;
    bottom: 0;

    .text-center {
      display: block;
      height: 20px;
      line-height: 20px;
      font-size: 12px;
    }
  }

  .images-box {
    position: relative;
    display: block;
    min-height: 1px;
    border: 0;
    line-height: 0;
    background: var(--el-fill-color-light);
    overflow: hidden;

    :deep(.el-image__wrapper) {
      position: relative;
      line-height: 100px;
      text-align: center;
    }
  }
}

.avatar-alert {
  line-height: 100%;
  margin-top: 8px;

  :deep(.el-alert__title) {
    line-height: 100%;
    font-size: 12px;
  }
}

.dialog-empty {
  display: block;
  margin: auto;
}
</style>
