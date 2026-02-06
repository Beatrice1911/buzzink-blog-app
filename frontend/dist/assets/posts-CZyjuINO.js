(function(){const o=document.createElement("link").relList;if(o&&o.supports&&o.supports("modulepreload"))return;for(const t of document.querySelectorAll('link[rel="modulepreload"]'))e(t);new MutationObserver(t=>{for(const a of t)if(a.type==="childList")for(const n of a.addedNodes)n.tagName==="LINK"&&n.rel==="modulepreload"&&e(n)}).observe(document,{childList:!0,subtree:!0});function r(t){const a={};return t.integrity&&(a.integrity=t.integrity),t.referrerPolicy&&(a.referrerPolicy=t.referrerPolicy),t.crossOrigin==="use-credentials"?a.credentials="include":t.crossOrigin==="anonymous"?a.credentials="omit":a.credentials="same-origin",a}function e(t){if(t.ep)return;t.ep=!0;const a=r(t);fetch(t.href,a)}})();const h="/api/posts",M="/api/auth",R="/api/comments",Z="https://i.postimg.cc/KvF0rh0Q/custom-default-avatar.png",ee=document.body,Y=document.querySelectorAll(".user-icon"),U=document.getElementById("userMenuDetails"),D=document.getElementById("authModal"),ie=document.getElementById("closeModal"),B=document.getElementById("loginTab"),C=document.getElementById("registerTab"),le=document.querySelectorAll(".write-post"),ce=document.querySelector(".search-icon"),W=document.getElementById("mobileSearch"),de=document.querySelector(".menu-toggle"),me=document.getElementById("mobileMenu"),A=document.querySelector(".logo"),ue=document.querySelector(".all-posts-btn"),ge=document.getElementById("myPosts"),fe=document.getElementById("savedPosts"),he=document.getElementById("profile-edit"),ye=document.getElementById("settings"),O=document.getElementById("themeToggle"),H=document.documentElement;function d(s,o="info",r=5e3){const e=document.getElementById("toast-container");if(!e)return;const t=document.createElement("div");t.className=`toast toast-${o}`;const a=document.createElement("i");o==="success"?a.className="fas fa-check-circle":o==="error"?a.className="fas fa-exclamation-circle":a.className="fas fa-info-circle",t.appendChild(a);const n=document.createElement("span");n.textContent=s,t.appendChild(n),e.appendChild(t),setTimeout(()=>{t.style.animation="slideOut 0.5s forwards",t?.addEventListener("animationend",()=>t.remove())},r)}function pe(){de?.addEventListener("click",s=>{s.stopPropagation(),U.classList.contains("show")&&U.classList.remove("show"),me.classList.toggle("active")})}function we(){A?.addEventListener("click",()=>{window.location.href="index.html"}),ue?.addEventListener("click",()=>{window.location.href="all-posts.html"}),ge?.addEventListener("click",()=>{window.location.href="my-posts.html"}),he?.addEventListener("click",()=>{window.location.href="dashboard.html"}),fe?.addEventListener("click",()=>{window.location.href="saved.html"}),ye?.addEventListener("click",()=>{window.location.href="settings.html"})}function ve(){B?.addEventListener("click",()=>{k.classList.remove("hidden"),E.classList.add("hidden"),B.classList.add("active"),C.classList.remove("active")}),C?.addEventListener("click",()=>{E.classList.remove("hidden"),k.classList.add("hidden"),C.classList.add("active"),B.classList.remove("active")}),ie?.addEventListener("click",()=>{D.classList.add("hidden")})}function ke(){Y.forEach(s=>s?.addEventListener("click",()=>{const o=localStorage.getItem("user"),r=o?JSON.parse(o):null;r&&r.id?(U.classList.toggle("show"),D.classList.add("hidden")):(U.classList.add("hidden"),D.classList.remove("hidden"),B.classList.add("active"),C.classList.remove("active"),k.classList.remove("hidden"),E.classList.add("hidden"),k?.reset(),E?.reset())}))}function Ee(){ce?.addEventListener("click",()=>{W.classList.toggle("show"),W.classList.contains("show")&&W.querySelector("input").focus()})}function be(){le.forEach(s=>{s?.addEventListener("click",o=>{const r=localStorage.getItem("user"),e=r?JSON.parse(r):null;!e||!e.id?(o.preventDefault(),D.classList.remove("hidden"),B.classList.add("active"),C.classList.remove("active"),k.classList.remove("hidden"),E.classList.add("hidden")):(localStorage.removeItem("editSlug"),window.location.href="write.html")})})}function Se(){O?.addEventListener("change",()=>{O.checked?(H.setAttribute("data-theme","dark"),localStorage.setItem("theme","dark"),A.src="/Images/logo-dark-theme_optimized_.png"):(H.setAttribute("data-theme","light"),localStorage.setItem("theme","light"),A.src="/Images/logo_optimized.png")})}function Oe(){localStorage.getItem("theme")==="dark"?(H.setAttribute("data-theme","dark"),O&&(O.checked=!0)):H.setAttribute("data-theme","light")}function He(s){s==="dark"?(ee.classList.add("dark"),A.src="/Images/logo-dark-theme_optimized_.png"):(ee.classList.remove("dark"),A.src="/Images/logo_optimized.png"),localStorage.setItem("theme",s)}function _e(){pe(),ve(),ke(),Ee(),be(),we(),Se()}const k=document.getElementById("loginForm"),E=document.getElementById("registerForm"),Le=document.getElementById("logoutBtn");function J(s){return s?{...s,id:s.id||s._id}:null}window.currentUser=(()=>{const s=localStorage.getItem("user");return s?J(JSON.parse(s)):null})();function L(s){s?.id?Y.forEach(o=>o.title=`Logged in as ${s.name}`):(Y.forEach(o=>o.title="Click to Login/Register"),U?.classList.remove("show"))}async function _(s){try{const o=await m("/api/users/me");if(!o.ok)return;s=await o.json();const r=document.querySelectorAll(".user-icon");r&&r.forEach(t=>{t.src=s.profilePhoto?.trim()?s.profilePhoto:Z});const e=document.querySelectorAll(".avatar");e&&e.forEach(t=>{t.src=s.profilePhoto?.trim()?s.profilePhoto:Z}),window.currentUser=s}catch(o){console.warn("Failed to load auth user:",o)}}function Ie(){k?.addEventListener("submit",async s=>{s.preventDefault();const o=document.getElementById("loginEmail").value,r=document.getElementById("loginPassword").value;console.log("Login Triggered");const e=await m(`${M}/login`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({email:o,password:r})}),t=await e.json();console.log("Login response:",t),e.ok||d(`Login failed: ${t.message||"Unknown error"}`,"error");const a=J(t.user);localStorage.setItem("user",JSON.stringify(a)),window.currentUser=a,localStorage.setItem("role",a.role),a.role==="admin"&&(window.location.href="admin.html"),L(a),_(a),authModal.classList.add("hidden"),k.reset(),d(`Welcome back, ${a.name}!`,"success"),De()})}function $e(){E?.addEventListener("submit",async s=>{s.preventDefault();const o=document.getElementById("registerName").value,r=document.getElementById("registerEmail").value,e=document.getElementById("registerPassword").value,t=await m(`${M}/register`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({name:o,email:r,password:e})}),a=await t.json();console.log("Register response:",a),t.ok||d(`Registration failed: ${a.message||"Unknown error"}`,"error");const n=J(a.user);localStorage.setItem("user",JSON.stringify(n)),window.currentUser=n,localStorage.setItem("role",n.role),L(n),_(n),authModal.classList.add("hidden"),E.reset(),d(`Welcome, ${n.name}! Your account has been created.`,"success")})}function Pe(){Le?.addEventListener("click",()=>{te(),window.location.href="index.html"})}async function Re(){try{const s=await m(`${M}/me`);if(!s.ok)throw new Error("Not authenticated");const o=await s.json(),r=J(o);return localStorage.setItem("user",JSON.stringify(r)),window.currentUser=r,L(r),_(r),r}catch{return L(null),_(null),null}}async function te(s=!1){try{await fetch(`${M}/logout`,{method:"POST",credentials:"include"})}catch(o){console.warn("Logout request failed:",o)}localStorage.removeItem("user"),window.currentUser=null,L(null),s||d("You have been logged out.","info")}function Be(){const s=document.getElementById("forgotPasswordLink"),o=document.getElementById("forgotPasswordModal"),r=document.getElementById("closeForgotModal"),e=document.getElementById("forgotPasswordForm");s&&s?.addEventListener("click",t=>{t.preventDefault(),o.classList.remove("hidden")}),r&&r?.addEventListener("click",()=>{o.classList.add("hidden")}),e&&e?.addEventListener("submit",async t=>{t.preventDefault();const a=document.getElementById("forgotEmail").value.trim();try{const l=await(await fetch("/api/auth/forgot-password",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({email:a})})).json();d(l.message||"Check your email for the reset link.","success"),o.classList.add("hidden")}catch(n){console.error(n),d("Failed to send reset link. Try again.","error")}})}function Je(){Ie(),$e(),Pe(),Be()}async function m(s,o={}){let r=await fetch(s,{credentials:"include",...o});return r.status===401&&(await Ce()?r=await fetch(s,{credentials:"include",...o}):te(!0)),r}async function Ce(){try{const s=await fetch(`${M}/refresh`,{method:"POST",credentials:"include"});if(!s.ok)throw new Error("Refresh failed");const o=await s.json();return window.currentUser=o.user,L(o.user),!0}catch{return!1}}async function ze(s){const o=s.dataset.slug;if(!o)return;const r=window.location.pathname.endsWith("post.html"),e=r?document.getElementById("singlePostContainer"):s.closest(".post");if(!e)return;const t=e.querySelector(".comments-section"),a=t?.querySelector(".comments-list");!t||!a||(r||t.classList.toggle("show"),(r||t.classList.contains("show"))&&await se(o,a))}async function We(s){if(s.dataset.deleting==="true")return;s.dataset.deleting="true";const o=s.dataset.commentId;if(!confirm("Are you sure you want to delete this comment?")){s.dataset.deleting="false";return}try{const e=await m(`${R}/${o}`,{method:"DELETE"}),t=await e.json();if(e.ok){const a=s.closest(".comment");a&&a.remove();const l=(window.location.pathname.endsWith("post.html")?document.getElementById("singlePostContainer"):s.closest(".post"))?.querySelector(".comment-count");if(l){let i=parseInt(l.textContent)||0;i=Math.max(i-1,0),l.textContent=i,l.title=`${i} comment${i!==1?"s":""}`}d("Comment deleted successfully!","success")}else throw new Error(t.message||"Delete failed")}catch(e){console.error("Error deleting comment:",e),d("Error deleting comment. Please try again.","error")}finally{s.dataset.deleting="false"}}async function se(s,o,r=3){try{o.innerHTML='<p class="loading-comments">Loading comments...</p>';const e=await m(`${R}/post/${s}?_=${Date.now()}`);if(!e.ok)throw new Error("Failed to fetch comments");const t=await e.json();if(o.innerHTML="",t.length===0){o.innerHTML="<p class='no-comments'>No comments yet. Be the first to comment!</p>";return}const a=t.slice(0,r);if(V(a,o),t.length>r){const n=document.createElement("button");n.classList.add("view-more-btn"),n.textContent=`View all ${t.length} comments`;const l=document.createElement("div");l.classList.add("comments-scroll-container"),l.style.display="none",V(t,l);let i=!1;n?.addEventListener("click",()=>{i=!i,i?(o.innerHTML="",o.appendChild(l),o.appendChild(n),l.style.display="block",n.textContent="View less comments"):(o.innerHTML="",V(a,o),n.textContent=`View all ${t.length} comments`,o.appendChild(n))}),o.appendChild(n)}}catch(e){console.error("Error fetching comments:",e),o.innerHTML="<p class='error-comments'>Failed to load comments.</p>"}}function V(s,o){const r=window.currentUser?.id||window.currentUser?._id;s.forEach(e=>{const t=document.createElement("div");t.classList.add("comment");const a=typeof e.authorId=="object"?e.authorId._id:e.authorId,n=r&&a&&a.toString()===r.toString();t.innerHTML=`
      <div class="comment-header">
        <p><strong class="comment-author" style="cursor: pointer;">${e.authorId?.name||"Anonymous"}:</strong> ${G(e.text)}</p>
        ${n?`<div class="comment-menu">
                  <button class="menu-btn">⋮</button>
                  <div class="menu-options hidden">
                    <button class="delete-comment-btn" data-comment-id="${e._id}">Delete</button>
                  </div>
                </div>`:""}
      </div>  
      <small title="${new Date(e.createdAt).toLocaleString()}">
        ${F(e.createdAt)}
      </small>
    `,o.appendChild(t),t.querySelector(".comment-author")?.addEventListener("click",()=>{window.location.href=`profile.html?id=${e.authorId?._id}`})})}async function Te(s,o,r,e){try{const t=await m(`${R}/post/${s}`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({text:o})});if(t.ok){const n=(await t.json()).comment,l=document.createElement("div");if(l.classList.add("comment"),l.innerHTML=`
        <div class="comment-header">
          <p><strong>You:</strong> ${G(n.text)}</p>
          <div class="comment-menu">
            <button class="menu-btn">⋮</button>
            <div class="menu-options hidden">
              <button class="delete-comment-btn" data-comment-id="${n._id}">Delete</button>
            </div>
          </div>
        </div>
        <small title="${new Date(n.createdAt).toLocaleString()}">
        ${F(n.createdAt)}
      </small>
      `,r.prepend(l),e&&e){let i=parseInt(e.textContent)||0;e.textContent=i+1,e.title=`${i+1} comments`}d("Comment posted successfully!","success")}else throw new Error("Failed to post comment")}catch(t){console.error("Error posting comment:",t),d("Failed to post comment","error")}}async function oe(s,o){try{const r=await m(`${R}/post/${s}`);if(!r.ok)throw new Error("Failed to fetch comment count");const t=(await r.json()).length;t===0?(o.textContent="0",o.title="No comments yet"):(o.textContent=t,o.title=`${t} comment${t>1?"s":""}`)}catch(r){console.error("Error fetching comment count:",r),o.textContent="0"}}async function Ue(s){const o=s.target.closest(".comment-form"),r=o.querySelector(".comment-form button");if(!o)return;s.preventDefault();const e=o.querySelector(".comment-input"),t=e.value.trim();if(!t)return;let a,n,l,i;window.location.pathname.endsWith("post.html")?(a=document.getElementById("singlePostContainer"),n=a.querySelector(".comments-list"),l=a.querySelector(".comment-btn").dataset.slug,i=a.querySelector(".comment-count")):(a=o.closest(".post"),n=a.querySelector(".comments-list"),l=a.querySelector(".like-btn").dataset.slug,i=a.querySelector(".comment-count"));const c=u=>{r.disabled=u,r.innerHTML=u?'<i class="fa-solid fa-spinner fa-spin"></i>':"Comment"};try{if(c(!0),!window.currentUser){d("Please log in to comment.","error"),e.value="",c(!1);return}await Te(l,t,n,i),e.value=""}catch{c(!1)}finally{c(!1)}}function Ve(){document.addEventListener("submit",Ue)}const Ae=document.querySelectorAll(".search");let v={all:[],mine:[],saved:[]},I=1,g=Number(sessionStorage.getItem("postsPage"))||1,Ye=sessionStorage.getItem("postsCategory")||"",Ke=sessionStorage.getItem("postsSearch")||"";function K(s){return s&&s.startsWith("http")?s:"/Images/fallback.jpg"}function Me(s){s.innerHTML=`<p style="text-align:center; color:gray; font-size: 20px; font-weight: bold;">You haven't made any posts yet...</p>`}function q(s){const o=new URL(window.location);s===1?o.searchParams.delete("page"):o.searchParams.set("page",s);const r=sessionStorage.getItem("postsCategory"),e=sessionStorage.getItem("postsSearch");r?o.searchParams.set("category",r):o.searchParams.delete("category"),e?o.searchParams.set("search",e):o.searchParams.delete("search"),window.history.pushState({},"",o)}function Q(){const s=new URLSearchParams(window.location.search);return Number(s.get("page"))||1}async function Qe(){const s=sessionStorage.getItem("postsCategory"),o=sessionStorage.getItem("postsSearch"),r=document.getElementById("categoryFilter");r&&s&&(r.value=s),document.querySelectorAll(".search").forEach(t=>{o&&(t.value=o)})}async function z(s,o=6){try{const r=s??Q(),e=document.getElementById("categoryFilter")?.value,t=document.querySelectorAll(".search"),a=new URLSearchParams;a.append("page",r),a.append("limit",o),e&&e!=="all"&&a.append("category",e),t.forEach(c=>{if(c){const u=c.value.trim();u&&a.append("search",u)}});const l=await(await m(`${h}?${a.toString()}`)).json();v.all=Array.isArray(l.posts)?l.posts:[],g=l.currentPage??1,I=l.totalPages??1,q(g),typeof g<"u"&&sessionStorage.setItem("postsPage",g),sessionStorage.setItem("postsCategory",e&&e!=="all"?e:"");const i=[...t].find(c=>c.value.trim())?.value.trim()||"";sessionStorage.setItem("postsSearch",i),T("allPostsContainer"),X("allPostsContainer",g,I)}catch(r){console.error("Error fetching posts:",r),d("Something went wrong while displaying posts!","error")}}async function ne(s=1,o=6){try{const r=s??Q(),e=document.querySelectorAll(".search"),t=new URLSearchParams;t.append("page",r),t.append("limit",o),e.forEach(c=>{if(c){const u=c.value.trim();u&&t.append("search",u)}});const a=await m(`${h}/mine?${t.toString()}`);if(!a.ok){const c=await a.text();throw new Error(c||"Failed to fetch your posts")}const n=await a.json();v.mine=Array.isArray(n.posts)?n.posts:[],g=n.currentPage||1,I=n.totalPages||1,q(g),sessionStorage.setItem("postsPage",g);const l=[...e].find(c=>c.value.trim())?.value.trim()||"";sessionStorage.setItem("postsSearch",l);const i="myPostsContainer";if(T("myPostsContainer",null,"You haven't made any posts yet..."),X(i,g,I),v.mine.length===0){const c=document.getElementById("myPostsContainer");c&&Me(c)}}catch(r){console.error("Error fetching my posts:",r),d("Failed to load your posts!","error")}}function F(s){const o=Math.floor((Date.now()-new Date(s))/1e3),r=[{label:"year",seconds:31536e3},{label:"month",seconds:2592e3},{label:"day",seconds:86400},{label:"hour",seconds:3600},{label:"minute",seconds:60},{label:"second",seconds:1}],e=new Intl.RelativeTimeFormat("en",{numeric:"auto"});for(const t of r){const a=Math.floor(o/t.seconds);if(a>=1)return e.format(-a,t.label)}return"Just now"}function G(s){return s.replace(/\n/g,"<br>")}function T(s,o=null,r=null){const e=window.currentUser?._id||window.currentUser?.id,t=document.getElementById(s);if(!t)return;t.innerHTML="";let a=[];if(s==="allPostsContainer"||s==="featuredPostsContainer"?a=[...v.all]:s==="myPostsContainer"?a=[...v.mine]:s==="savedPostsContainer"&&(a=[...v.saved]),o&&(a=a.slice(0,o)),a.length===0){t.innerHTML=r??'<p style="text-align:center; color:gray; font-size:20px;">No results found...</p>';return}a.forEach(n=>{const l=document.createElement("div");l.classList.add("post");const i=n.content.length>150?n.content.substring(0,150)+"...":n.content,c=typeof n.authorId=="object"&&n.authorId!==null?n.authorId._id:n.authorId,u=typeof n.authorId=="object"&&n.authorId!==null?n.authorId.name:n.authorName||"Unknown",b=e&&String(c)===String(e);l.innerHTML=`
      ${n.image?`<a href="post.html?slug=${n.slug}">
             <img src="${K(n.image)}" alt="${n.title}" class="post-image" loading="lazy">
           </a>`:""}
        <p class="tag">${n.category}</p>
        <h2>
          <a href="post.html?slug=${n.slug}" class="post-link">${n.title}</a>
        </h2>
        <p>${i} <a href="post.html?slug=${n.slug}" class="read-more">Read more</a></p>
        <a href="profile.html?id=${c}" class="author"><em>By ${u}</em></a>
        <small title="${new Date(n.date).toLocaleString()}">
          ${F(n.date)}
        </small>
        <br>
        <div class="post-interactions-container">
          <div class="post-interactions">
            <button class="like-btn ${n.likedByUser?"liked":""}" data-slug="${n.slug}">
              <i class="${n.likedByUser?"fa-solid":"fa-regular"} fa-heart"></i>
              <span class="like-count">${n.likesCount||0}</span>
            </button>
            <button class="comment-btn" data-slug="${n.slug}">
              <i class="fa-regular fa-comment"></i>
              <span class="comment-count">${n.commentsCount||0}</span>
            </button>
            <button class="share-btn" data-slug="${n.slug}">
              <i class="fa-solid fa-share"></i>
              <span class="share-count">${n.shares}</span>
            </button>
          </div>
          <span class="liked-by likes-info">No likes yet</span>
        </div>
        <div id="likesModal-${n.slug}" class="likes-modal hidden slide-up">
          <div class="likes-modal-content">
            <span id="closeLikesModal-${n.slug}" class="close-btn">&times;</span>
            <h3>Liked by</h3>
            <ul id="likesList-${n.slug}" class="likes-list"></ul>            
          </div>
        </div>
        <div class="comments-section">
          <form class="comment-form">
            <input type="text" class="comment-input" placeholder="Write a comment..." required />
            <button type="submit">Comment</button>
          </form>
          <div class="comments-list"></div>
        </div>
        ${b?`
        <div class="post-actions">
            <button class="edit-btn btn" data-slug="${n.slug}">Edit</button>
            <button class="delete-btn btn" data-slug="${n.slug}">Delete</button>
        </div>
        `:""}
    `,t.appendChild(l);const y=l.querySelector(".post-image");y&&(y.onerror=function(){this.onerror=null,this.src="/Images/fallback.jpg"});const $=l.querySelector(".like-btn"),N=$.querySelector("i"),p=l.querySelector(".liked-by");p.dataset.slug=n.slug,p.dataset.likedBy=JSON.stringify(n.likedBy||[]),n.likedBy&&n.likedBy.length>0?p.classList.remove("disabled"):p.classList.add("disabled");const x=Array.isArray(n.likes)?n.likes.map(P=>typeof P=="object"?P._id:P):[];e&&(x.includes(e)||n.likedByUser)?($.classList.add("liked"),N.className="fa-solid fa-heart"):($.classList.remove("liked"),N.className="fa-regular fa-heart"),!n.likedBy||n.likedBy.length===0?p.textContent="No likes yet":n.likedBy.length===1?p.textContent=`Liked by ${n.likedBy[0]}`:p.textContent=`Liked by ${n.likedBy[0]} and ${n.likedBy.length-1} others`;const w=l.querySelector(".comment-count");oe(n.slug,w)})}async function qe(s,o,r,e){const t=new FormData;t.append("title",s),t.append("content",o),t.append("category",r),e&&t.append("image",e);const a=await m(`${h}`,{method:"POST",body:t});if(!a.ok)throw new Error("Failed to add post");return await a.json()}async function Ge(s){if(confirm("Are you sure you want to delete this post?"))try{const o=await m(`${h}/${s}`,{method:"DELETE"});if(!o.ok){const r=await o.text();throw new Error(r||"Failed to delete post")}d("Post deleted successfully!","success"),window.location.pathname.endsWith("my-posts.html")?ne(g):z(g)}catch(o){console.error("Error deleting post:",o),d("Failed to delete post!","error")}}function Xe(s){s&&(localStorage.setItem("editSlug",s),window.location.href="write.html")}function Ze(){const s=document.getElementById("postForm"),o=document.querySelector(".add-post-btn");if(!s)return;const r=localStorage.getItem("editSlug"),e=t=>{o.disabled=t,o.innerHTML=t?'<i class="fa-solid fa-spinner fa-spin"></i> Posting...':r?"Update Post":"Add Post"};r&&r!=="null"?((async()=>{try{const t=await m(`${h}/${r}`);if(!t.ok)throw new Error("Post not found");const a=await t.json();if(document.getElementById("title").value=a.title||"",document.getElementById("content").value=a.content||"",document.getElementById("category").value=a.category||"",a.image){const n=document.getElementById("imagePreview");n.src=a.image,n.style.display="block"}}catch(t){console.error("Error loading post:",t)}})(),s.onsubmit=async function(t){t.preventDefault();const a=new FormData;a.append("title",document.getElementById("title").value),a.append("content",document.getElementById("content").value),a.append("category",document.getElementById("category").value);const n=document.getElementById("image").files[0];n&&a.append("image",n);try{e(!0);const l=await m(`${h}/${r}`,{method:"PUT",body:a});l.ok?(d("Post updated successfully!","success"),localStorage.removeItem("editSlug"),window.location.href="all-posts.html"):console.error("Update failed:",await l.text())}catch(l){console.error("Error updating post:",l),d("Failed to update post!","error")}finally{e(!1)}}):(localStorage.removeItem("editSlug"),s?.addEventListener("submit",async function(t){t.preventDefault();const a=document.getElementById("title").value,n=document.getElementById("content").value,l=document.getElementById("category").value,i=document.getElementById("image").files[0];console.log("Submitting new post:",{title:a,content:n,category:l,imageFile:i});try{e(!0);const c=await qe(a,n,l,i);console.log("Post created successfully!",c),d("Post created successfully!","success"),s.reset(),window.location.href="all-posts.html",localStorage.removeItem("editSlug")}catch(c){console.error("Error adding post:",c),d("Failed to add post!","error")}finally{e(!1)}}))}async function et(){const o=new URLSearchParams(window.location.search).get("slug")||window.location.pathname.split("/").pop();if(o&&m(`/api/posts/${o}/view`,{method:"POST"}).catch(r=>{console.error("Failed to increment view",r)}),!!o){try{let P=function(f){w.dataset.saved=f?"true":"false",w.classList.toggle("saved",f);const S=w.querySelector("i");S.classList.toggle("fa-solid",f),S.classList.toggle("fa-regular",!f)};const r=await m(`${h}/${o}`);if(!r.ok)throw new Error("Failed to fetch post");const e=await r.json(),t=window.currentUser?._id||window.currentUser?.id,a=typeof e.authorId=="object"&&e.authorId!==null?e.authorId._id:e.authorId,n=typeof e.authorId=="object"&&e.authorId!==null?e.authorId.name:e.authorName||"Unknown",l=t&&String(a)===String(t),i=document.getElementById("singlePostContainer");i.innerHTML=`
      ${e.image?`<img src="${K(e.image)}" alt="${e.title}" class="post-image" loading="lazy">`:""}
      <h1>${e.title}</h1>
      <p class="tag">${e.category}</p>
      <p onclick="window.location.href='profile.html?id=${a}'" style="cursor: pointer;" class="author"><em>By ${n}</em></p>
      <small title="${new Date(e.date).toLocaleString()}">
        ${F(e.date)}
      </small>
      <div class="content">
        <p>${G(e.content)}</p>
      </div>
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
          <span class="bookmark ${e.savedByUser?"saved":""}" data-saved="${e.savedByUser?"true":"false"}" data-slug="${e.slug}">
            <i class="${e.savedByUser?"fa-solid":"fa-regular"} fa-bookmark"></i>
          </span>
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
      <div class="comments-section show">
        <form class="comment-form">
          <input type="text" class="comment-input" placeholder="Write a comment..." required />
          <button type="submit">Comment</button>
        </form>
        <div class="comments-list"></div>
      </div>
      ${l?`
      <div class="post-actions">
        <button class="edit-btn btn" data-slug="${e.slug}">Edit</button>
        <button class="delete-btn btn" data-slug="${e.slug}">Delete</button>
      </div>`:""}
    `;const c=i.querySelector(".post-image");c&&(c.onerror=function(){this.onerror=null,this.src="/Images/fallback.jpg"});const u=i?.querySelector(".like-btn"),b=u?.querySelector("i"),y=i?.querySelector(".liked-by");y.dataset.slug=e.slug,y.dataset.likedBy=JSON.stringify(e.likedBy||[]),e.likedBy&&e.likedBy.length>0?y.classList.remove("disabled"):y.classList.add("disabled");const $=Array.isArray(e.likes)?e.likes.map(f=>typeof f=="object"?f._id:f):[];t&&($.includes(t)||e.likedByUser)?(u.classList.add("liked"),b.className="fa-solid fa-heart"):(u.classList.remove("liked"),b.className="fa-regular fa-heart"),!e.likedBy||e.likedBy.length===0?y.textContent="No likes yet":e.likedBy.length===1?y.textContent=`Liked by ${e.likedBy[0]}`:y.textContent=`Liked by ${e.likedBy[0]} and ${e.likedBy.length-1} others`;const N=i.querySelector(".comment-count");oe(e.slug,N);const p=document.querySelector(".comments-section"),x=p.querySelector(".comments-list");p&&x&&await se(e.slug,x,1/0);const w=i.querySelector(".bookmark");w?.addEventListener("click",async()=>{const f=w.dataset.slug,S=w.dataset.saved==="true";if(!window.currentUser){d("Please log in to save posts");return}w.classList.add("clicked"),setTimeout(()=>w.classList.remove("clicked"),200);const ae=S?`/api/posts/${f}/unsave`:`/api/posts/${f}/save`;try{const j=await m(ae,{method:"POST"}),re=await j.json();if(!j.ok)throw new Error(re.message||"Failed to toggle bookmark");P(!S),d(S?"Removed from saved posts":"Post saved","success")}catch(j){console.error("Failed to toggle bookmark",j),d("Something went wrong","error")}})}catch(r){console.error(r),document.getElementById("singlePostContainer").innerHTML="<p>Error loading post.</p>"}Ne(o)}}const tt=async()=>{const o=await(await m(`${h}/trending?limit=5`)).json(),r=document.getElementById("trending-list");r.innerHTML=o.map((e,t)=>`
    <li>
      <span class="trending-rank">${["🥇","🥈","🥉"][t]||`#${t+1}`}</span>
      <a href="post.html?slug=${e.slug}" class="trending-title">${e.title}</a>
      <i class="fa-solid fa-bolt trending-icon" title="Trending now"></i>
    </li>
  `).join("")};function Fe(s){const o=document.getElementById("related-posts-container");if(!s.length){o.innerHTML="<p style='margin: 0 5px;'>No related posts found.</p>";return}o.innerHTML=s.map(r=>`
      <article class="related-post-card">
        <h4><a href="post.html?slug=${r.slug}">${r.title}</a></h4>
        <small>${r.category}</small>
      </article>
    `).join("")}const Ne=async s=>{try{const r=await(await m(`${h}/slug/${s}/related`)).json();Fe(r)}catch(o){console.error("Failed to fetch related posts.",o)}},xe=document.getElementById("savedPostsContainer");async function je(s=1,o=6){try{const r=s??Q(),e=document.querySelectorAll(".search"),t=new URLSearchParams;t.append("page",r),t.append("limit",o),e.forEach(i=>{if(i){const c=i.value.trim();c&&t.append("search",c)}});const a=await m(`${h}/saved/me?${t.toString()}`);if(!a.ok)throw new Error("Failed to fetch");const n=await a.json();v.saved=Array.isArray(n.posts)?n.posts:[],g=n.currentPage||1,I=n.totalPages||1,q(g),sessionStorage.setItem("postsPage",g);const l=xe;if(!l)return;if(v.saved.length===0){l.innerHTML="<p>You have no saved posts yet.</p>";return}l.innerHTML=v.saved.map(i=>`
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
            <small title="${new Date(i.date).toLocaleString()}">${F(i.date)}</small>
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
    `).join(""),document.querySelectorAll(".bookmark").forEach(i=>{i?.addEventListener("click",async c=>{c.stopPropagation();const u=i.dataset.slug;try{await m(`${h}/${u}/unsave`,{method:"POST"}),i.closest(".post-card").remove(),d("Removed from saved posts","success")}catch(b){console.error(b),d("Failed to remove","error")}})}),X("savedPostsContainer",g,I)}catch(r){console.error(r),container.innerHTML="<p>Error loading saved posts.</p>"}}function De(){document.getElementById("allPostsContainer")&&T("allPostsContainer"),document.getElementById("featuredPostsContainer")&&T("featuredPostsContainer",3),document.getElementById("myPostsContainer")&&T("myPostsContainer",null,"You haven't made any posts yet...")}document.getElementById("categoryFilter")?.addEventListener("change",()=>{q(1),z(1)});Ae.forEach(s=>s?.addEventListener("keyup",()=>{q(1),z(1)}));function X(s,o,r){const e=document.getElementById("pagination");if(e){e.innerHTML="";for(let t=1;t<=r;t++){const a=document.createElement("button");a.textContent=t,a.className=t===o?"pg-active":"",a?.addEventListener("click",()=>{s==="myPostsContainer"?ne(t):s==="savedPostsContainer"?je(t):z(t)}),e.appendChild(a)}}}export{et as A,je as B,te as C,m as a,Y as b,de as c,Ge as d,Xe as e,g as f,Ye as g,We as h,Ke as i,Re as j,Je as k,_e as l,me as m,Ve as n,Oe as o,He as p,Ze as q,De as r,d as s,ze as t,U as u,Qe as v,z as w,Q as x,tt as y,ne as z};
