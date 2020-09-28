<template>
    <div class="login_container">
        <div class="login_box">
            <!-- 头像区域 -->
            <div class="avatar_box">
                <img src="../assets/logo.png" alt="">
            </div>
            <!-- 登录表单区域 -->
            <el-form ref="loginFormRef" :model="loginForm" :rules="loginFormRules" label-width="0px" class="login_form">
                <!-- 用户名 -->
                <el-form-item prop="username">
                    <el-input v-model="loginForm.username" prefix-icon="el-icon-user"></el-input>
                </el-form-item>
                <!-- 密码 -->
                <el-form-item prop="password">
                    <el-input v-model="loginForm.password" prefix-icon="el-icon-user" type="password"></el-input>
                </el-form-item>
                <!-- 按钮区域 -->
                <el-form-item class="btns">
                    <el-button type="primary" @click="login">登录</el-button>
                    <el-button type="info" @click="resetLoginForm">重置</el-button>
                </el-form-item>
            </el-form>
        </div>
    </div>
</template>

<script>
export default {
    data() {
        return {
            loginForm: {
                username: '',
                password: ''
            },
            loginFormRules: {
                username: [
                    { required: true, message: '请输入用户名', trigger: 'blur' },
                    { min: 3, max: 10, message: '长度在 3 到 10 个字符', trigger: 'blur' }
                ],
                password: [
                    { required: true, message: '请输入密码', trigger: 'blur' },
                    { min: 6, max: 15, message: '长度在 6 到 15 个字符', trigger: 'blur' }
                ]
            }
        }
    },
    methods: {
        resetLoginForm() {
            this.$refs.loginFormRef.resetFields();
        },
        login() {
            this.$refs.loginFormRef.validate(async valid => {
                if(!valid) return;
                const {data: res} = await this.$http.post("/login", this.loginForm);
                console.log(res)
                if (res.code !== 1) return this.$message.error("登陆失败！ ");
                this.$message.success("登陆成功")

                // 将登录成功返回的token保存到sessionStorage
                window.sessionStorage.setItem("token", "res.data.token");

                // 页面跳转
                this.$router.push('/home')
            });
        }
    }
}
</script>

<style lang="less" scoped>
.login_container {
    background-color: rgb(5, 31, 146);
    height: 100%;
}

.login_box {
    width: 450px;
    height: 300px;
    background-color: rgb(255, 255, 255);
    border-radius: 3px;
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%)
}

.avatar_box {
    height: 130px;
    width: 130px;
    border: 1px solid rgb(199, 97, 97);
    border-radius: 50%;
    padding: 10px;
    box-shadow: 0 0 10px rgb(184, 73, 73);
    position:absolute;
    left: 50%;
    transform: translate(-50%, -50%);
    background-color: #fff;
    img {
        width: 100%;
        height: 100%;
        border-color: rgb(98, 168, 147)
    }
}

.login_form {
    position: absolute;
    bottom: 0;
    width: 100%;
    padding: 0 20px;
    box-sizing: border-box;
}

.btns {
    display: flex;
    justify-content: flex-end;
}
</style>
