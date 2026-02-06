(function(){const n=document.createElement("link").relList;if(n&&n.supports&&n.supports("modulepreload"))return;for(const s of document.querySelectorAll('link[rel="modulepreload"]'))t(s);new MutationObserver(s=>{for(const e of s)if(e.type==="childList")for(const r of e.addedNodes)r.tagName==="LINK"&&r.rel==="modulepreload"&&t(r)}).observe(document,{childList:!0,subtree:!0});function a(s){const e={};return s.integrity&&(e.integrity=s.integrity),s.referrerPolicy&&(e.referrerPolicy=s.referrerPolicy),s.crossOrigin==="use-credentials"?e.credentials="include":s.crossOrigin==="anonymous"?e.credentials="omit":e.credentials="same-origin",e}function t(s){if(s.ep)return;s.ep=!0;const e=a(s);fetch(s.href,e)}})();const p="/api/posts",U="/api/auth",R="/api/comments",oe="https://i.postimg.cc/KvF0rh0Q/custom-default-avatar.png",ne=document.body,Y=document.querySelectorAll(".user-icon"),C=document.getElementById("userMenuDetails"),j=document.getElementById("authModal"),ue=document.getElementById("closeModal"),$=document.getElementById("loginTab"),P=document.getElementById("registerTab"),ge=document.querySelectorAll(".write-post"),fe=document.querySelector(".search-icon"),W=document.getElementById("mobileSearch"),he=document.querySelector(".menu-toggle"),ye=document.getElementById("mobileMenu"),T=document.querySelector(".logo"),pe=document.querySelector(".all-posts-btn"),we=document.getElementById("myPosts"),ve=document.getElementById("savedPosts"),ke=document.getElementById("profile-edit"),Ee=document.getElementById("settings"),D=document.getElementById("themeToggle"),O=document.documentElement;function d(o,n="info",a=5e3){const t=document.getElementById("toast-container");if(!t)return;const s=document.createElement("div");s.className=`toast toast-${n}`;const e=document.createElement("i");n==="success"?e.className="fas fa-check-circle":n==="error"?e.className="fas fa-exclamation-circle":e.className="fas fa-info-circle",s.appendChild(e);const r=document.createElement("span");r.textContent=o,s.appendChild(r),t.appendChild(s),setTimeout(()=>{s.style.animation="slideOut 0.5s forwards",s?.addEventListener("animationend",()=>s.remove())},a)}function be(){he?.addEventListener("click",o=>{o.stopPropagation(),C.classList.contains("show")&&C.classList.remove("show"),ye.classList.toggle("active")})}function Le(){T?.addEventListener("click",()=>{window.location.href="index.html"}),pe?.addEventListener("click",()=>{window.location.href="all-posts.html"}),we?.addEventListener("click",()=>{window.location.href="my-posts.html"}),ke?.addEventListener("click",()=>{window.location.href="dashboard.html"}),ve?.addEventListener("click",()=>{window.location.href="saved.html"}),Ee?.addEventListener("click",()=>{window.location.href="settings.html"})}function Se(){$?.addEventListener("click",()=>{E.classList.remove("hidden"),b.classList.add("hidden"),$.classList.add("active"),P.classList.remove("active")}),P?.addEventListener("click",()=>{b.classList.remove("hidden"),E.classList.add("hidden"),P.classList.add("active"),$.classList.remove("active")}),ue?.addEventListener("click",()=>{j.classList.add("hidden")})}function Ie(){Y.forEach(o=>o?.addEventListener("click",()=>{const n=localStorage.getItem("user"),a=n?JSON.parse(n):null;a&&a.id?(C.classList.toggle("show"),j.classList.add("hidden")):(C.classList.add("hidden"),j.classList.remove("hidden"),$.classList.add("active"),P.classList.remove("active"),E.classList.remove("hidden"),b.classList.add("hidden"),E?.reset(),b?.reset())}))}function $e(){fe?.addEventListener("click",()=>{W.classList.toggle("show"),W.classList.contains("show")&&W.querySelector("input").focus()})}function Pe(){ge.forEach(o=>{o?.addEventListener("click",n=>{const a=localStorage.getItem("user"),t=a?JSON.parse(a):null;!t||!t.id?(n.preventDefault(),j.classList.remove("hidden"),$.classList.add("active"),P.classList.remove("active"),E.classList.remove("hidden"),b.classList.add("hidden")):(localStorage.removeItem("editSlug"),window.location.href="write.html")})})}function Be(){D?.addEventListener("change",()=>{D.checked?(O.setAttribute("data-theme","dark"),localStorage.setItem("theme","dark"),T.src="/Images/logo-dark-theme_optimized_.png"):(O.setAttribute("data-theme","light"),localStorage.setItem("theme","light"),T.src="/Images/logo_optimized.png")})}function Je(){localStorage.getItem("theme")==="dark"?(O.setAttribute("data-theme","dark"),D&&(D.checked=!0)):O.setAttribute("data-theme","light")}function ze(o){o==="dark"?(ne.classList.add("dark"),T.src="/Images/logo-dark-theme_optimized_.png"):(ne.classList.remove("dark"),T.src="/Images/logo_optimized.png"),localStorage.setItem("theme",o)}function We(){be(),Se(),Ie(),$e(),Pe(),Le(),Be()}const E=document.getElementById("loginForm"),b=document.getElementById("registerForm"),Ce=document.getElementById("logoutBtn");function J(o){return o?{...o,id:o.id||o._id}:null}window.currentUser=(()=>{const o=localStorage.getItem("user");return o?J(JSON.parse(o)):null})();function S(o){o?.id?Y.forEach(n=>n.title=`Logged in as ${o.name}`):(Y.forEach(n=>n.title="Click to Login/Register"),C?.classList.remove("show"))}async function H(o){try{const n=await m("/api/users/me");if(!n.ok)return;o=await n.json();const a=document.querySelectorAll(".user-icon");a&&a.forEach(s=>{s.src=o.profilePhoto?.trim()?o.profilePhoto:oe});const t=document.querySelectorAll(".avatar");t&&t.forEach(s=>{s.src=o.profilePhoto?.trim()?o.profilePhoto:oe}),window.currentUser=o}catch(n){console.warn("Failed to load auth user:",n)}}function Te(){E?.addEventListener("submit",async o=>{o.preventDefault();const n=document.getElementById("loginEmail").value,a=document.getElementById("loginPassword").value;console.log("Login Triggered");const t=await m(`${U}/login`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({email:n,password:a})}),s=await t.json();console.log("Login response:",s),t.ok||d(`Login failed: ${s.message||"Unknown error"}`,"error");const e=J(s.user);localStorage.setItem("user",JSON.stringify(e)),window.currentUser=e,localStorage.setItem("role",e.role),e.role==="admin"&&(window.location.href="admin.html"),S(e),H(e),authModal.classList.add("hidden"),E.reset(),d(`Welcome back, ${e.name}!`,"success"),Re()})}function Ue(){b?.addEventListener("submit",async o=>{o.preventDefault();const n=document.getElementById("registerName").value,a=document.getElementById("registerEmail").value,t=document.getElementById("registerPassword").value,s=await m(`${U}/register`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({name:n,email:a,password:t})}),e=await s.json();console.log("Register response:",e),s.ok||d(`Registration failed: ${e.message||"Unknown error"}`,"error");const r=J(e.user);localStorage.setItem("user",JSON.stringify(r)),window.currentUser=r,localStorage.setItem("role",r.role),S(r),H(r),authModal.classList.add("hidden"),b.reset(),d(`Welcome, ${r.name}! Your account has been created.`,"success")})}function Ae(){Ce?.addEventListener("click",()=>{ae(),window.location.href="index.html"})}async function Ve(){try{const o=await m(`${U}/me`);if(!o.ok)throw new Error("Not authenticated");const n=await o.json(),a=J(n);return localStorage.setItem("user",JSON.stringify(a)),window.currentUser=a,S(a),H(a),a}catch{return S(null),H(null),null}}async function ae(o=!1){try{await fetch(`${U}/logout`,{method:"POST",credentials:"include"})}catch(n){console.warn("Logout request failed:",n)}localStorage.removeItem("user"),window.currentUser=null,S(null),o||d("You have been logged out.","info")}function Me(){const o=document.getElementById("forgotPasswordLink"),n=document.getElementById("forgotPasswordModal"),a=document.getElementById("closeForgotModal"),t=document.getElementById("forgotPasswordForm");o&&o?.addEventListener("click",s=>{s.preventDefault(),n.classList.remove("hidden")}),a&&a?.addEventListener("click",()=>{n.classList.add("hidden")}),t&&t?.addEventListener("submit",async s=>{s.preventDefault();const e=document.getElementById("forgotEmail").value.trim();try{const l=await(await fetch("/api/auth/forgot-password",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({email:e})})).json();d(l.message||"Check your email for the reset link.","success"),n.classList.add("hidden")}catch(r){console.error(r),d("Failed to send reset link. Try again.","error")}})}function Ye(){Te(),Ue(),Ae(),Me()}async function m(o,n={}){let a=await fetch(o,{credentials:"include",...n});return a.status===401&&(await qe()?a=await fetch(o,{credentials:"include",...n}):ae(!0)),a}async function qe(){try{const o=await fetch(`${U}/refresh`,{method:"POST",credentials:"include"});if(!o.ok)throw new Error("Refresh failed");const n=await o.json();return window.currentUser=n.user,S(n.user),!0}catch{return!1}}async function Ke(o){const n=o.dataset.slug;if(!n)return;const a=window.location.pathname.endsWith("post.html"),t=a?document.getElementById("singlePostContainer"):o.closest(".post");if(!t)return;const s=t.querySelector(".comments-section"),e=s?.querySelector(".comments-list");!s||!e||(a||s.classList.toggle("show"),(a||s.classList.contains("show"))&&await re(n,e))}async function Qe(o){if(o.dataset.deleting==="true")return;o.dataset.deleting="true";const n=o.dataset.commentId;if(!confirm("Are you sure you want to delete this comment?")){o.dataset.deleting="false";return}try{const t=await m(`${R}/${n}`,{method:"DELETE"}),s=await t.json();if(t.ok){const e=o.closest(".comment");e&&e.remove();const l=(window.location.pathname.endsWith("post.html")?document.getElementById("singlePostContainer"):o.closest(".post"))?.querySelector(".comment-count");if(l){let i=parseInt(l.textContent)||0;i=Math.max(i-1,0),l.textContent=i,l.title=`${i} comment${i!==1?"s":""}`}d("Comment deleted successfully!","success")}else throw new Error(s.message||"Delete failed")}catch(t){console.error("Error deleting comment:",t),d("Error deleting comment. Please try again.","error")}finally{o.dataset.deleting="false"}}async function re(o,n,a=3){try{n.innerHTML='<p class="loading-comments">Loading comments...</p>';const t=await m(`${R}/post/${o}?_=${Date.now()}`);if(!t.ok)throw new Error("Failed to fetch comments");const s=await t.json();if(n.innerHTML="",s.length===0){n.innerHTML="<p class='no-comments'>No comments yet. Be the first to comment!</p>";return}const e=s.slice(0,a);if(V(e,n),s.length>a){const r=document.createElement("button");r.classList.add("view-more-btn"),r.textContent=`View all ${s.length} comments`;const l=document.createElement("div");l.classList.add("comments-scroll-container"),l.style.display="none",V(s,l);let i=!1;r?.addEventListener("click",()=>{i=!i,i?(n.innerHTML="",n.appendChild(l),n.appendChild(r),l.style.display="block",r.textContent="View less comments"):(n.innerHTML="",V(e,n),r.textContent=`View all ${s.length} comments`,n.appendChild(r))}),n.appendChild(r)}}catch(t){console.error("Error fetching comments:",t),n.innerHTML="<p class='error-comments'>Failed to load comments.</p>"}}function V(o,n){const a=window.currentUser?.id||window.currentUser?._id;o.forEach(t=>{const s=document.createElement("div");s.classList.add("comment");const e=typeof t.authorId=="object"?t.authorId._id:t.authorId,r=a&&e&&e.toString()===a.toString();s.innerHTML=`
      <div class="comment-header">
        <p><strong class="comment-author" style="cursor: pointer;">${t.authorId?.name||"Anonymous"}:</strong> ${te(t.text)}</p>
        ${r?`<div class="comment-menu">
                  <button class="menu-btn">⋮</button>
                  <div class="menu-options hidden">
                    <button class="delete-comment-btn" data-comment-id="${t._id}">Delete</button>
                  </div>
                </div>`:""}
      </div>  
      <small title="${new Date(t.createdAt).toLocaleString()}">
        ${M(t.createdAt)}
      </small>
    `,n.appendChild(s),s.querySelector(".comment-author")?.addEventListener("click",()=>{window.location.href=`profile.html?id=${t.authorId?._id}`})})}async function Fe(o,n,a,t){try{const s=await m(`${R}/post/${o}`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({text:n})});if(s.ok){const r=(await s.json()).comment,l=document.createElement("div");if(l.classList.add("comment"),l.innerHTML=`
        <div class="comment-header">
          <p><strong>You:</strong> ${te(r.text)}</p>
          <div class="comment-menu">
            <button class="menu-btn">⋮</button>
            <div class="menu-options hidden">
              <button class="delete-comment-btn" data-comment-id="${r._id}">Delete</button>
            </div>
          </div>
        </div>
        <small title="${new Date(r.createdAt).toLocaleString()}">
        ${M(r.createdAt)}
      </small>
      `,a.prepend(l),t&&t){let i=parseInt(t.textContent)||0;t.textContent=i+1,t.title=`${i+1} comments`}d("Comment posted successfully!","success")}else throw new Error("Failed to post comment")}catch(s){console.error("Error posting comment:",s),d("Failed to post comment","error")}}async function ie(o,n){try{const a=await m(`${R}/post/${o}`);if(!a.ok)throw new Error("Failed to fetch comment count");const s=(await a.json()).length;s===0?(n.textContent="0",n.title="No comments yet"):(n.textContent=s,n.title=`${s} comment${s>1?"s":""}`)}catch(a){console.error("Error fetching comment count:",a),n.textContent="0"}}async function xe(o){const n=o.target.closest(".comment-form"),a=n.querySelector(".comment-form button");if(!n)return;o.preventDefault();const t=n.querySelector(".comment-input"),s=t.value.trim();if(!s)return;let e,r,l,i;window.location.pathname.endsWith("post.html")?(e=document.getElementById("singlePostContainer"),r=e.querySelector(".comments-list"),l=e.querySelector(".comment-btn").dataset.slug,i=e.querySelector(".comment-count")):(e=n.closest(".post"),r=e.querySelector(".comments-list"),l=e.querySelector(".like-btn").dataset.slug,i=e.querySelector(".comment-count"));const c=u=>{a.disabled=u,a.innerHTML=u?'<i class="fa-solid fa-spinner fa-spin"></i>':"Comment"};try{if(c(!0),!window.currentUser){d("Please log in to comment.","error"),t.value="",c(!1);return}await Fe(l,s,r,i),t.value=""}catch{c(!1)}finally{c(!1)}}function Ge(){document.addEventListener("submit",xe)}const Ne=document.querySelectorAll(".search");let v={all:[],mine:[],saved:[]},I=1,g=Number(sessionStorage.getItem("postsPage"))||1,Xe=sessionStorage.getItem("postsCategory")||"",Ze=sessionStorage.getItem("postsSearch")||"";function K(o){return o&&o.startsWith("http")?o:"/Images/fallback.jpg"}let _;function Q(){clearTimeout(_),document.getElementById("postsSkeleton")?.classList.remove("hidden")}function G(){document.getElementById("postsSkeleton")?.classList.add("hidden")}function X(){clearTimeout(_),_=setTimeout(()=>{document.getElementById("postsLoader")?.classList.remove("hidden")},150)}function Z(){clearTimeout(_),document.getElementById("postsLoader")?.classList.add("hidden")}function A(o){const n=new URL(window.location);o===1?n.searchParams.delete("page"):n.searchParams.set("page",o);const a=sessionStorage.getItem("postsCategory"),t=sessionStorage.getItem("postsSearch");a?n.searchParams.set("category",a):n.searchParams.delete("category"),t?n.searchParams.set("search",t):n.searchParams.delete("search"),window.history.pushState({},"",n)}function ee(){const o=new URLSearchParams(window.location.search);return Number(o.get("page"))||1}async function et(){const o=sessionStorage.getItem("postsCategory"),n=sessionStorage.getItem("postsSearch"),a=document.getElementById("categoryFilter");a&&o&&(a.value=o),document.querySelectorAll(".search").forEach(s=>{n&&(s.value=n)})}async function z(o,n=6){try{const a=o??ee(),t=document.getElementById("categoryFilter")?.value,s=document.querySelectorAll(".search"),e=new URLSearchParams;e.append("page",a),e.append("limit",n),t&&t!=="all"&&e.append("category",t),s.forEach(c=>{if(c){const u=c.value.trim();u&&e.append("search",u)}}),a===1?Q():X();const l=await(await m(`${p}?${e.toString()}`)).json();v.all=Array.isArray(l.posts)?l.posts:[],g=l.currentPage??1,I=l.totalPages??1,A(g),typeof g<"u"&&sessionStorage.setItem("postsPage",g),sessionStorage.setItem("postsCategory",t&&t!=="all"?t:"");const i=[...s].find(c=>c.value.trim())?.value.trim()||"";sessionStorage.setItem("postsSearch",i),B("allPostsContainer"),se("allPostsContainer",g,I)}catch(a){console.error("Error fetching posts:",a),d("Something went wrong while displaying posts!","error")}finally{G(),Z()}}async function le(o,n=6){try{const a=o??ee(),t=document.querySelectorAll(".search"),s=new URLSearchParams;s.append("page",a),s.append("limit",n),t.forEach(c=>{if(c){const u=c.value.trim();u&&s.append("search",u)}}),a===1?Q():X();const e=await m(`${p}/mine?${s.toString()}`);if(!e.ok){const c=await e.text();throw new Error(c||"Failed to fetch your posts")}const r=await e.json();v.mine=Array.isArray(r.posts)?r.posts:[],g=r.currentPage||1,I=r.totalPages||1,A(g),sessionStorage.setItem("postsPage",g);const l=[...t].find(c=>c.value.trim())?.value.trim()||"";sessionStorage.setItem("postsSearch",l);const i="myPostsContainer";B("myPostsContainer"),se(i,g,I)}catch(a){console.error("Error fetching my posts:",a),d("Failed to load your posts!","error")}finally{G(),Z()}}function M(o){const n=Math.floor((Date.now()-new Date(o))/1e3),a=[{label:"year",seconds:31536e3},{label:"month",seconds:2592e3},{label:"day",seconds:86400},{label:"hour",seconds:3600},{label:"minute",seconds:60},{label:"second",seconds:1}],t=new Intl.RelativeTimeFormat("en",{numeric:"auto"});for(const s of a){const e=Math.floor(n/s.seconds);if(e>=1)return t.format(-e,s.label)}return"Just now"}function te(o){return o.replace(/\n/g,"<br>")}function B(o,n=null){const a=window.currentUser?._id||window.currentUser?.id,t=document.getElementById(o);if(!t)return;t.innerHTML="";let s=[];if(o==="allPostsContainer"||o==="featuredPostsContainer"?s=[...v.all]:o==="myPostsContainer"?s=[...v.mine]:o==="savedPostsContainer"&&(s=[...v.saved]),n&&(s=s.slice(0,n)),s.length===0){o==="myPostsContainer"?t.innerHTML=`<p style="text-align:center; color:gray; font-size: 20px; font-weight: bold;">You haven't made any posts yet...</p>`:t.innerHTML='<p style="text-align:center; color:gray; font-size:20px;">No results found...</p>';return}s.forEach(e=>{const r=document.createElement("div");r.classList.add("post");const l=e.content.length>150?e.content.substring(0,150)+"...":e.content,i=typeof e.authorId=="object"&&e.authorId!==null?e.authorId._id:e.authorId,c=typeof e.authorId=="object"&&e.authorId!==null?e.authorId.name:e.authorName||"Unknown",u=a&&String(i)===String(a);r.innerHTML=`
      ${e.image?`<a href="post.html?slug=${e.slug}">
             <img src="${K(e.image)}" alt="${e.title}" class="post-image" loading="lazy">
           </a>`:""}
        <p class="tag">${e.category}</p>
        <h2>
          <a href="post.html?slug=${e.slug}" class="post-link">${e.title}</a>
        </h2>
        <p>${l} <a href="post.html?slug=${e.slug}" class="read-more">Read more</a></p>
        <a href="profile.html?id=${i}" class="author"><em>By ${c}</em></a>
        <small title="${new Date(e.date).toLocaleString()}">
          ${M(e.date)}
        </small>
        <br>
        <div class="post-interactions-container">
          <div class="post-interactions">
            <button class="like-btn ${e.likedByUser?"liked":""}" data-slug="${e.slug}">
              <i class="${e.likedByUser?"fa-solid":"fa-regular"} fa-heart"></i>
              <span class="like-count">${e.likesCount||0}</span>
            </button>
            <button class="comment-btn" data-slug="${e.slug}">
              <i class="fa-regular fa-comment"></i>
              <span class="comment-count">${e.commentsCount||0}</span>
            </button>
            <button class="share-btn" data-slug="${e.slug}">
              <i class="fa-solid fa-share"></i>
              <span class="share-count">${e.shares}</span>
            </button>
          </div>
          <span class="liked-by likes-info">No likes yet</span>
        </div>
        <div id="likesModal-${e.slug}" class="likes-modal hidden slide-up">
          <div class="likes-modal-content">
            <span id="closeLikesModal-${e.slug}" class="close-btn">&times;</span>
            <h3>Liked by</h3>
            <ul id="likesList-${e.slug}" class="likes-list"></ul>            
          </div>
        </div>
        <div class="comments-section">
          <form class="comment-form">
            <input type="text" class="comment-input" placeholder="Write a comment..." required />
            <button type="submit">Comment</button>
          </form>
          <div class="comments-list"></div>
        </div>
        ${u?`
        <div class="post-actions">
            <button class="edit-btn btn" data-slug="${e.slug}">Edit</button>
            <button class="delete-btn btn" data-slug="${e.slug}">Delete</button>
        </div>
        `:""}
    `,t.appendChild(r);const k=r.querySelector(".post-image");k&&(k.onerror=function(){this.onerror=null,this.src="/Images/fallback.jpg"});const h=r.querySelector(".like-btn"),q=h.querySelector("i"),w=r.querySelector(".liked-by");w.dataset.slug=e.slug,w.dataset.likedBy=JSON.stringify(e.likedBy||[]),e.likedBy&&e.likedBy.length>0?w.classList.remove("disabled"):w.classList.add("disabled");const F=Array.isArray(e.likes)?e.likes.map(f=>typeof f=="object"?f._id:f):[];a&&(F.includes(a)||e.likedByUser)?(h.classList.add("liked"),q.className="fa-solid fa-heart"):(h.classList.remove("liked"),q.className="fa-regular fa-heart"),!e.likedBy||e.likedBy.length===0?w.textContent="No likes yet":e.likedBy.length===1?w.textContent=`Liked by ${e.likedBy[0]}`:w.textContent=`Liked by ${e.likedBy[0]} and ${e.likedBy.length-1} others`;const x=r.querySelector(".comment-count");ie(e.slug,x)})}async function je(o,n,a,t){const s=new FormData;s.append("title",o),s.append("content",n),s.append("category",a),t&&s.append("image",t);const e=await m(`${p}`,{method:"POST",body:s});if(!e.ok)throw new Error("Failed to add post");return await e.json()}async function tt(o){if(confirm("Are you sure you want to delete this post?"))try{const n=await m(`${p}/${o}`,{method:"DELETE"});if(!n.ok){const a=await n.text();throw new Error(a||"Failed to delete post")}d("Post deleted successfully!","success"),window.location.pathname.endsWith("my-posts.html")?le(g):z(g)}catch(n){console.error("Error deleting post:",n),d("Failed to delete post!","error")}}function st(o){o&&(localStorage.setItem("editSlug",o),window.location.href="write.html")}function ot(){const o=document.getElementById("postForm"),n=document.querySelector(".add-post-btn");if(!o)return;const a=localStorage.getItem("editSlug"),t=s=>{n.disabled=s,n.innerHTML=s?'<i class="fa-solid fa-spinner fa-spin"></i> Posting...':a?"Update Post":"Add Post"};a&&a!=="null"?((async()=>{try{const s=await m(`${p}/${a}`);if(!s.ok)throw new Error("Post not found");const e=await s.json();if(document.getElementById("title").value=e.title||"",document.getElementById("content").value=e.content||"",document.getElementById("category").value=e.category||"",e.image){const r=document.getElementById("imagePreview");r.src=e.image,r.style.display="block"}}catch(s){console.error("Error loading post:",s)}})(),o.onsubmit=async function(s){s.preventDefault();const e=new FormData;e.append("title",document.getElementById("title").value),e.append("content",document.getElementById("content").value),e.append("category",document.getElementById("category").value);const r=document.getElementById("image").files[0];r&&e.append("image",r);try{t(!0);const l=await m(`${p}/${a}`,{method:"PUT",body:e});l.ok?(d("Post updated successfully!","success"),localStorage.removeItem("editSlug"),window.location.href="all-posts.html"):console.error("Update failed:",await l.text())}catch(l){console.error("Error updating post:",l),d("Failed to update post!","error")}finally{t(!1)}}):(localStorage.removeItem("editSlug"),o?.addEventListener("submit",async function(s){s.preventDefault();const e=document.getElementById("title").value,r=document.getElementById("content").value,l=document.getElementById("category").value,i=document.getElementById("image").files[0];console.log("Submitting new post:",{title:e,content:r,category:l,imageFile:i});try{t(!0);const c=await je(e,r,l,i);console.log("Post created successfully!",c),d("Post created successfully!","success"),o.reset(),window.location.href="all-posts.html",localStorage.removeItem("editSlug")}catch(c){console.error("Error adding post:",c),d("Failed to add post!","error")}finally{t(!1)}}))}async function nt(){const n=new URLSearchParams(window.location.search).get("slug")||window.location.pathname.split("/").pop();if(n&&m(`/api/posts/${n}/view`,{method:"POST"}).catch(a=>{console.error("Failed to increment view",a)}),!!n){try{let ce=function(y){f.dataset.saved=y?"true":"false",f.classList.toggle("saved",y);const L=f.querySelector("i");L.classList.toggle("fa-solid",y),L.classList.toggle("fa-regular",!y)};const a=await m(`${p}/${n}`);if(!a.ok)throw new Error("Failed to fetch post");const t=await a.json(),s=window.currentUser?._id||window.currentUser?.id,e=typeof t.authorId=="object"&&t.authorId!==null?t.authorId._id:t.authorId,r=typeof t.authorId=="object"&&t.authorId!==null?t.authorId.name:t.authorName||"Unknown",l=s&&String(e)===String(s),i=document.getElementById("singlePostContainer");i.innerHTML=`
      ${t.image?`<img src="${K(t.image)}" alt="${t.title}" class="post-image" loading="lazy">`:""}
      <h1>${t.title}</h1>
      <p class="tag">${t.category}</p>
      <p onclick="window.location.href='profile.html?id=${e}'" style="cursor: pointer;" class="author"><em>By ${r}</em></p>
      <small title="${new Date(t.date).toLocaleString()}">
        ${M(t.date)}
      </small>
      <div class="content">
        <p>${te(t.content)}</p>
      </div>
      <div class="post-interactions-container">
        <div class="post-interactions">
          <button class="like-btn ${t.likedByUser?"liked":""}" data-slug="${t.slug}">
            <i class="${t.likedByUser?"fa-solid":"fa-regular"} fa-heart"></i>
            <span class="like-count">${t.likesCount||0}</span>
          </button>
          <button class="comment-btn" data-slug="${t.slug}">
            <i class="fa-regular fa-comment"></i>
            <span class="comment-count">${t.commentsCount||0}</span>
          </button>
          <button class="share-btn" data-slug="${t.slug}">
            <i class="fa-solid fa-share"></i>
            <span class="share-count">${t.shares}</span>
          </button>
          <span class="bookmark ${t.savedByUser?"saved":""}" data-saved="${t.savedByUser?"true":"false"}" data-slug="${t.slug}">
            <i class="${t.savedByUser?"fa-solid":"fa-regular"} fa-bookmark"></i>
          </span>
        </div>
        <span class="liked-by likes-info">No likes yet</span>
      </div>
      <div id="likesModal-${t.slug}" class="likes-modal hidden slide-up">
        <div class="likes-modal-content">
          <span id="closeLikesModal-${t.slug}" class="close-btn">&times;</span>
          <h3>Liked by</h3>
          <ul id="likesList-${t.slug}" class="likes-list"></ul>            
        </div>
      </div>
      <div class="comments-section show">
        <form class="comment-form">
          <input type="text" class="comment-input" placeholder="Write a comment..." required />
          <button type="submit">Comment</button>
        </form>
        <div class="comments-list"></div>
      </div>
      ${l?`
      <div class="post-actions">
        <button class="edit-btn btn" data-slug="${t.slug}">Edit</button>
        <button class="delete-btn btn" data-slug="${t.slug}">Delete</button>
      </div>`:""}
    `;const c=i.querySelector(".post-image");c&&(c.onerror=function(){this.onerror=null,this.src="/Images/fallback.jpg"});const u=i?.querySelector(".like-btn"),k=u?.querySelector("i"),h=i?.querySelector(".liked-by");h.dataset.slug=t.slug,h.dataset.likedBy=JSON.stringify(t.likedBy||[]),t.likedBy&&t.likedBy.length>0?h.classList.remove("disabled"):h.classList.add("disabled");const q=Array.isArray(t.likes)?t.likes.map(y=>typeof y=="object"?y._id:y):[];s&&(q.includes(s)||t.likedByUser)?(u.classList.add("liked"),k.className="fa-solid fa-heart"):(u.classList.remove("liked"),k.className="fa-regular fa-heart"),!t.likedBy||t.likedBy.length===0?h.textContent="No likes yet":t.likedBy.length===1?h.textContent=`Liked by ${t.likedBy[0]}`:h.textContent=`Liked by ${t.likedBy[0]} and ${t.likedBy.length-1} others`;const w=i.querySelector(".comment-count");ie(t.slug,w);const F=document.querySelector(".comments-section"),x=F.querySelector(".comments-list");F&&x&&await re(t.slug,x,1/0);const f=i.querySelector(".bookmark");f?.addEventListener("click",async()=>{const y=f.dataset.slug,L=f.dataset.saved==="true";if(!window.currentUser){d("Please log in to save posts");return}f.classList.add("clicked"),setTimeout(()=>f.classList.remove("clicked"),200);const de=L?`/api/posts/${y}/unsave`:`/api/posts/${y}/save`;try{const N=await m(de,{method:"POST"}),me=await N.json();if(!N.ok)throw new Error(me.message||"Failed to toggle bookmark");ce(!L),d(L?"Removed from saved posts":"Post saved","success")}catch(N){console.error("Failed to toggle bookmark",N),d("Something went wrong","error")}})}catch(a){console.error(a),document.getElementById("singlePostContainer").innerHTML="<p>Error loading post.</p>"}Oe(n)}}const at=async()=>{const n=await(await m(`${p}/trending?limit=5`)).json(),a=document.getElementById("trending-list");a.innerHTML=n.map((t,s)=>`
    <li>
      <span class="trending-rank">${["🥇","🥈","🥉"][s]||`#${s+1}`}</span>
      <a href="post.html?slug=${t.slug}" class="trending-title">${t.title}</a>
      <i class="fa-solid fa-bolt trending-icon" title="Trending now"></i>
    </li>
  `).join("")};function De(o){const n=document.getElementById("related-posts-container");if(!o.length){n.innerHTML="<p style='margin: 0 5px;'>No related posts found.</p>";return}n.innerHTML=o.map(a=>`
      <article class="related-post-card">
        <h4><a href="post.html?slug=${a.slug}">${a.title}</a></h4>
        <small>${a.category}</small>
      </article>
    `).join("")}const Oe=async o=>{try{const a=await(await m(`${p}/slug/${o}/related`)).json();De(a)}catch(n){console.error("Failed to fetch related posts.",n)}},He=document.getElementById("savedPostsContainer");async function _e(o,n=6){try{const a=o??ee(),t=document.querySelectorAll(".search"),s=new URLSearchParams;s.append("page",a),s.append("limit",n),t.forEach(i=>{if(i){const c=i.value.trim();c&&s.append("search",c)}}),a===1?Q():X();const e=await m(`${p}/saved/me?${s.toString()}`);if(!e.ok)throw new Error("Failed to fetch");const r=await e.json();v.saved=Array.isArray(r.posts)?r.posts:[],g=r.currentPage||1,I=r.totalPages||1,A(g),sessionStorage.setItem("postsPage",g);const l=He;if(!l)return;if(v.saved.length===0){l.innerHTML="<p>You have no saved posts yet.</p>";return}l.innerHTML=v.saved.map(i=>`
      <article class="post-card">
        ${i.image?`
          <img 
            src="${K(i.image)}" 
            alt="${i.title}" 
            class="post-image"
            loading="lazy"
            onclick="window.location.href='post.html?slug=${i.slug}'"
          >
        `:""}
        <div class="post-body" onclick="window.location.href='post.html?slug=${i.slug}'">
          <h2>${i.title}</h2>
          <p class="tag">${i.category}</p>
          <p class="excerpt">
            ${i.content.slice(0,150)}...
          </p>
          <div class="post-meta">
            <small>By ${i.authorId?.name||"Unknown"}</small>
            <small title="${new Date(i.date).toLocaleString()}">${M(i.date)}</small>
          </div>
        </div>
        <button 
          class="bookmark saved"
          data-slug="${i.slug}"
          title="Remove from saved"
        >
          <i class="fa-solid fa-bookmark"></i>
        </button>
      </article>
    `).join(""),document.querySelectorAll(".bookmark").forEach(i=>{i?.addEventListener("click",async c=>{c.stopPropagation();const u=i.dataset.slug;try{await m(`${p}/${u}/unsave`,{method:"POST"}),i.closest(".post-card").remove(),d("Removed from saved posts","success")}catch(k){console.error(k),d("Failed to remove","error")}})}),se("savedPostsContainer",g,I)}catch(a){console.error(a),container.innerHTML="<p>Error loading saved posts.</p>"}finally{G(),Z()}}function Re(){document.getElementById("allPostsContainer")&&B("allPostsContainer"),document.getElementById("featuredPostsContainer")&&B("featuredPostsContainer",3),document.getElementById("myPostsContainer")&&B("myPostsContainer")}document.getElementById("categoryFilter")?.addEventListener("change",()=>{A(1),z(1)});Ne.forEach(o=>o?.addEventListener("keyup",()=>{A(1),z(1)}));function se(o,n,a){const t=document.getElementById("pagination");if(t){t.innerHTML="";for(let s=1;s<=a;s++){const e=document.createElement("button");e.textContent=s,e.className=s===n?"pg-active":"",e?.addEventListener("click",()=>{o==="myPostsContainer"?le(s):o==="savedPostsContainer"?_e(s):z(s)}),t.appendChild(e)}}}export{nt as A,_e as B,ae as C,m as a,Y as b,he as c,tt as d,st as e,g as f,Xe as g,Qe as h,Ze as i,Ve as j,Ye as k,We as l,ye as m,Ge as n,Je as o,ze as p,ot as q,Re as r,d as s,Ke as t,C as u,et as v,z as w,ee as x,at as y,le as z};
