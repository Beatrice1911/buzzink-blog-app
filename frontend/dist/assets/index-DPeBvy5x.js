(function(){const o=document.createElement("link").relList;if(o&&o.supports&&o.supports("modulepreload"))return;for(const t of document.querySelectorAll('link[rel="modulepreload"]'))a(t);new MutationObserver(t=>{for(const n of t)if(n.type==="childList")for(const i of n.addedNodes)i.tagName==="LINK"&&i.rel==="modulepreload"&&a(i)}).observe(document,{childList:!0,subtree:!0});function s(t){const n={};return t.integrity&&(n.integrity=t.integrity),t.referrerPolicy&&(n.referrerPolicy=t.referrerPolicy),t.crossOrigin==="use-credentials"?n.credentials="include":t.crossOrigin==="anonymous"?n.credentials="omit":n.credentials="same-origin",n}function a(t){if(t.ep)return;t.ep=!0;const n=s(t);fetch(t.href,n)}})();const p="/api/posts",q="/api/auth",x="/api/comments",oe="https://i.postimg.cc/KvF0rh0Q/custom-default-avatar.png",Q=document.querySelectorAll(".user-icon"),k=document.getElementById("userMenuDetails"),N=document.getElementById("authModal"),se=document.getElementById("closeModal"),S=document.getElementById("loginTab"),B=document.getElementById("registerTab"),ae=document.querySelectorAll(".write-post"),ie=document.querySelector(".search-icon"),z=document.getElementById("mobileSearch"),re=document.querySelector(".menu-toggle"),le=document.getElementById("mobileMenu"),C=document.querySelector(".logo"),ce=document.querySelector(".all-posts-btn"),de=document.getElementById("myPosts"),me=document.getElementById("savedPosts"),ue=document.getElementById("profile-edit");function c(e,o="info",s=5e3){const a=document.getElementById("toast-container");if(!a)return;const t=document.createElement("div");t.className=`toast toast-${o}`;const n=document.createElement("i");o==="success"?n.className="fas fa-check-circle":o==="error"?n.className="fas fa-exclamation-circle":n.className="fas fa-info-circle",t.appendChild(n);const i=document.createElement("span");i.textContent=e,t.appendChild(i),a.appendChild(t),setTimeout(()=>{t.style.animation="slideOut 0.5s forwards",t.addEventListener("animationend",()=>t.remove())},s)}function ge(){re?.addEventListener("click",e=>{e.stopPropagation(),k.classList.contains("show")&&k.classList.remove("show"),le.classList.toggle("active")})}function fe(){C?.addEventListener("click",()=>{window.location.href="index.html"}),ce?.addEventListener("click",()=>{window.location.href="all-posts.html"}),de?.addEventListener("click",()=>{window.location.href="my-posts.html"}),ue?.addEventListener("click",()=>{window.location.href="dashboard.html"}),me?.addEventListener("click",()=>{window.location.href="saved.html"}),document.getElementById("settings")?.addEventListener("click",()=>{window.location.href="settings.html"})}function he(){S?.addEventListener("click",()=>{w.classList.remove("hidden"),v.classList.add("hidden"),S.classList.add("active"),B.classList.remove("active")}),B?.addEventListener("click",()=>{v.classList.remove("hidden"),w.classList.add("hidden"),B.classList.add("active"),S.classList.remove("active")}),se?.addEventListener("click",()=>{N.classList.add("hidden")})}function ye(){Q.forEach(e=>e?.addEventListener("click",()=>{const o=localStorage.getItem("user"),s=o?JSON.parse(o):null;s&&s.id?(k.classList.toggle("show"),N.classList.add("hidden")):(k.classList.add("hidden"),N.classList.remove("hidden"),S.classList.add("active"),B.classList.remove("active"),w.classList.remove("hidden"),v.classList.add("hidden"),w?.reset(),v?.reset())}))}function pe(){ie?.addEventListener("click",()=>{z.classList.toggle("show"),z.classList.contains("show")&&z.querySelector("input").focus()})}function ke(){ae.forEach(e=>{e.addEventListener("click",o=>{const s=localStorage.getItem("user"),a=s?JSON.parse(s):null;!a||!a.id?(o.preventDefault(),N.classList.remove("hidden"),S.classList.add("active"),B.classList.remove("active"),w.classList.remove("hidden"),v.classList.add("hidden")):(localStorage.removeItem("editSlug"),window.location.href="write.html")})})}function we(){themeToggle?.addEventListener("change",()=>{themeToggle.checked?(root.setAttribute("data-theme","dark"),localStorage.setItem("theme","dark"),C.src="/Images/logo-dark-theme_optimized_.png"):(root.setAttribute("data-theme","light"),localStorage.setItem("theme","light"),C.src="/Images/logo_optimized.png")})}function ve(){const e=document.getElementById("themeToggle"),o=document.documentElement;localStorage.getItem("theme")==="dark"?(o.setAttribute("data-theme","dark"),e&&(e.checked=!0)):o.setAttribute("data-theme","light")}function Le(e){e==="dark"?(body.classList.add("dark"),C.src="/Images/logo-dark-theme_optimized_.png"):(body.classList.remove("dark"),C.src="/Images/logo_optimized.png"),localStorage.setItem("theme",e)}function Ee(){ge(),he(),ye(),pe(),ke(),fe(),we()}const be=document.querySelectorAll(".search");let T=[],M=1,J=1;function D(e){return e?e.startsWith("http")?e:(e.startsWith("/uploads"),"/Images/fallback.jpg"):"/Images/fallback.jpg"}function G(e){e.innerHTML='<p style="text-align:center; color:gray; font-size: 20px; font-weight: bold;">No results found...</p>'}function Ie(e){e.innerHTML=`<p style="text-align:center; color:gray; font-size: 20px; font-weight: bold;">You haven't made any posts yet...</p>`}async function U(e=1,o=6){try{const a=await(await d(`${p}?page=${e}&limit=${o}`)).json();T=Array.isArray(a.posts)?a.posts:[],M=a.currentPage??1,J=a.totalPages??1,_(),Z()}catch(s){console.error("Error fetching posts:",s),c("Something went wrong while displaying posts!","error")}}async function X(e=1,o=6){try{const s=await d(`${p}/mine?page=${e}&limit=${o}`);if(!s.ok){const n=await s.text();throw new Error(n||"Failed to fetch your posts")}const a=await s.json();if(T=Array.isArray(a.posts)?a.posts:[],M=a.currentPage||1,J=a.totalPages||1,P("myPostsContainer"),Z(),T.length===0){const n=document.getElementById("myPostsContainer");n&&Ie(n)}}catch(s){console.error("Error fetching my posts:",s),c("Failed to load your posts!","error")}}function $e(e){return e.replace(/\n/g,"<br>")}function P(e,o=null){const s=window.currentUser?._id||window.currentUser?.id,a=document.getElementById(e);if(!a)return;a.innerHTML="";let t=[...T];if(e==="allPostsContainer"){const n=document.getElementById("categoryFilter");if(n){const i=n?.value;i!=="all"&&(t=t.filter(r=>r.category===i))}}if(e==="myPostsContainer"&&s&&(t=t.filter(n=>{const i=typeof n.authorId=="object"&&n.authorId!==null?n.authorId._id:n.authorId;return String(i)===String(s)})),o&&(t=t.slice(0,o)),t.length===0){G(a);return}t.forEach(n=>{const i=document.createElement("div");i.classList.add("post");const r=n.content.length>150?n.content.substring(0,150)+"...":n.content,m=typeof n.authorId=="object"&&n.authorId!==null?n.authorId._id:n.authorId,l=typeof n.authorId=="object"&&n.authorId!==null?n.authorId.name:n.authorName||"Unknown",f=s&&String(m)===String(s);i.innerHTML=`
      ${n.image?`<a href="post.html?slug=${n.slug}">
             <img src="${D(n.image)}" alt="${n.title}" class="post-image" loading="lazy">
           </a>`:""}
        <p class="tag">${n.category}</p>
        <h2>
          <a href="post.html?slug=${n.slug}" class="post-link">${n.title}</a>
        </h2>
        <p>${r} <a href="post.html?slug=${n.slug}" class="read-more">Read more</a></p>
        <a href="profile.html?id=${m}" class="author"><em>By ${l}</em></a>
        <small>${new Date(n.date).toLocaleString()}</small>
        <br>
        <div class="post-interactions-container">
          <div class="post-interactions">
            <button class="like-btn ${n.likedByUser?"liked":""}" data-post-id="${n._id}">
              <i class="${n.likedByUser?"fa-solid":"fa-regular"} fa-heart"></i>
              <span class="like-count">${n.likesCount||0}</span>
            </button>
            <button class="comment-btn" data-post-id="${n._id}">
              <i class="fa-regular fa-comment"></i>
              <span class="comment-count">${n.commentsCount||0}</span>
            </button>
            <button class="share-btn">
              <i class="fa-solid fa-share"></i>
              <span class="share-count"></span>
            </button>
          </div>
          <span class="liked-by likes-info">No likes yet</span>
        </div>
        <div id="likesModal-${n._id}" class="likes-modal hidden slide-up">
          <div class="likes-modal-content">
            <span id="closeLikesModal-${n._id}" class="close-btn">&times;</span>
            <h3>Liked by</h3>
            <ul id="likesList-${n._id}" class="likes-list"></ul>            
          </div>
        </div>
        <div class="comments-section">
          <form class="comment-form">
            <input type="text" class="comment-input" placeholder="Write a comment..." required />
            <button type="submit">Comment</button>
          </form>
          <div class="comments-list"></div>
        </div>
        ${f?`
        <div class="post-actions">
            <button class="edit-btn btn" data-slug="${n.slug}">Edit</button>
            <button class="delete-btn btn" data-slug="${n.slug}">Delete</button>
        </div>
        `:""}
    `,a.appendChild(i);const L=i.querySelector(".post-image");L&&(L.onerror=function(){this.onerror=null,this.src="/Images/fallback.jpg"});const E=i.querySelector(".like-btn"),u=E.querySelector("i"),h=i.querySelector(".liked-by");h.dataset.postId=n._id,h.dataset.likedBy=JSON.stringify(n.likedBy||[]),n.likedBy&&n.likedBy.length>0?h.classList.remove("disabled"):h.classList.add("disabled");const F=Array.isArray(n.likes)?n.likes.map(b=>typeof b=="object"?b._id:b):[];s&&(F.includes(s)||n.likedByUser)?(E.classList.add("liked"),u.className="fa-solid fa-heart"):(E.classList.remove("liked"),u.className="fa-regular fa-heart"),!n.likedBy||n.likedBy.length===0?h.textContent="No likes yet":n.likedBy.length===1?h.textContent=`Liked by ${n.likedBy[0]}`:h.textContent=`Liked by ${n.likedBy[0]} and ${n.likedBy.length-1} others`;const A=i.querySelector(".comment-count");updateCommentCount(n._id,A)})}async function Se(e){if(confirm("Are you sure you want to delete this post?"))try{const o=await d(`${p}/${e}`,{method:"DELETE"});if(!o.ok){const s=await o.text();throw new Error(s||"Failed to delete post")}c("Post deleted successfully!","success"),window.location.pathname.endsWith("my-posts.html")?X(M):U(M)}catch(o){console.error("Error deleting post:",o),c("Failed to delete post!","error")}}window.location.pathname.endsWith("write.html")&&!localStorage.getItem("editSlug")&&localStorage.removeItem("editSlug");function Be(e){const o=document.getElementById("post-jsonld");o&&o.remove();const s={"@context":"https://schema.org","@type":"Article",headline:e.title,description:e.content.slice(0,160),image:e.image?[e.image]:[],author:{"@type":"Person",name:e.authorName||"BuzzInk Contributor"},publisher:{"@type":"Organization",name:"BuzzInk",logo:{"@type":"ImageObject",url:"https://buzzink.onrender.com/Images/logo_optimized.png"}},datePublished:e.createdAt||e.date,dateModified:e.updatedAt||e.date,mainEntityOfPage:{"@type":"WebPage","@id":window.location.href}},a=document.createElement("script");a.type="application/ld+json",a.id="post-jsonld",a.textContent=JSON.stringify(s),document.head.appendChild(a)}async function Pe(){const o=new URLSearchParams(window.location.search).get("slug");if(o){try{let Y=function(g){y.dataset.saved=g?"true":"false",y.classList.toggle("saved",g);const $=y.querySelector("i");$.classList.toggle("fa-solid",g),$.classList.toggle("fa-regular",!g)};var s=Y;const a=await d(`${p}/${o}`);if(!a.ok)throw new Error("Failed to fetch post");const t=await a.json(),n=window.currentUser?._id||window.currentUser?.id,i=typeof t.authorId=="object"&&t.authorId!==null?t.authorId._id:t.authorId,r=typeof t.authorId=="object"&&t.authorId!==null?t.authorId.name:t.authorName||"Unknown",m=n&&String(i)===String(n),l=document.getElementById("singlePostContainer");l.innerHTML=`
      ${t.image?`<img src="${D(t.image)}" alt="${t.title}" class="post-image" loading="lazy">`:""}
      <h1>${t.title}</h1>
      <p class="tag">${t.category}</p>
      <p onclick="window.location.href='profile.html?id=${i}'" style="cursor: pointer;" class="author"><em>By ${r}</em></p>
      <small>${new Date(t.date).toLocaleString()}</small>
      <div class="content">
        <p>${$e(t.content)}</p>
      </div>
      <div class="post-interactions-container">
        <div class="post-interactions">
          <button class="like-btn ${t.likedByUser?"liked":""}" data-post-id="${t._id}">
            <i class="${t.likedByUser?"fa-solid":"fa-regular"} fa-heart"></i>
            <span class="like-count">${t.likesCount||0}</span>
          </button>
          <button class="comment-btn" data-post-id="${t._id}">
            <i class="fa-regular fa-comment"></i>
            <span class="comment-count">${t.commentsCount||0}</span>
          </button>
          <button class="share-btn">
            <i class="fa-solid fa-share"></i>
            <span class="share-count"></span>
          </button>
          <span class="bookmark ${t.savedByUser?"saved":""}" data-saved="${t.savedByUser?"true":"false"}" data-slug="${t.slug}">
            <i class="${t.savedByUser?"fa-solid":"fa-regular"} fa-bookmark"></i>
          </span>
        </div>
        <span class="liked-by likes-info">No likes yet</span>
      </div>
      <div id="likesModal-${t._id}" class="likes-modal hidden slide-up">
        <div class="likes-modal-content">
          <span id="closeLikesModal-${t._id}" class="close-btn">&times;</span>
          <h3>Liked by</h3>
          <ul id="likesList-${t._id}" class="likes-list"></ul>            
        </div>
      </div>
      <div class="comments-section show">
        <form class="comment-form">
          <input type="text" class="comment-input" placeholder="Write a comment..." required />
          <button type="submit">Comment</button>
        </form>
        <div class="comments-list"></div>
      </div>
      ${m?`
      <div class="post-actions">
        <button class="edit-btn btn" data-slug="${t.slug}">Edit</button>
        <button class="delete-btn btn" data-slug="${t.slug}">Delete</button>
      </div>`:""}
    `;const f=l.querySelector(".post-image");f&&(f.onerror=function(){this.onerror=null,this.src="/Images/fallback.jpg"});const L=l?.querySelector(".like-btn"),E=L?.querySelector("i"),u=l?.querySelector(".liked-by");u.dataset.postId=t._id,u.dataset.likedBy=JSON.stringify(t.likedBy||[]),t.likedBy&&t.likedBy.length>0?u.classList.remove("disabled"):u.classList.add("disabled");const h=Array.isArray(t.likes)?t.likes.map(g=>typeof g=="object"?g._id:g):[];n&&(h.includes(n)||t.likedByUser)?(L.classList.add("liked"),E.className="fa-solid fa-heart"):(L.classList.remove("liked"),E.className="fa-regular fa-heart"),!t.likedBy||t.likedBy.length===0?u.textContent="No likes yet":t.likedBy.length===1?u.textContent=`Liked by ${t.likedBy[0]}`:u.textContent=`Liked by ${t.likedBy[0]} and ${t.likedBy.length-1} others`;const F=l.querySelector(".comment-count");updateCommentCount(t._id,F);const A=document.querySelector(".comments-section"),b=A.querySelector(".comments-list");A&&b&&await fetchComments(t._id,b,1/0);const y=l.querySelector(".bookmark");y.addEventListener("click",async()=>{const g=localStorage.getItem("token"),$=y.dataset.slug,H=y.dataset.saved==="true";if(!g){c("Please log in to save posts");return}y.classList.add("clicked"),setTimeout(()=>y.classList.remove("clicked"),200);const ne=H?`/api/posts/${$}/unsave`:`/api/posts/${$}/save`;try{const et=await(await d(ne,{method:"POST"})).json();Y(!H),c(H?"Removed from saved posts":"Post saved","success")}catch(K){console.error("Failed to toggle bookmark",K),c("Something went wrong","error")}}),Be(t)}catch(a){console.error(a),document.getElementById("singlePostContainer").innerHTML="<p>Error loading post.</p>"}Me(o)}}const Ce=async()=>{const o=await(await d(`${p}/trending?limit=5`)).json(),s=document.getElementById("trending-list");s.innerHTML=o.map((a,t)=>`
    <li>
      <span class="trending-rank">${["🥇","🥈","🥉"][t]||`#${t+1}`}</span>
      <a href="post.html?slug=${a.slug}" class="trending-title">${a.title}</a>
      <i class="fa-solid fa-bolt trending-icon" title="Trending now"></i>
    </li>
  `).join("")};function Te(e){const o=document.getElementById("related-posts-container");if(!e.length){o.innerHTML="<p>No related posts found.</p>";return}o.innerHTML=e.map(s=>`
      <article class="related-post-card">
        <h4><a href="post.html?slug=${s.slug}">${s.title}</a></h4>
        <small>${s.category}</small>
      </article>
    `).join("")}const Me=async e=>{try{const s=await(await d(`${p}/slug/${e}/related`)).json();Te(s)}catch(o){console.error("Failed to fetch related posts.",o)}},R=document.getElementById("savedPostsContainer");async function Ae(){try{const e=await d(`${p}/saved/me`);if(!e.ok)throw new Error("Failed to fetch");const o=await e.json();if(o.length===0){R.innerHTML="<p>You have no saved posts yet.</p>";return}R.innerHTML=o.map(s=>`
      <article class="post-card">
        ${s.image?`
          <img 
            src="${D(s.image)}" 
            alt="${s.title}" 
            class="post-image"
            loading="lazy"
            onclick="window.location.href='post.html?slug=${s.slug}'"
          >
        `:""}
        <div class="post-body" onclick="window.location.href='post.html?slug=${s.slug}'">
          <h2>${s.title}</h2>
          <p class="tag">${s.category}</p>
          <p class="excerpt">
            ${s.content.slice(0,150)}...
          </p>
          <div class="post-meta">
            <small>By ${s.authorId?.name||"Unknown"}</small>
            <small>${new Date(s.date).toLocaleDateString()}</small>
          </div>
        </div>
        <button 
          class="bookmark saved"
          data-slug="${s.slug}"
          title="Remove from saved"
        >
          <i class="fa-solid fa-bookmark"></i>
        </button>
      </article>
    `).join(""),document.querySelectorAll(".bookmark").forEach(s=>{s.addEventListener("click",async a=>{a.stopPropagation();const t=s.dataset.slug;try{await d(`${p}/${t}/unsave`,{method:"POST"}),s.closest(".post-card").remove(),c("Removed from saved posts","success")}catch(n){console.error(n),c("Failed to remove","error")}})})}catch(e){console.error(e),R.innerHTML="<p>Error loading saved posts.</p>"}}function _(){document.getElementById("allPostsContainer")&&P("allPostsContainer"),document.getElementById("featuredPostsContainer")&&P("featuredPostsContainer",3),document.getElementById("myPostsContainer")&&P("myPostsContainer")}document.getElementById("categoryFilter")?.addEventListener("change",()=>{P("allPostsContainer")});function Ne(e){const o=e.target.value.toLowerCase()||"",s=document.getElementById("allPostsContainer")?"allPostsContainer":"featuredPostsContainer",a=document.getElementById(s);if(!a)return;const t=T.filter(n=>n.title.toLowerCase().includes(o)||n.content.toLowerCase().includes(o)||n.category.toLowerCase().includes(o));if(a.innerHTML="",t.length===0){G(a);return}t.forEach(n=>{const i=document.createElement("div");i.classList.add("post"),i.innerHTML=`
      ${n.image?`<img src="${D(n.image)}" alt="${n.title}" class="post-image" loading="lazy">`:""}
      <div class="post-content">
        <p class="tag">${n.category}</p>
        <h2>${n.title}</h2>
        <p>${n.content}</p>
        <p><em>By ${n.authorName||"Unknown"}</em></p>
        <small>${new Date(n.date).toLocaleString()}</small>
      </div>
    `,a.appendChild(i);const r=i.querySelector(".post-image");r&&(r.onerror=function(){this.onerror=null,this.src="/Images/fallback.jpg"}),i.addEventListener("click",()=>{window.location.href=`post.html?slug=${n.slug}`})}),o===""&&_()}be.forEach(e=>e.addEventListener("keyup",Ne));function Z(){const e=document.getElementById("pagination");if(e){e.innerHTML="";for(let o=1;o<=J;o++){const s=document.createElement("button");s.textContent=o,s.className=o===M?"pg-active":"",s?.addEventListener("click",()=>U(o)),e.appendChild(s)}}}const w=document.getElementById("loginForm"),v=document.getElementById("registerForm"),Ue=document.getElementById("logoutBtn");function O(e){return e?{...e,id:e.id||e._id}:null}window.currentUser=(()=>{const e=localStorage.getItem("user");return e?O(JSON.parse(e)):null})();function I(e){e?.id?userIcon.forEach(o=>o.title=`Logged in as ${e.name}`):(userIcon.forEach(o=>o.title="Click to Login/Register"),userMenuDetails?.classList.remove("show"))}async function j(e){try{const o=await d("/api/users/me");if(!o.ok)return;e=await o.json();const s=document.querySelectorAll(".user-icon");s&&s.forEach(a=>{a.src=e.profilePhoto?.trim()?e.profilePhoto:oe}),window.currentUser=e}catch(o){console.warn("Failed to load auth user:",o)}}function je(){w?.addEventListener("submit",async e=>{e.preventDefault();const o=document.getElementById("loginEmail").value,s=document.getElementById("loginPassword").value;console.log("Login Triggered");const a=await d(`${q}/login`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({email:o,password:s})}),t=await a.json();console.log("Login response:",t),a.ok||c(`Login failed: ${t.message||"Unknown error"}`,"error");const n=O(t.user);localStorage.setItem("user",JSON.stringify(n)),window.currentUser=n,localStorage.setItem("role",n.role),n.role==="admin"&&(window.location.href="admin.html"),I(n),j(n),authModal.classList.add("hidden"),w.reset(),c(`Welcome back, ${n.name}!`,"success"),_()})}function qe(){v?.addEventListener("submit",async e=>{e.preventDefault();const o=document.getElementById("registerName").value,s=document.getElementById("registerEmail").value,a=document.getElementById("registerPassword").value,t=await d(`${q}/register`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({name:o,email:s,password:a})}),n=await t.json();console.log("Register response:",n),t.ok||c(`Registration failed: ${n.message||"Unknown error"}`,"error");const i=O(n.user);localStorage.setItem("user",JSON.stringify(i)),window.currentUser=i,localStorage.setItem("role",i.role),I(i),j(i),authModal.classList.add("hidden"),v.reset(),c(`Welcome, ${i.name}! Your account has been created.`,"success")})}function xe(){Ue?.addEventListener("click",()=>{ee(),window.location.href="index.html"})}async function De(){if(!token)return I(null),j(null),null;try{const e=await d(`${q}/me`);if(!e.ok)throw new Error("Not authenticated");const o=await e.json(),s=O(o.user);return localStorage.setItem("user",JSON.stringify(s)),window.currentUser=s,I(s),j(s),s}catch{return ee(!0),null}}function ee(e=!1){localStorage.removeItem("user"),window.currentUser=null,I(null),e||c("You have been logged out.","info")}function _e(){const e=document.getElementById("forgotPasswordLink"),o=document.getElementById("forgotPasswordModal"),s=document.getElementById("closeForgotModal"),a=document.getElementById("forgotPasswordForm");e&&e.addEventListener("click",t=>{t.preventDefault(),o.classList.remove("hidden")}),s&&s.addEventListener("click",()=>{o.classList.add("hidden")}),a&&a.addEventListener("submit",async t=>{t.preventDefault();const n=document.getElementById("forgotEmail").value.trim();try{const r=await(await fetch("/api/auth/forgot-password",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({email:n})})).json();c(r.message||"Check your email for the reset link.","success"),o.classList.add("hidden")}catch(i){console.error(i),c("Failed to send reset link. Try again.","error")}})}function Oe(){je(),qe(),xe(),_e()}async function d(e,o={}){let s=await fetch(e,{credentials:"include",...o});return s.status===401&&(await Fe()?s=await fetch(e,{credentials:"include",...o}):logout(!0)),s}async function Fe(){try{const e=await fetch(`${q}/refresh`,{method:"POST",credentials:"include"});if(!e.ok)throw new Error("Refresh failed");const o=await e.json();return window.currentUser=o.user,I(o.user),!0}catch{return!1}}function He(){window.location.pathname.endsWith("post.html")&&(async()=>{const o=new URLSearchParams(window.location.search).get("slug");if(!o)return;const a=await(await d(`/api/posts/${o}`)).json();document.title=`${a.title} | BuzzInk`;const t=a.content.slice(0,160);document.getElementById("postTitle")?.setAttribute("content",a.title),document.getElementById("postDescription")?.setAttribute("content",t),document.getElementById("ogTitle")?.setAttribute("content",a.title),document.getElementById("ogDescription")?.setAttribute("content",t),document.getElementById("ogImage")?.setAttribute("content",a.image||"/Images/fallback.jpg"),document.getElementById("ogUrl")?.setAttribute("content",window.location.href),document.getElementById("twitterTitle")?.setAttribute("content",a.title),document.getElementById("twitterDescription")?.setAttribute("content",t),document.getElementById("twitterImage")?.setAttribute("content",a.image||"/Images/fallback.jpg")})()}async function ze(e){const o=e.dataset.postId,s=e.querySelector("i"),a=e.querySelector(".like-count"),t=e.closest(".post-interactions-container")?.querySelector(".liked-by"),n=e.classList.contains("liked"),i=localStorage.getItem("token"),r=localStorage.getItem("refreshToken");if(!i&&!r){c("Please log in to like or unlike posts.","error");return}try{let m;n?m=await d(`/api/posts/${o}/unlike`,{method:"POST"}):m=await d(`/api/posts/${o}/like`,{method:"POST"});const l=await m.json();m.ok?(n?(e.classList.remove("liked"),s.className="fa-regular fa-heart"):(e.classList.add("liked"),s.className="fa-solid fa-heart"),a.textContent=l.likes??0,t.dataset.postId=o,t.dataset.likedBy=JSON.stringify(l.likedBy||[]),l.likedBy&&l.likedBy.length>0?(t.classList.remove("disabled"),l.likedBy.length===1?t.textContent=`Liked by ${l.likedBy[0]}`:t.textContent=`Liked by ${l.likedBy[0]} and ${l.likedBy.length-1} others`):(t.classList.add("disabled"),t.textContent="No likes yet")):c(`Failed to update likes: ${l.message}`,"error")}catch(m){console.error("Like action failed:",m),c("Error updating like. Please try again.","error")}}async function Re(e){const o=e.dataset.postId;if(!o)return;const s=window.location.pathname.endsWith("post.html"),a=s?document.getElementById("singlePostContainer"):e.closest(".post");if(!a)return;const t=a.querySelector(".comments-section"),n=t?.querySelector(".comments-list");!t||!n||(s||t.classList.toggle("show"),(s||t.classList.contains("show"))&&await Je(o,n))}async function We(e){if(e.dataset.deleting==="true")return;e.dataset.deleting="true";const o=e.dataset.commentId;if(!confirm("Are you sure you want to delete this comment?")){e.dataset.deleting="false";return}try{const a=await d(`${x}/${o}`,{method:"DELETE"}),t=await a.json();if(a.ok){const n=e.closest(".comment");n&&n.remove();let i;if(window.location.pathname.endsWith("post.html")?i=document.getElementById("singlePostContainer")?.querySelector(".comment-count"):i=e.closest(".post")?.querySelector(".comment-count"),i){const r=parseInt(i.textContent)||0;i.textContent=Math.max(0,r-1)}c("Comment deleted successfully!","success")}else throw new Error(t.message||"Delete failed")}catch(a){console.error("Error deleting comment:",a),c("Error deleting comment. Please try again.","error")}finally{e.dataset.deleting="false"}}async function Je(e,o,s=3){try{o.innerHTML='<p class="loading-comments">Loading comments...</p>';const a=await d(`${x}/post/${e}?_=${Date.now()}`);if(!a.ok)throw new Error("Failed to fetch comments");const t=await a.json();if(o.innerHTML="",t.length===0){o.innerHTML="<p class='no-comments'>No comments yet. Be the first to comment!</p>";return}const n=t.slice(0,s);if(W(n,o),t.length>s){const i=document.createElement("button");i.classList.add("view-more-btn"),i.textContent=`View all ${t.length} comments`;const r=document.createElement("div");r.classList.add("comments-scroll-container"),r.style.display="none",W(t,r);let m=!1;i.addEventListener("click",()=>{m=!m,m?(o.innerHTML="",o.appendChild(r),o.appendChild(i),r.style.display="block",i.textContent="View less comments"):(o.innerHTML="",W(n,o),i.textContent=`View all ${t.length} comments`,o.appendChild(i))}),o.appendChild(i)}}catch(a){console.error("Error fetching comments:",a),o.innerHTML="<p class='error-comments'>Failed to load comments.</p>"}}function W(e,o){const s=window.currentUser?.id||window.currentUser?._id;e.forEach(a=>{const t=document.createElement("div");t.classList.add("comment");const n=typeof a.authorId=="object"?a.authorId._id:a.authorId,i=s&&n&&n.toString()===s.toString();t.innerHTML=`
      <div class="comment-header">
        <p><strong class="comment-author" style="cursor: pointer;">${a.authorId?.name||"Anonymous"}:</strong> ${formatText(a.text)}</p>
        ${i?`<div class="comment-menu">
                  <button class="menu-btn">⋮</button>
                  <div class="menu-options hidden">
                    <button class="delete-comment-btn" data-comment-id="${a._id}">Delete</button>
                  </div>
                </div>`:""}
      </div>  
      <small>${new Date(a.createdAt).toLocaleString()}</small>
    `,o.appendChild(t),t.querySelector(".comment-author")?.addEventListener("click",()=>{window.location.href=`profile.html?id=${a.authorId?._id}`})})}async function Ve(e,o,s,a){try{const t=localStorage.getItem("token"),n=await d(`${x}/post/${e}`,{method:"POST",headers:{"Content-Type":"application/json",Authorization:`Bearer ${t}`},body:JSON.stringify({text:o})});if(n.ok){const i=await n.json(),r=document.createElement("div");r.classList.add("comment"),r.innerHTML=`
        <div class="comment-header">
          <p><strong>You:</strong> ${formatText(i.text)}</p>
          <div class="comment-menu">
            <button class="menu-btn">⋮</button>
            <div class="menu-options hidden">
              <button class="delete-comment-btn" data-comment-id="${i._id}">Delete</button>
            </div>
          </div>
        </div>
        <small>${new Date(i.createdAt).toLocaleString()}</small>
      `,s.prepend(r),a&&await Ye(e,a),c("Comment posted successfully!","success")}else throw new Error("Failed to post comment")}catch(t){console.error("Error posting comment:",t),c("Failed to post comment","error")}}async function Ye(e,o){try{const s=await d(`${x}/post/${e}`);if(!s.ok)throw new Error("Failed to fetch comment count");const t=(await s.json()).length;t===0?(o.textContent="0",o.title="No comments yet"):(o.textContent=t,o.title=`${t} comment${t>1?"s":""}`)}catch(s){console.error("Error fetching comment count:",s),o.textContent="0"}}function Ke(){document.addEventListener("submit",async e=>{const o=e.target.closest(".comment-form");if(!o)return;e.preventDefault();const s=o.querySelector(".comment-input"),a=s.value.trim();if(!a)return;let t,n,i,r;if(window.location.pathname.endsWith("post.html")?(t=document.getElementById("singlePostContainer"),n=t.querySelector(".comments-list"),i=t.querySelector(".comment-btn").dataset.postId,r=t.querySelector(".comment-count")):(t=o.closest(".post"),n=t.querySelector(".comments-list"),i=t.querySelector(".like-btn").dataset.postId,r=t.querySelector(".comment-count")),!window.currentUser||!localStorage.getItem("token")){c("Please log in to comment.","error"),s.value="";return}await Ve(i,a,n,r),s.value=""})}function Qe(){document.addEventListener("submit",Ke)}let V=!1;function Ge(e,o){const s=document.getElementById(`likesModal-${e}`),a=document.getElementById(`likesList-${e}`);if(!s||!a)return;a.innerHTML="",o.forEach(n=>{const i=document.createElement("li");i.textContent=n,a.appendChild(i)}),s.classList.remove("hidden"),requestAnimationFrame(()=>s.classList.add("active")),V=!0,s.querySelector(".likes-modal-content").addEventListener("click",n=>n.stopPropagation()),document.getElementById(`closeLikesModal-${e}`)?.addEventListener("click",n=>{n.stopPropagation(),te(e)},{once:!0})}function te(e){const o=document.getElementById(`likesModal-${e}`);o&&(o.classList.remove("active"),setTimeout(()=>{o.classList.add("hidden"),V=!1},300))}function Xe(){document.addEventListener("click",async e=>{const o=e.target.closest(".edit-btn");if(o){e.preventDefault(),e.stopPropagation(),editPost(o.dataset.slug);return}const s=e.target.closest(".delete-btn");if(s){e.preventDefault(),e.stopPropagation(),Se(s.dataset.slug);return}const a=e.target.closest(".like-btn");if(a){e.preventDefault(),ze(a);return}const t=e.target.closest(".comment-btn");if(t){e.preventDefault(),Re(t);return}const n=e.target.closest(".likes-info");if(n&&!n.classList.contains("disabled")){e.preventDefault(),e.stopPropagation();const l=n.dataset.postId,f=JSON.parse(n.dataset.likedBy||"[]");if(!l||f.length===0)return;Ge(l,f);return}if(V){const l=document.querySelector(".likes-modal.active");if(l&&!l.contains(e.target)){const f=l.id.replace("likesModal-","");te(f)}}const i=e.target.closest(".delete-comment-btn");i&&(e.preventDefault(),e.stopPropagation(),We(i));const r=e.target.closest(".menu-btn"),m=e.target.closest(".menu-options");if(!r&&!m){document.querySelectorAll(".menu-options").forEach(l=>l.classList.add("hidden"));return}r&&r.nextElementSibling.classList.toggle("hidden"),k?.classList.contains("show")&&!k.contains(e.target)&&![...Q].some(l=>l.contains(e.target))&&k.classList.remove("show"),mobileMenu?.classList.contains("active")&&!mobileMenu.contains(e.target)&&!menuToggle.contains(e.target)&&mobileMenu.classList.remove("active")})}document.getElementById("canonicalUrl")?.setAttribute("href",window.location.href);function Ze(){window.location.pathname.endsWith("index.html")?(U(),Ce()):window.location.pathname.endsWith("my-posts.html")?X():window.location.pathname.endsWith("post.html")?Pe():window.location.pathname.endsWith("saved.html")?Ae():U()}document.addEventListener("DOMContentLoaded",async()=>{He(),Xe(),Oe(),Ee(),Qe(),ve();const e=localStorage.getItem("theme")||"light";Le(e);const o=await De();window.currentUser=o,await updateAvatar(o),Ze(),_()});
