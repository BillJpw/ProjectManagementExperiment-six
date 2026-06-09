<template>
  <view class="chart-wrap">
    <view class="chart-title" v-if="title">{{ title }}</view>
    <canvas type="2d" :id="cid" class="cvs" @touchstart="onT" @touchmove="onT" @touchend="onTe"></canvas>
    <view class="legend" v-if="legend.length">
      <view class="litem" v-for="(it,i) in legend" :key="i">
        <view class="ldot" :style="{background:it.color}"></view>
        <text class="ltxt">{{ it.name }}</text>
      </view>
    </view>
  </view>
</template>

<script>
let n=0
export default {
  name:'LineChart',
  props:{ title:{type:String,default:''}, labels:{type:Array,default:()=>[]}, datasets:{type:Array,default:()=>[]}, legend:{type:Array,default:()=>[]} },
  data(){ n++; return { cid:'lc'+n, ctx:null, ready:false, w:0, h:0 } },
  mounted(){ this.init() },
  watch:{ datasets:{deep:true,handler(){if(this.ready)this.draw()}}, labels:{handler(){if(this.ready)this.draw()}} },
  methods:{
    init(){
      setTimeout(()=>{
        const q=uni.createSelectorQuery().in(this)
        q.select('#'+this.cid).fields({node:true,size:true}).exec((res)=>{
          if(!res||!res[0]||!res[0].node) return
          const c=res[0].node
          this.w=res[0].width; this.h=res[0].height
          c.width=this.w; c.height=this.h
          this.ctx=c.getContext('2d')
          this.ready=true
          this.draw()
        })
      },200)
    },
    draw(){
      const ctx=this.ctx; if(!ctx) return
      const W=this.w, H=this.h
      const pad={t:24,r:12,b:42,l:42}
      ctx.fillStyle='#fff'; ctx.fillRect(0,0,W,H)
      if(!this.labels.length||!this.datasets.length) return
      const pw=W-pad.l-pad.r, ph=H-pad.t-pad.b
      let max=0
      this.datasets.forEach(ds=>ds.data.forEach(v=>{if(v>max)max=v}))
      max=Math.ceil(max*1.2)||10

      // grid
      for(let i=0;i<=4;i++){
        const y=pad.t+ph/4*i
        ctx.beginPath(); ctx.strokeStyle=i===0?'#e0e0e0':'#f0f0f0'; ctx.lineWidth=1
        ctx.moveTo(pad.l,y); ctx.lineTo(W-pad.r,y); ctx.stroke()
        ctx.fillStyle='#999'; ctx.font='18px sans-serif'; ctx.textAlign='right'; ctx.textBaseline='middle'
        ctx.fillText(String(Math.round(max-max/4*i)),pad.l-8,y)
      }

      // x labels
      const xs=this.labels.length>1?pw/(this.labels.length-1):pw
      ctx.fillStyle='#666'; ctx.font='18px sans-serif'; ctx.textAlign='center'; ctx.textBaseline='top'
      this.labels.forEach((lb,i)=>ctx.fillText(lb,pad.l+xs*i,H-pad.b+28))

      // lines
      const clrs=['#5352ED','#FF6B6B','#FF9F43','#2ED573']
      this.datasets.forEach((ds,di)=>{
        const clr=ds.color||clrs[di%clrs.length]
        const pts=ds.data.map((v,i)=>({x:pad.l+xs*i, y:pad.t+ph-(v/max)*ph}))
        // fill
        const g=ctx.createLinearGradient(0,pad.t,0,pad.t+ph)
        g.addColorStop(0,clr+'40'); g.addColorStop(1,clr+'05')
        ctx.beginPath(); ctx.moveTo(pts[0].x,pad.t+ph)
        pts.forEach(p=>ctx.lineTo(p.x,p.y))
        ctx.lineTo(pts[pts.length-1].x,pad.t+ph); ctx.closePath()
        ctx.fillStyle=g; ctx.fill()
        // line
        ctx.beginPath(); ctx.strokeStyle=clr; ctx.lineWidth=2.5; ctx.lineJoin='round'
        pts.forEach((p,i)=>i===0?ctx.moveTo(p.x,p.y):ctx.lineTo(p.x,p.y))
        ctx.stroke()
        // dots
        pts.forEach(p=>{
          ctx.beginPath(); ctx.fillStyle='#fff'; ctx.arc(p.x,p.y,4,0,Math.PI*2); ctx.fill()
          ctx.beginPath(); ctx.fillStyle=clr; ctx.arc(p.x,p.y,2.5,0,Math.PI*2); ctx.fill()
        })
      })
    },
    onT(e){
      if(!e.touches||!e.touches.length) return
      const t=e.touches[0]; const pw=this.w-42-12
      const xs=this.labels.length>1?pw/(this.labels.length-1):pw
      let idx=-1
      this.labels.forEach((_,i)=>{if(Math.abs(t.x-(42+xs*i))<18)idx=i})
      if(idx>=0) this.$emit('point-click',idx)
    },
    onTe(){}
  }
}
</script>

<style scoped>
.chart-wrap { background:#fff; border-radius:20rpx; padding:24rpx; margin-bottom:24rpx; box-shadow:0 2rpx 12rpx rgba(0,0,0,0.05); }
.chart-title { font-size:30rpx; font-weight:bold; color:#333; margin-bottom:16rpx; padding-left:8rpx; }
.cvs { width:100%; height:340rpx; display:block; }
.legend { display:flex; justify-content:center; gap:32rpx; padding-top:16rpx; }
.litem { display:flex; align-items:center; gap:8rpx; }
.ldot { width:16rpx; height:16rpx; border-radius:50%; }
.ltxt { font-size:24rpx; color:#666; }
</style>
