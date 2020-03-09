<template>
    <div>
        <!-- 面包屑导航区 -->
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/welcome' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>用户管理</el-breadcrumb-item>
            <el-breadcrumb-item>用户列表</el-breadcrumb-item>
        </el-breadcrumb>

        <el-card class="box-card">
            <div style="margin-top: 15px;">
                <el-row :gutter="20">
                    <el-col :span="7">
                        <el-input placeholder="请输入内容" v-model="queryInfo.name" clearable @clear="getUserList">
                            <el-button slot="append" icon="el-icon-search" @click="getUserList"></el-button>
                        </el-input>
                    </el-col>
                    <el-col :sm="4">
                        <el-button type="primary" @click="dialogVisible = true">添加用户</el-button>
                    </el-col>
                </el-row>

                <el-table :data="userList" style="width: 100%" border stripe>
                    <el-table-column type="index"></el-table-column>
                    <el-table-column label="姓名" prop="name"></el-table-column>
                    <el-table-column label="用户等级" prop="level"></el-table-column>
                    <el-table-column label="电话" prop="phone"></el-table-column>
                    <el-table-column label="邮箱" prop="email"></el-table-column>
                    <el-table-column label="状态">
                        <template slot-scope="scope">
                            <el-switch v-model="scope.row.active" @change="userStateChange(scope.row)"></el-switch>
                        </template>
                    </el-table-column>
                    <el-table-column label="操作">
                        <template>
                            <el-button type="primary" icon="el-icon-edit" size="mini"></el-button>
                            <el-button type="danger" icon="el-icon-delete" size="mini"></el-button>
                            <el-tooltip class="item" effect="dark" content="分配角色权限" placement="top" :enterable="false">
                                <el-button type="warning" icon="el-icon-setting" size="mini"></el-button>
                            </el-tooltip>
                        </template>
                    </el-table-column>
                </el-table>

                <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange"
                               :current-page="queryInfo.pageNo" :page-sizes="[1, 5, 10, 20]"
                               :page-size="queryInfo.pageSize"
                               layout="total, sizes, prev, pager, next, jumper" :total="total">
                </el-pagination>
            </div>
        </el-card>
        <el-dialog title="添加用户" :visible.sync="dialogVisible" width="30%" @close="">
            <el-form :model="userForm" :rules="userFormRules" ref="ruleForm" label-width="100px">
                <el-form-item label="用户名" prop="name">
                    <el-input v-model="userForm.name"></el-input>
                </el-form-item>
                <el-form-item label="密码" prop="password">
                    <el-input v-model="userForm.password"></el-input>
                </el-form-item>
                <el-form-item label="电话" prop="phone">
                    <el-input v-model="userForm.phone"></el-input>
                </el-form-item>
                <el-form-item label="邮箱" prop="email">
                    <el-input v-model="userForm.email"></el-input>
                </el-form-item>
            </el-form>

            <span slot="footer" class="dialog-footer">
                <el-button @click="dialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="dialogVisible = false">确 定</el-button>
            </span>
        </el-dialog>

    </div>
</template>

<script>
    export default {
        data() {
            return {
                queryInfo: {
                    name: '',
                    pageNo: 1,
                    pageSize: 10,
                    orderBy: 'id',
                    asc: true
                },
                userList: [],
                total: 0,
                dialogVisible: false,
                userForm: {
                    username: '',
                    password: '',
                    phone: '',
                    email: ''
                },
                userFormRules: {
                    name: [
                        { required: true, message: '请输入用户名', trigger: 'blur'},
                        { min: 3, max: 10, message: '用户名长度在3到10之间', trigger: 'blur'}
                    ],
                    password: [
                        { required: true, message: '请输入密码' , trigger: 'blur'},
                        { min: 6, max: 16, message: '密码长度在3到10之间', trigger: 'blur'}
                    ],
                    phone: [
                        { required: true, message: '请输入电话号码' , trigger: 'blur'}
                    ]
                }
            }
        },
        created() {
            this.getUserList()
        },
        methods: {
            async getUserList() {
                const {data: res} = await this.$http.post('/sys_user/selectPage', this.queryInfo);
                if (res.code === 0) return this.$message.error(res.message)
                this.userList = res.data.records
                this.total = res.data.total
            },
            handleSizeChange(newSize) {
                this.queryInfo.pageSize = newSize
                this.getUserList()
            },
            handleCurrentChange(newNo) {
                this.queryInfo.pageNo = newNo
                this.getUserList()
            },
            async userStateChange(userInfo) {
                const {data: res} = await this.$http.put(`/sys_user/${userInfo.id}/active?active=${userInfo.active}`)
                if (res.code !== 1) {
                    userInfo.active = !userInfo.active
                    return this.$message.error('更新用户状态失败！')
                }
                this.$message.success('更新用户状态成功！')
            },
            async addUser(userInfo) {
                const {data: res} = await this.$http.put(`/sys_user/${userInfo.id}/active?active=${userInfo.active}`)
                if (res.code !== 1) {
                    return this.$message.error('添加用户失败！')
                }
                this.$message.success('添加用户成功！')
            }
        },
    }
</script>

<style scoped>

</style>