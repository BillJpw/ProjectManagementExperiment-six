<template>
  <view class="chart-wrap">
    <view class="chart-title" v-if="title">{{ title }}</view>
    <view class="rwrap"><canvas type="2d" :id="cid" class="rcvs"></canvas></view>
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
  name:'RadarChart',
  props:{ title:{type:String,default:''}, labels:{type:Array,default:()=>[]}, datasets:{type:Array,default:()=>[]}, legend:{type:Array,default:()=>[]}, maxValue:{type:Number,default:100} },
  data(){ n++; return { cid:'rc'+n, ctx:null, ready:false, s:0 } },
  mounted(){ this.init() },
  watch:{ datasets:{deep:true,handler(){if(this.ready)this.draw()}} },
  methods:{
    init(){
      setTimeout(()=>{
        const q=uni.createSelectorQuery().in(this)
        q.select('#'+this.cid).fields({node:true,size:true}).exec((res)=>{
          if(!res||!res[0]||!res[0].node) return
          const c=res[0].node
          this.s=res[0].width
          c.width=res[0].width; c.height=res[0].height
          this.ctx=c.getContext('2d')
          this.ready=true
          this.draw()
        })
      },200)
    },
    draw(){
      const ctx=this.ctx; if(!ctx) return
      const W=this.s, H=this.s
      ctx.fillStyle='#fff'; ctx.fillRect(0,0,W,H)
      const n=this.labels.length; if(n<3) return
      const cx=W/2, cy=H/2-6
      const R=Math.min(cx,cy)-36
      const step=Math.PI*2/n

      // grid
      for(let lv=1;lv<=4;lv++){
        const lr=R/4*lv
        ctx.beginPath(); ctx.strokeStyle=lv===4?'#ddd':'#f0f0f0'; ctx.lineWidth=1
        for(let i=0;i<n;i++){const a=-Math.PI/2+step*i; const x=cx+Math.cos(a)*lr; const y=cy+Math.sin(a)*lr; i===0?ctx.moveTo(x,y):ctx.lineTo(x,y)}
        ctx.closePath(); ctx.stroke()
      }
      // axis
      for(let i=0;i<n;i++){const a=-Math.PI/2+step*i; ctx.beginPath(); ctx.strokeStyle='#e8e8e8'; ctx.lineWidth=1; ctx.moveTo(cx,cy); ctx.lineTo(cx+Math.cos(a)*R,cy+Math.sin(a)*R); ctx.stroke()}
      // labels
      ctx.fillStyle='#333'; ctx.font='20px sans-serif'; ctx.textAlign='center'; ctx.textBaseline='middle'
      for(let i=0;i<n;i++){const a=-Math.PI/2+step*i; ctx.fillText(this.labels[i],cx+Math.cos(a)*(R+26),cy+Math.sin(a)*(R+26))}

      // datasets
      const clrs=['#5352ED','#FF6B6B','#FF9F43','#2ED573']
      this.datasets.forEach((ds,di)=>{
        const clr=ds.color||clrs[di%clrs.length]
        ctx.beginPath(); ctx.fillStyle=clr+'20'
        for(let i=0;i<n;i++){const a=-Math.PI/2+step*i; const vr=(ds.data[i]/this.maxValue)*R; const x=cx+Math.cos(a)*vr; const y=cy+Math.sin(a)*vr; i===0?ctx.moveTo(x,y):ctx.lineTo(x,y)}
        ctx.closePath(); ctx.fill()
        ctx.beginPath(); ctx.strokeStyle=clr; ctx.lineWidth=2.5
        for(let i=0;i<n;i++){const a=-Math.PI/2+step*i; const vr=(ds.data[i]/this.maxValue)*R; const x=cx+Math.cos(a)*vr; const y=cy+Math.sin(a)*vr; i===0?ctx.moveTo(x,y):ctx.lineTo(x,y)}
        ctx.closePath(); ctx.stroke()
        for(let i=0;i<n;i++){const a=-Math.PI/2+step*i; const vr=(ds.data[i]/this.maxValue)*R; const x=cx+Math.cos(a)*vr; const y=cy+Math.sin(a)*vr; ctx.beginPath(); ctx.fillStyle='#fff'; ctx.arc(x,y,4,0,Math.PI*2); ctx.fill(); ctx.beginPath(); ctx.fillStyle=clr; ctx.arc(x,y,2.5,0,Math.PI*2); ctx.fill()}
      })
    }
  }
}
</script>

<style scoped>
.chart-wrap { background:#fff; border-radius:20rpx; padding:24rpx; margin-bottom:24rpx; box-shadow:0 2rpx 12rpx rgba(0,0,0,0.05); }
.chart-title { font-size:30rpx; font-weight:bold; color:#333; margin-bottom:16rpx; padding-left:8rpx; }
.rwrap { width:100%; max-width:500rpx; margin:0 auto; }
.rcvs { width:100%; height:500rpx; display:block; }
.legend { display:flex; justify-content:center; gap:32rpx; padding-top:8rpx; }
.litem { display:flex; align-items:center; gap:8rpx; }
.ldot { width:16rpx; height:16rpx; border-radius:50%; }
.ltxt { font-size:24rpx; color:#666; }
</style>
