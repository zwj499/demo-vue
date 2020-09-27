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
                        <el-input placeholder="请输入内容" v-model="queryInfo.name" clearable @clear="getUserList()">
                            <el-button slot="append" icon="el-icon-search" @click="getUserListSearch()"></el-button>
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
                        <template slot-scope="scope">
                            <el-button type="primary" icon="el-icon-edit" size="mini"
                                       @click="showEditDialog(scope.row.id)"></el-button>
                            <el-button type="danger" icon="el-icon-delete" size="mini"
                                       @click="deleteUserById(scope.row.id)" content="删除"></el-button>
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

        <el-dialog title="添加用户" :visible.sync="dialogVisible" width="30%">
            <el-form :model="userForm" :rules="userFormRules" ref="ruleFormRef" label-width="100px">
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
                <el-button type="primary" @click="addUser">确 定</el-button>
            </span>
        </el-dialog>

        <el-dialog title="修改用户" :visible.sync="editDialogVisible" width="50%">
            <el-form :model="editForm" :rules="editFormRules" ref="editForm" label-width="100px">
                <el-form-item label="用户名" prop="name">
                    <el-input v-model="editForm.name" disabled></el-input>
                </el-form-item>
                <el-form-item label="电话" prop="phone">
                    <el-input v-model="editForm.phone"></el-input>
                </el-form-item>
                <el-form-item label="邮箱" prop="email">
                    <el-input v-model="editForm.email"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="editDialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="editUser()">确 定</el-button>
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
                        {required: true, message: '请输入用户名', trigger: 'blur'},
                        {min: 3, max: 10, message: '用户名长度在3到10之间', trigger: 'blur'}
                    ],
                    password: [
                        {required: true, message: '请输入密码', trigger: 'blur'},
                        {min: 6, max: 16, message: '密码长度在3到10之间', trigger: 'blur'}
                    ],
                    phone: [
                        {required: true, message: '请输入电话号码', trigger: 'blur'}
                    ]
                },
                editDialogVisible: false,
                editForm: {},
                editFormRules: {
                    phone: [
                        {required: true, message: '请输入电话号码', trigger: 'blur'}
                    ]
                },
                deleteDialogVisible: false,
                deleteId: {}
            }
        },
        created() {
            this.refreshUserList()
        },
        methods: {
            async refreshUserList() {
                const {data: res} = await this.$http.post('/sysUser/selectPage', {
                    name: '',
                    pageNo: 1,
                    pageSize: 10,
                    orderBy: 'id',
                    asc: true
                });
                if (res.code === 0) return this.$message.error(res.message)
                this.userList = res.data.records
                this.total = res.data.total
            },
            async getUserList() {
                const {data: res} = await this.$http.post('/sysUser/selectPage', this.queryInfo);
                if (res.code === 0) return this.$message.error(res.message)
                this.userList = res.data.records
                this.total = res.data.total
            },
            getUserListSearch() {
                this.queryInfo.pageNo = 1
                this.getUserList()
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
                const {data: res} = await this.$http.put(`/sysUser/${userInfo.id}/active?active=${userInfo.active}`)
                if (res.code !== 1) {
                    userInfo.active = !userInfo.active
                    return this.$message.error('更新用户状态失败！')
                }
                this.$message.success('更新用户状态成功！')
            },
            async addUser() {
                const {data: res} = await this.$http.post(`/sysUser`, this.userForm)
                if (res.code !== 1) {
                    return this.$message.error('添加用户失败！')
                }
                this.$message.success('添加用户成功！')
                await this.refreshUserList()
                this.dialogVisible = false
            },
            async showEditDialog(id) {
                const {data: res} = await this.$http.get(`/sysUser/` + id)
                if (res.code !== 1) {
                    return this.$message.error('查询用户信息失败！')
                }
                this.editForm = res.data

                this.editDialogVisible = true
            },
            async editUser() {
                const {data: res} = await this.$http.put(`/sysUser/` + this.editForm.id, this.editForm)
                if (res.code !== 1) {
                    return this.$message.error('修改用户信息失败！')
                }
                this.$message.success('修改用户信息成功！')
                await this.refreshUserList()

                this.editDialogVisible = false
            },
            async deleteUserById(id) {
                const confirmResult = await this.$confirm('是否删除用户', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).catch(err => err)
                if (confirmResult === 'confirm') {
                    const {data : res} =  await this.$http.delete(`/sysUser/` + id)
                    if (res.code !== 1) {
                        return this.$message.error('删除用户失败！')
                    }
                    this.$message.success('删除用户成功！')

                    await this.refreshUserList()
                }
            }
        },
    }
</script>

<style scoped>

</style>