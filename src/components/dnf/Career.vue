<template>
    <div>
        <!-- 面包屑导航区 -->
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/welcome' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>dnf</el-breadcrumb-item>
            <el-breadcrumb-item>职业列表</el-breadcrumb-item>
        </el-breadcrumb>

        <el-card class="box-card">
            <div style="margin-top: 15px;">
                <el-tree :data="careerTrees" :props="defaultProps" @node-click="getCareerTrees"></el-tree>
            </div>
        </el-card>
    </div>
</template>

<script>
    export default {
        data() {
            return {
                careerTrees:[],
                defaultProps: {
                    children: 'children',
                    label: 'label'
                }
            }
        },
        created() {
            this.getCareerTrees()
        },
        methods: {
            async getCareerTrees() {
                const {data: res} = await this.$http.get('/dnf/career/tree');
                if (res.code === 0)
                    return this.$message.error(res.message)
                this.careerTrees = res.data
            }
        }
    }
</script>

<style scoped>

</style>
