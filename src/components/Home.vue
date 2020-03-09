<template>
    <el-container class="home-container">
        <!-- 头部区域 -->
        <el-header height="150px">
            <div>
                <img src="../assets/dnf.png" alt="">
                <span>小骚逼系统</span>
            </div>
            <el-button type='info' @click="logout">退出</el-button>
        </el-header>
        <el-container>
            <el-aside :width="isCollapse ? '64px' : '200px'">
                <div class="toggle-button" @click="toggleCollapse">|||</div>
                <el-menu background-color="#545c64" text-color="#fff" active-text-color="#ffd04b" unique-opened :collapse="isCollapse"
                         :collapse-transition="false" router :default-active="activePath">
                    <el-submenu :index="item.id + ''" v-for="item in menuList" :key="item.id">
                        <template slot="title">
                            <i :class="iconObj[item.id]"></i>
                            <span>{{ item.authName }}</span>
                        </template>
                        <el-menu-item :index="'/' + subItem.path" v-for="subItem in item.children" :key="subItem.id"
                                      @click="saveNavState('/' + subItem.path)">
                            <template slot="title">
                                <i class="el-icon-menu"></i>
                                <span>{{ subItem.authName }}</span>
                            </template>
                        </el-menu-item>
                    </el-submenu>
                </el-menu>
            </el-aside>
            <el-main>
                <router-view></router-view>
            </el-main>
        </el-container>
    </el-container>
</template>

<script>
export default {
    data() {
        return {
            menuList: [
                {
                    id: 1,
                    authName: "用户管理",
                    path: "user",
                    children: [
                        {
                            id: 101,
                            authName: "用户列表",
                            path: "sys_user",
                        }
                    ]
                },
                {
                    id: 2,
                    authName: "权限管理",
                    path: "rights",
                    children: [
                        {
                            id: 201,
                            authName: "权限角色",
                            path: "sys_role",
                        },
                        {
                            id: 202,
                            authName: "权限菜单",
                            path: "sys_permission",
                        }
                    ]
                },
                {
                    id: 3,
                    authName: "dnf管理",
                    path: "dnf_manage",
                    children: [
                        {
                            id: 301,
                            authName: "游戏角色",
                            path: "dnf_role",
                        },
                        {
                            id: 302,
                            authName: "记录",
                            path: "record",
                        }
                    ]
                }
            ],
            iconObj: {
                1: 'el-icon-setting',
                2: 'el-icon-setting',
                3: 'el-icon-setting'
            },
            isCollapse: false,
            activePath: ''
        }
    },
    created() {
        this.getMenuList()
        this.activePath = window.sessionStorage.getItem('activePath')
    },
    methods: {
        logout() {
            window.sessionStorage.clear();
            this.$router.push("/login")
        },
         getMenuList() {
            // const {data: res} = await this.$http.get('/menus')
            // if(res.meta.status !== 200) return this.$message.error(res.meta.message)
            // this.menuList = res.data
        },
        toggleCollapse() {
            this.isCollapse = !this.isCollapse
        },
        saveNavState(activePath) {
            window.sessionStorage.setItem('activePath', activePath)
            this.activePath = activePath
        }
    }
}
</script>

<style lang="less" scoped>
.el-header {
    height: 300px;
    background-color: rgba(209, 206, 36, 0.425);
    display: flex;
    justify-content: space-between;
    padding-left: 0;
    align-items: center;
    color: rgb(30, 16, 153);
    font-size: 20px;
    > div {
        display: flex;
        align-items: center;
        span {
            margin-left: 15px;
        }
    }
}
.el-aside {
    background-color: #545c64;
    .el-menu {
        border-right: none;
    }
}
.el-main {
    background-color: #fff;
}
.home-container {
    height: 100%;
}
.toggle-button {
    background-color: cadetblue;
    font-size: 10px;
    line-height: 24px;
    color: white;
    text-align: center;
    letter-spacing: 0.2em;
    cursor: pointer;
}
</style>