<template>
    <div>
        <!-- 面包屑导航区 -->
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/welcome' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>dnf</el-breadcrumb-item>
            <el-breadcrumb-item>游戏角色</el-breadcrumb-item>
        </el-breadcrumb>

        <el-card class="box-card">
            <div style="margin-top: 15px;">
                <el-row :gutter="20">
                    <el-col :span="7">
                        <el-input placeholder="请输入内容" v-model="queryInfo.searchText" clearable
                                  @clear="getRoleList()">
                            <el-button slot="append" icon="el-icon-search" @click="getRoleListSearch()"></el-button>
                        </el-input>
                    </el-col>
                    <el-col :sm="4">
                        <el-button type="primary"
                                   @click="addDialogVisible = true, queryAccountList(), queryCareerTrees()">添加账号
                        </el-button>
                    </el-col>
                </el-row>

                <el-table :data="roleList" style="width: 100%" border stripe>
                    <el-table-column type="index"></el-table-column>
                    <el-table-column label="名称" prop="name"></el-table-column>
                    <el-table-column label="职业" prop="career"></el-table-column>
                    <el-table-column label="等级" prop="level"></el-table-column>
                    <el-table-column label="所属账号" prop="account"></el-table-column>
                    <el-table-column label="创建时间" prop="createTime"></el-table-column>
                    <el-table-column label="更新时间" prop="updateTime"></el-table-column>
                    <!--                    <el-table-column label="操作">-->
                    <!--                        <template slot-scope="scope">-->
                    <!--                            <el-button type="primary" icon="el-icon-edit" size="mini"-->
                    <!--                                       @click="showEditDialog(scope.row.id)"></el-button>-->
                    <!--                            <el-button type="danger" icon="el-icon-delete" size="mini"-->
                    <!--                                       @click="deleteUserById(scope.row.id)" content="删除"></el-button>-->
                    <!--                            <el-tooltip class="item" effect="dark" content="分配角色权限" placement="top" :enterable="false">-->
                    <!--                                <el-button type="warning" icon="el-icon-setting" size="mini"></el-button>-->
                    <!--                            </el-tooltip>-->
                    <!--                        </template>-->
                    <!--                    </el-table-column>-->
                </el-table>

                <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange"
                               :current-page="queryInfo.pageNo" :page-sizes="[1, 5, 10, 20]"
                               :page-size="queryInfo.pageSize"
                               layout="total, sizes, prev, pager, next, jumper" :total="total">
                </el-pagination>
            </div>
        </el-card>

        <el-dialog title="添加角色" :visible.sync="addDialogVisible" width="30%">
            <el-form :model="roleForm" :rules="roleFormRules" ref="roleFormRef" label-width="100px">
                <el-form-item label="名称" prop="name">
                    <el-input v-model="roleForm.name"></el-input>
                </el-form-item>
                <el-form-item label="所属账号" prop="account">
                    <el-select v-model="roleForm.accountId" placeholder="请选择">
                        <el-option v-for="item in accountList" :key="item.id"
                                :label="item.account" :value="item.id">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="等级" prop="level">
                    <el-input-number v-model="roleForm.level" :min="1" :max="100" label="描述文字"></el-input-number>
                </el-form-item>
                <el-form-item label="职业" prop="career">
                    <el-cascader v-model="roleForm.career" :options="careerTrees"
                                 :props="this.careerProps" :show-all-levels="false"></el-cascader>
                </el-form-item>
            </el-form>

            <span slot="footer" class="dialog-footer">
                <el-button @click="addDialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="addRole()">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
    export default {
        data() {
            return {
                queryInfo: {
                    searchText: '',
                    pageNo: 1,
                    pageSize: 10,
                    orderBy: 'id',
                    asc: true
                },
                roleList: [],
                total: 0,
                addDialogVisible: false,
                roleForm: {
                    accountId: '',
                    name: '',
                    level: 1,
                    career: ''
                },
                roleFormRules: {
                    accountId: [
                        {required: true, message: '请选择账号', trigger: 'blur'}
                    ],
                    name: [
                        {required: true, message: '请输入角色名称', trigger: 'blur'}
                    ],
                    level: [
                        {required: true, message: '请输入角色等级', trigger: 'blur'},
                        {type: 'number', message: '请输入数字', trigger: 'blur'},
                    ],
                    career: [
                        {required: true, message: '请输入QQ账号', trigger: 'blur'},
                        {type: 'number', message: '账号必须为全数字', trigger: 'blur'},
                        {min: 6, max: 12, message: '用户名长度在6到12之间', trigger: 'blur'}
                    ]
                },
                accountList: [],
                careerTrees: [],
                careerProps: {
                    expandTrigger: 'hover',
                    label: 'label',
                    value: 'label',
                    emitPath: false
                }
            }
        },
        created() {
            this.getRoleList()
        },
        methods: {
            async refreshRoleList() {
                this.queryInfo = {
                    searchText: '',
                    pageNo: 1,
                    pageSize: 10,
                    orderBy: 'id',
                    asc: true
                }
                this.getRoleList()
            },
            async getRoleList() {
                const {data: res} = await this.$http.post('/dnf/role/selectPage', this.queryInfo);
                if (res.code === 0)
                    return this.$message.error(res.message)
                if (res.data == null) {
                    this.roleList = []
                    this.total = 0
                    return
                }
                this.roleList = res.data.records
                for (let i = 0; i < this.roleList.length; i++) {
                    let role = this.roleList[i]
                    role.createTime = this.formatTimeStamp(role.createTime)
                    role.updateTime = this.formatTimeStamp(role.updateTime)
                }
                this.total = res.data.total
            },
            getRoleListSearch() {
                this.queryInfo.pageNo = 1
                this.getRoleList()
            },
            handleSizeChange(newSize) {
                this.queryInfo.pageSize = newSize
                this.getRoleList()
            },
            handleCurrentChange(newNo) {
                this.queryInfo.pageNo = newNo
                this.getRoleList()
            },
            async queryAccountList() {
                const {data: res} = await this.$http.get('/dnf/account/list');
                if (res.code !== 1)
                    return this.$message.error('获取账号失败！')
                this.accountList = res.data
            },
            async queryCareerTrees() {
                const {data: res} = await this.$http.get('/dnf/career/tree');
                if (res.code !== 1) {
                    return this.$message.error('获取职业树失败！')
                }
                this.careerTrees = res.data
            },
            async addRole() {
                console.log(this.roleForm)
                const {data: res} = await this.$http.post('/dnf/role', this.roleForm);
                if (res.code !== 1) {
                    return this.$message.error('添加角色失败！')
                }
                this.$message.success('添加角色成功！')
                await this.refreshRoleList()
                this.addDialogVisible = false
            },
            formatTimeStamp(timeStamp) {
                const unixDate = new Date(timeStamp);
                const year = unixDate.getFullYear();
                const month = "0" + (unixDate.getMonth() + 1);
                const date = "0" + unixDate.getDate();
                const hour = "0" + unixDate.getHours();
                const minute = "0" + unixDate.getMinutes();
                const second = "0" + unixDate.getSeconds();
                return year + "-" + month.substring(month.length - 2, month.length) + "-" + date.substring(date.length - 2, date.length)
                    + " " + hour.substring(hour.length - 2, hour.length) + ":"
                    + minute.substring(minute.length - 2, minute.length) + ":"
                    + second.substring(second.length - 2, second.length);
            }
        }
    }
</script>

<style scoped>

</style>
