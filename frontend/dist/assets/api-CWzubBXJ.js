(function(){const o=document.createElement("link").relList;if(o&&o.supports&&o.supports("modulepreload"))return;for(const t of document.querySelectorAll('link[rel="modulepreload"]'))e(t);new MutationObserver(t=>{for(const r of t)if(r.type==="childList")for(const n of r.addedNodes)n.tagName==="LINK"&&n.rel==="modulepreload"&&e(n)}).observe(document,{childList:!0,subtree:!0});function a(t){const r={};return t.integrity&&(r.integrity=t.integrity),t.referrerPolicy&&(r.referrerPolicy=t.referrerPolicy),t.crossOrigin==="use-credentials"?r.credentials="include":t.crossOrigin==="anonymous"?r.credentials="omit":r.credentials="same-origin",r}function e(t){if(t.ep)return;t.ep=!0;const r=a(t);fetch(t.href,r)}})();const f="/api/posts",U="/api/auth",_="/api/comments",Q="https://i.postimg.cc/KvF0rh0Q/custom-default-avatar.png",G=document.body,W=document.querySelectorAll(".user-icon"),T=document.getElementById("userMenuDetails"),j=document.getElementById("authModal"),ne=document.getElementById("closeModal"),P=document.getElementById("loginTab"),B=document.getElementById("registerTab"),ae=document.querySelectorAll(".write-post"),re=document.querySelector(".search-icon"),z=document.getElementById("mobileSearch"),ie=document.querySelector(".menu-toggle"),le=document.getElementById("mobileMenu"),A=document.querySelector(".logo"),ce=document.querySelector(".all-posts-btn"),de=document.getElementById("myPosts"),me=document.getElementById("savedPosts"),ue=document.getElementById("profile-edit"),ge=document.getElementById("settings"),F=document.getElementById("themeToggle"),D=document.documentElement;function c(s,o="info",a=5e3){const e=document.getElementById("toast-container");if(!e)return;const t=document.createElement("div");t.className=`toast toast-${o}`;const r=document.createElement("i");o==="success"?r.className="fas fa-check-circle":o==="error"?r.className="fas fa-exclamation-circle":r.className="fas fa-info-circle",t.appendChild(r);const n=document.createElement("span");n.textContent=s,t.appendChild(n),e.appendChild(t),setTimeout(()=>{t.style.animation="slideOut 0.5s forwards",t?.addEventListener("animationend",()=>t.remove())},a)}function fe(){ie?.addEventListener("click",s=>{s.stopPropagation(),T.classList.contains("show")&&T.classList.remove("show"),le.classList.toggle("active")})}function he(){A?.addEventListener("click",()=>{window.location.href="index.html"}),ce?.addEventListener("click",()=>{window.location.href="all-posts.html"}),de?.addEventListener("click",()=>{window.location.href="my-posts.html"}),ue?.addEventListener("click",()=>{window.location.href="dashboard.html"}),me?.addEventListener("click",()=>{window.location.href="saved.html"}),ge?.addEventListener("click",()=>{window.location.href="settings.html"})}function ye(){P?.addEventListener("click",()=>{k.classList.remove("hidden"),E.classList.add("hidden"),P.classList.add("active"),B.classList.remove("active")}),B?.addEventListener("click",()=>{E.classList.remove("hidden"),k.classList.add("hidden"),B.classList.add("active"),P.classList.remove("active")}),ne?.addEventListener("click",()=>{j.classList.add("hidden")})}function pe(){W.forEach(s=>s?.addEventListener("click",()=>{const o=localStorage.getItem("user"),a=o?JSON.parse(o):null;a&&a.id?(T.classList.toggle("show"),j.classList.add("hidden")):(T.classList.add("hidden"),j.classList.remove("hidden"),P.classList.add("active"),B.classList.remove("active"),k.classList.remove("hidden"),E.classList.add("hidden"),k?.reset(),E?.reset())}))}function we(){re?.addEventListener("click",()=>{z.classList.toggle("show"),z.classList.contains("show")&&z.querySelector("input").focus()})}function ve(){ae.forEach(s=>{s?.addEventListener("click",o=>{const a=localStorage.getItem("user"),e=a?JSON.parse(a):null;!e||!e.id?(o.preventDefault(),j.classList.remove("hidden"),P.classList.add("active"),B.classList.remove("active"),k.classList.remove("hidden"),E.classList.add("hidden")):(localStorage.removeItem("editSlug"),window.location.href="write.html")})})}function ke(){F?.addEventListener("change",()=>{F.checked?(D.setAttribute("data-theme","dark"),localStorage.setItem("theme","dark"),A.src="/Images/logo-dark-theme_optimized_.png"):(D.setAttribute("data-theme","light"),localStorage.setItem("theme","light"),A.src="/Images/logo_optimized.png")})}function Fe(){localStorage.getItem("theme")==="dark"?(D.setAttribute("data-theme","dark"),F&&(F.checked=!0)):D.setAttribute("data-theme","light")}function De(s){s==="dark"?(G.classList.add("dark"),A.src="/Images/logo-dark-theme_optimized_.png"):(G.classList.remove("dark"),A.src="/Images/logo_optimized.png"),localStorage.setItem("theme",s)}function Oe(){fe(),ye(),pe(),we(),ve(),he(),ke()}async function _e(s){const o=s.dataset.slug;if(!o)return;const a=window.location.pathname.endsWith("post.html"),e=a?document.getElementById("singlePostContainer"):s.closest(".post");if(!e)return;const t=e.querySelector(".comments-section"),r=t?.querySelector(".comments-list");!t||!r||(a||t.classList.toggle("show"),(a||t.classList.contains("show"))&&await X(o,r))}async function He(s){if(s.dataset.deleting==="true")return;s.dataset.deleting="true";const o=s.dataset.commentId;if(!confirm("Are you sure you want to delete this comment?")){s.dataset.deleting="false";return}try{const e=await d(`${_}/${o}`,{method:"DELETE"}),t=await e.json();if(e.ok){const r=s.closest(".comment");r&&r.remove();const i=(window.location.pathname.endsWith("post.html")?document.getElementById("singlePostContainer"):s.closest(".post"))?.querySelector(".comment-count");if(i){let l=parseInt(i.textContent)||0;l=Math.max(l-1,0),i.textContent=l,i.title=`${l} comment${l!==1?"s":""}`}c("Comment deleted successfully!","success")}else throw new Error(t.message||"Delete failed")}catch(e){console.error("Error deleting comment:",e),c("Error deleting comment. Please try again.","error")}finally{s.dataset.deleting="false"}}async function X(s,o,a=3){try{o.innerHTML='<p class="loading-comments">Loading comments...</p>';const e=await d(`${_}/post/${s}?_=${Date.now()}`);if(!e.ok)throw new Error("Failed to fetch comments");const t=await e.json();if(o.innerHTML="",t.length===0){o.innerHTML="<p class='no-comments'>No comments yet. Be the first to comment!</p>";return}const r=t.slice(0,a);if(J(r,o),t.length>a){const n=document.createElement("button");n.classList.add("view-more-btn"),n.textContent=`View all ${t.length} comments`;const i=document.createElement("div");i.classList.add("comments-scroll-container"),i.style.display="none",J(t,i);let l=!1;n?.addEventListener("click",()=>{l=!l,l?(o.innerHTML="",o.appendChild(i),o.appendChild(n),i.style.display="block",n.textContent="View less comments"):(o.innerHTML="",J(r,o),n.textContent=`View all ${t.length} comments`,o.appendChild(n))}),o.appendChild(n)}}catch(e){console.error("Error fetching comments:",e),o.innerHTML="<p class='error-comments'>Failed to load comments.</p>"}}function J(s,o){const a=window.currentUser?.id||window.currentUser?._id;s.forEach(e=>{const t=document.createElement("div");t.classList.add("comment");const r=typeof e.authorId=="object"?e.authorId._id:e.authorId,n=a&&r&&r.toString()===a.toString();t.innerHTML=`
      <div class="comment-header">
        <p><strong class="comment-author" style="cursor: pointer;">${e.authorId?.name||"Anonymous"}:</strong> ${Y(e.text)}</p>
        ${n?`<div class="comment-menu">
                  <button class="menu-btn">⋮</button>
                  <div class="menu-options hidden">
                    <button class="delete-comment-btn" data-comment-id="${e._id}">Delete</button>
                  </div>
                </div>`:""}
      </div>  
      <small>${new Date(e.createdAt).toLocaleString()}</small>
    `,o.appendChild(t),t.querySelector(".comment-author")?.addEventListener("click",()=>{window.location.href=`profile.html?id=${e.authorId?._id}`})})}async function Ee(s,o,a,e){try{const t=await d(`${_}/post/${s}`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({text:o})});if(t.ok){const n=(await t.json()).comment,i=document.createElement("div");if(i.classList.add("comment"),i.innerHTML=`
        <div class="comment-header">
          <p><strong>You:</strong> ${Y(n.text)}</p>
          <div class="comment-menu">
            <button class="menu-btn">⋮</button>
            <div class="menu-options hidden">
              <button class="delete-comment-btn" data-comment-id="${n._id}">Delete</button>
            </div>
          </div>
        </div>
        <small>${new Date(n.createdAt).toLocaleString()}</small>
      `,a.prepend(i),e&&e){let l=parseInt(e.textContent)||0;e.textContent=l+1,e.title=`${l+1} comments`}c("Comment posted successfully!","success")}else throw new Error("Failed to post comment")}catch(t){console.error("Error posting comment:",t),c("Failed to post comment","error")}}async function Z(s,o){try{const a=await d(`${_}/post/${s}`);if(!a.ok)throw new Error("Failed to fetch comment count");const t=(await a.json()).length;t===0?(o.textContent="0",o.title="No comments yet"):(o.textContent=t,o.title=`${t} comment${t>1?"s":""}`)}catch(a){console.error("Error fetching comment count:",a),o.textContent="0"}}async function be(s){const o=s.target.closest(".comment-form");if(!o)return;s.preventDefault();const a=o.querySelector(".comment-input"),e=a.value.trim();if(!e)return;let t,r,n,i;if(window.location.pathname.endsWith("post.html")?(t=document.getElementById("singlePostContainer"),r=t.querySelector(".comments-list"),n=t.querySelector(".comment-btn").dataset.slug,i=t.querySelector(".comment-count")):(t=o.closest(".post"),r=t.querySelector(".comments-list"),n=t.querySelector(".like-btn").dataset.slug,i=t.querySelector(".comment-count")),!window.currentUser){c("Please log in to comment.","error"),a.value="";return}await Ee(n,e,r,i),a.value=""}function Re(){document.addEventListener("submit",be)}const Le=document.querySelectorAll(".search");let w={all:[],mine:[],saved:[]},L=1,g=Number(sessionStorage.getItem("postsPage"))||1;sessionStorage.getItem("postsCategory");sessionStorage.getItem("postsSearch");function V(s){return s&&s.startsWith("http")?s:"/Images/fallback.jpg"}function Ie(s){s.innerHTML=`<p style="text-align:center; color:gray; font-size: 20px; font-weight: bold;">You haven't made any posts yet...</p>`}async function H(s=1,o=6){try{const a=document.getElementById("categoryFilter")?.value,e=document.querySelectorAll(".search"),t=new URLSearchParams;t.append("page",s),t.append("limit",o),a&&a!=="all"&&t.append("category",a),e.forEach(l=>{if(l){const m=l.value.trim();m&&t.append("search",m)}});const n=await(await d(`${f}?${t.toString()}`)).json();w.all=Array.isArray(n.posts)?n.posts:[],g=n.currentPage??1,L=n.totalPages??1,sessionStorage.setItem("postsPage",g),sessionStorage.setItem("postsCategory",a&&a!=="all"?a:"");const i=[...e].find(l=>l.value.trim())?.value.trim()||"";sessionStorage.setItem("postsSearch",i),C("allPostsContainer"),K("allPostsContainer",g,L)}catch(a){console.error("Error fetching posts:",a),c("Something went wrong while displaying posts!","error")}}async function ee(s=1,o=6){try{const a=document.querySelectorAll(".search"),e=new URLSearchParams;e.append("page",s),e.append("limit",o),a.forEach(l=>{if(l){const m=l.value.trim();m&&e.append("search",m)}});const t=await d(`${f}/mine?${e.toString()}`);if(!t.ok){const l=await t.text();throw new Error(l||"Failed to fetch your posts")}const r=await t.json();w.mine=Array.isArray(r.posts)?r.posts:[],g=r.currentPage||1,L=r.totalPages||1,sessionStorage.setItem("postsPage",g);const n=[...a].find(l=>l.value.trim())?.value.trim()||"";sessionStorage.setItem("postsSearch",n);const i="myPostsContainer";if(C("myPostsContainer",null,"You haven't made any posts yet..."),K(i,g,L),w.mine.length===0){const l=document.getElementById("myPostsContainer");l&&Ie(l)}}catch(a){console.error("Error fetching my posts:",a),c("Failed to load your posts!","error")}}function Y(s){return s.replace(/\n/g,"<br>")}function C(s,o=null,a=null){const e=window.currentUser?._id||window.currentUser?.id,t=document.getElementById(s);if(!t)return;t.innerHTML="";let r=[];if(s==="allPostsContainer"||s==="featuredPostsContainer"?r=[...w.all]:s==="myPostsContainer"?r=[...w.mine]:s==="savedPostsContainer"&&(r=[...w.saved]),o&&(r=r.slice(0,o)),r.length===0){t.innerHTML=a??'<p style="text-align:center; color:gray; font-size:20px;">No results found...</p>';return}r.forEach(n=>{const i=document.createElement("div");i.classList.add("post");const l=n.content.length>150?n.content.substring(0,150)+"...":n.content,m=typeof n.authorId=="object"&&n.authorId!==null?n.authorId._id:n.authorId,v=typeof n.authorId=="object"&&n.authorId!==null?n.authorId.name:n.authorName||"Unknown",M=e&&String(m)===String(e);i.innerHTML=`
      ${n.image?`<a href="post.html?slug=${n.slug}">
             <img src="${V(n.image)}" alt="${n.title}" class="post-image" loading="lazy">
           </a>`:""}
        <p class="tag">${n.category}</p>
        <h2>
          <a href="post.html?slug=${n.slug}" class="post-link">${n.title}</a>
        </h2>
        <p>${l} <a href="post.html?slug=${n.slug}" class="read-more">Read more</a></p>
        <a href="profile.html?id=${m}" class="author"><em>By ${v}</em></a>
        <small>${new Date(n.date).toLocaleString()}</small>
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
            <button class="share-btn">
              <i class="fa-solid fa-share"></i>
              <span class="share-count"></span>
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
        ${M?`
        <div class="post-actions">
            <button class="edit-btn btn" data-slug="${n.slug}">Edit</button>
            <button class="delete-btn btn" data-slug="${n.slug}">Delete</button>
        </div>
        `:""}
    `,t.appendChild(i);const h=i.querySelector(".post-image");h&&(h.onerror=function(){this.onerror=null,this.src="/Images/fallback.jpg"});const S=i.querySelector(".like-btn"),q=S.querySelector("i"),y=i.querySelector(".liked-by");y.dataset.slug=n.slug,y.dataset.likedBy=JSON.stringify(n.likedBy||[]),n.likedBy&&n.likedBy.length>0?y.classList.remove("disabled"):y.classList.add("disabled");const x=Array.isArray(n.likes)?n.likes.map($=>typeof $=="object"?$._id:$):[];e&&(x.includes(e)||n.likedByUser)?(S.classList.add("liked"),q.className="fa-solid fa-heart"):(S.classList.remove("liked"),q.className="fa-regular fa-heart"),!n.likedBy||n.likedBy.length===0?y.textContent="No likes yet":n.likedBy.length===1?y.textContent=`Liked by ${n.likedBy[0]}`:y.textContent=`Liked by ${n.likedBy[0]} and ${n.likedBy.length-1} others`;const p=i.querySelector(".comment-count");Z(n.slug,p)})}async function Se(s,o,a,e){const t=new FormData;t.append("title",s),t.append("content",o),t.append("category",a),e&&t.append("image",e);const r=await d(`${f}`,{method:"POST",body:t});if(!r.ok)throw new Error("Failed to add post");return await r.json()}async function ze(s){if(confirm("Are you sure you want to delete this post?"))try{const o=await d(`${f}/${s}`,{method:"DELETE"});if(!o.ok){const a=await o.text();throw new Error(a||"Failed to delete post")}c("Post deleted successfully!","success"),window.location.pathname.endsWith("my-posts.html")?ee(g):H(g)}catch(o){console.error("Error deleting post:",o),c("Failed to delete post!","error")}}function Je(s){s&&(localStorage.setItem("editSlug",s),window.location.href="write.html")}function We(){const s=document.getElementById("postForm"),o=document.querySelector(".add-post-btn");if(!s)return;const a=localStorage.getItem("editSlug"),e=t=>{o.disabled=t,o.innerHTML=t?'<i class="fa-solid fa-spinner fa-spin"></i> Posting...':a?"Update Post":"Add Post"};a&&a!=="null"?((async()=>{try{const t=await d(`${f}/${a}`);if(!t.ok)throw new Error("Post not found");const r=await t.json();if(document.getElementById("title").value=r.title||"",document.getElementById("content").value=r.content||"",document.getElementById("category").value=r.category||"",r.image){const n=document.getElementById("imagePreview");n.src=r.image,n.style.display="block"}}catch(t){console.error("Error loading post:",t)}})(),s.onsubmit=async function(t){t.preventDefault();const r=new FormData;r.append("title",document.getElementById("title").value),r.append("content",document.getElementById("content").value),r.append("category",document.getElementById("category").value);const n=document.getElementById("image").files[0];n&&r.append("image",n);try{e(!0);const i=await d(`${f}/${a}`,{method:"PUT",body:r});i.ok?(c("Post updated successfully!","success"),localStorage.removeItem("editSlug"),window.location.href="all-posts.html"):console.error("Update failed:",await i.text())}catch(i){console.error("Error updating post:",i),c("Failed to update post!","error")}finally{e(!1)}}):(localStorage.removeItem("editSlug"),s?.addEventListener("submit",async function(t){t.preventDefault();const r=document.getElementById("title").value,n=document.getElementById("content").value,i=document.getElementById("category").value,l=document.getElementById("image").files[0];console.log("Submitting new post:",{title:r,content:n,category:i,imageFile:l});try{e(!0);const m=await Se(r,n,i,l);console.log("Post created successfully!",m),c("Post created successfully!","success"),s.reset(),window.location.href="all-posts.html",localStorage.removeItem("editSlug")}catch(m){console.error("Error adding post:",m),c("Failed to add post!","error")}finally{e(!1)}}))}function $e(s){const o=document.getElementById("post-jsonld");o&&o.remove();const a={"@context":"https://schema.org","@type":"Article",headline:s.title,description:s.content.slice(0,160),image:s.image?[s.image]:[],author:{"@type":"Person",name:s.authorName||"BuzzInk Contributor"},publisher:{"@type":"Organization",name:"BuzzInk",logo:{"@type":"ImageObject",url:"https://buzzink.onrender.com/Images/logo_optimized.png"}},datePublished:s.createdAt||s.date,dateModified:s.updatedAt||s.date,mainEntityOfPage:{"@type":"WebPage","@id":window.location.href}},e=document.createElement("script");e.type="application/ld+json",e.id="post-jsonld",e.textContent=JSON.stringify(a),document.head.appendChild(e)}async function Ve(){const o=new URLSearchParams(window.location.search).get("slug");if(o){try{let $=function(u){p.dataset.saved=u?"true":"false",p.classList.toggle("saved",u);const b=p.querySelector("i");b.classList.toggle("fa-solid",u),b.classList.toggle("fa-regular",!u)};const a=await d(`${f}/${o}`);if(!a.ok)throw new Error("Failed to fetch post");const e=await a.json(),t=window.currentUser?._id||window.currentUser?.id,r=typeof e.authorId=="object"&&e.authorId!==null?e.authorId._id:e.authorId,n=typeof e.authorId=="object"&&e.authorId!==null?e.authorId.name:e.authorName||"Unknown",i=t&&String(r)===String(t),l=document.getElementById("singlePostContainer");l.innerHTML=`
      ${e.image?`<img src="${V(e.image)}" alt="${e.title}" class="post-image" loading="lazy">`:""}
      <h1>${e.title}</h1>
      <p class="tag">${e.category}</p>
      <p onclick="window.location.href='profile.html?id=${r}'" style="cursor: pointer;" class="author"><em>By ${n}</em></p>
      <small>${new Date(e.date).toLocaleString()}</small>
      <div class="content">
        <p>${Y(e.content)}</p>
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
          <button class="share-btn">
            <i class="fa-solid fa-share"></i>
            <span class="share-count"></span>
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
      ${i?`
      <div class="post-actions">
        <button class="edit-btn btn" data-slug="${e.slug}">Edit</button>
        <button class="delete-btn btn" data-slug="${e.slug}">Delete</button>
      </div>`:""}
    `;const m=l.querySelector(".post-image");m&&(m.onerror=function(){this.onerror=null,this.src="/Images/fallback.jpg"});const v=l?.querySelector(".like-btn"),M=v?.querySelector("i"),h=l?.querySelector(".liked-by");h.dataset.slug=e.slug,h.dataset.likedBy=JSON.stringify(e.likedBy||[]),e.likedBy&&e.likedBy.length>0?h.classList.remove("disabled"):h.classList.add("disabled");const S=Array.isArray(e.likes)?e.likes.map(u=>typeof u=="object"?u._id:u):[];t&&(S.includes(t)||e.likedByUser)?(v.classList.add("liked"),M.className="fa-solid fa-heart"):(v.classList.remove("liked"),M.className="fa-regular fa-heart"),!e.likedBy||e.likedBy.length===0?h.textContent="No likes yet":e.likedBy.length===1?h.textContent=`Liked by ${e.likedBy[0]}`:h.textContent=`Liked by ${e.likedBy[0]} and ${e.likedBy.length-1} others`;const q=l.querySelector(".comment-count");Z(e.slug,q);const y=document.querySelector(".comments-section"),x=y.querySelector(".comments-list");y&&x&&await X(e.slug,x,1/0);const p=l.querySelector(".bookmark");p?.addEventListener("click",async()=>{const u=p.dataset.slug,b=p.dataset.saved==="true";if(!window.currentUser){c("Please log in to save posts");return}p.classList.add("clicked"),setTimeout(()=>p.classList.remove("clicked"),200);const se=b?`/api/posts/${u}/unsave`:`/api/posts/${u}/save`;try{const N=await d(se,{method:"POST"}),oe=await N.json();if(!N.ok)throw new Error(oe.message||"Failed to toggle bookmark");$(!b),c(b?"Removed from saved posts":"Post saved","success")}catch(N){console.error("Failed to toggle bookmark",N),c("Something went wrong","error")}}),$e(e)}catch(a){console.error(a),document.getElementById("singlePostContainer").innerHTML="<p>Error loading post.</p>"}Be(o)}}const Ye=async()=>{const o=await(await d(`${f}/trending?limit=5`)).json(),a=document.getElementById("trending-list");a.innerHTML=o.map((e,t)=>`
    <li>
      <span class="trending-rank">${["🥇","🥈","🥉"][t]||`#${t+1}`}</span>
      <a href="post.html?slug=${e.slug}" class="trending-title">${e.title}</a>
      <i class="fa-solid fa-bolt trending-icon" title="Trending now"></i>
    </li>
  `).join("")};function Pe(s){const o=document.getElementById("related-posts-container");if(!s.length){o.innerHTML="<p style='margin: 0 5px;'>No related posts found.</p>";return}o.innerHTML=s.map(a=>`
      <article class="related-post-card">
        <h4><a href="post.html?slug=${a.slug}">${a.title}</a></h4>
        <small>${a.category}</small>
      </article>
    `).join("")}const Be=async s=>{try{const a=await(await d(`${f}/slug/${s}/related`)).json();Pe(a)}catch(o){console.error("Failed to fetch related posts.",o)}},Ce=document.getElementById("savedPostsContainer");async function Te(s=1,o=6){try{const a=document.querySelectorAll(".search"),e=new URLSearchParams;e.append("page",s),e.append("limit",o),a.forEach(i=>{if(i){const l=i.value.trim();l&&e.append("search",l)}});const t=await d(`${f}/saved/me?${e.toString()}`);if(!t.ok)throw new Error("Failed to fetch");const r=await t.json();w.saved=Array.isArray(r.posts)?r.posts:[],g=r.currentPage||1,L=r.totalPages||1,sessionStorage.setItem("postsPage",g);const n=Ce;if(!n)return;if(w.saved.length===0){n.innerHTML="<p>You have no saved posts yet.</p>";return}n.innerHTML=w.saved.map(i=>`
      <article class="post-card">
        ${i.image?`
          <img 
            src="${V(i.image)}" 
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
            <small>${new Date(i.date).toLocaleDateString()}</small>
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
    `).join(""),document.querySelectorAll(".bookmark").forEach(i=>{i?.addEventListener("click",async l=>{l.stopPropagation();const m=i.dataset.slug;try{await d(`${f}/${m}/unsave`,{method:"POST"}),i.closest(".post-card").remove(),c("Removed from saved posts","success")}catch(v){console.error(v),c("Failed to remove","error")}})}),K("savedPostsContainer",g,L)}catch(a){console.error(a),container.innerHTML="<p>Error loading saved posts.</p>"}}function Ae(){document.getElementById("allPostsContainer")&&C("allPostsContainer"),document.getElementById("featuredPostsContainer")&&C("featuredPostsContainer",3),document.getElementById("myPostsContainer")&&C("myPostsContainer",null,"You haven't made any posts yet...")}document.getElementById("categoryFilter")?.addEventListener("change",()=>H(1));Le.forEach(s=>s?.addEventListener("keyup",()=>H(1)));function K(s,o,a){const e=document.getElementById("pagination");if(e){e.innerHTML="";for(let t=1;t<=a;t++){const r=document.createElement("button");r.textContent=t,r.className=t===o?"pg-active":"",r?.addEventListener("click",()=>{s==="myPostsContainer"?ee(t):s==="savedPostsContainer"?Te(t):H(t)}),e.appendChild(r)}}}const k=document.getElementById("loginForm"),E=document.getElementById("registerForm"),Ue=document.getElementById("logoutBtn");function R(s){return s?{...s,id:s.id||s._id}:null}window.currentUser=(()=>{const s=localStorage.getItem("user");return s?R(JSON.parse(s)):null})();function I(s){s?.id?W.forEach(o=>o.title=`Logged in as ${s.name}`):(W.forEach(o=>o.title="Click to Login/Register"),T?.classList.remove("show"))}async function O(s){try{const o=await d("/api/users/me");if(!o.ok)return;s=await o.json();const a=document.querySelectorAll(".user-icon");a&&a.forEach(t=>{t.src=s.profilePhoto?.trim()?s.profilePhoto:Q});const e=document.querySelectorAll(".avatar");e&&e.forEach(t=>{t.src=s.profilePhoto?.trim()?s.profilePhoto:Q}),window.currentUser=s}catch(o){console.warn("Failed to load auth user:",o)}}function Me(){k?.addEventListener("submit",async s=>{s.preventDefault();const o=document.getElementById("loginEmail").value,a=document.getElementById("loginPassword").value;console.log("Login Triggered");const e=await d(`${U}/login`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({email:o,password:a})}),t=await e.json();console.log("Login response:",t),e.ok||c(`Login failed: ${t.message||"Unknown error"}`,"error");const r=R(t.user);localStorage.setItem("user",JSON.stringify(r)),window.currentUser=r,localStorage.setItem("role",r.role),r.role==="admin"&&(window.location.href="admin.html"),I(r),O(r),authModal.classList.add("hidden"),k.reset(),c(`Welcome back, ${r.name}!`,"success"),Ae()})}function qe(){E?.addEventListener("submit",async s=>{s.preventDefault();const o=document.getElementById("registerName").value,a=document.getElementById("registerEmail").value,e=document.getElementById("registerPassword").value,t=await d(`${U}/register`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({name:o,email:a,password:e})}),r=await t.json();console.log("Register response:",r),t.ok||c(`Registration failed: ${r.message||"Unknown error"}`,"error");const n=R(r.user);localStorage.setItem("user",JSON.stringify(n)),window.currentUser=n,localStorage.setItem("role",n.role),I(n),O(n),authModal.classList.add("hidden"),E.reset(),c(`Welcome, ${n.name}! Your account has been created.`,"success")})}function xe(){Ue?.addEventListener("click",()=>{te(),window.location.href="index.html"})}async function Ke(){try{const s=await d(`${U}/me`);if(!s.ok)throw new Error("Not authenticated");const o=await s.json(),a=R(o);return localStorage.setItem("user",JSON.stringify(a)),window.currentUser=a,I(a),O(a),a}catch{return I(null),O(null),null}}async function te(s=!1){try{await fetch(`${U}/logout`,{method:"POST",credentials:"include"})}catch(o){console.warn("Logout request failed:",o)}localStorage.removeItem("user"),window.currentUser=null,I(null),s||c("You have been logged out.","info")}function Ne(){const s=document.getElementById("forgotPasswordLink"),o=document.getElementById("forgotPasswordModal"),a=document.getElementById("closeForgotModal"),e=document.getElementById("forgotPasswordForm");s&&s?.addEventListener("click",t=>{t.preventDefault(),o.classList.remove("hidden")}),a&&a?.addEventListener("click",()=>{o.classList.add("hidden")}),e&&e?.addEventListener("submit",async t=>{t.preventDefault();const r=document.getElementById("forgotEmail").value.trim();try{const i=await(await fetch("/api/auth/forgot-password",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({email:r})})).json();c(i.message||"Check your email for the reset link.","success"),o.classList.add("hidden")}catch(n){console.error(n),c("Failed to send reset link. Try again.","error")}})}function Qe(){Me(),qe(),xe(),Ne()}async function d(s,o={}){let a=await fetch(s,{credentials:"include",...o});return a.status===401&&(await je()?a=await fetch(s,{credentials:"include",...o}):te(!0)),a}async function je(){try{const s=await fetch(`${U}/refresh`,{method:"POST",credentials:"include"});if(!s.ok)throw new Error("Refresh failed");const o=await s.json();return window.currentUser=o.user,I(o.user),!0}catch{return!1}}export{d as a,W as b,ie as c,ze as d,Je as e,Ke as f,Oe as g,He as h,Qe as i,Re as j,De as k,Fe as l,le as m,We as n,H as o,Ye as p,ee as q,Ae as r,c as s,_e as t,T as u,Ve as v,Te as w,te as x};
