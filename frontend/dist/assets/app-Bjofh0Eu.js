import{a as u,C as F,s as d,A as y,u as D,b as ie,m as H,c as le,d as ce,i as de,e as X,l as me,f as Z}from"./api-Cle1m952.js";async function ue(t){const o=t.dataset.slug;if(!o)return;const a=window.location.pathname.endsWith("post.html"),e=a?document.getElementById("singlePostContainer"):t.closest(".post");if(!e)return;const n=e.querySelector(".comments-section"),s=n?.querySelector(".comments-list");!n||!s||(a||n.classList.toggle("show"),(a||n.classList.contains("show"))&&await ee(o,s))}async function ge(t){if(t.dataset.deleting==="true")return;t.dataset.deleting="true";const o=t.dataset.commentId;if(!confirm("Are you sure you want to delete this comment?")){t.dataset.deleting="false";return}try{const e=await u(`${F}/${o}`,{method:"DELETE"}),n=await e.json();if(e.ok){const s=t.closest(".comment");s&&s.remove();const i=(window.location.pathname.endsWith("post.html")?document.getElementById("singlePostContainer"):t.closest(".post"))?.querySelector(".comment-count");if(i){let l=parseInt(i.textContent)||0;l=Math.max(l-1,0),i.textContent=l,i.title=`${l} comment${l!==1?"s":""}`}d("Comment deleted successfully!","success")}else throw new Error(n.message||"Delete failed")}catch(e){console.error("Error deleting comment:",e),d("Error deleting comment. Please try again.","error")}finally{t.dataset.deleting="false"}}async function ee(t,o,a=3){try{o.innerHTML='<p class="loading-comments">Loading comments...</p>';const e=await u(`${F}/post/${t}?_=${Date.now()}`);if(!e.ok)throw new Error("Failed to fetch comments");const n=await e.json();if(o.innerHTML="",n.length===0){o.innerHTML="<p class='no-comments'>No comments yet. Be the first to comment!</p>";return}const s=n.slice(0,a);if(j(s,o),n.length>a){const r=document.createElement("button");r.classList.add("view-more-btn"),r.textContent=`View all ${n.length} comments`;const i=document.createElement("div");i.classList.add("comments-scroll-container"),i.style.display="none",j(n,i);let l=!1;r?.addEventListener("click",()=>{l=!l,l?(o.innerHTML="",o.appendChild(i),o.appendChild(r),i.style.display="block",r.textContent="View less comments"):(o.innerHTML="",j(s,o),r.textContent=`View all ${n.length} comments`,o.appendChild(r))}),o.appendChild(r)}}catch(e){console.error("Error fetching comments:",e),o.innerHTML="<p class='error-comments'>Failed to load comments.</p>"}}function j(t,o){const a=window.currentUser?.id||window.currentUser?._id;t.forEach(e=>{const n=document.createElement("div");n.classList.add("comment");const s=typeof e.authorId=="object"?e.authorId._id:e.authorId,r=a&&s&&s.toString()===a.toString();n.innerHTML=`
      <div class="comment-header">
        <p><strong class="comment-author" style="cursor: pointer;">${e.authorId?.name||"Anonymous"}:</strong> ${J(e.text)}</p>
        ${r?`<div class="comment-menu">
                  <button class="menu-btn">⋮</button>
                  <div class="menu-options hidden">
                    <button class="delete-comment-btn" data-comment-id="${e._id}">Delete</button>
                  </div>
                </div>`:""}
      </div>  
      <small title="${new Date(e.createdAt).toLocaleString()}">
        ${C(e.createdAt)}
      </small>
    `,o.appendChild(n),n.querySelector(".comment-author")?.addEventListener("click",()=>{window.location.href=`profile.html?id=${e.authorId?._id}`})})}async function fe(t,o,a,e){try{const n=await u(`${F}/post/${t}`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({text:o})});if(n.ok){const r=(await n.json()).comment,i=document.createElement("div");if(i.classList.add("comment"),i.innerHTML=`
        <div class="comment-header">
          <p><strong>You:</strong> ${J(r.text)}</p>
          <div class="comment-menu">
            <button class="menu-btn">⋮</button>
            <div class="menu-options hidden">
              <button class="delete-comment-btn" data-comment-id="${r._id}">Delete</button>
            </div>
          </div>
        </div>
        <small title="${new Date(r.createdAt).toLocaleString()}">
        ${C(r.createdAt)}
      </small>
      `,a.prepend(i),e&&e){let l=parseInt(e.textContent)||0;e.textContent=l+1,e.title=`${l+1} comments`}d("Comment posted successfully!","success")}else throw new Error("Failed to post comment")}catch(n){console.error("Error posting comment:",n),d("Failed to post comment","error")}}async function te(t,o){try{const a=await u(`${F}/post/${t}`);if(!a.ok)throw new Error("Failed to fetch comment count");const n=(await a.json()).length;n===0?(o.textContent="0",o.title="No comments yet"):(o.textContent=n,o.title=`${n} comment${n>1?"s":""}`)}catch(a){console.error("Error fetching comment count:",a),o.textContent="0"}}async function he(t){const o=t.target.closest(".comment-form"),a=o.querySelector(".comment-form button");if(!o)return;t.preventDefault();const e=o.querySelector(".comment-input"),n=e.value.trim();if(!n)return;let s,r,i,l;window.location.pathname.endsWith("post.html")?(s=document.getElementById("singlePostContainer"),r=s.querySelector(".comments-list"),i=s.querySelector(".comment-btn").dataset.slug,l=s.querySelector(".comment-count")):(s=o.closest(".post"),r=s.querySelector(".comments-list"),i=s.querySelector(".like-btn").dataset.slug,l=s.querySelector(".comment-count"));const c=h=>{a.disabled=h,a.innerHTML=h?'<i class="fa-solid fa-spinner fa-spin"></i>':"Comment"};try{if(c(!0),!window.currentUser){d("Please log in to comment.","error"),e.value="",c(!1);return}await fe(i,n,r,l),e.value=""}catch{c(!1)}finally{c(!1)}}function pe(){document.addEventListener("submit",he)}const O=document.querySelectorAll(".search");function W(){return[...O].find(t=>t.value.trim())?.value.trim()||""}let p={all:[],featured:[],mine:[],saved:[]},b=1,m=Number(sessionStorage.getItem("postsPage"))||1,$=sessionStorage.getItem("postsCategory")||"",L=sessionStorage.getItem("postsSearch")||"";function _(t){return t&&t.startsWith("http")?t:"/Images/fallback.jpg"}let ye,N;function U(t="allPostsContainer",o=6){clearTimeout(ye);const a=document.getElementById(t);if(!a)return;let e=a.previousElementSibling?.classList.contains("posts-skeleton")?a.previousElementSibling:null;e||(e=document.createElement("div"),e.className="posts-skeleton",a.before(e)),e.innerHTML="",e.classList.remove("hidden");for(let n=0;n<o;n++){let s="";t==="savedPostsContainer"?s=`
        <article class="post-card skeleton">
          <div class="skeleton-img"></div>
          <div class="post-body">
            <div class="skeleton-title"></div>
            <div class="skeleton-tag"></div>
            <div class="skeleton-excerpt"></div>
            <div class="post-meta">
              <div class="skeleton-meta-line"></div>
            </div>
          </div>
          <div class="skeleton-bookmark"></div>
        </article>
      `:s=`
        <div class="post skeleton">
          <div class="skeleton-img"></div>
          <p class="skeleton-tag"></p>
          <h2 class="skeleton-title"></h2>
          <p class="skeleton-excerpt"></p>
          <a href="#" class="skeleton-author"></a>
          <small class="skeleton-date"></small>
          <div class="post-interactions-container">
            <div class="post-interactions">
              <button class="skeleton-btn like-btn"></button>
              <button class="skeleton-btn comment-btn"></button>
              <button class="skeleton-btn share-btn"></button>
            </div>
            <span class="liked-by likes-info skeleton"></span>
          </div>
          <div class="comments-section skeleton"></div>
          <div class="post-actions skeleton"></div>
        </div>
      `,e.insertAdjacentHTML("beforeend",s)}}function q(){document.querySelectorAll(".posts-skeleton").forEach(t=>t.classList.add("hidden"))}function z(){clearTimeout(N),N=setTimeout(()=>{document.getElementById("postsLoader")?.classList.remove("hidden")},150)}function V(){clearTimeout(N),document.getElementById("postsLoader")?.classList.add("hidden")}function P(){const t=new URLSearchParams(window.location.search);return{page:Number(t.get("page"))||1,category:t.get("category")||"",search:t.get("search")||""}}function E({page:t,category:o,search:a}){const e=new URL(window.location);t===1?e.searchParams.delete("page"):e.searchParams.set("page",t),o?e.searchParams.set("category",o):e.searchParams.delete("category"),a?e.searchParams.set("search",a):e.searchParams.delete("search"),window.history.pushState({},"",e)}async function M(){const t=sessionStorage.getItem("postsCategory"),o=sessionStorage.getItem("postsSearch"),a=document.getElementById("categoryFilter");a&&t&&(a.value=t),O.forEach(e=>{e.value=o||""})}async function I(t,o=6){try{const a=P(),e=t??a.page,n=document.getElementById("categoryFilter")?.value||a.category,s=W()||a.search,r=new URLSearchParams;r.append("page",e),r.append("limit",o),n&&n!=="all"&&r.append("category",n),s&&r.append("search",s),e===1?U("allPostsContainer",o):z();const l=await(await u(`${y}?${r.toString()}`)).json();p.all=Array.isArray(l.posts)?l.posts:[],m=l.currentPage??1,b=l.totalPages??1,$=n||"",L=s||"",E({page:m,category:n&&n!=="all"?n:"",search:s}),typeof m<"u"&&sessionStorage.setItem("postsPage",m),typeof $<"u"&&sessionStorage.setItem("postsCategory",$),sessionStorage.setItem("postsSearch",L),Y("allPostsContainer"),x("allPostsContainer",m,b)}catch(a){console.error("Error fetching posts:",a),d("Something went wrong while displaying posts!","error")}finally{q(),V()}}async function ve(t=3){try{U("featuredPostsContainer",t);const a=await(await u(`${y}?page=1&limit=${t}`)).json();p.featured=Array.isArray(a.posts)?a.posts:[],Y("featuredPostsContainer",t)}catch(o){console.error("Failed to load featured posts",o)}finally{q()}}async function se(t,o=6){try{const a=P(),e=t??a.page,n=W()||a.search;a.search;const s=new URLSearchParams;s.append("page",e),s.append("limit",o),n&&s.append("search",n),e===1?U("myPostsContainer",o):z();const r=await u(`${y}/mine?${s.toString()}`);if(!r.ok){const c=await r.text();throw new Error(c||"Failed to fetch your posts")}const i=await r.json();p.mine=Array.isArray(i.posts)?i.posts:[],m=i.currentPage||1,b=i.totalPages||1,E({page:m,search:n}),typeof m<"u"&&sessionStorage.setItem("postsPage",m),sessionStorage.setItem("postsSearch",n||""),sessionStorage.removeItem("postsCategory"),$="";const l="myPostsContainer";Y(l),x(l,m,b)}catch(a){console.error("Error fetching my posts:",a),d("Failed to load your posts!","error")}finally{q(),V()}}function C(t){const o=Math.floor((Date.now()-new Date(t))/1e3),a=[{label:"year",seconds:31536e3},{label:"month",seconds:2592e3},{label:"day",seconds:86400},{label:"hour",seconds:3600},{label:"minute",seconds:60},{label:"second",seconds:1}],e=new Intl.RelativeTimeFormat("en",{numeric:"auto"});for(const n of a){const s=Math.floor(o/n.seconds);if(s>=1)return e.format(-s,n.label)}return"Just now"}function J(t){const o=document.createElement("div");return o.textContent=t,o.innerHTML.replace(/\n/g,"<br>")}function Y(t,o=null){const a=window.currentUser?._id||window.currentUser?.id,e=document.getElementById(t);if(!e)return;e.innerHTML="";let n=[];if(t==="allPostsContainer"?n=[...p.all]:t==="featuredPostsContainer"?n=[...p.featured]:t==="myPostsContainer"?n=[...p.mine]:t==="savedPostsContainer"&&(n=[...p.saved]),o&&(n=n.slice(0,o)),n.length===0){t==="myPostsContainer"?e.innerHTML=`<p style="text-align:center; color:gray; font-size: 20px; font-weight: bold;">You haven't made any posts yet...</p>`:e.innerHTML='<p style="text-align:center; color:gray; font-size:20px;">No results found...</p>';return}n.forEach(s=>{const r=document.createElement("div");r.classList.add("post");const i=s.content.length>150?s.content.substring(0,150)+"...":s.content,l=typeof s.authorId=="object"&&s.authorId!==null?s.authorId._id:s.authorId,c=typeof s.authorId=="object"&&s.authorId!==null?s.authorId.name:s.authorName||"Unknown",h=a&&String(l)===String(a);r.innerHTML=`
      ${s.image?`<a href="post.html?slug=${s.slug}">
             <img src="${_(s.image)}" alt="${s.title}" class="post-image" loading="lazy">
           </a>`:""}
        <p class="tag">${s.category}</p>
        <h2>
          <a href="post.html?slug=${s.slug}" class="post-link">${s.title}</a>
        </h2>
        <p>${i} <a href="post.html?slug=${s.slug}" class="read-more">Read more</a></p>
        <a href="profile.html?id=${l}" class="author"><em>By ${c}</em></a>
        <small title="${new Date(s.date).toLocaleString()}">
          ${C(s.date)}
        </small>
        <br>
        <div class="post-interactions-container">
          <div class="post-interactions">
            <button class="like-btn ${s.likedByUser?"liked":""}" data-slug="${s.slug}">
              <i class="${s.likedByUser?"fa-solid":"fa-regular"} fa-heart"></i>
              <span class="like-count">${s.likesCount||0}</span>
            </button>
            <button class="comment-btn" data-slug="${s.slug}">
              <i class="fa-regular fa-comment"></i>
              <span class="comment-count">${s.commentsCount||0}</span>
            </button>
            <button class="share-btn" data-slug="${s.slug}">
              <i class="fa-solid fa-share"></i>
              <span class="share-count">${s.shares}</span>
            </button>
          </div>
          <span class="liked-by likes-info">No likes yet</span>
        </div>
        <div id="likesModal-${s.slug}" class="likes-modal hidden slide-up">
          <div class="likes-modal-content">
            <h3>Liked by</h3>
            <ul id="likesList-${s.slug}" class="likes-list"></ul>            
          </div>
        </div>
        <div class="comments-section">
          <form class="comment-form">
            <input type="text" class="comment-input" placeholder="Write a comment..." required />
            <button type="submit">Comment</button>
          </form>
          <div class="comments-list"></div>
        </div>
        ${h?`
        <div class="post-actions">
            <button class="edit-btn btn" data-slug="${s.slug}">Edit</button>
            <button class="delete-btn btn" data-slug="${s.slug}">Delete</button>
        </div>
        `:""}
    `,e.appendChild(r);const g=r.querySelector(".post-image");g&&(g.onerror=function(){this.onerror=null,this.src="/Images/fallback.jpg"});const f=r.querySelector(".like-btn"),A=f.querySelector("i"),v=r.querySelector(".liked-by");v.dataset.slug=s.slug,v.dataset.likedBy=JSON.stringify(s.likedBy||[]),s.likedBy&&s.likesCount>0&&v.classList.remove("disabled"),f.classList.toggle("liked",s.likedByUser),A.className=s.likedByUser?"fa-solid fa-heart":"fa-regular fa-heart",s.likesCount?(v.textContent=v.textContent=s.likesCount===1?`Liked by ${s.likedBy[0]}`:`Liked by ${s.likedBy[0]} and ${s.likedBy.length-1} others`,v.classList.remove("disabled")):(v.textContent="No likes yet",v.classList.add("disabled"));const B=r.querySelector(".comment-count");te(s.slug,B)})}async function we(t,o,a,e){const n=new FormData;n.append("title",t),n.append("content",o),n.append("category",a),e&&n.append("image",e);const s=await u(`${y}`,{method:"POST",body:n});if(!s.ok)throw new Error("Failed to add post");return await s.json()}async function ke(t){if(confirm("Are you sure you want to delete this post?"))try{const o=await u(`${y}/${t}`,{method:"DELETE"});if(!o.ok){const a=await o.text();throw new Error(a||"Failed to delete post")}d("Post deleted successfully!","success"),window.location.pathname.endsWith("my-posts.html")?se(m):I(m)}catch(o){console.error("Error deleting post:",o),d("Failed to delete post!","error")}}function be(t){t&&(localStorage.setItem("editSlug",t),window.location.href="write.html")}function $e(){const t=document.getElementById("postForm"),o=document.querySelector(".add-post-btn");if(!t)return;const a=localStorage.getItem("editSlug"),e=n=>{o.disabled=n,o.innerHTML=n?'<i class="fa-solid fa-spinner fa-spin"></i> Posting...':a?"Update Post":"Add Post"};a&&a!=="null"?((async()=>{try{const n=await u(`${y}/${a}`);if(!n.ok)throw new Error("Post not found");const s=await n.json();if(document.getElementById("title").value=s.title||"",document.getElementById("content").value=s.content||"",document.getElementById("category").value=s.category||"",s.image){const r=document.getElementById("imagePreview");r.src=s.image,r.style.display="block"}}catch(n){console.error("Error loading post:",n)}})(),t.onsubmit=async function(n){n.preventDefault();const s=new FormData;s.append("title",document.getElementById("title").value),s.append("content",document.getElementById("content").value),s.append("category",document.getElementById("category").value);const r=document.getElementById("image").files[0];r&&s.append("image",r);try{e(!0);const i=await u(`${y}/${a}`,{method:"PUT",body:s});i.ok?(d("Post updated successfully!","success"),localStorage.removeItem("editSlug"),window.location.href="all-posts.html"):console.error("Update failed:",await i.text())}catch(i){console.error("Error updating post:",i),d("Failed to update post!","error")}finally{e(!1)}}):(localStorage.removeItem("editSlug"),t?.addEventListener("submit",async function(n){n.preventDefault();const s=document.getElementById("title").value,r=document.getElementById("content").value,i=document.getElementById("category").value,l=document.getElementById("image").files[0];console.log("Submitting new post:",{title:s,content:r,category:i,imageFile:l});try{e(!0);const c=await we(s,r,i,l);console.log("Post created successfully!",c),d("Post created successfully!","success"),t.reset(),window.location.href="all-posts.html",localStorage.removeItem("editSlug")}catch(c){console.error("Error adding post:",c),d("Failed to add post!","error")}finally{e(!1)}}))}async function G(){const o=new URLSearchParams(window.location.search).get("slug")||window.location.pathname.split("/").pop();if(o&&u(`/api/posts/${o}/view`,{method:"POST"}).catch(a=>{console.error("Failed to increment view",a)}),!!o){try{let ne=function(k){w.dataset.saved=k?"true":"false",w.classList.toggle("saved",k);const S=w.querySelector("i");S.classList.toggle("fa-solid",k),S.classList.toggle("fa-regular",!k)};const a=await u(`${y}/${o}`);if(!a.ok)throw new Error("Failed to fetch post");const e=await a.json(),n=window.currentUser?._id||window.currentUser?.id,s=typeof e.authorId=="object"&&e.authorId!==null?e.authorId._id:e.authorId,r=typeof e.authorId=="object"&&e.authorId!==null?e.authorId.name:e.authorName||"Unknown",i=n&&String(s)===String(n),l=document.getElementById("singlePostContainer");l.innerHTML=`
      ${e.image?`<img src="${_(e.image)}" alt="${e.title}" class="post-image" loading="lazy">`:""}
      <h1>${e.title}</h1>
      <p class="tag">${e.category}</p>
      <p onclick="window.location.href='profile.html?id=${s}'" style="cursor: pointer;" class="author"><em>By ${r}</em></p>
      <small title="${new Date(e.date).toLocaleString()}">
        ${C(e.date)}
      </small>
      <div class="content">
        <p>${J(e.content)}</p>
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
    `;const c=l.querySelector(".post-image");c&&(c.onerror=function(){this.onerror=null,this.src="/Images/fallback.jpg"});const h=l?.querySelector(".like-btn"),g=h?.querySelector("i"),f=l?.querySelector(".liked-by");f.dataset.slug=e.slug,f.dataset.likedBy=JSON.stringify(e.likedBy||[]),e.likedBy&&e.likedBy.length>0?f.classList.remove("disabled"):f.classList.add("disabled"),n&&e.likedByUser?(h.classList.add("liked"),g.className="fa-solid fa-heart"):(h.classList.remove("liked"),g.className="fa-regular fa-heart"),!e.likedBy||e.likedBy.length===0?f.textContent="No likes yet":e.likedBy.length===1?f.textContent=`Liked by ${e.likedBy[0]}`:f.textContent=`Liked by ${e.likedBy[0]} and ${e.likedBy.length-1} others`;const A=l.querySelector(".comment-count");te(e.slug,A);const v=document.querySelector(".comments-section"),B=v.querySelector(".comments-list");v&&B&&await ee(e.slug,B,1/0);const w=l.querySelector(".bookmark");w?.addEventListener("click",async()=>{const k=w.dataset.slug,S=w.dataset.saved==="true";if(!window.currentUser){d("Please log in to save posts");return}w.classList.add("clicked"),setTimeout(()=>w.classList.remove("clicked"),200);const ae=S?`/api/posts/${k}/unsave`:`/api/posts/${k}/save`;try{const T=await u(ae,{method:"POST"}),re=await T.json();if(!T.ok)throw new Error(re.message||"Failed to toggle bookmark");ne(!S),d(S?"Removed from saved posts":"Post saved","success")}catch(T){console.error("Failed to toggle bookmark",T),d("Something went wrong","error")}})}catch(a){console.error(a),document.getElementById("singlePostContainer").innerHTML="<p>Error loading post.</p>"}Ee(o)}}const Se=async()=>{const o=await(await u(`${y}/trending?limit=5`)).json(),a=document.getElementById("trending-list");a.innerHTML=o.map((e,n)=>`
    <li>
      <span class="trending-rank">${["🥇","🥈","🥉"][n]||`#${n+1}`}</span>
      <a href="post.html?slug=${e.slug}" class="trending-title">${e.title}</a>
      <i class="fa-solid fa-bolt trending-icon" title="Trending now"></i>
    </li>
  `).join("")};function Le(t){const o=document.getElementById("related-posts-container");if(!t.length){o.innerHTML="<p style='margin: 0 5px;'>No related posts found.</p>";return}o.innerHTML=t.map(a=>`
      <article class="related-post-card">
        <h4><a href="post.html?slug=${a.slug}">${a.title}</a></h4>
        <small>${a.category}</small>
      </article>
    `).join("")}const Ee=async t=>{try{const a=await(await u(`${y}/slug/${t}/related`)).json();Le(a)}catch(o){console.error("Failed to fetch related posts.",o)}},Ie=document.getElementById("savedPostsContainer");async function oe(t,o=6){const a=Ie;try{const e=P(),n=t??e.page,s=W()||e.search,r=new URLSearchParams;r.append("page",n),r.append("limit",o),s&&r.append("search",s),n===1?U("savedPostsContainer",o):z();const i=await u(`${y}/saved/me?${r.toString()}`);if(!i.ok)throw new Error("Failed to fetch");const l=await i.json();if(p.saved=Array.isArray(l.posts)?l.posts:[],m=l.currentPage||1,b=l.totalPages||1,L=s||"",E({page:m,search:s}),sessionStorage.setItem("postsPage",m),sessionStorage.removeItem("postsCategory"),$="",sessionStorage.setItem("postsSearch",L),!a)return;if(p.saved.length===0){a.innerHTML="<p>You have no saved posts yet.</p>";return}a.innerHTML=p.saved.map(c=>`
      <article class="post-card">
        ${c.image?`
          <img 
            src="${_(c.image)}" 
            alt="${c.title}" 
            class="post-image"
            loading="lazy"
            onclick="window.location.href='post.html?slug=${c.slug}'"
          >
        `:""}
        <div class="post-body" onclick="window.location.href='post.html?slug=${c.slug}'">
          <h2>${c.title}</h2>
          <p class="tag">${c.category}</p>
          <p class="excerpt">
            ${c.content.slice(0,150)}...
          </p>
          <div class="post-meta">
            <small>By ${c.authorId?.name||"Unknown"}</small>
            <small title="${new Date(c.date).toLocaleString()}">${C(c.date)}</small>
          </div>
        </div>
        <button 
          class="bookmark saved"
          data-slug="${c.slug}"
          title="Remove from saved"
        >
          <i class="fa-solid fa-bookmark"></i>
        </button>
      </article>
    `).join(""),document.querySelectorAll(".bookmark").forEach(c=>{c?.addEventListener("click",async h=>{h.stopPropagation();const g=c.dataset.slug;try{await u(`${y}/${g}/unsave`,{method:"POST"}),p.saved=p.saved.filter(f=>f.slug!==g),c.closest(".post-card").remove(),d("Removed from saved posts","success"),p.saved.length===0&&m>1?oe(m-1):x("savedPostsContainer",m,b)}catch(f){console.error(f),d("Failed to remove","error")}})}),x("savedPostsContainer",m,b)}catch(e){console.error(e),a.innerHTML="<p>Error loading saved posts.</p>"}finally{q(),V()}}document.getElementById("categoryFilter")?.addEventListener("change",()=>{E({page:1}),I(1)});let Q;O.forEach(t=>t?.addEventListener("keyup",()=>{clearTimeout(Q),Q=setTimeout(()=>{E({page:1}),I(1)},400)}));function x(t,o,a){const e=document.getElementById("pagination");if(e){e.innerHTML="";for(let n=1;n<=a;n++){const s=document.createElement("button");s.textContent=n,s.className=n===o?"pg-active":"",s?.addEventListener("click",async()=>{E({page:n}),await K()}),e.appendChild(s)}}}async function Pe(t){const o=t.dataset.slug,a=t.querySelector("i"),e=t.querySelector(".like-count"),n=t.closest(".post-interactions-container")?.querySelector(".liked-by");if(!window.currentUser){d("Please log in to like or unlike posts.","error");return}const s=t.classList.contains("liked");try{const r=await u(`/api/posts/${o}/${s?"unlike":"like"}`,{method:"POST"}),i=await r.json();if(r.ok){t.classList.toggle("liked",!s),a.className=s?"fa-regular fa-heart":"fa-solid fa-heart";const l=i.likesCount??i.likes??0;e.textContent=l,n&&(l?(n.textContent=l===1?"1 like":`${l} likes`,n.classList.remove("disabled")):(n.textContent="No likes yet",n.classList.add("disabled")),Array.isArray(i.likedBy)&&(n.dataset.slug=o,n.dataset.likedBy=JSON.stringify(i.likedBy)))}else d(`Failed to update likes: ${i.message}`,"error")}catch(r){console.error("Like action failed:",r),d("Error updating like. Please try again.","error")}}const Ce=async t=>{const o=t.dataset.slug,a=`${window.location.origin}/post/${o}`,e=`shared_${o}`;try{navigator.share?await navigator.share({title:"BuzzInk",text:"Check out this post on BuzzInk",url:a}):(await navigator.clipboard.writeText(a),d("Link copied to clipboard!","success")),sessionStorage.getItem(e)||(sessionStorage.setItem(e,"true"),u(`/api/posts/${o}/share`,{method:"POST"}).catch(()=>{}));const n=t.querySelector(".share-count");n&&(n.textContent=Number(n.textContent)+1)}catch(n){d("Failed to share post. Please try again.","error"),console.error("Share cancelled or failed",n)}};let R=!1;async function Be(t){if(R)return;const o=encodeURIComponent(t),a=document.getElementById(`likesModal-${o}`),e=document.getElementById(`likesList-${o}`);if(!(!a||!e)&&!a.classList.contains("active")){R=!0,a.classList.remove("hidden"),requestAnimationFrame(()=>a.classList.add("active")),e.innerHTML="<li>Loading...</li>";try{const s=await(await u(`/api/posts/${t}/likes`)).json();if(e.innerHTML="",!Array.isArray(s.users)||s.users.length===0){e.innerHTML="<li>No likes yet</li>";return}s.users.forEach(r=>{const i=document.createElement("li");i.textContent=r,e.appendChild(i)})}catch(n){e.innerHTML="<li>Failed to load likes</li>",console.error("Failed to fetch likes:",n)}}}function Te(t){const o=encodeURIComponent(t),a=document.getElementById(`likesModal-${o}`);a&&(R=!1,a.classList.remove("active"),setTimeout(()=>{a.classList.add("hidden")},300))}function Me(){document.addEventListener("click",async t=>{const o=t.target.closest(".edit-btn");if(o){t.preventDefault(),t.stopPropagation(),be(o.dataset.slug);return}const a=t.target.closest(".delete-btn");if(a){t.preventDefault(),t.stopPropagation(),ke(a.dataset.slug);return}const e=t.target.closest(".like-btn");if(e){t.preventDefault(),Pe(e);return}const n=t.target.closest(".comment-btn");if(n){t.preventDefault(),ue(n);return}const s=t.target.closest(".share-btn");if(s){t.preventDefault(),Ce(s);return}const r=t.target.closest(".likes-info");if(r&&!r.classList.contains("disabled")){t.preventDefault(),t.stopPropagation();const g=r.dataset.slug;if(!g)return;Be(g);return}const i=document.querySelector(".likes-modal.active");if(i&&!i.contains(t.target)){const g=i.id.replace("likesModal-","");Te(g)}const l=t.target.closest(".delete-comment-btn");l&&(t.preventDefault(),t.stopPropagation(),ge(l));const c=t.target.closest(".menu-btn"),h=t.target.closest(".menu-options");!c&&!h&&document.querySelectorAll(".menu-options").forEach(g=>g.classList.add("hidden")),c&&c.nextElementSibling.classList.toggle("hidden"),D?.classList.contains("show")&&!D.contains(t.target)&&![...ie].some(g=>g.contains(t.target))&&D.classList.remove("show"),H?.classList.contains("active")&&!H.contains(t.target)&&!le.contains(t.target)&&H.classList.remove("active")})}document.getElementById("canonicalUrl")?.setAttribute("href",window.location.href);"scrollRestoration"in history&&(history.scrollRestoration="manual");function xe(){const t=`scroll:${window.location.pathname}${window.location.search}`,o=sessionStorage.getItem(t);o!==null&&(window.scrollTo(0,Number(o)),sessionStorage.removeItem(t))}async function K(){const t=window.location.pathname,{page:o}=P();t==="/"||t.endsWith("index.html")?(await M(),await ve(),await I(o),await Se()):t.endsWith("my-posts.html")?(await M(),await se(o)):t.endsWith("post.html")?await G():t.endsWith("saved.html")?(await M(),await oe(o)):t.startsWith("/post/")?G():(await M(),await I(o)),xe()}document.addEventListener("click",t=>{const o=t.target.closest("a[href]");if(!o||new URL(o.href,window.location.origin).origin!==window.location.origin)return;const e=`scroll:${window.location.pathname}${window.location.search}`;sessionStorage.setItem(e,window.scrollY),typeof m<"u"&&sessionStorage.setItem("postsPage",m),typeof $<"u"&&sessionStorage.setItem("postsCategory",$),typeof L<"u"&&sessionStorage.setItem("postsSearch",L)});document.addEventListener("DOMContentLoaded",async()=>{const t=await ce();window.currentUser=t,de(),X(),Me(),pe(),me();const o=localStorage.getItem("theme")||"light";Z(o),await K(),window.location.pathname.endsWith("write.html")&&!localStorage.getItem("editSlug")&&localStorage.removeItem("editSlug"),$e()});window.addEventListener("pageshow",t=>{if(t.persisted){const o=localStorage.getItem("theme")||"light";Z(o),X()}});window.addEventListener("popstate",async()=>{const{category:t,search:o}=P(),a=document.getElementById("categoryFilter");a&&(a.value=t||"all"),document.querySelectorAll(".search").forEach(e=>{e.value=o||""}),await K()});
