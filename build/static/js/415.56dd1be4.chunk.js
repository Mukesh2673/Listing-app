"use strict";(self.webpackChunklisting_admin=self.webpackChunklisting_admin||[]).push([[415],{2548:function(e,t,n){n(2791);var a=n(8116),r=n(184);t.Z=function(e){var t=e.limit,n=e.pages,s=e.currentPage,i=e.PaginationHandleClick,c=[];if(n<=5)for(var o=0;o<n;o++)c.push({offSet:o*t,page:o+1});else if(n>=5&&s<=4){for(var l=0;l<=4;l++)c.push({offSet:l*t,page:l+1});c.push({offSet:"...",page:"..."}),c.push({offSet:(n-1)*t,page:n})}else if(n>=5&&s>=5&&s<=n-4){c.push({offSet:0,page:1}),c.push({offSet:"...",page:"..."});for(var u=s-1;u<=s+1;u++)c.push({offSet:(u-1)*t,page:u});c.push({offSet:"...",page:"..."}),c.push({offSet:(n-1)*t,page:n})}else{c.push({offSet:0,page:1}),c.push({offSet:"...",page:"..."});for(var d=n-4;d<=n;d++)c.push({offSet:(d-1)*t,page:d})}return(0,r.jsx)(r.Fragment,{children:(0,r.jsx)("div",{className:"paginationWrapper",children:(0,r.jsxs)(a.Z,{children:[(0,r.jsx)(a.Z.Prev,{disabled:1==s,onClick:function(){return i((s-2)*t,s-1)}}),c.map((function(e,t){return e.page===s?(0,r.jsx)(a.Z.Item,{disabled:"..."===e.page,className:"active",onClick:function(){return i(e.offSet,e.page)},children:e.page},t):(0,r.jsx)(a.Z.Item,{disabled:"..."===e.page,onClick:function(){return i(e.offSet,e.page)},children:e.page},t)})),(0,r.jsx)(a.Z.Next,{disabled:s==n,onClick:function(){return i(s*t,s+1)}})]})})})}},3415:function(e,t,n){n.r(t),n.d(t,{default:function(){return A}});var a=n(4165),r=n(5861),s=n(9439),i=n(2791),c=n(717),o=n(4292),l=n(3360),u=n(2591),d=n(614),v=(n(3704),n(9472)),f=n(1453),p=n(7999),h=(n(8427),n(5634)),m=n(1326),x=n(1795),g=n(979),Z=n(2976),j=n(8472),N=n(5819),y=n(1993),C=(n(5462),n(9281)),S=n(3532),k=n(9508),b=n(2548),w=n(184);var A=function(){var e=(0,i.useState)([]),t=(0,s.Z)(e,2),n=t[0],A=t[1],_=(0,i.useState)([]),T=(0,s.Z)(_,2),L=(T[0],T[1]),P=(0,i.useState)(!1),B=(0,s.Z)(P,2),F=B[0],U=B[1],V=(0,i.useState)([]),G=(0,s.Z)(V,2),H=G[0],I=G[1],z=(0,i.useState)(!1),$=(0,s.Z)(z,2),E=$[0],O=$[1],W=(0,i.useState)(),D=(0,s.Z)(W,2),K=D[0],R=D[1],X=(0,i.useState)(),Y=(0,s.Z)(X,2),q=Y[0],J=Y[1],M=(0,i.useState)(""),Q=(0,s.Z)(M,2),ee=Q[0],te=Q[1],ne=(0,i.useState)(""),ae=(0,s.Z)(ne,2),re=ae[0],se=ae[1],ie=(0,i.useState)([]),ce=(0,s.Z)(ie,2),oe=ce[0],le=ce[1],ue=(0,i.useState)(50),de=(0,s.Z)(ue,2),ve=de[0],fe=(de[1],(0,i.useState)(1)),pe=(0,s.Z)(fe,2),he=pe[0],me=pe[1],xe=(0,i.useState)(0),ge=(0,s.Z)(xe,2),Ze=ge[0],je=ge[1],Ne=(0,i.useState)(0),ye=(0,s.Z)(Ne,2),Ce=ye[0],Se=ye[1],ke=(0,C.Nr)(re,1e3),be=(0,s.Z)(ke,1)[0],we=(0,i.useState)(!1),Ae=(0,s.Z)(we,2),_e=Ae[0],Te=Ae[1],Le=(0,i.useRef)(null),Pe=function(e){"new"==e?(Ge.resetForm(),J(),U(!0)):U(!0)};(0,i.useEffect)((function(){Be(),Ue("")}),[]),(0,i.useEffect)((function(){0===be.length?Be():$e()}),[be]);var Be=function(){var e=(0,r.Z)((0,a.Z)().mark((function e(){var t,n=arguments;return(0,a.Z)().wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return t=n.length>0&&void 0!==n[0]?n[0]:0,Te(!0),e.next=4,(0,h.kA)("".concat(m._n,"/priceCatalog?offSet=").concat(t,"&limit=").concat(ve)).then((function(e){var t,n;if((null===e||void 0===e||null===(t=e.data)||void 0===t||null===(n=t.data)||void 0===n?void 0:n.length)>0){var a,r;Te(!1);var s=null===e||void 0===e||null===(a=e.data)||void 0===a?void 0:a.data,i=[];s.map((function(e,t){i[t]={createdAt:e.createdAt,updatedAt:e.updatedAt,price:e.price?e.price:"NULL",serviceName:e.serviceName?e.serviceName:"NULL",category:e.category[0].value?e.category[0].value:"NULL"}})),le(i),A(s),Se(null===e||void 0===e||null===(r=e.data)||void 0===r?void 0:r.pages)}}));case 4:case"end":return e.stop()}}),e)})));return function(){return e.apply(this,arguments)}}(),Fe=function(){U(!1),te(""),Ge.resetForm()},Ue=function(e){var t=[];if(e.length>0){for(var n=0;n<e.length;n++)for(var a=0;a<H.length;a++)H[a].value==e[n].toLowerCase()&&t.push({value:H[a].value?H[a].value.toLowerCase():"ocean",label:H[a].value?H[a].value.toUpperCase():"Ocean",id:H[a]._id?H[a]._id:"1"});L(t)}else(0,h.kA)("".concat(m._n,"/category")).then((function(e){var n,a;if((null===e||void 0===e||null===(n=e.data)||void 0===n||null===(a=n.data)||void 0===a?void 0:a.length)>0){for(var r,s=null===e||void 0===e||null===(r=e.data)||void 0===r?void 0:r.data,i=0;i<s.length;i++)t.push({value:s[i].name?s[i].name.toLowerCase():"ocean",label:s[i].name?s[i].name.toUpperCase():"Ocean",id:s[i]._id?s[i]._id:"1"});I(t)}}))},Ve=function(){var e=(0,r.Z)((0,a.Z)().mark((function e(t,n){return(0,a.Z)().wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return Te(!0),e.next=3,(0,h.e8)("".concat(m._n,"/priceCatalog/status/").concat(t._id));case 3:200===e.sent.status?(Te(!1),Be(),(0,N.z)(S.eI),setTimeout((function(){y.Am.dismiss()}),1e3)):((0,N.g)(S.Zv),setTimeout((function(){y.Am.dismiss()}),1e3));case 5:case"end":return e.stop()}}),e)})));return function(t,n){return e.apply(this,arguments)}}(),Ge=(0,x.TA)({initialValues:{category:[],serviceName:"",price:""},validate:function(e){var t={};if(e.serviceName||(t.serviceName=S.$7),e.price)e.price<0&&(t.price=S.fX);else{if(0===e.price)return;t.price=S.$7}return e.category.length<1&&(t.category=S.$7),t},onSubmit:function(){var e=(0,r.Z)((0,a.Z)().mark((function e(t){var n;return(0,a.Z)().wrap((function(e){for(;;)switch(e.prev=e.next){case 0:if(n={category:[t.category],serviceName:t.serviceName,price:t.price},!q){e.next=9;break}return Te(!0),e.next=5,(0,h.e8)("".concat(m._n,"/priceCatalog/").concat(q),n);case 5:200===e.sent.status?(Te(!1),Fe(),(0,N.z)(S.SH),setTimeout((function(){y.Am.dismiss(),Be(),L([])}),1e3)):((0,N.g)(S.Zv),Fe(),setTimeout((function(){y.Am.dismiss()}),1e3)),e.next=14;break;case 9:return Te(!0),e.next=12,(0,h.Ko)("".concat(m._n,"/priceCatalog"),n);case 12:200===e.sent.status?(Te(!1),Fe(),(0,N.z)(S.yS),setTimeout((function(){y.Am.dismiss(),Be(),L([])}),1e3)):((0,N.g)(S.Zv),Fe(),setTimeout((function(){y.Am.dismiss()}),1e3));case 14:case"end":return e.stop()}}),e)})));return function(t){return e.apply(this,arguments)}}()}),He=function(){var e=(0,r.Z)((0,a.Z)().mark((function e(t,n){var r,s;return(0,a.Z)().wrap((function(e){for(;;)switch(e.prev=e.next){case 0:Ge.setFieldValue("serviceName",n.serviceName),Ge.setFieldValue("price",n.price),Ge.setFieldValue("category",n.category),s=null===(r=n.category[0].value)||void 0===r?void 0:r.toUpperCase(),te(s),J(t),Pe();case 7:case"end":return e.stop()}}),e)})));return function(t,n){return e.apply(this,arguments)}}(),Ie=function(){var e=(0,r.Z)((0,a.Z)().mark((function e(){return(0,a.Z)().wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return Te(!0),e.next=3,(0,h.P3)("".concat(m._n,"/priceCatalog/").concat(K));case 3:200===e.sent.status?(Te(!1),(0,N.z)(S.oZ),setTimeout((function(){y.Am.dismiss(),Be()}),1e3)):((0,N.g)(S.Zv),setTimeout((function(){y.Am.dismiss()}),1e3)),ze();case 6:case"end":return e.stop()}}),e)})));return function(){return e.apply(this,arguments)}}(),ze=function(){return O(!1)},$e=function(){var e=(0,r.Z)((0,a.Z)().mark((function e(){var t,n,r;return(0,a.Z)().wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return Te(!0),e.next=3,(0,h.kA)("".concat(m._n,"/priceCatalog/search?text=").concat(be,"&offSet=").concat(Ze,"&limit=").concat(ve));case 3:200===(t=e.sent).status?(Te(!1),(r=null===t||void 0===t||null===(n=t.data)||void 0===n?void 0:n.data).length&&A(r)):((0,N.g)(S.Zv),setTimeout((function(){y.Am.dismiss()}),1e3));case 5:case"end":return e.stop()}}),e)})));return function(){return e.apply(this,arguments)}}(),Ee=function(){var e=(0,r.Z)((0,a.Z)().mark((function e(){return(0,a.Z)().wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return Te(!0),e.next=3,(0,h.kA)("".concat(m._n,"/priceCatalog?offSet=",0,"&limit=").concat(ve*Ce)).then((function(e){var t;if(null!==e&&void 0!==e&&null!==(t=e.data)&&void 0!==t&&t.data){var n,a=null===e||void 0===e||null===(n=e.data)||void 0===n?void 0:n.data,r=[];a.map((function(e,t){r[t]={category:(null===e||void 0===e?void 0:e.category.length)>0?null===e||void 0===e?void 0:e.category[0].value:"Null",serviceName:null!==e&&void 0!==e&&e.serviceName?null===e||void 0===e?void 0:e.serviceName:"Null",status:null!==e&&void 0!==e&&e.status?null===e||void 0===e?void 0:e.status:"false",createdAt:null!==e&&void 0!==e&&e.createdAt?null===e||void 0===e?void 0:e.createdAt:"Null",updatedAt:null!==e&&void 0!==e&&e.updatedAt?null===e||void 0===e?void 0:e.updatedAt:"Null"}})),le(r),setTimeout((function(){Le.current.link.click(),Te(!1)}),2e3)}}));case 3:case"end":return e.stop()}}),e)})));return function(){return e.apply(this,arguments)}}();return(0,w.jsxs)(w.Fragment,{children:[_e&&(0,w.jsx)(k.Z,{}),(0,w.jsxs)("div",{className:"main-content",children:[(0,w.jsx)("div",{className:"main-content-inner",children:(0,w.jsx)("div",{className:"listing-headder",children:(0,w.jsxs)("div",{className:"tabing-content-inner",children:[(0,w.jsxs)("div",{className:"search-point justify-content-between",children:[(0,w.jsxs)(c.Z,{inline:"true",className:"search-box d-flex",children:[(0,w.jsx)(o.Z,{type:"text",placeholder:"Search",className:"mr-2",onChange:function(e){se(e.target.value)},value:re}),(0,w.jsx)(l.Z,{variant:"outline-success",children:(0,w.jsx)("img",{src:v.Z,alt:""})}),(0,w.jsx)(l.Z,{onClick:Ee,className:"export-btn btn btn-primary",children:(0,w.jsx)("img",{src:p.Z,alt:""})}),(0,w.jsx)(j.CSVLink,{className:"hidden",data:oe,ref:Le,target:"_blank"})]}),(0,w.jsx)(l.Z,{className:"new-btn",onClick:function(){return Pe("new")},children:"New"})]}),(0,w.jsx)("div",{className:"listing-content-table",children:(0,w.jsxs)(u.Z,{responsive:!0,className:"porfile-list",children:[(0,w.jsx)("thead",{children:(0,w.jsxs)("tr",{children:[(0,w.jsx)("th",{children:"ID"}),(0,w.jsx)("th",{children:"Category"}),(0,w.jsx)("th",{children:"Service"}),(0,w.jsx)("th",{children:"Price"}),(0,w.jsx)("th",{})]})}),(0,w.jsx)("tbody",{children:n.map((function(e,t){var n;return(0,w.jsxs)("tr",{children:[(0,w.jsx)("td",{onClick:function(){return He(e._id,e)},children:t+1}),(0,w.jsx)("td",{onClick:function(){return He(e._id,e)},children:e.category[0].value?null===(n=e.category[0].value)||void 0===n?void 0:n.toUpperCase():"Null"}),(0,w.jsx)("td",{onClick:function(){return He(e._id,e)},children:e.serviceName}),(0,w.jsx)("td",{onClick:function(){return He(e._id,e)},children:e.price}),(0,w.jsx)("td",{children:(0,w.jsxs)("div",{className:"d-flex",children:[(0,w.jsx)("div",{className:"statusWrap",children:(0,w.jsxs)("label",{className:"switch",children:[(0,w.jsx)("input",{type:"checkbox",onChange:function(t){return Ve(e)},checked:e.status}),(0,w.jsx)("span",{className:"slider round"})]})}),(0,w.jsx)("div",{className:"d-flex btnsGroup",children:(0,w.jsx)(l.Z,{type:"button",onClick:function(){return t=e._id,O(!0),void R(t);var t},children:(0,w.jsx)("img",{src:f.Z,alt:""})})})]})})]},t)}))})]})}),(0,w.jsx)(b.Z,{limit:ve,pages:Ce,currentPage:he,PaginationHandleClick:function(e,t){je(e),me(t),Be(e)}})]})})}),(0,w.jsx)(d.Z,{show:F,onHide:Fe,className:"category-modal",children:(0,w.jsxs)(c.Z,{onSubmit:Ge.handleSubmit,children:[(0,w.jsxs)(d.Z.Header,{children:[(0,w.jsx)(d.Z.Title,{children:""}),(0,w.jsx)("div",{className:"crossBtnwrap d-flex justify-content-end",children:(0,w.jsx)(l.Z,{className:"crossBtn",variant:"primary",children:(0,w.jsx)("img",{src:g.Z,alt:"close",onClick:Fe})})})]}),(0,w.jsxs)(d.Z.Body,{children:[(0,w.jsxs)(c.Z.Group,{className:"form-group",children:[(0,w.jsx)(Z.ZP,{onChange:function(e){Ge.setFieldValue("category",e),L(e)},name:"category",options:H,className:"basic-single",classNamePrefix:"select",defaultInputValue:ee}),Ge.errors.category&&Ge.touched.category?(0,w.jsx)("div",{className:"text-danger",children:Ge.errors.category}):null]}),(0,w.jsxs)(c.Z.Group,{className:"form-group",children:[(0,w.jsx)(c.Z.Control,{type:"text",placeholder:"Service Name",name:"serviceName",onChange:Ge.handleChange,onBlur:Ge.handleBlur,value:Ge.values.serviceName}),Ge.errors.serviceName&&Ge.touched.serviceName?(0,w.jsx)("div",{className:"text-danger",children:Ge.errors.serviceName}):null]}),(0,w.jsxs)(c.Z.Group,{className:"form-group",children:[(0,w.jsx)(c.Z.Control,{type:"number",placeholder:"Price",name:"price",onChange:Ge.handleChange,onBlur:Ge.handleBlur,value:Ge.values.price,min:"0"}),Ge.errors.price&&Ge.touched.price?(0,w.jsx)("div",{className:"text-danger",children:Ge.errors.price}):null]}),(0,w.jsx)(c.Z.Group,{className:"form-group",children:(0,w.jsx)(l.Z,{type:"submit",className:"save",variant:"primary",children:q?"Update":"Save"})})]})]})}),(0,w.jsx)(d.Z,{show:E,onHide:ze,className:"category-modal",children:(0,w.jsxs)(c.Z,{onSubmit:Ge.handleSubmit,children:[(0,w.jsx)("div",{className:"crossBtnwrap d-flex justify-content-end",children:(0,w.jsx)(l.Z,{children:(0,w.jsx)("img",{src:g.Z,alt:"close",onClick:ze})})}),(0,w.jsx)(d.Z.Body,{children:(0,w.jsx)(c.Z.Group,{className:"form-group",children:(0,w.jsxs)("div",{className:"text-center content-center",children:[(0,w.jsx)("h3",{children:S.fF}),(0,w.jsxs)("p",{children:[(0,w.jsxs)(l.Z,{type:"button",className:"save",variant:"info",onClick:ze,children:[" ","No"," "]})," ",(0,w.jsxs)(l.Z,{type:"button",className:"save",variant:"danger",onClick:Ie,children:[" ","Yes"," "]})]})]})})})]})})]})]})}}}]);
//# sourceMappingURL=415.56dd1be4.chunk.js.map