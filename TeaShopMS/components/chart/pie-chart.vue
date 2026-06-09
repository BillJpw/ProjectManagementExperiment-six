<template>
  <view class="chart-wrap">
    <view class="chart-title" v-if="title">{{ title }}</view>
    <view class="pie-body">
      <view class="pie-left">
        <canvas type="2d" :id="cid" class="pie-cvs" @touchstart="onTouch"></canvas>
      </view>
      <view class="pie-right" v-if="data.length">
        <view class="pitem" v-for="(d,i) in data" :key="i" :class="{ on: active===i }" @click="tapLegend(i)">
          <view class="pdot" :style="{background:d.color}"></view>
          <view class="pinfo">
            <text class="plabel">{{ d.label }}</text>
            <text class="pval">{{ d.value }} ({{ pct(d.value) }}%)</text>
          </view>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
let n = 0
export default {
  name: 'PieChart',
  props: { title:{type:String,default:''}, data:{type:Array,default:()=>[]} },
  data() { n++; return { cid:'pc'+n, ctx:null, ready:false, w:0, h:0, active:-1, ir:0.58 } },
  mounted() { this.init() },
  watch: { data:{deep:true,handler(){if(this.ready)this.draw()}} },
  methods: {
    init() {
      setTimeout(() => {
        const q = uni.createSelectorQuery().in(this)
        q.select('#'+this.cid).fields({node:true,size:true}).exec((res) => {
          if (!res||!res[0]||!res[0].node) return
          const c = res[0].node
          this.w = res[0].width
          this.h = res[0].height
          c.width = this.w
          c.height = this.h
          this.ctx = c.getContext('2d')
          this.ready = true
          this.draw()
        })
      }, 200)
    },
    sum() { let s=0; this.data.forEach(d=>s+=d.value); return s||1 },
    pct(v) { return Math.round(v/this.sum()*100) },
    draw() {
      const ctx=this.ctx; if(!ctx) return
      const W=this.w, H=this.h
      ctx.fillStyle='#fff'; ctx.fillRect(0,0,W,H)
      if(!this.data.length) return
      const cx=W/2, cy=H/2
      const R=Math.min(cx,cy)-4
      const r=R*this.ir
      const total=this.sum()
      let sa=-Math.PI/2
      this.data.forEach((d,i)=>{
        const angle=d.value/total*Math.PI*2
        const ea=sa+angle, mid=sa+angle/2
        const off=this.active===i?6:0
        const ox=Math.cos(mid)*off, oy=Math.sin(mid)*off
        ctx.beginPath()
        ctx.arc(cx+ox,cy+oy,R,sa,ea)
        ctx.arc(cx+ox,cy+oy,r,ea,sa,true)
        ctx.closePath()
        ctx.fillStyle=d.color; ctx.fill()
        if(angle>0.45){
          const lr=r+(R-r)*0.65
          ctx.fillStyle='#fff'
          ctx.font='bold 19px sans-serif'
          ctx.textAlign='center'; ctx.textBaseline='middle'
          ctx.fillText(this.pct(d.value)+'%', cx+ox+Math.cos(mid)*lr, cy+oy+Math.sin(mid)*lr)
        }
        sa=ea
      })
      ctx.beginPath(); ctx.arc(cx,cy,r,0,Math.PI*2); ctx.fillStyle='#fff'; ctx.fill()
      ctx.fillStyle='#333'; ctx.font='22px sans-serif'; ctx.textAlign='center'; ctx.textBaseline='middle'
      ctx.fillText('总计',cx,cy-7)
      ctx.font='bold 27px sans-serif'; ctx.fillText(String(total),cx,cy+19)
    },
    tapLegend(i) { this.active=this.active===i?-1:i; this.draw(); this.$emit('slice-click',this.data[i],i) },
    onTouch(e) {
      if(!e.touches||!e.touches.length) return
      const t=e.touches[0], cx=this.w/2, cy=this.h/2
      const dist=Math.sqrt((t.x-cx)**2+(t.y-cy)**2)
      const R=Math.min(cx,cy)-4, r=R*this.ir
      if(dist<r||dist>R){this.active=-1;this.draw();return}
      let a=Math.atan2(t.y-cy,t.x-cx)
      let sa=-Math.PI/2; const total=this.sum()
      for(let i=0;i<this.data.length;i++){
        const angle=this.data[i].value/total*Math.PI*2
        const ea=sa+angle
        let aa=a; if(aa<-Math.PI/2) aa+=Math.PI*2
        let ssa=sa<0?sa+Math.PI*2:sa
        let eea=ssa+(ea-sa)
        if(aa>=ssa&&aa<=eea){this.active=i;this.draw();this.$emit('slice-click',this.data[i],i);return}
        sa=ea
      }
    }
  }
}
</script>

<style scoped>
.chart-wrap { background:#fff; border-radius:20rpx; padding:24rpx; margin-bottom:24rpx; box-shadow:0 2rpx 12rpx rgba(0,0,0,0.05); }
.chart-title { font-size:30rpx; font-weight:bold; color:#333; margin-bottom:16rpx; padding-left:8rpx; }
.pie-body { display:flex; align-items:center; gap:20rpx; }
.pie-left { width:250rpx; height:250rpx; flex-shrink:0; }
.pie-cvs { width:100%; height:100%; display:block; }
.pie-right { flex:1; display:flex; flex-direction:column; gap:12rpx; }
.pitem { display:flex; align-items:center; gap:10rpx; padding:6rpx 10rpx; border-radius:10rpx; }
.pitem.on { background:#f5f5f5; }
.pdot { width:18rpx; height:18rpx; border-radius:50%; flex-shrink:0; }
.pinfo { display:flex; flex-direction:column; }
.plabel { font-size:22rpx; color:#666; }
.pval { font-size:26rpx; color:#333; font-weight:bold; }
</style>
