import{cn as e,rn as t,vn as n,xn as r}from"../jse/index-index-uy1cF7DH.js";import{B as i,L as a,V as o,j as s,n as c,z as l}from"./use-theme-BvigQW3q.js";import{n as u}from"./light-BJpBbtiA.js";import{t as d}from"./light-BF7en6UM.js";var f=a(`divider`,`
 position: relative;
 display: flex;
 width: 100%;
 box-sizing: border-box;
 font-size: 16px;
 color: var(--n-text-color);
 transition:
 color .3s var(--n-bezier),
 background-color .3s var(--n-bezier);
`,[o(`vertical`,`
 margin-top: 24px;
 margin-bottom: 24px;
 `,[o(`no-title`,`
 display: flex;
 align-items: center;
 `)]),l(`title`,`
 display: flex;
 align-items: center;
 margin-left: 12px;
 margin-right: 12px;
 white-space: nowrap;
 font-weight: var(--n-font-weight);
 `),i(`title-position-left`,[l(`line`,[i(`left`,{width:`28px`})])]),i(`title-position-right`,[l(`line`,[i(`right`,{width:`28px`})])]),i(`dashed`,[l(`line`,`
 background-color: #0000;
 height: 0px;
 width: 100%;
 border-style: dashed;
 border-width: 1px 0 0;
 `)]),i(`vertical`,`
 display: inline-block;
 height: 1em;
 margin: 0 8px;
 vertical-align: middle;
 width: 1px;
 `),l(`line`,`
 border: none;
 transition: background-color .3s var(--n-bezier), border-color .3s var(--n-bezier);
 height: 1px;
 width: 100%;
 margin: 0;
 `),o(`dashed`,[l(`line`,{backgroundColor:`var(--n-color)`})]),i(`dashed`,[l(`line`,{borderColor:`var(--n-color)`})]),i(`vertical`,{backgroundColor:`var(--n-color)`})]),p=n({name:`Divider`,props:Object.assign(Object.assign({},c.props),{titlePlacement:{type:String,default:`center`},dashed:Boolean,vertical:Boolean}),setup(t){let{mergedClsPrefixRef:n,inlineThemeDisabled:r}=s(t),i=c(`Divider`,`-divider`,f,d,t,n),a=e(()=>{let{common:{cubicBezierEaseInOut:e},self:{color:t,textColor:n,fontWeight:r}}=i.value;return{"--n-bezier":e,"--n-color":t,"--n-text-color":n,"--n-font-weight":r}}),o=r?u(`divider`,void 0,a,t):void 0;return{mergedClsPrefix:n,cssVars:r?void 0:a,themeClass:o==null?void 0:o.themeClass,onRender:o==null?void 0:o.onRender}},render(){var e;let{$slots:n,titlePlacement:i,vertical:a,dashed:o,cssVars:s,mergedClsPrefix:c}=this;return(e=this.onRender)==null||e.call(this),r(`div`,{role:`separator`,class:[`${c}-divider`,this.themeClass,{[`${c}-divider--vertical`]:a,[`${c}-divider--no-title`]:!n.default,[`${c}-divider--dashed`]:o,[`${c}-divider--title-position-${i}`]:n.default&&i}],style:s},a?null:r(`div`,{class:`${c}-divider__line ${c}-divider__line--left`}),!a&&n.default?r(t,null,r(`div`,{class:`${c}-divider__title`},this.$slots),r(`div`,{class:`${c}-divider__line ${c}-divider__line--right`})):null)}});export{p as NDivider};