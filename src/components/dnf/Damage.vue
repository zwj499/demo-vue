<template>
    <div>
        <!-- 面包屑导航区 -->
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/welcome' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>dnf</el-breadcrumb-item>
            <el-breadcrumb-item>修炼场</el-breadcrumb-item>
        </el-breadcrumb>


        <el-tabs type="card" v-model="monster" style="width: 100%">
            <el-tab-pane :key="item1" v-for="item1 in monsterList" :label="item1" :name="item1"
                         @click="monster = item1">
                <el-tabs type="border-card" v-model="duration" style="width: 100%" @tab-click="refreshDamageList()">
                    <el-tab-pane :key="item2" v-for="item2 in durationList" :label="item2" :name="item2">
                        <div style="margin-top: 15px;">
                            <el-row :gutter="20">
                                <el-col :sm="4">
                                    <el-button type="primary"
                                               @click="addDialogVisible = true, refreshDamageForm(), getRoleList()">
                                        添加修炼场记录
                                    </el-button>
                                </el-col>
                            </el-row>

                            <el-table :data="damageList" style="width: 100%" border stripe
                                      :default-sort="{prop: 'damage', order: 'descending'}"
                                      @sort-change="sortChange">
                                <el-table-column type="index"></el-table-column>
                                <el-table-column label="角色" prop="roleName"></el-table-column>
                                <el-table-column label="伤害" sortable="custom" prop="damage"></el-table-column>
                                <el-table-column label="创建时间" prop="createTime"></el-table-column>
                                <el-table-column label="更新时间" prop="updateTime"></el-table-column>
                            </el-table>

                            <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange"
                                           :current-page="queryInfo.pageNo" :page-sizes="[1, 5, 10, 20]"
                                           :page-size="queryInfo.pageSize"
                                           layout="total, sizes, prev, pager, next, jumper" :total="total">
                            </el-pagination>
                        </div>
                    </el-tab-pane>
                </el-tabs>
            </el-tab-pane>
        </el-tabs>

        <el-dialog title="添加修炼场记录" :visible.sync="addDialogVisible" width="30%">
            <el-form :model="damageForm" :rules="damageFormRules" ref="damageFormRef" label-width="100px">
                <el-form-item label="怪物" prop="monster">
                    <el-input v-model="damageForm.monster" disabled></el-input>
                </el-form-item>
                <el-form-item label="时长" prop="duration">
                    <el-input v-model="damageForm.duration" disabled></el-input>
                </el-form-item>
                <el-form-item label="角色" prop="roleId">
                    <el-select v-model="damageForm.roleId" placeholder="请选择">
                        <el-option v-for="item in roleList" :key="item.id"
                                   :label="item.name" :value="item.id">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="伤害" prop="duration">
                    <el-input v-model="damageForm.damage"></el-input>
                </el-form-item>
            </el-form>

            <span slot="footer" class="dialog-footer">
                <el-button @click="addDialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="addDamage()">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
    export default {
        data() {
            return {
                monsterList: [],
                durationList: [],
                monster: '',
                duration: '',
                queryInfo: {
                    monster: '',
                    duration: '',
                    pageNo: 1,
                    pageSize: 10,
                    orderBy: 'id',
                    asc: true
                },
                damageList: [],
                total: 0,
                addDialogVisible: false,
                damageForm: {
                    monster: '',
                    duration: '',
                    roleId: '',
                    damage: ''
                },
                damageFormRules: {
                    monster: [
                        {required: true, message: '请选择沙包', trigger: 'blur'}
                    ],
                    duration: [
                        {required: true, message: '请选择打桩时长', trigger: 'blur'}
                    ],
                    roleId: [
                        {required: true, message: '请选择角色', trigger: 'blur'}
                    ],
                    damage: [
                        {required: true, message: '请输入打桩伤害', trigger: 'blur'},
                        {type: 'number', message: '打桩伤害必须为全数字', trigger: 'blur'}
                    ]
                },
                roleList: []
            }
        },
        created() {
            this.init();
        },
        methods: {
            async init() {
                this.monsterList = await this.queryMonsterList()
                this.monster = this.monsterList[0]
                this.durationList = await this.queryDurationList(this.monster)
                this.duration = this.durationList[0]

                this.queryInfo.monster = this.monster
                this.queryInfo.duration = this.duration

                await this.getDamageList()
            },
            async queryMonsterList() {
                const {data: res} = await this.$http.get('/dnf/damage/monsters');
                if (res.code !== 1)
                    return this.$message.error('获取怪物列表失败！')
                return res.data
            },
            async queryDurationList(monster) {
                const {data: res} = await this.$http.get('/dnf/damage/durations?monster=' + monster);
                if (res.code !== 1)
                    return this.$message.error('获取时长列表失败！')
                return res.data
            },
            async refreshDamageList() {
                this.queryInfo = {
                    monster: this.monster,
                    duration: this.duration,
                    pageNo: 1,
                    pageSize: 10,
                    orderBy: 'id',
                    asc: true
                };
                await this.getDamageList()
            },
            async getDamageList() {
                const {data: res} = await this.$http.post('/dnf/damage/selectPage', this.queryInfo);
                if (res.code === 0)
                    return this.$message.error(res.message);
                if (res.data == null) {
                    this.damageList = [];
                    this.total = 0;
                    return
                }
                this.damageList = res.data.records;
                for (let i = 0; i < this.damageList.length; i++) {
                    let damage = this.damageList[i];
                    damage.createTime = this.formatTimeStamp(damage.createTime);
                    damage.updateTime = this.formatTimeStamp(damage.updateTime)
                }
                this.total = res.data.total
            },
            // eslint-disable-next-line no-unused-vars
            sortChange:function({column, prop, order}) {
                this.queryInfo.orderBy = prop;
                this.queryInfo.asc = order === 'ascending';
                this.getDamageList()
            },
            handleSizeChange(newSize) {
                this.queryInfo.pageSize = newSize;
                this.getDamageList()
            },
            handleCurrentChange(newNo) {
                this.queryInfo.pageNo = newNo;
                this.getDamageList()
            },
            refreshDamageForm() {
                this.damageForm.monster = this.monster;
                this.damageForm.duration = this.duration
            },
            async getRoleList() {
                const {data: res} = await this.$http.get('/dnf/role');
                if (res.code === 0)
                    return this.$message.error(res.message);
                this.roleList = res.data
            },
            async addDamage() {
                const {data: res} = await this.$http.post('/dnf/damage', this.damageForm);
                if (res.code !== 1) {
                    return this.$message.error('添加打桩记录失败！')
                }
                this.$message.success('添加打桩记录成功！');
                await this.refreshDamageList();
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
