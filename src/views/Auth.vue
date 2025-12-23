<script setup lang="ts">
import { useAuthStore } from '@/stores/auth'
import { login, register } from '@/utility/db'
import {
  NButton,
  NCard,
  NForm,
  NFormItem,
  NInput,
  NTabPane,
  NTabs,
  useMessage,
  type FormInst,
} from 'naive-ui'
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const message = useMessage()
const auth = useAuthStore()
const router = useRouter()

const loginRef = ref<FormInst | null>(null)

const loginForm = ref<{
  username: string
  password: string
}>({
  username: '',
  password: '',
})

const registerRef = ref<FormInst | null>(null)

const registerForm = ref<{
  username: string
  password: string
  confirmPassword: string
}>({
  username: '',
  password: '',
  confirmPassword: '',
})

const handleLogin = async () => {
  if (loginRef.value) {
    loginRef.value.validate((errors) => {
      if (!errors) {
        login(loginForm.value.username, loginForm.value.password)
          .then((id) => {
            if (id) {
              message.success('Login success')
              auth.setAccountId(id)
              router.push('/')
              loginRef.value?.restoreValidation()
            } else {
              message.error('Username or password is incorrect')
            }
          })
          .catch(() => {
            message.error('Login failed')
          })
      }
    })
  }
}

const handleRegister = async () => {
  if (registerRef.value) {
    registerRef.value.validate((errors) => {
      if (!errors) {
        if (registerForm.value.password !== registerForm.value.confirmPassword) {
          message.error('Password and Confirm Password do not match')
          return
        }

        register(registerForm.value.username, registerForm.value.password)
          .then(() => {
            message.success('Register success')
            registerRef.value?.restoreValidation()
          })
          .catch(() => {
            message.error('Register failed')
          })
      }
    })
  }
}

const rules = {
  username: [{ required: true, message: 'Username is required' }],
  password: [{ required: true, message: 'Password is required' }],
  confirmPassword: [{ required: true, message: 'Confirm Password is required' }],
}
</script>

<template>
  <div class="flex justify-center items-center h-full">
    <div class="w-1/3 h-1/2">
      <NCard>
        <NTabs>
          <NTabPane name="login" tab="Login">
            <NForm :model="loginForm" :rules="rules" ref="loginRef">
              <NFormItem label="Username" path="username">
                <NInput v-model:value="loginForm.username" />
              </NFormItem>
              <NFormItem label="Password" path="password">
                <NInput v-model:value="loginForm.password" type="password" />
              </NFormItem>
              <NFormItem>
                <div class="flex justify-end w-full">
                  <NButton type="primary" @click="handleLogin">Login</NButton>
                </div>
              </NFormItem>
            </NForm>
          </NTabPane>
          <NTabPane name="register" tab="Register">
            <NForm :model="registerForm" :rules="rules" ref="registerRef">
              <NFormItem label="Username" path="username">
                <NInput v-model:value="registerForm.username" />
              </NFormItem>
              <NFormItem label="Password" path="password">
                <NInput v-model:value="registerForm.password" type="password" />
              </NFormItem>
              <NFormItem label="Confirm Password" path="confirmPassword">
                <NInput v-model:value="registerForm.confirmPassword" type="password" />
              </NFormItem>
              <NFormItem>
                <div class="flex justify-end w-full">
                  <NButton type="primary" @click="handleRegister">Register</NButton>
                </div>
              </NFormItem>
            </NForm>
          </NTabPane>
        </NTabs>
      </NCard>
    </div>
  </div>
</template>
