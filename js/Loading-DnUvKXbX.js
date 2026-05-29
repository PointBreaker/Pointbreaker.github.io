import{An as e,Cn as t,fr as n,vn as r,xn as i}from"../jse/index-index-ByjQckRl.js";import{B as a,L as o,N as s,P as c,R as l,a as u,r as d}from"./use-theme-BtD0lQHu.js";import{n as f,t as p}from"./icon-switch.cssr-D2SeaB1E.js";function m(n,r,i){if(!r)return;let a=c(),o=t(s,null),l=()=>{let e=i.value;r.mount({id:e===void 0?n:e+n,head:!0,anchorMetaName:u,props:{bPrefix:e?`.${e}-`:void 0},ssr:a,parent:o==null?void 0:o.styleMountTarget}),o!=null&&o.preflightStyleDisabled||d.mount({id:`n-global`,head:!0,anchorMetaName:u,ssr:a,parent:o==null?void 0:o.styleMountTarget})};a?l():e(l)}var h=o([o(`@keyframes rotator`,`
 0% {
 -webkit-transform: rotate(0deg);
 transform: rotate(0deg);
 }
 100% {
 -webkit-transform: rotate(360deg);
 transform: rotate(360deg);
 }`),l(`base-loading`,`
 position: relative;
 line-height: 0;
 width: 1em;
 height: 1em;
 `,[a(`transition-wrapper`,`
 position: absolute;
 width: 100%;
 height: 100%;
 `,[p()]),a(`placeholder`,`
 position: absolute;
 left: 50%;
 top: 50%;
 transform: translateX(-50%) translateY(-50%);
 `,[p({left:`50%`,top:`50%`,originalTransform:`translateX(-50%) translateY(-50%)`})]),a(`container`,`
 animation: rotator 3s linear infinite both;
 `,[a(`icon`,`
 height: 1em;
 width: 1em;
 `)])])]),g=`1.6s`,_=r({name:`BaseLoading`,props:Object.assign({clsPrefix:{type:String,required:!0},show:{type:Boolean,default:!0}},{strokeWidth:{type:Number,default:28},stroke:{type:String,default:void 0},scale:{type:Number,default:1},radius:{type:Number,default:100}}),setup(e){m(`-base-loading`,h,n(e,`clsPrefix`))},render(){let{clsPrefix:e,radius:t,strokeWidth:n,stroke:r,scale:a}=this,o=t/a;return i(`div`,{class:`${e}-base-loading`,role:`img`,"aria-label":`loading`},i(f,null,{default:()=>this.show?i(`div`,{key:`icon`,class:`${e}-base-loading__transition-wrapper`},i(`div`,{class:`${e}-base-loading__container`},i(`svg`,{class:`${e}-base-loading__icon`,viewBox:`0 0 ${2*o} ${2*o}`,xmlns:`http://www.w3.org/2000/svg`,style:{color:r}},i(`g`,null,i(`animateTransform`,{attributeName:`transform`,type:`rotate`,values:`0 ${o} ${o};270 ${o} ${o}`,begin:`0s`,dur:g,fill:`freeze`,repeatCount:`indefinite`}),i(`circle`,{class:`${e}-base-loading__icon`,fill:`none`,stroke:`currentColor`,"stroke-width":n,"stroke-linecap":`round`,cx:o,cy:o,r:t-n/2,"stroke-dasharray":5.67*t,"stroke-dashoffset":18.48*t},i(`animateTransform`,{attributeName:`transform`,type:`rotate`,values:`0 ${o} ${o};135 ${o} ${o};450 ${o} ${o}`,begin:`0s`,dur:g,fill:`freeze`,repeatCount:`indefinite`}),i(`animate`,{attributeName:`stroke-dashoffset`,values:`${5.67*t};${1.42*t};${5.67*t}`,begin:`0s`,dur:g,fill:`freeze`,repeatCount:`indefinite`})))))):i(`div`,{key:`placeholder`,class:`${e}-base-loading__placeholder`},this.$slots)}))}});export{m as n,_ as t};