(function(){const s=document.createElement("link").relList;if(s&&s.supports&&s.supports("modulepreload"))return;for(const t of document.querySelectorAll('link[rel="modulepreload"]'))e(t);new MutationObserver(t=>{for(const r of t)if(r.type==="childList")for(const n of r.addedNodes)n.tagName==="LINK"&&n.rel==="modulepreload"&&e(n)}).observe(document,{childList:!0,subtree:!0});function a(t){const r={};return t.integrity&&(r.integrity=t.integrity),t.referrerPolicy&&(r.referrerPolicy=t.referrerPolicy),t.crossOrigin==="use-credentials"?r.credentials="include":t.crossOrigin==="anonymous"?r.credentials="omit":r.credentials="same-origin",r}function e(t){if(t.ep)return;t.ep=!0;const r=a(t);fetch(t.href,r)}})();const f="/api/posts",U="/api/auth",O="/api/comments",G="https://i.postimg.cc/KvF0rh0Q/custom-default-avatar.png",X=document.body,W=document.querySelectorAll(".user-icon"),T=document.getElementById("userMenuDetails"),F=document.getElementById("authModal"),ne=document.getElementById("closeModal"),P=document.getElementById("loginTab"),B=document.getElementById("registerTab"),ae=document.querySelectorAll(".write-post"),re=document.querySelector(".search-icon"),z=document.getElementById("mobileSearch"),ie=document.querySelector(".menu-toggle"),ce=document.getElementById("mobileMenu"),A=document.querySelector(".logo"),le=document.querySelector(".all-posts-btn"),de=document.getElementById("myPosts"),me=document.getElementById("savedPosts"),ue=document.getElementById("profile-edit"),ge=document.getElementById("settings"),x=document.getElementById("themeToggle"),_=document.documentElement;function l(o,s="info",a=5e3){const e=document.getElementById("toast-container");if(!e)return;const t=document.createElement("div");t.className=`toast toast-${s}`;const r=document.createElement("i");s==="success"?r.className="fas fa-check-circle":s==="error"?r.className="fas fa-exclamation-circle":r.className="fas fa-info-circle",t.appendChild(r);const n=document.createElement("span");n.textContent=o,t.appendChild(n),e.appendChild(t),setTimeout(()=>{t.style.animation="slideOut 0.5s forwards",t?.addEventListener("animationend",()=>t.remove())},a)}function fe(){ie?.addEventListener("click",o=>{o.stopPropagation(),T.classList.contains("show")&&T.classList.remove("show"),ce.classList.toggle("active")})}function he(){A?.addEventListener("click",()=>{window.location.href="index.html"}),le?.addEventListener("click",()=>{window.location.href="all-posts.html"}),de?.addEventListener("click",()=>{window.location.href="my-posts.html"}),ue?.addEventListener("click",()=>{window.location.href="dashboard.html"}),me?.addEventListener("click",()=>{window.location.href="saved.html"}),ge?.addEventListener("click",()=>{window.location.href="settings.html"})}function pe(){P?.addEventListener("click",()=>{k.classList.remove("hidden"),E.classList.add("hidden"),P.classList.add("active"),B.classList.remove("active")}),B?.addEventListener("click",()=>{E.classList.remove("hidden"),k.classList.add("hidden"),B.classList.add("active"),P.classList.remove("active")}),ne?.addEventListener("click",()=>{F.classList.add("hidden")})}function ye(){W.forEach(o=>o?.addEventListener("click",()=>{const s=localStorage.getItem("user"),a=s?JSON.parse(s):null;a&&a.id?(T.classList.toggle("show"),F.classList.add("hidden")):(T.classList.add("hidden"),F.classList.remove("hidden"),P.classList.add("active"),B.classList.remove("active"),k.classList.remove("hidden"),E.classList.add("hidden"),k?.reset(),E?.reset())}))}function we(){re?.addEventListener("click",()=>{z.classList.toggle("show"),z.classList.contains("show")&&z.querySelector("input").focus()})}function ve(){ae.forEach(o=>{o?.addEventListener("click",s=>{const a=localStorage.getItem("user"),e=a?JSON.parse(a):null;!e||!e.id?(s.preventDefault(),F.classList.remove("hidden"),P.classList.add("active"),B.classList.remove("active"),k.classList.remove("hidden"),E.classList.add("hidden")):(localStorage.removeItem("editSlug"),window.location.href="write.html")})})}function ke(){x?.addEventListener("change",()=>{x.checked?(_.setAttribute("data-theme","dark"),localStorage.setItem("theme","dark"),A.src="/Images/logo-dark-theme_optimized_.png"):(_.setAttribute("data-theme","light"),localStorage.setItem("theme","light"),A.src="/Images/logo_optimized.png")})}function xe(){localStorage.getItem("theme")==="dark"?(_.setAttribute("data-theme","dark"),x&&(x.checked=!0)):_.setAttribute("data-theme","light")}function _e(o){o==="dark"?(X.classList.add("dark"),A.src="/Images/logo-dark-theme_optimized_.png"):(X.classList.remove("dark"),A.src="/Images/logo_optimized.png"),localStorage.setItem("theme",o)}function De(){fe(),pe(),ye(),we(),ve(),he(),ke()}async function Oe(o){const s=o.dataset.postId;if(!s)return;const a=window.location.pathname.endsWith("post.html"),e=a?document.getElementById("singlePostContainer"):o.closest(".post");if(!e)return;const t=e.querySelector(".comments-section"),r=t?.querySelector(".comments-list");!t||!r||(a||t.classList.toggle("show"),(a||t.classList.contains("show"))&&await Z(s,r))}async function He(o){if(o.dataset.deleting==="true")return;o.dataset.deleting="true";const s=o.dataset.commentId;if(!confirm("Are you sure you want to delete this comment?")){o.dataset.deleting="false";return}try{const e=await d(`${O}/${s}`,{method:"DELETE"}),t=await e.json();if(e.ok){const r=o.closest(".comment");r&&r.remove();const i=(window.location.pathname.endsWith("post.html")?document.getElementById("singlePostContainer"):o.closest(".post"))?.querySelector(".comment-count");if(i){let c=parseInt(i.textContent)||0;c=Math.max(c-1,0),i.textContent=c,i.title=`${c} comment${c!==1?"s":""}`}l("Comment deleted successfully!","success")}else throw new Error(t.message||"Delete failed")}catch(e){console.error("Error deleting comment:",e),l("Error deleting comment. Please try again.","error")}finally{o.dataset.deleting="false"}}async function Z(o,s,a=3){try{s.innerHTML='<p class="loading-comments">Loading comments...</p>';const e=await d(`${O}/post/${o}?_=${Date.now()}`);if(!e.ok)throw new Error("Failed to fetch comments");const t=await e.json();if(s.innerHTML="",t.length===0){s.innerHTML="<p class='no-comments'>No comments yet. Be the first to comment!</p>";return}const r=t.slice(0,a);if(J(r,s),t.length>a){const n=document.createElement("button");n.classList.add("view-more-btn"),n.textContent=`View all ${t.length} comments`;const i=document.createElement("div");i.classList.add("comments-scroll-container"),i.style.display="none",J(t,i);let c=!1;n?.addEventListener("click",()=>{c=!c,c?(s.innerHTML="",s.appendChild(i),s.appendChild(n),i.style.display="block",n.textContent="View less comments"):(s.innerHTML="",J(r,s),n.textContent=`View all ${t.length} comments`,s.appendChild(n))}),s.appendChild(n)}}catch(e){console.error("Error fetching comments:",e),s.innerHTML="<p class='error-comments'>Failed to load comments.</p>"}}function J(o,s){const a=window.currentUser?.id||window.currentUser?._id;o.forEach(e=>{const t=document.createElement("div");t.classList.add("comment");const r=typeof e.authorId=="object"?e.authorId._id:e.authorId,n=a&&r&&r.toString()===a.toString();t.innerHTML=`
      <div class="comment-header">
        <p><strong class="comment-author" style="cursor: pointer;">${e.authorId?.name||"Anonymous"}:</strong> ${K(e.text)}</p>
        ${n?`<div class="comment-menu">
                  <button class="menu-btn">⋮</button>
                  <div class="menu-options hidden">
                    <button class="delete-comment-btn" data-comment-id="${e._id}">Delete</button>
                  </div>
                </div>`:""}
      </div>  
      <small>${new Date(e.createdAt).toLocaleString()}</small>
    `,s.appendChild(t),t.querySelector(".comment-author")?.addEventListener("click",()=>{window.location.href=`profile.html?id=${e.authorId?._id}`})})}async function Ee(o,s,a,e){try{const t=await d(`${O}/post/${o}`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({text:s})});if(t.ok){const n=(await t.json()).comment,i=document.createElement("div");i.classList.add("comment"),i.innerHTML=`
        <div class="comment-header">
          <p><strong>You:</strong> ${K(n.text)}</p>
          <div class="comment-menu">
            <button class="menu-btn">⋮</button>
            <div class="menu-options hidden">
              <button class="delete-comment-btn" data-comment-id="${n._id}">Delete</button>
            </div>
          </div>
        </div>
        <small>${new Date(n.createdAt).toLocaleString()}</small>
      `,a.prepend(i),e&&await V(o,e),l("Comment posted successfully!","success")}else throw new Error("Failed to post comment")}catch(t){console.error("Error posting comment:",t),l("Failed to post comment","error")}}async function V(o,s){try{const a=await d(`${O}/post/${o}`);if(!a.ok)throw new Error("Failed to fetch comment count");const t=(await a.json()).length;t===0?(s.textContent="0",s.title="No comments yet"):(s.textContent=t,s.title=`${t} comment${t>1?"s":""}`)}catch(a){console.error("Error fetching comment count:",a),s.textContent="0"}}async function be(o){const s=o.target.closest(".comment-form");if(!s)return;o.preventDefault();const a=s.querySelector(".comment-input"),e=a.value.trim();if(!e)return;let t,r,n,i;if(window.location.pathname.endsWith("post.html")?(t=document.getElementById("singlePostContainer"),r=t.querySelector(".comments-list"),n=t.querySelector(".comment-btn").dataset.postId,i=t.querySelector(".comment-count")):(t=s.closest(".post"),r=t.querySelector(".comments-list"),n=t.querySelector(".like-btn").dataset.postId,i=t.querySelector(".comment-count")),!window.currentUser){l("Please log in to comment.","error"),a.value="";return}await Ee(n,e,r,i),a.value=""}function Re(){document.addEventListener("submit",be)}const Le=document.querySelectorAll(".search");let w={all:[],mine:[],saved:[]},L=1,g=Number(sessionStorage.getItem("postsPage"))||1;sessionStorage.getItem("postsCategory");sessionStorage.getItem("postsSearch");function Y(o){return o&&o.startsWith("http")?o:"/Images/fallback.jpg"}function Ie(o){o.innerHTML=`<p style="text-align:center; color:gray; font-size: 20px; font-weight: bold;">You haven't made any posts yet...</p>`}async function H(o=1,s=6){try{const a=document.getElementById("categoryFilter")?.value,e=document.querySelectorAll(".search"),t=new URLSearchParams;t.append("page",o),t.append("limit",s),a&&a!=="all"&&t.append("category",a),e.forEach(c=>{if(c){const m=c.value.trim();m&&t.append("search",m)}});const n=await(await d(`${f}?${t.toString()}`)).json();w.all=Array.isArray(n.posts)?n.posts:[],g=n.currentPage??1,L=n.totalPages??1,sessionStorage.setItem("postsPage",g),sessionStorage.setItem("postsCategory",a&&a!=="all"?a:"");const i=[...e].find(c=>c.value.trim())?.value.trim()||"";sessionStorage.setItem("postsSearch",i),C("allPostsContainer"),Q("allPostsContainer",g,L)}catch(a){console.error("Error fetching posts:",a),l("Something went wrong while displaying posts!","error")}}async function ee(o=1,s=6){try{const a=document.querySelectorAll(".search"),e=new URLSearchParams;e.append("page",o),e.append("limit",s),a.forEach(c=>{if(c){const m=c.value.trim();m&&e.append("search",m)}});const t=await d(`${f}/mine?${e.toString()}`);if(!t.ok){const c=await t.text();throw new Error(c||"Failed to fetch your posts")}const r=await t.json();w.mine=Array.isArray(r.posts)?r.posts:[],g=r.currentPage||1,L=r.totalPages||1,sessionStorage.setItem("postsPage",g);const n=[...a].find(c=>c.value.trim())?.value.trim()||"";sessionStorage.setItem("postsSearch",n);const i="myPostsContainer";if(C("myPostsContainer",null,"You haven't made any posts yet..."),Q(i,g,L),w.mine.length===0){const c=document.getElementById("myPostsContainer");c&&Ie(c)}}catch(a){console.error("Error fetching my posts:",a),l("Failed to load your posts!","error")}}function K(o){return o.replace(/\n/g,"<br>")}function C(o,s=null,a=null){const e=window.currentUser?._id||window.currentUser?.id,t=document.getElementById(o);if(!t)return;t.innerHTML="";let r=[];if(o==="allPostsContainer"||o==="featuredPostsContainer"?r=[...w.all]:o==="myPostsContainer"?r=[...w.mine]:o==="savedPostsContainer"&&(r=[...w.saved]),s&&(r=r.slice(0,s)),r.length===0){t.innerHTML=a??'<p style="text-align:center; color:gray; font-size:20px;">No results found...</p>';return}r.forEach(n=>{const i=document.createElement("div");i.classList.add("post");const c=n.content.length>150?n.content.substring(0,150)+"...":n.content,m=typeof n.authorId=="object"&&n.authorId!==null?n.authorId._id:n.authorId,v=typeof n.authorId=="object"&&n.authorId!==null?n.authorId.name:n.authorName||"Unknown",M=e&&String(m)===String(e);i.innerHTML=`
      ${n.image?`<a href="post.html?slug=${n.slug}">
             <img src="${Y(n.image)}" alt="${n.title}" class="post-image" loading="lazy">
           </a>`:""}
        <p class="tag">${n.category}</p>
        <h2>
          <a href="post.html?slug=${n.slug}" class="post-link">${n.title}</a>
        </h2>
        <p>${c} <a href="post.html?slug=${n.slug}" class="read-more">Read more</a></p>
        <a href="profile.html?id=${m}" class="author"><em>By ${v}</em></a>
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
        ${M?`
        <div class="post-actions">
            <button class="edit-btn btn" data-slug="${n.slug}">Edit</button>
            <button class="delete-btn btn" data-slug="${n.slug}">Delete</button>
        </div>
        `:""}
    `,t.appendChild(i);const h=i.querySelector(".post-image");h&&(h.onerror=function(){this.onerror=null,this.src="/Images/fallback.jpg"});const S=i.querySelector(".like-btn"),q=S.querySelector("i"),p=i.querySelector(".liked-by");p.dataset.postId=n._id,p.dataset.likedBy=JSON.stringify(n.likedBy||[]),n.likedBy&&n.likedBy.length>0?p.classList.remove("disabled"):p.classList.add("disabled");const N=Array.isArray(n.likes)?n.likes.map($=>typeof $=="object"?$._id:$):[];e&&(N.includes(e)||n.likedByUser)?(S.classList.add("liked"),q.className="fa-solid fa-heart"):(S.classList.remove("liked"),q.className="fa-regular fa-heart"),!n.likedBy||n.likedBy.length===0?p.textContent="No likes yet":n.likedBy.length===1?p.textContent=`Liked by ${n.likedBy[0]}`:p.textContent=`Liked by ${n.likedBy[0]} and ${n.likedBy.length-1} others`;const y=i.querySelector(".comment-count");V(n._id,y)})}async function Se(o,s,a,e){const t=new FormData;t.append("title",o),t.append("content",s),t.append("category",a),e&&t.append("image",e);const r=await d(`${f}`,{method:"POST",body:t});if(!r.ok)throw new Error("Failed to add post");return await r.json()}async function ze(o){if(confirm("Are you sure you want to delete this post?"))try{const s=await d(`${f}/${o}`,{method:"DELETE"});if(!s.ok){const a=await s.text();throw new Error(a||"Failed to delete post")}l("Post deleted successfully!","success"),window.location.pathname.endsWith("my-posts.html")?ee(g):H(g)}catch(s){console.error("Error deleting post:",s),l("Failed to delete post!","error")}}function Je(o){o&&(localStorage.setItem("editSlug",o),window.location.href="write.html")}function We(){const o=document.getElementById("postForm"),s=document.querySelector(".add-post-btn");if(!o)return;const a=localStorage.getItem("editSlug"),e=t=>{s.disabled=t,s.innerHTML=t?'<i class="fa-solid fa-spinner fa-spin"></i> Posting...':a?"Update Post":"Add Post"};a&&a!=="null"?((async()=>{try{const t=await d(`${f}/${a}`);if(!t.ok)throw new Error("Post not found");const r=await t.json();if(document.getElementById("title").value=r.title||"",document.getElementById("content").value=r.content||"",document.getElementById("category").value=r.category||"",r.image){const n=document.getElementById("imagePreview");n.src=r.image,n.style.display="block"}}catch(t){console.error("Error loading post:",t)}})(),o.onsubmit=async function(t){t.preventDefault();const r=new FormData;r.append("title",document.getElementById("title").value),r.append("content",document.getElementById("content").value),r.append("category",document.getElementById("category").value);const n=document.getElementById("image").files[0];n&&r.append("image",n);try{e(!0);const i=await d(`${f}/${a}`,{method:"PUT",body:r});i.ok?(l("Post updated successfully!","success"),localStorage.removeItem("editSlug"),window.location.href="all-posts.html"):console.error("Update failed:",await i.text())}catch(i){console.error("Error updating post:",i),l("Failed to update post!","error")}finally{e(!1)}}):(localStorage.removeItem("editSlug"),o?.addEventListener("submit",async function(t){t.preventDefault();const r=document.getElementById("title").value,n=document.getElementById("content").value,i=document.getElementById("category").value,c=document.getElementById("image").files[0];console.log("Submitting new post:",{title:r,content:n,category:i,imageFile:c});try{e(!0);const m=await Se(r,n,i,c);console.log("Post created successfully!",m),l("Post created successfully!","success"),o.reset(),window.location.href="all-posts.html",localStorage.removeItem("editSlug")}catch(m){console.error("Error adding post:",m),l("Failed to add post!","error")}finally{e(!1)}}))}function $e(o){const s=document.getElementById("post-jsonld");s&&s.remove();const a={"@context":"https://schema.org","@type":"Article",headline:o.title,description:o.content.slice(0,160),image:o.image?[o.image]:[],author:{"@type":"Person",name:o.authorName||"BuzzInk Contributor"},publisher:{"@type":"Organization",name:"BuzzInk",logo:{"@type":"ImageObject",url:"https://buzzink.onrender.com/Images/logo_optimized.png"}},datePublished:o.createdAt||o.date,dateModified:o.updatedAt||o.date,mainEntityOfPage:{"@type":"WebPage","@id":window.location.href}},e=document.createElement("script");e.type="application/ld+json",e.id="post-jsonld",e.textContent=JSON.stringify(a),document.head.appendChild(e)}async function Ve(){const s=new URLSearchParams(window.location.search).get("slug");if(s){try{let $=function(u){y.dataset.saved=u?"true":"false",y.classList.toggle("saved",u);const b=y.querySelector("i");b.classList.toggle("fa-solid",u),b.classList.toggle("fa-regular",!u)};const a=await d(`${f}/${s}`);if(!a.ok)throw new Error("Failed to fetch post");const e=await a.json(),t=window.currentUser?._id||window.currentUser?.id,r=typeof e.authorId=="object"&&e.authorId!==null?e.authorId._id:e.authorId,n=typeof e.authorId=="object"&&e.authorId!==null?e.authorId.name:e.authorName||"Unknown",i=t&&String(r)===String(t),c=document.getElementById("singlePostContainer");c.innerHTML=`
      ${e.image?`<img src="${Y(e.image)}" alt="${e.title}" class="post-image" loading="lazy">`:""}
      <h1>${e.title}</h1>
      <p class="tag">${e.category}</p>
      <p onclick="window.location.href='profile.html?id=${r}'" style="cursor: pointer;" class="author"><em>By ${n}</em></p>
      <small>${new Date(e.date).toLocaleString()}</small>
      <div class="content">
        <p>${K(e.content)}</p>
      </div>
      <div class="post-interactions-container">
        <div class="post-interactions">
          <button class="like-btn ${e.likedByUser?"liked":""}" data-post-id="${e._id}">
            <i class="${e.likedByUser?"fa-solid":"fa-regular"} fa-heart"></i>
            <span class="like-count">${e.likesCount||0}</span>
          </button>
          <button class="comment-btn" data-post-id="${e._id}">
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
      <div id="likesModal-${e._id}" class="likes-modal hidden slide-up">
        <div class="likes-modal-content">
          <span id="closeLikesModal-${e._id}" class="close-btn">&times;</span>
          <h3>Liked by</h3>
          <ul id="likesList-${e._id}" class="likes-list"></ul>            
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
    `;const m=c.querySelector(".post-image");m&&(m.onerror=function(){this.onerror=null,this.src="/Images/fallback.jpg"});const v=c?.querySelector(".like-btn"),M=v?.querySelector("i"),h=c?.querySelector(".liked-by");h.dataset.postId=e._id,h.dataset.likedBy=JSON.stringify(e.likedBy||[]),e.likedBy&&e.likedBy.length>0?h.classList.remove("disabled"):h.classList.add("disabled");const S=Array.isArray(e.likes)?e.likes.map(u=>typeof u=="object"?u._id:u):[];t&&(S.includes(t)||e.likedByUser)?(v.classList.add("liked"),M.className="fa-solid fa-heart"):(v.classList.remove("liked"),M.className="fa-regular fa-heart"),!e.likedBy||e.likedBy.length===0?h.textContent="No likes yet":e.likedBy.length===1?h.textContent=`Liked by ${e.likedBy[0]}`:h.textContent=`Liked by ${e.likedBy[0]} and ${e.likedBy.length-1} others`;const q=c.querySelector(".comment-count");V(e._id,q);const p=document.querySelector(".comments-section"),N=p.querySelector(".comments-list");p&&N&&await Z(e._id,N,1/0);const y=c.querySelector(".bookmark");y?.addEventListener("click",async()=>{const u=y.dataset.slug,b=y.dataset.saved==="true";if(!window.currentUser){l("Please log in to save posts");return}y.classList.add("clicked"),setTimeout(()=>y.classList.remove("clicked"),200);const oe=b?`/api/posts/${u}/unsave`:`/api/posts/${u}/save`;try{const j=await d(oe,{method:"POST"}),se=await j.json();if(!j.ok)throw new Error(se.message||"Failed to toggle bookmark");$(!b),l(b?"Removed from saved posts":"Post saved","success")}catch(j){console.error("Failed to toggle bookmark",j),l("Something went wrong","error")}}),$e(e)}catch(a){console.error(a),document.getElementById("singlePostContainer").innerHTML="<p>Error loading post.</p>"}Be(s)}}const Ye=async()=>{const s=await(await d(`${f}/trending?limit=5`)).json(),a=document.getElementById("trending-list");a.innerHTML=s.map((e,t)=>`
    <li>
      <span class="trending-rank">${["🥇","🥈","🥉"][t]||`#${t+1}`}</span>
      <a href="post.html?slug=${e.slug}" class="trending-title">${e.title}</a>
      <i class="fa-solid fa-bolt trending-icon" title="Trending now"></i>
    </li>
  `).join("")};function Pe(o){const s=document.getElementById("related-posts-container");if(!o.length){s.innerHTML="<p style='margin: 0 5px;'>No related posts found.</p>";return}s.innerHTML=o.map(a=>`
      <article class="related-post-card">
        <h4><a href="post.html?slug=${a.slug}">${a.title}</a></h4>
        <small>${a.category}</small>
      </article>
    `).join("")}const Be=async o=>{try{const a=await(await d(`${f}/slug/${o}/related`)).json();Pe(a)}catch(s){console.error("Failed to fetch related posts.",s)}},Ce=document.getElementById("savedPostsContainer");async function Te(o=1,s=6){try{const a=document.querySelectorAll(".search"),e=new URLSearchParams;e.append("page",o),e.append("limit",s),a.forEach(i=>{if(i){const c=i.value.trim();c&&e.append("search",c)}});const t=await d(`${f}/saved/me?${e.toString()}`);if(!t.ok)throw new Error("Failed to fetch");const r=await t.json();w.saved=Array.isArray(r.posts)?r.posts:[],g=r.currentPage||1,L=r.totalPages||1,sessionStorage.setItem("postsPage",g);const n=Ce;if(!n)return;if(w.saved.length===0){n.innerHTML="<p>You have no saved posts yet.</p>";return}n.innerHTML=w.saved.map(i=>`
      <article class="post-card">
        ${i.image?`
          <img 
            src="${Y(i.image)}" 
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
    `).join(""),document.querySelectorAll(".bookmark").forEach(i=>{i?.addEventListener("click",async c=>{c.stopPropagation();const m=i.dataset.slug;try{await d(`${f}/${m}/unsave`,{method:"POST"}),i.closest(".post-card").remove(),l("Removed from saved posts","success")}catch(v){console.error(v),l("Failed to remove","error")}})}),Q("savedPostsContainer",g,L)}catch(a){console.error(a),container.innerHTML="<p>Error loading saved posts.</p>"}}function Ae(){document.getElementById("allPostsContainer")&&C("allPostsContainer"),document.getElementById("featuredPostsContainer")&&C("featuredPostsContainer",3),document.getElementById("myPostsContainer")&&C("myPostsContainer",null,"You haven't made any posts yet...")}document.getElementById("categoryFilter")?.addEventListener("change",()=>H(1));Le.forEach(o=>o?.addEventListener("keyup",()=>H(1)));function Q(o,s,a){const e=document.getElementById("pagination");if(e){e.innerHTML="";for(let t=1;t<=a;t++){const r=document.createElement("button");r.textContent=t,r.className=t===s?"pg-active":"",r?.addEventListener("click",()=>{o==="myPostsContainer"?ee(t):o==="savedPostsContainer"?Te(t):H(t)}),e.appendChild(r)}}}const k=document.getElementById("loginForm"),E=document.getElementById("registerForm"),Ue=document.getElementById("logoutBtn");function R(o){return o?{...o,id:o.id||o._id}:null}window.currentUser=(()=>{const o=localStorage.getItem("user");return o?R(JSON.parse(o)):null})();function I(o){o?.id?W.forEach(s=>s.title=`Logged in as ${o.name}`):(W.forEach(s=>s.title="Click to Login/Register"),T?.classList.remove("show"))}async function D(o){try{const s=await d("/api/users/me");if(!s.ok)return;o=await s.json();const a=document.querySelectorAll(".user-icon");a&&a.forEach(t=>{t.src=o.profilePhoto?.trim()?o.profilePhoto:G});const e=document.querySelectorAll(".avatar");e&&e.forEach(t=>{t.src=o.profilePhoto?.trim()?o.profilePhoto:G}),window.currentUser=o}catch(s){console.warn("Failed to load auth user:",s)}}function Me(){k?.addEventListener("submit",async o=>{o.preventDefault();const s=document.getElementById("loginEmail").value,a=document.getElementById("loginPassword").value;console.log("Login Triggered");const e=await d(`${U}/login`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({email:s,password:a})}),t=await e.json();console.log("Login response:",t),e.ok||l(`Login failed: ${t.message||"Unknown error"}`,"error");const r=R(t.user);localStorage.setItem("user",JSON.stringify(r)),window.currentUser=r,localStorage.setItem("role",r.role),r.role==="admin"&&(window.location.href="admin.html"),I(r),D(r),authModal.classList.add("hidden"),k.reset(),l(`Welcome back, ${r.name}!`,"success"),Ae()})}function qe(){E?.addEventListener("submit",async o=>{o.preventDefault();const s=document.getElementById("registerName").value,a=document.getElementById("registerEmail").value,e=document.getElementById("registerPassword").value,t=await d(`${U}/register`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({name:s,email:a,password:e})}),r=await t.json();console.log("Register response:",r),t.ok||l(`Registration failed: ${r.message||"Unknown error"}`,"error");const n=R(r.user);localStorage.setItem("user",JSON.stringify(n)),window.currentUser=n,localStorage.setItem("role",n.role),I(n),D(n),authModal.classList.add("hidden"),E.reset(),l(`Welcome, ${n.name}! Your account has been created.`,"success")})}function Ne(){Ue?.addEventListener("click",()=>{te(),window.location.href="index.html"})}async function Ke(){try{const o=await d(`${U}/me`);if(!o.ok)throw new Error("Not authenticated");const s=await o.json(),a=R(s);return localStorage.setItem("user",JSON.stringify(a)),window.currentUser=a,I(a),D(a),a}catch{return I(null),D(null),null}}async function te(o=!1){try{await fetch(`${U}/logout`,{method:"POST",credentials:"include"})}catch(s){console.warn("Logout request failed:",s)}localStorage.removeItem("user"),window.currentUser=null,I(null),o||l("You have been logged out.","info")}function je(){const o=document.getElementById("forgotPasswordLink"),s=document.getElementById("forgotPasswordModal"),a=document.getElementById("closeForgotModal"),e=document.getElementById("forgotPasswordForm");o&&o?.addEventListener("click",t=>{t.preventDefault(),s.classList.remove("hidden")}),a&&a?.addEventListener("click",()=>{s.classList.add("hidden")}),e&&e?.addEventListener("submit",async t=>{t.preventDefault();const r=document.getElementById("forgotEmail").value.trim();try{const i=await(await fetch("/api/auth/forgot-password",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({email:r})})).json();l(i.message||"Check your email for the reset link.","success"),s.classList.add("hidden")}catch(n){console.error(n),l("Failed to send reset link. Try again.","error")}})}function Qe(){Me(),qe(),Ne(),je()}async function d(o,s={}){let a=await fetch(o,{credentials:"include",...s});return a.status===401&&(await Fe()?a=await fetch(o,{credentials:"include",...s}):te(!0)),a}async function Fe(){try{const o=await fetch(`${U}/refresh`,{method:"POST",credentials:"include"});if(!o.ok)throw new Error("Refresh failed");const s=await o.json();return window.currentUser=s.user,I(s.user),!0}catch{return!1}}export{d as a,W as b,ie as c,ze as d,Je as e,Ke as f,De as g,He as h,Qe as i,Re as j,_e as k,xe as l,ce as m,We as n,H as o,Ye as p,ee as q,Ae as r,l as s,Oe as t,T as u,Ve as v,Te as w,te as x};
