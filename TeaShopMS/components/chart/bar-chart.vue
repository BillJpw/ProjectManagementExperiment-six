<template>
  <view class="chart-wrap">
    <view class="chart-title" v-if="title">{{ title }}</view>
    <canvas type="2d" :id="cid" class="cvs" @touchstart="onT"></canvas>
  </view>
</template>

<script>
let n=0
export default {
  name:'BarChart',
  props:{ title:{type:String,default:''}, labels:{type:Array,default:()=>[]}, data:{type:Array,default:()=>[]}, color:{type:String,default:'#5352ED'}, showValues:{type:Boolean,default:true} },
  data(){ n++; return { cid:'bc'+n, ctx:null, ready:false, w:0, h:0, ai:-1 } },
  mounted(){ this.init() },
  watch:{ data:{deep:true,handler(){if(this.ready)this.draw()}}, labels:{handler(){if(this.ready)this.draw()}} },
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
      const pad={t:20,r:12,b:42,l:40}
      const pw=W-pad.l-pad.r, ph=H-pad.t-pad.b
      ctx.fillStyle='#fff'; ctx.fillRect(0,0,W,H)
      if(!this.data.length) return

      const max=Math.max(...this.data,10)*1.2
      for(let i=0;i<=4;i++){
        const y=pad.t+ph/4*i
        ctx.beginPath(); ctx.strokeStyle=i===0?'#e0e0e0':'#f0f0f0'; ctx.lineWidth=1
        ctx.moveTo(pad.l,y); ctx.lineTo(W-pad.r,y); ctx.stroke()
        ctx.fillStyle='#999'; ctx.font='18px sans-serif'; ctx.textAlign='right'; ctx.textBaseline='middle'
        ctx.fillText(String(Math.round(max-max/4*i)),pad.l-8,y)
      }

      const n=this.data.length
      const gap=12; const bw=Math.max(12,(pw-gap*(n+1))/n)
      const sx=pad.l+gap+bw/2

      this.data.forEach((v,i)=>{
        const x=sx+i*(bw+gap)
        const bh=Math.max(2,(v/max)*ph)
        const y=pad.t+ph-bh; const rad=Math.min(5,bw/2)
        const g=ctx.createLinearGradient(0,y,0,pad.t+ph)
        g.addColorStop(0,this.color); g.addColorStop(1,this.color+'80')
        ctx.fillStyle=g
        ctx.beginPath()
        ctx.moveTo(x-bw/2+rad,y); ctx.lineTo(x+bw/2-rad,y)
        ctx.arc(x+bw/2-rad,y+rad,rad,-Math.PI/2,0)
        ctx.lineTo(x+bw/2,pad.t+ph); ctx.lineTo(x-bw/2,pad.t+ph)
        ctx.lineTo(x-bw/2,y+rad); ctx.arc(x-bw/2+rad,y+rad,rad,Math.PI,-Math.PI/2)
        ctx.closePath(); ctx.fill()
        if(this.showValues){
          ctx.fillStyle='#333'; ctx.font='bold 19px sans-serif'; ctx.textAlign='center'; ctx.textBaseline='bottom'
          ctx.fillText(String(v),x,y-4)
        }
      })

      ctx.fillStyle='#666'; ctx.font='18px sans-serif'; ctx.textAlign='center'; ctx.textBaseline='top'
      this.labels.forEach((lb,i)=>ctx.fillText(lb,sx+i*(bw+gap),H-pad.b+28))
    },
    onT(e){
      if(!e.touches||!e.touches.length) return
      const t=e.touches[0]
      const pw=this.w-40-12; const n=this.data.length
      const gap=12; const bw=Math.max(12,(pw-gap*(n+1))/n)
      const sx=40+gap+bw/2
      let idx=-1
      this.data.forEach((_,i)=>{if(Math.abs(t.x-(sx+i*(bw+gap)))<bw/2+6)idx=i})
      if(this.ai!==idx){this.ai=idx; if(idx>=0)this.$emit('bar-click',idx); this.draw()}
    }
  }
}
</script>

<style scoped>
.chart-wrap { background:#fff; border-radius:20rpx; padding:24rpx; margin-bottom:24rpx; box-shadow:0 2rpx 12rpx rgba(0,0,0,0.05); }
.chart-title { font-size:30rpx; font-weight:bold; color:#333; margin-bottom:16rpx; padding-left:8rpx; }
.cvs { width:100%; height:340rpx; display:block; }
</style>
