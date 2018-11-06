import Vue from 'vue'
import Router from 'vue-router'
import Login from '@/views/Account/Login'
import Home from '@/views/Base/Home'
import Help from '@/views/Others/Help'
import Error from '@/views/Others/404'
// 元数据管理
import MetaDataList from '@/views/MetaConfig/MetaData/MetaDataList'
import BaseFieldList from '@/views/MetaConfig/MetaData/BaseFieldList'
import NewMetaData from '@/views/MetaConfig/MetaData/NewMetaData'
import EditMetaData from '@/views/MetaConfig/MetaData/EditMetaData'
// 自定义数据指标
import CustomDataList from '@/views/MetaConfig/CustomData/CustomDataList'
import CustomDataQuota from '@/views/MetaConfig/CustomData/CustomDataQuota'
import EditCustomData from '@/views/MetaConfig/CustomData/EditCustomData'
// 模板管理
import NewTemplate from '@/views/MetaConfig/TemplateData/NewTemplate'
import RoleTemplate from '@/views/MetaConfig/TemplateData/RoleTemplate'
import EditTemplate from '@/views/MetaConfig/TemplateData/EditTemplate'
import TemplateList from '@/views/MetaConfig/TemplateData/TemplateList'
// 新建筛选器
import CustomFilterList from '@/views/MetaConfig/CustomFilter/CustomFilterList'
// 用户权限
import UserPermissions from '@/views/MetaConfig/Permissions/UserPermissions'
// 数据库列表
import DatabaseInfo from '@/views/MetaConfig/DatabaseData/DatabaseTabs'

Vue.use(Router)

export default new Router({
  // mode: 'history',
  routes: [
    {
      path: '/login',
      component: Login
    },
    {
      path: '/',
      component: Home,
      redirect: '/metaDataList',
      children: [
        { path: '/metaDataList', component: MetaDataList },
        { path: '/baseFieldList', component: BaseFieldList },
        { path: '/editMetaData', component: EditMetaData },
        { path: '/newMetaData', component: NewMetaData },
        { path: '/customDataList', component: CustomDataList },
        { path: '/customDataQuota', component: CustomDataQuota },
        { path: '/editCustomData', component: EditCustomData },
        { path: '/templateList', component: TemplateList },
        { path: '/newTemplate', component: NewTemplate },
        { path: '/editTemplate', component: EditTemplate },
        { path: '/roleTemplate', component: RoleTemplate },
        { path: '/userPermissions', component: UserPermissions },
        { path: '/customFilterList', component: CustomFilterList },
        { path: '/databaseInfo/:id', component: DatabaseInfo }
      ]
    },
    {
      path: '/help',
      component: Help
    },
    {
      path: '*',
      component: Error
    }
  ]
})

// Router.before
