<template>
    <div>
        <!-- 面包屑导航区 -->
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/welcome' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>dnf</el-breadcrumb-item>
            <el-breadcrumb-item>QQ账号</el-breadcrumb-item>
        </el-breadcrumb>

        <el-card class="box-card">
            <div style="margin-top: 15px;">
                <el-row :gutter="20">
                    <el-col :span="7">
                        <el-input placeholder="请输入内容" v-model="queryInfo.searchText" clearable
                                  @clear="getAccountList()">
                            <el-button slot="append" icon="el-icon-search" @click="getAccountListSearch()"></el-button>
                        </el-input>
                    </el-col>
                    <el-col :sm="4">
                        <el-button type="primary" @click="addDialogVisible = true">添加账号</el-button>
                    </el-col>
                </el-row>

                <el-table :data="accountList" style="width: 100%" border stripe>
                    <el-table-column type="index"></el-table-column>
                    <el-table-column label="账号" prop="account"></el-table-column>
                    <el-table-column label="创建时间" prop="createTime"></el-table-column>
                    <el-table-column label="角色数量" prop="roleCount"></el-table-column>
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

        <el-dialog title="添加账号" :visible.sync="addDialogVisible" width="30%">
            <el-form :model="accountForm" :rules="accountFormRules" ref="ruleFormRef" label-width="100px">
                <el-form-item label="账号" prop="name">
                    <el-input v-model="accountForm.account"></el-input>
                </el-form-item>
            </el-form>

            <span slot="footer" class="dialog-footer">
                <el-button @click="addDialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="addAccount()">确 定</el-button>
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
                accountList: [],
                total: 0,
                addDialogVisible: false,
                accountForm: {
                    account: ''
                },
                accountFormRules: {
                    account: [
                        {required: true, message: '请输入QQ账号', trigger: 'blur'},
                        {type: 'number', message: '账号必须为全数字', trigger: 'blur'},
                        {min: 6, max: 12, message: '用户名长度在6到12之间', trigger: 'blur'}
                    ]
                }
            }
        },
        created() {
            this.getAccountList()
        },
        methods: {
            async refreshAccountList() {
                this.queryInfo = {
                    searchText: '',
                    pageNo: 1,
                    pageSize: 10,
                    orderBy: 'id',
                    asc: true
                }
                this.getAccountList()
            },
            async getAccountList() {
                const {data: res} = await this.$http.post('/dnf/account/selectPage', this.queryInfo);
                if (res.code === 0)
                    return this.$message.error(res.message)
                this.accountList = res.data.records
                for (let i=0; i<this.accountList.length; i++) {
                    let account = this.accountList[i]
                    account.createTime = this.formatTimeStamp(account.createTime)
                }
                this.total = res.data.total
            },
            getAccountListSearch() {
                this.queryInfo.pageNo = 1
                this.getAccountList()
            },
            handleSizeChange(newSize) {
                this.queryInfo.pageSize = newSize
                this.getAccountList()
            },
            handleCurrentChange(newNo) {
                this.queryInfo.pageNo = newNo
                this.getAccountList()
            },
            async addAccount() {
                const {data: res} = await this.$http.post('/dnf/account', this.accountForm);
                if (res.code !== 1) {
                    return this.$message.error('添加账号失败！')
                }
                this.$message.success('添加账号成功！')
                await this.refreshAccountList()
                this.addDialogVisible = false
            },
            formatTimeStamp (timeStamp){
                const unixDate = new Date(timeStamp);
                const year = unixDate.getFullYear();
                const month = "0" + (unixDate.getMonth() + 1);
                const date = "0" + unixDate.getDate();
                const hour = "0" + unixDate.getHours();
                const minute = "0" + unixDate.getMinutes();
                const second = "0" + unixDate.getSeconds();
                return year + "-" + month.substring(month.length-2, month.length)  + "-" + date.substring(date.length-2, date.length)
                    + " " + hour.substring(hour.length-2, hour.length) + ":"
                    + minute.substring(minute.length-2, minute.length) + ":"
                    + second.substring(second.length-2, second.length);
            }
        }
    }
</script>

<style scoped>

</style>
