<script setup lang="ts">
import { useAuthStore } from '@/stores/auth'
import { addTodo, getTodos, updateTodo, type Todo } from '@/utility/db'
import {
  NButton,
  NCard,
  NForm,
  NFormItem,
  NInput,
  NList,
  NListItem,
  NModal,
  useMessage,
  type FormInst,
} from 'naive-ui'
import { onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'

const message = useMessage()
const auth = useAuthStore()
const router = useRouter()

if (!auth.accountId) {
  message.error('Please login first')
  router.push('/auth')
}

const todos = ref<Todo[]>([])

const refreshTodos = async () => {
  todos.value = await getTodos(auth.accountId!)
}

onMounted(async () => {
  await refreshTodos()
})

const showAddTodo = ref(false)

const handleAddTodo = () => {
  showAddTodo.value = true
}

const addTodoRef = ref<FormInst | null>(null)

const addTodoForm = ref({
  title: '',
})

const rules = {
  title: [{ required: true, message: 'Title is required' }],
}

const handleAddTodoSubmit = async () => {
  if (addTodoRef.value) {
    addTodoRef.value.validate((errors) => {
      if (!errors) {
        addTodo(auth.accountId!, addTodoForm.value.title)
          .then(() => {
            message.success('Add Todo success')
            addTodoRef.value?.restoreValidation()
            showAddTodo.value = false
            addTodoForm.value.title = ''
            refreshTodos()
          })
          .catch(() => {
            message.error('Add Todo failed')
          })
      }
    })
  }
}

const handleUpdateTodo = async (id: number, completed: boolean) => {
  await updateTodo(id, completed)
  refreshTodos()
}
</script>

<template>
  <div class="h-full flex justify-center items-center">
    <div class="w-2/3 h-2/3">
      <NCard>
        <template #header>
          <div class="flex justify-between items-center">
            <div class="text-lg font-bold">Todos</div>
            <NButton type="primary" @click="handleAddTodo">Add Todo</NButton>
          </div>
        </template>
        <template #default>
          <div class="overflow-y-auto h-[400px]">
            <NList>
              <NListItem v-for="todo in todos" :key="todo.id">
                <NCard>
                  <div class="flex justify-between items-center">
                    <div class="text-lg font-bold">{{ todo.title }}</div>
                    <NButton
                      :type="todo.completed ? 'error' : 'primary'"
                      @click="handleUpdateTodo(todo.id, !todo.completed)"
                      round
                    />
                  </div>
                </NCard>
              </NListItem>
            </NList>
          </div>
        </template>
      </NCard>
    </div>
  </div>

  <NModal v-model:show="showAddTodo" title="Add Todo" preset="dialog">
    <NForm :model="addTodoForm" :rules="rules" ref="addTodoRef">
      <NFormItem label="Title" path="title">
        <NInput v-model:value="addTodoForm.title" />
      </NFormItem>
      <NFormItem>
        <div class="flex justify-end w-full">
          <NButton type="primary" @click="handleAddTodoSubmit">Add</NButton>
        </div>
      </NFormItem>
    </NForm>
  </NModal>
</template>
