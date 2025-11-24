<template>
  <MacOSLayout>
    <view class="bills-page">
      <!-- 账单头部 -->
      <view class="bills-header">
        <view class="month-selector">
          <text class="month-text">{{ currentMonth }}</text>
          <view class="month-arrows">
            <text class="arrow" @click="prevMonth">◀</text>
            <text class="arrow" @click="nextMonth">▶</text>
          </view>
        </view>

        <view class="summary-cards">
          <view class="summary-card income">
            <text class="amount">¥{{ incomeTotal }}</text>
            <text class="label">总收入</text>
          </view>
          <view class="summary-card expense">
            <text class="amount">¥{{ expenseTotal }}</text>
            <text class="label">总支出</text>
          </view>
        </view>
      </view>

      <!-- 账单列表 -->
      <view class="bills-list">
        <view v-for="bill in bills" :key="bill.id" class="bill-item">
          <view class="bill-icon">
            <text :class="bill.type === 'income' ? 'icon-income' : 'icon-expense'">
              {{ bill.type === 'income' ? '💵' : '💸' }}
            </text>
          </view>

          <view class="bill-info">
            <text class="bill-title">{{ bill.title }}</text>
            <text class="bill-date">{{ bill.date }}</text>
            <text class="bill-category">{{ bill.category }}</text>
          </view>

          <view class="bill-amount" :class="bill.type">
            {{ bill.type === 'income' ? '+' : '-' }}¥{{ bill.amount }}
          </view>
        </view>
      </view>

      <!-- 添加账单按钮 -->
      <view class="add-bill-btn" @click="showAddBill = true">
        <text class="add-icon">+</text>
      </view>

      <!-- 添加账单模态框 -->
      <view v-if="showAddBill" class="add-bill-modal">
        <view class="modal-content">
          <text class="modal-title">添加账单</text>

          <view class="form-group">
            <text class="label">类型</text>
            <view class="type-selector">
              <button class="type-btn" :class="[newBill.type === 'income' ? 'active' : '']" @click="newBill.type = 'income'">
                收入
              </button>
              <button class="type-btn" :class="[newBill.type === 'expense' ? 'active' : '']" @click="newBill.type = 'expense'">
                支出
              </button>
            </view>
          </view>

          <view class="form-group">
            <text class="label">金额</text>
            <input v-model="newBill.amount" type="number" placeholder="输入金额" class="amount-input">
          </view>

          <view class="form-group">
            <text class="label">分类</text>
            <picker :value="categoryIndex" :range="categories" @change="onCategoryChange">
              <view class="category-picker">
                {{ categories[categoryIndex] }}
              </view>
            </picker>
          </view>

          <view class="form-group">
            <text class="label">备注</text>
            <input v-model="newBill.title" placeholder="备注信息" class="title-input">
          </view>

          <view class="modal-actions">
            <button class="cancel-btn" @click="showAddBill = false">
              取消
            </button>
            <button class="confirm-btn" @click="addBill">
              确认
            </button>
          </view>
        </view>
      </view>
    </view>
  </MacOSLayout>
</template>

<script setup lang="ts">
import { computed, reactive, ref } from 'vue'
import MacOSLayout from '@/components/MacOSLayout.vue'

interface Bill {
  id: number
  type: 'income' | 'expense'
  amount: number
  title: string
  category: string
  date: string
}

const currentDate = new Date()
const currentMonth = ref(`${currentDate.getFullYear()}年${currentDate.getMonth() + 1}月`)

const bills = ref<Bill[]>([
  {
    id: 1,
    type: 'expense',
    amount: 25.5,
    title: '午餐',
    category: '餐饮',
    date: '11-13 12:30',
  },
  {
    id: 2,
    type: 'income',
    amount: 5000,
    title: '工资',
    category: '薪资',
    date: '11-10 09:00',
  },
  {
    id: 3,
    type: 'expense',
    amount: 199,
    title: '书籍',
    category: '学习',
    date: '11-08 15:20',
  },
])

const categories = ['餐饮', '交通', '购物', '娱乐', '学习', '医疗', '薪资', '投资']
const categoryIndex = ref(0)

const showAddBill = ref(false)
const newBill = reactive({
  type: 'expense' as 'income' | 'expense',
  amount: 0,
  title: '',
  category: '餐饮',
})

const incomeTotal = computed(() => {
  return bills.value
    .filter(bill => bill.type === 'income')
    .reduce((sum, bill) => sum + bill.amount, 0)
})

const expenseTotal = computed(() => {
  return bills.value
    .filter(bill => bill.type === 'expense')
    .reduce((sum, bill) => sum + bill.amount, 0)
})

function prevMonth() {
  // 上个月逻辑
  console.log('上个月')
}

function nextMonth() {
  // 下个月逻辑
  console.log('下个月')
}

function onCategoryChange(e: any) {
  categoryIndex.value = e.detail.value
  newBill.category = categories[categoryIndex.value]
}

function addBill() {
  if (newBill.amount <= 0 || !newBill.title.trim()) {
    uni.showToast({
      title: '请填写完整信息',
      icon: 'none',
    })
    return
  }

  const bill: Bill = {
    id: Date.now(),
    type: newBill.type,
    amount: newBill.amount,
    title: newBill.title,
    category: newBill.category,
    date: `${new Date().toLocaleDateString('zh-CN', { month: '2-digit', day: '2-digit' })
    } ${new Date().toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' })}`,
  }

  bills.value.unshift(bill)

  // 重置表单
  newBill.amount = 0
  newBill.title = ''
  newBill.category = '餐饮'
  categoryIndex.value = 0
  showAddBill.value = false

  uni.showToast({
    title: '添加成功',
    icon: 'success',
  })
}
</script>

<style lang="scss" scoped>
.bills-page {
  padding: 20rpx;
  min-height: 100vh;
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
}

.bills-header {
  background: white;
  border-radius: 20rpx;
  padding: 30rpx;
  margin-bottom: 20rpx;
  box-shadow: 0 4rpx 12rpx rgba(0, 0, 0, 0.1);
}

.month-selector {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30rpx;
}

.month-text {
  font-size: 36rpx;
  font-weight: bold;
  color: #333;
}

.month-arrows {
  display: flex;
  gap: 20rpx;
}

.arrow {
  font-size: 28rpx;
  color: #666;
  padding: 10rpx 15rpx;
  background: #f0f0f0;
  border-radius: 8rpx;
}

.summary-cards {
  display: flex;
  gap: 20rpx;
}

.summary-card {
  flex: 1;
  padding: 20rpx;
  border-radius: 12rpx;
  text-align: center;

  &.income {
    background: linear-gradient(135deg, #4caf50 0%, #81c784 100%);
    color: white;
  }

  &.expense {
    background: linear-gradient(135deg, #f44336 0%, #ef5350 100%);
    color: white;
  }
}

.amount {
  display: block;
  font-size: 32rpx;
  font-weight: bold;
  margin-bottom: 10rpx;
}

.label {
  font-size: 24rpx;
  opacity: 0.9;
}

.bills-list {
  background: white;
  border-radius: 20rpx;
  overflow: hidden;
  box-shadow: 0 4rpx 12rpx rgba(0, 0, 0, 0.1);
}

.bill-item {
  display: flex;
  align-items: center;
  padding: 30rpx;
  border-bottom: 1rpx solid #f0f0f0;

  &:last-child {
    border-bottom: none;
  }
}

.bill-icon {
  margin-right: 20rpx;

  .icon-income,
  .icon-expense {
    font-size: 40rpx;
  }
}

.bill-info {
  flex: 1;
}

.bill-title {
  display: block;
  font-size: 28rpx;
  color: #333;
  margin-bottom: 8rpx;
}

.bill-date {
  display: block;
  font-size: 22rpx;
  color: #999;
  margin-bottom: 4rpx;
}

.bill-category {
  font-size: 22rpx;
  color: #666;
  background: #f0f0f0;
  padding: 4rpx 12rpx;
  border-radius: 6rpx;
}

.bill-amount {
  font-size: 28rpx;
  font-weight: bold;

  &.income {
    color: #4caf50;
  }

  &.expense {
    color: #f44336;
  }
}

.add-bill-btn {
  position: fixed;
  right: 40rpx;
  bottom: 40rpx;
  width: 100rpx;
  height: 100rpx;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 8rpx 25rpx rgba(102, 126, 234, 0.4);

  .add-icon {
    color: white;
    font-size: 40rpx;
    font-weight: bold;
  }
}

.add-bill-modal {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal-content {
  background: white;
  border-radius: 20rpx;
  padding: 40rpx;
  width: 80%;
  max-width: 600rpx;
}

.modal-title {
  display: block;
  font-size: 32rpx;
  font-weight: bold;
  text-align: center;
  margin-bottom: 30rpx;
  color: #333;
}

.form-group {
  margin-bottom: 30rpx;
}

.label {
  display: block;
  font-size: 26rpx;
  color: #666;
  margin-bottom: 10rpx;
}

.type-selector {
  display: flex;
  gap: 20rpx;
}

.type-btn {
  flex: 1;
  padding: 20rpx;
  border: 2rpx solid #ddd;
  border-radius: 10rpx;
  background: white;
  color: #666;

  &.active {
    border-color: #667eea;
    background: #667eea;
    color: white;
  }
}

.amount-input,
.title-input {
  width: 100%;
  padding: 20rpx;
  border: 2rpx solid #ddd;
  border-radius: 10rpx;
  font-size: 26rpx;
}

.category-picker {
  padding: 20rpx;
  border: 2rpx solid #ddd;
  border-radius: 10rpx;
  background: white;
}

.modal-actions {
  display: flex;
  gap: 20rpx;
  margin-top: 40rpx;
}

.cancel-btn,
.confirm-btn {
  flex: 1;
  padding: 20rpx;
  border-radius: 10rpx;
  font-size: 26rpx;
}

.cancel-btn {
  background: #f0f0f0;
  color: #666;
}

.confirm-btn {
  background: #667eea;
  color: white;
}
</style>
