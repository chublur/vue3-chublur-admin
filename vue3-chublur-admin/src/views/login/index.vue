<template>
  <!-- 
        1. 结构相关
            el-row 表示一行，一行分成 24 份
            el-col 表示列
            (1)  :span="12"   代表在一行中，占12份 (50%)
            (2)  :span="6"    代表在一行中，占6份 (25%)
            (3)  :offset="3"    代表在一行中，左侧 margin 份数

            el-form  整个表单组件
            el-form-item  表单一行  (每个表单域)
            el-input  表单元素  (输入值)

        2. 校验相关
            (1) el-form   =>  :model="ruleForm"      绑定的是整个 form 数据对象  { xxx, xxx, xxx }
            (2) el-form   =>  :rules="rules"         绑定的是整个 rules 规则对象  { xxx, xxx, xxx }   和上面每个对应  是基于上面数据
            (3) 表单元素   => v-model="ruleForm.xxx"  给表单元素，绑定 form 子属性
            (4) el-form-item => prop 配置生效的是哪个校验规则 (和 rules 中的字段要对应)
     -->

  <el-row class="login-page">
    <el-col :span="12" class="bg"></el-col>

    <el-col :span="6" :offset="3" class="form">
      <!-- 注册表单 -->
      <el-form
        :model="formModel"
        :rules="rules"
        ref="form"
        size="large"
        autocomplete="off"
        v-if="isRegister"
      >
        <el-form-item>
          <h1>注册</h1>
        </el-form-item>

        <!-- 用户名 -->
        <!-- el-form-item 配置的是生效哪个规则 -->
        <el-form-item prop="username">
          <el-input
            v-model="formModel.username"
            :prefix-icon="User"
            placeholder="请输入用户名"
          ></el-input>
        </el-form-item>

        <el-form-item prop="password">
          <el-input
            v-model="formModel.password"
            :prefix-icon="Lock"
            type="password"
            placeholder="请输入密码"
          ></el-input>
        </el-form-item>

        <!-- 自定义校验 -->
        <el-form-item prop="repassword">
          <el-input
            v-model="formModel.repassword"
            :prefix-icon="Lock"
            type="password"
            placeholder="请输入再次密码"
          ></el-input>
        </el-form-item>

        <!-- 点击按钮预校验 -->
        <el-form-item>
          <el-button @click="register" class="button" type="primary" auto-insert-space>
            注册
          </el-button>
        </el-form-item>
        <el-form-item class="flex">
          <el-link type="info" :underline="false" @click="isRegister = false"> ← 返回 </el-link>
        </el-form-item>
      </el-form>

      <!-- 登录表单 -->
      <!-- 绑定数据  配置规则  和注册一样 -->
      <el-form :model="formModel" :rules="rules" ref="form" size="large" autocomplete="off" v-else>
        <el-form-item>
          <h1>登录</h1>
        </el-form-item>

        <!-- 绑定用户名 -->
        <el-form-item prop="username">
          <el-input
            v-model="formModel.username"
            :prefix-icon="User"
            placeholder="请输入用户名"
          ></el-input>
        </el-form-item>

        <!-- 绑定 password -->
        <el-form-item prop="password">
          <el-input
            v-model="formModel.password"
            name="password"
            :prefix-icon="Lock"
            type="password"
            placeholder="请输入密码"
          ></el-input>
        </el-form-item>

        <el-form-item class="flex">
          <div class="flex">
            <el-checkbox>记住我</el-checkbox>
            <el-link type="primary" :underline="false">忘记密码？</el-link>
          </div>
        </el-form-item>

        <!-- 点击登录按钮之前进行预校验 -->
        <el-form-item>
          <el-button @click="login" class="button" type="primary" auto-insert-space>登录</el-button>
        </el-form-item>
        <el-form-item class="flex">
          <el-link type="info" :underline="false" @click="isRegister = true"> 注册 → </el-link>
        </el-form-item>
      </el-form>
    </el-col>
  </el-row>
</template>

<script setup>
import { User, Lock } from '@element-plus/icons-vue'
import { ref, watch } from 'vue'
import { userRegisterService,userLoginService } from '@/api/user'
import { useUserStore } from '@/stores/index'
import { useRouter } from 'vue-router'

// pinia 中 token  存 token
const userStore = useUserStore()
const router = useRouter()

// true 就是注册页面  要么就是登录页面  使用 v-if  控制
const isRegister = ref(false)
const form = ref()

// 注册
// 整个用于提交的 form 字段对象
// 需要绑定给我们 el-form  标签
const formModel = ref({
  username: '',
  password: '',
  repassword: '' // 自定义校验
})

// 整个表单的校验规则
// 1. 非空校验  required: true   message 消息提示，trigger 触发校验时机    change change
// 2. 长度校验  min: xx, max: xx
// 3. 正则校验  pattern: 正则规则   \S  非空字符
// 4. 自定义校验 (如果上面都没有符合我们，那我们就自定义校验)  => 自己写逻辑校验  (校验函数)
//    validate: (rule, value, callback)
//              (1)  rule  当前校验规则相关信息
//              (2)  value  所校验的表单元素目前的表单值
//              (3)  callback  无论成功还是失败，都需要 callback 回调
//                      callback()   校验成功
//                      callback(new Error(错误信息))   校验失败
const rules = {
  username: [
    { required: true, message: '请输入用户名', trigger: 'change' },
    { min: 5, max: 10, message: '用户名必须是 5-10 位字符', trigger: 'change' }
  ],
  password: [
    { required: true, message: '请输入密码', trigger: 'change' },
    {
      pattern: /^\S{6,15}$/,
      message: '密码必须是 6-15 位非空字符',
      trigger: 'change'
    }
  ],
  repassword: [
    { required: true, message: '请输入密码', trigger: 'change' },
    {
      pattern: /^\S{6,15}$/,
      message: '密码必须是 6-15 位非空字符',
      trigger: 'change'
    },
    {
      validate: (rule, value, callback) => {
        // 判断 value 和当前 form 中收集的 password 是否一致
        if (value !== formModel.value.password) {
          callback(new Error('两次输入密码不一致'))
        } else {
          callback() // 就算校验成功，也需要 callback
        }
      },
      trigger: 'change'
    }
  ]
}

// 点击注册按钮   预校验
const register = async () => {
  // 注册成功之前，先进行校验，校验成功 ->  请求，校验失败 ->  自动提示
  await form.value.validate() // 因为是 promise 请求   所以我们等待请求结果
  // 开始注册请求
  await userRegisterService(formModel.value)
  ElMessage.success('注册成功')
  // 切换到登录页面
  isRegister.value = false
}

// 点击登录按钮   预校验
const login = async () => {
  await form.value.validate()
  const res = await userLoginService(formModel.value) // 返回是 token

  // 存入 pinia 中 setToken
  // 因为我们加入了持久化本地存储     因此我们本地存储也有
  userStore.setToken(res.data.token)
  ElMessage.success('登录成功')

  // 登录成功就可以跳转到首页
  router.push('/')
}

// 切换时   重置表单内容
// 不然注册页面  切换成登录页面时候  表单输入框中还有数据   所以每次切换时候我们要重置表单数据
// 所以我们监视 isRegister  数据变化
watch(isRegister, () => {
  formModel.value = {
    username: '',
    password: '',
    repassword: ''
  }
})
</script>

<style lang="scss" scoped>
.login-page {
  height: 100vh;
  background-color: #fff;

  .bg {
    background: url('@/assets/bg.jpg') no-repeat center / cover;
    border-radius: 0 10px 10px 0;
  }

  .form {
    display: flex;
    flex-direction: column;
    justify-content: center;
    user-select: none;

    .title {
      margin: 0 auto;
    }
    .button {
      width: 100%;
      background-color: #3a3734;
    }
    .flex {
      width: 100%;
      display: flex;
      justify-content: space-between;
    }
  }
}
</style>
