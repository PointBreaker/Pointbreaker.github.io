import{hn as e,lr as t,vn as n}from"../jse/index-index-Bo4uM3sB.js";import{I as r,L as i,z as a}from"./use-theme-DHAUM9Qh.js";import{n as o,t as s}from"./icon-switch.cssr-CU-rFz1W.js";import{t as c}from"./use-style-DCzaNR9I.js";var l=r([r(`@keyframes rotator`,`
 0% {
 -webkit-transform: rotate(0deg);
 transform: rotate(0deg);
 }
 100% {
 -webkit-transform: rotate(360deg);
 transform: rotate(360deg);
 }`),i(`base-loading`,`
 position: relative;
 line-height: 0;
 width: 1em;
 height: 1em;
 `,[a(`transition-wrapper`,`
 position: absolute;
 width: 100%;
 height: 100%;
 `,[s()]),a(`placeholder`,`
 position: absolute;
 left: 50%;
 top: 50%;
 transform: translateX(-50%) translateY(-50%);
 `,[s({left:`50%`,top:`50%`,originalTransform:`translateX(-50%) translateY(-50%)`})]),a(`container`,`
 animation: rotator 3s linear infinite both;
 `,[a(`icon`,`
 height: 1em;
 width: 1em;
 `)])])]),u=`1.6s`,d=e({name:`BaseLoading`,props:Object.assign({clsPrefix:{type:String,required:!0},show:{type:Boolean,default:!0}},{strokeWidth:{type:Number,default:28},stroke:{type:String,default:void 0},scale:{type:Number,default:1},radius:{type:Number,default:100}}),setup(e){c(`-base-loading`,l,t(e,`clsPrefix`))},render(){let{clsPrefix:e,radius:t,strokeWidth:r,stroke:i,scale:a}=this,s=t/a;return n(`div`,{class:`${e}-base-loading`,role:`img`,"aria-label":`loading`},n(o,null,{default:()=>this.show?n(`div`,{key:`icon`,class:`${e}-base-loading__transition-wrapper`},n(`div`,{class:`${e}-base-loading__container`},n(`svg`,{class:`${e}-base-loading__icon`,viewBox:`0 0 ${2*s} ${2*s}`,xmlns:`http://www.w3.org/2000/svg`,style:{color:i}},n(`g`,null,n(`animateTransform`,{attributeName:`transform`,type:`rotate`,values:`0 ${s} ${s};270 ${s} ${s}`,begin:`0s`,dur:u,fill:`freeze`,repeatCount:`indefinite`}),n(`circle`,{class:`${e}-base-loading__icon`,fill:`none`,stroke:`currentColor`,"stroke-width":r,"stroke-linecap":`round`,cx:s,cy:s,r:t-r/2,"stroke-dasharray":5.67*t,"stroke-dashoffset":18.48*t},n(`animateTransform`,{attributeName:`transform`,type:`rotate`,values:`0 ${s} ${s};135 ${s} ${s};450 ${s} ${s}`,begin:`0s`,dur:u,fill:`freeze`,repeatCount:`indefinite`}),n(`animate`,{attributeName:`stroke-dashoffset`,values:`${5.67*t};${1.42*t};${5.67*t}`,begin:`0s`,dur:u,fill:`freeze`,repeatCount:`indefinite`})))))):n(`div`,{key:`placeholder`,class:`${e}-base-loading__placeholder`},this.$slots)}))}});export{d as t};