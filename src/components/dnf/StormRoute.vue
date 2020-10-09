<template>
    <div>
        <!-- 面包屑导航区 -->
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/welcome' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>dnf</el-breadcrumb-item>
            <el-breadcrumb-item>风暴航路</el-breadcrumb-item>
        </el-breadcrumb>

        <div style="margin-top: 15px;">
            <el-row :gutter="20">
                <el-col :sm="4">
                    <el-select v-model="firstBoss" placeholder="请选择" @change="selectFirstBoss(firstBoss)">
                        <el-option v-for="item in firstBossList" :key="item"
                                   :label="item" :value="item">
                        </el-option>
                    </el-select>
                </el-col>
                <el-col :sm="4">
                    <el-select v-model="secondBoss" placeholder="请选择" @change="refreshStormRouteList">
                        <el-option v-for="item in secondBossList" :key="item"
                                   :label="item" :value="item">
                        </el-option>
                    </el-select>
                </el-col>

                <el-col :sm="6">
                    <el-button type="primary"
                               @click="addDialogVisible = true, queryAddFirstBossList(), getRoleList()">
                        添加风暴航路通关记录
                    </el-button>
                </el-col>

                <el-col :sm="3">
                    <el-button icon="el-icon-refresh" @click="refreshStormRouteList" ></el-button>
                </el-col>
            </el-row>

            <el-table :data="stormRouteList" style="width: 100%" border stripe >
                <el-table-column type="index"></el-table-column>
                <el-table-column label="角色" prop="roleName"></el-table-column>
                <el-table-column label="通关时间" prop="passTimeString"></el-table-column>
                <el-table-column label="创建时间" prop="createTime"></el-table-column>
                <el-table-column label="更新时间" prop="updateTime"></el-table-column>
            </el-table>

            <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange"
                           :current-page="queryInfo.pageNo" :page-sizes="[1, 5, 10, 20]"
                           :page-size="queryInfo.pageSize"
                           layout="total, sizes, prev, pager, next, jumper" :total="total">
            </el-pagination>
        </div>


        <el-dialog title="添加暴风航路通关记录" :visible.sync="addDialogVisible" width="30%">
            <el-form :model="stormRouteForm" :rules="stormRouteFormRules" ref="stormRouteFormRef" label-width="100px">
                <el-form-item label="第一Boss" prop="firstBoss">
                    <el-select v-model="stormRouteForm.firstBoss" placeholder="请选择"
                               @change="queryAddSecondBossList(stormRouteForm.firstBoss)">
                        <el-option v-for="item in addFirstBossList" :key="item"
                                   :label="item" :value="item">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="第二Boss" prop="secondBoss">
                    <el-select v-model="stormRouteForm.secondBoss" placeholder="请选择">
                        <el-option v-for="item in addSecondBossList" :key="item"
                                   :label="item" :value="item">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="角色" prop="roleId">
                    <el-select v-model="stormRouteForm.roleId" placeholder="请选择">
                        <el-option v-for="item in roleList" :key="item.id"
                                   :label="item.name" :value="item.id">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="通关时长">
                    <el-row>
                        <el-col :span="6">
                            <el-input v-model="stormRouteForm.minute" />
                        </el-col>
                        <el-col :span="2" >分</el-col>
                        <el-col :span="6">
                            <el-input v-model="stormRouteForm.second" />
                        </el-col>
                        <el-col :span="2" >秒</el-col>
                        <el-col :span="6">
                            <el-input v-model="stormRouteForm.millisecond" />
                        </el-col>
                    </el-row>
                </el-form-item>

            </el-form>

            <span slot="footer" class="dialog-footer">
                <el-button @click="addDialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="addStormRoute()">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
    export default {
        data() {
            return {
                firstBoss: '',
                secondBoss: '',
                firstBossList: [],
                secondBossList: [],
                queryInfo: {
                    firstBoss: '',
                    secondBoss: '',
                    pageNo: 1,
                    pageSize: 10,
                    orderBy: 'id',
                    asc: true
                },
                stormRouteList: [],
                total: 0,
                addDialogVisible: false,
                addFirstBossList: [],
                addSecondBossList: [],
                stormRouteForm: {
                    firstBoss: '',
                    secondBoss: '',
                    roleId: '',
                    minute: 0,
                    second: 0,
                    millisecond: 0
                },
                stormRouteFormRules: {
                    firstBoss: [
                        {required: true, message: '请选择第一Boss', trigger: 'blur'}
                    ],
                    secondBoss: [
                        {required: true, message: '请选择第二Boss', trigger: 'blur'}
                    ],
                    roleId: [
                        {required: true, message: '请选择角色', trigger: 'blur'}
                    ],
                },
                roleList: []
            }
        },
        created() {
            this.init()
        },
        methods: {
            async init() {
                this.firstBossList = await this.queryFirstBossList()
                this.firstBoss = this.firstBossList[0]

                this.secondBossList = await this.querySecondBossList(this.firstBoss)
                this.secondBoss = this.secondBossList[0]

                this.queryInfo.firstBoss = this.firstBoss
                this.queryInfo.secondBoss = this.secondBoss

                await this.getStormRouteList()

            },
            async queryFirstBossList() {
                const {data: res} = await this.$http.get('/dnf/stormRoute/firstBoss');
                if (res.code !== 1)
                    return this.$message.error('获取风暴航路第一Boss列表失败！')
                return res.data
            },
            async querySecondBossList(firstBoss) {
                const {data: res} = await this.$http.get(`/dnf/stormRoute/secondBoss?firstBoss=${firstBoss}`);
                if (res.code !== 1)
                    return this.$message.error('获取风暴航路第二Boss列表失败！')
                return res.data
            },
            async selectFirstBoss(firstBoss) {
                this.secondBossList = await this.querySecondBossList(firstBoss)
                this.secondBoss = this.secondBossList[0]

                await this.refreshStormRouteList()
            },
            async refreshStormRouteList() {
                this.queryInfo = {
                    firstBoss: this.firstBoss,
                    secondBoss: this.secondBoss,
                    pageNo: 1,
                    pageSize: 10,
                    orderBy: 'id',
                    asc: true
                }
                await this.getStormRouteList()
            },
            async getStormRouteList() {
                const {data: res} = await this.$http.post('/dnf/stormRoute/selectPage', this.queryInfo);
                if (res.code === 0)
                    return this.$message.error(res.message)
                if (res.data == null) {
                    this.stormRouteList = []
                    this.total = 0
                    return
                }
                this.stormRouteList = res.data.records
                for (let i = 0; i < this.stormRouteList.length; i++) {
                    let stormRoute = this.stormRouteList[i]
                    stormRoute.createTime = this.formatTimeStamp(stormRoute.createTime)
                    stormRoute.updateTime = this.formatTimeStamp(stormRoute.updateTime)
                }
                this.total = res.data.total
            },
            handleSizeChange(newSize) {
                this.queryInfo.pageSize = newSize
                this.getRoleList()
            },
            handleCurrentChange(newNo) {
                this.queryInfo.pageNo = newNo
                this.getRoleList()
            },
            async getRoleList() {
                const {data: res} = await this.$http.get('/dnf/role');
                if (res.code === 0)
                    return this.$message.error(res.message)
                this.roleList = res.data
            },
            async queryAddFirstBossList() {
                this.addFirstBossList = await this.queryFirstBossList()
                this.stormRouteForm.firstBoss = this.addFirstBossList[0]

                this.addSecondBossList = await this.querySecondBossList(this.stormRouteForm.firstBoss)
                this.stormRouteForm.secondBoss = this.addSecondBossList[0]
            },
            async queryAddSecondBossList(firstBoss) {
                this.addSecondBossList = await this.querySecondBossList(firstBoss)
                this.stormRouteForm.secondBoss = this.addSecondBossList[0]
            },
            async addStormRoute() {
                const {data: res} = await this.$http.post('/dnf/stormRoute', this.stormRouteForm);
                if (res.code !== 1) {
                    return this.$message.error('添加暴风航路通关记录失败！')
                }
                this.$message.success('添加暴风航路通关记录成功！')
                await this.refreshStormRouteList()
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
