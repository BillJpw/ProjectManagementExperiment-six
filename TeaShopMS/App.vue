<script>
export default {
  onLaunch: function() {
    console.log('App Launch')
    this.checkLogin()
  },
  onShow: function() {
    console.log('App Show')
  },
  onHide: function() {
    console.log('App Hide')
  },
  methods: {
    checkLogin() {
      const token = uni.getStorageSync('token')
      const userInfo = uni.getStorageSync('userInfo')
      if (!token || !userInfo) {
        uni.reLaunch({
          url: '/pages/login/login'
        })
      }
    }
  }
}
</script>

<style lang="scss">
@import '@/styles/common.scss';

page {
  background-color: #f5f7fa;
  font-size: 28rpx;
  color: #333;
}

/* Page transition animation */
.page-enter-active {
  animation: pageIn 0.3s ease-out;
}
.page-leave-active {
  animation: pageOut 0.2s ease-in;
}

@keyframes pageIn {
  from { opacity: 0; transform: translateX(40rpx); }
  to { opacity: 1; transform: translateX(0); }
}
@keyframes pageOut {
  from { opacity: 1; }
  to { opacity: 0; }
}

/* Card global style */
.card {
  background: #fff;
  border-radius: 20rpx;
  padding: 28rpx;
  margin-bottom: 24rpx;
  box-shadow: 0 2rpx 12rpx rgba(0, 0, 0, 0.05);
}

.btn-primary {
  background: linear-gradient(135deg, #FF6B6B 0%, #FF8E8E 100%);
  color: #fff;
  border: none;
  border-radius: 50rpx;
  font-weight: bold;
}
.btn-primary:active {
  opacity: 0.85;
  transform: scale(0.98);
}

.btn-secondary {
  background: #f5f5f5;
  color: #666;
  border: none;
  border-radius: 50rpx;
}

/* Tags */
.tag {
  display: inline-block;
  padding: 6rpx 16rpx;
  border-radius: 8rpx;
  font-size: 24rpx;
  margin-right: 12rpx;
}
.tag-high { background: #FFE5E5; color: #FF4757; }
.tag-medium { background: #FFF4E5; color: #FF9F43; }
.tag-low { background: #E8F8F5; color: #2ED573; }

/* Layout utilities */
.flex { display: flex; }
.flex-between { display: flex; justify-content: space-between; align-items: center; }
.flex-center { display: flex; justify-content: center; align-items: center; }
.flex-col { display: flex; flex-direction: column; }
.flex-1 { flex: 1; }

.text-primary { color: #FF6B6B; }
.text-secondary { color: #666; }
.text-muted { color: #999; }
.text-small { font-size: 24rpx; }
.font-bold { font-weight: bold; }

/* Skeleton / loading shimmer */
.skeleton {
  background: linear-gradient(90deg, #f0f0f0 25%, #e8e8e8 50%, #f0f0f0 75%);
  background-size: 200% 100%;
  animation: shimmer 1.5s infinite;
}

@keyframes shimmer {
  0% { background-position: -200% 0; }
  100% { background-position: 200% 0; }
}

/* Empty state */
.empty-state {
  text-align: center;
  padding: 80rpx 0;
}
.empty-state .empty-icon {
  font-size: 120rpx;
  display: block;
  margin-bottom: 20rpx;
}
.empty-state .empty-text {
  font-size: 28rpx;
  color: #999;
}

/* Pulse warning */
.pulse-warning {
  animation: pulse 2s infinite;
}
@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.6; }
}
</style>
