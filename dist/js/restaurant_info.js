let restaurant,reviews;var map;document.addEventListener("DOMContentLoaded",e=>{DBHelper.registerServiceWorker(),this._dbPromise=DBHelper.openDatabase(),this._toastsView=new Toast,fetchRestaurantFromURL()}),showNotification=((e,t,n)=>{this._toastsView.create(e,t,n)}),window.initMap=(()=>{self.restaurant&&(self.map=new google.maps.Map(document.getElementById("map"),{zoom:16,center:self.restaurant.latlng,scrollwheel:!1}),DBHelper.mapMarkerForRestaurant(self.restaurant,self.map))}),fetchRestaurantFromURL=(()=>{if(self.restaurant)return;const e=getParameterByName("id");e?(DBHelper.fetchDataById("restaurants",e,this._dbPromise,(e,t,n)=>{self.restaurant=n,e?showNotification(e):(t&&showNotification(t),fillRestaurantHTML(),Helper.lazyLoad())}),DBHelper.fetchReviewsByRestaurantId(e,this._dbPromise,(e,t,n)=>{e?(showNotification(e),fillReviewsHTML()):t&&showNotification(t),resetReviews(n),fillReviewsHTML()})):showNotification("No restaurant id in URL")}),resetReviews=(e=>{self.reviews=[],document.getElementById("reviews-list").innerHTML="",self.reviews=e}),fillRestaurantHTML=((e=self.restaurant)=>{fillBreadcrumb();const t=document.getElementsByTagName("head")[0],n=document.createElement("meta");n.setAttribute("name","description"),n.setAttribute("content",`Detailed information about ${e.name}`),t.append(n);const a=document.getElementById("restaurant-name");a.innerHTML=e.name,a.title="restaurant name";const r=document.createElement("input");r.type="checkbox",r.name="favourite",r.value="favourite",r.id="favourite",r.checked=e.is_favorite,r.setAttribute("onchange","updateIsFavourite()");const i=document.createElement("label");i.setAttribute("for","favourite"),a.appendChild(r),a.appendChild(i);const o=document.getElementById("restaurant-address");o.innerHTML=e.address,o.title="restaurant address";const s=DBHelper.imageUrlForRestaurant(e,!0),l=document.getElementById("restaurant-img");l.className="restaurant-img",l.classList.add("lazy"),l.src=s,l.setAttribute("data-src",DBHelper.imageUrlForRestaurant(e)),l.setAttribute("data-srcset",DBHelper.imageSRCSetUrlsForRestaurant(e,["1x","2x"])),l.alt=e.photograph?DBHelper.getPhotoDescription(e):"no picture found";const c=document.getElementById("restaurant-cuisine");c.innerHTML=e.cuisine_type,c.title="restaurant cuisine type",e.operating_hours&&fillRestaurantHoursHTML()}),updateIsFavourite=((e=self.restaurant)=>{const t=e.is_favorite?0:1;(new Date).toLocaleDateString("en-us",{month:"long",day:"numeric",year:"numeric"}),e.id,parseInt(t);return fetch("api/alter",{method:"PUT",body:`is_favorite=${t}&restaurant_id=${e.id}`}).then(e=>{saveLocally(),showNotification(`Restaurant is ${t?"favourite now :)":"not favourite anymore :("}`,1.5)}).catch(e=>{showNotification("Offline! Will update state as soon as possible.",2),saveLocally()})}),sendData=(e=>DBHelper._updateDB("newIsFavourite",e).then(()=>navigator.serviceWorker.ready).then(e=>e.sync.register("send-isFavourite")).then(()=>{showNotification(`Restaurant is ${e.is_favorite?"favourite now :)":"not favourite anymore :("}`,1.5)}).catch(()=>{showNotification("Oops! Something went wrong.",3)})),saveLocally=((e=self.restaurant)=>(e.is_favorite=!e.is_favorite,DBHelper._updateDB("restaurants",e).then(()=>{}))),fillRestaurantHoursHTML=((e=self.restaurant.operating_hours)=>{const t=document.getElementById("restaurant-hours");t.innerHTML="";for(let n in e){const a=document.createElement("tr"),r=document.createElement("td");r.innerHTML=n,r.className="openhours-day",a.appendChild(r);const i=document.createElement("td");i.innerHTML=e[n],i.className="openhours-time",a.appendChild(i),t.appendChild(a)}}),fillReviewsHTML=((e=self.reviews)=>{const t=document.getElementById("reviews-container"),n=document.getElementById("reviews-list");if(fillSubmitReviewFormHTML(n),0===e.length){const e=document.createElement("p");return e.innerHTML="No reviews yet!",void t.appendChild(e)}e.forEach(e=>{n.appendChild(createReviewHTML(e))})}),createReviewHTML=(e=>{const t=document.createElement("li"),n=document.createElement("p");n.innerHTML=e.name,n.className="review-name",n.title="reviewer's name",t.appendChild(n);const a=document.createElement("p"),r=new Date(e.createdAt).toLocaleDateString("en-us",{month:"long",day:"numeric",year:"numeric"});a.innerHTML=r,a.className="review-date",a.title="date when review was posted",t.appendChild(a);const i=document.createElement("p");i.innerHTML=`Rating: ${e.rating}`,i.className="review-rating",i.title="given rating",t.appendChild(i);const o=document.createElement("p");return o.innerHTML=e.comments,o.className="review-comments",o.title="comments from the reviewer",t.appendChild(o),t}),fillSubmitReviewFormHTML=((e,t=self.restaurant)=>{const n=document.createElement("li"),a=document.createElement("form");a.id="form-review",a.method="POST",a.setAttribute("aria-label","Add review for restaurant");const r=document.createElement("input");r.id="restaurant_id",r.name="restaurant_id",r.type="hidden",r.value=t.id,a.appendChild(r);const i=document.createElement("p");i.className="review-name";const o=document.createElement("label");o.innerHTML="*Name:",o.for="uName",o.title="reviewer's name",i.appendChild(o);const s=document.createElement("input");s.id="uName",s.name="name",s.placeholder="Your Name",s.setAttribute("aria-required","true"),s.setAttribute("aria-label","Your name"),o.appendChild(s),a.appendChild(i);const l=document.createElement("p"),c=(new Date).toLocaleDateString("en-us",{month:"long",day:"numeric",year:"numeric"});l.innerHTML=c,l.className="review-date",l.title="date when review is posted",a.appendChild(l);const d=document.createElement("p");d.className="review-rating";const m=document.createElement("label");m.innerHTML="Rating:";const u=document.createElement("select");u.name="rating";for(var p=1;p<=5;p++){const e=document.createElement("option");e.value=p,e.innerHTML=p,u.appendChild(e)}m.appendChild(u),d.appendChild(m),a.appendChild(d);const h=document.createElement("p");h.className="review-comments";const f=document.createElement("label");f.innerHTML="*Comments:";const w=document.createElement("textarea");w.name="comments",w.id="commentsText",w.setAttribute("aria-required","true"),w.setAttribute("aria-label","Additional comments for the review"),h.appendChild(f),h.appendChild(w),a.appendChild(h);const v=document.createElement("p"),g=document.createElement("button");g.id="submitBtn",g.type="submit",g.innerHTML="Submit Review!",g.value="Submit",g.setAttribute("aria-label","Submit review"),v.appendChild(g),a.appendChild(v),n.appendChild(a),e.appendChild(n),a.addEventListener("submit",function(e){e.preventDefault(),submitReview(a)})}),submitReview=(e=>{const t=new FormData(e),n={};let a=!1;if(t.forEach(function(e,t){const r=escape(e);""===r&&(showNotification(`Oh no! Something went wrong, please check ${t} field`),a=!0),n[t]=r}),a)return;let r=e.parentNode.parentNode;const i=(new Date).toLocaleDateString("en-us",{month:"long",day:"numeric",year:"numeric"});n.createdAt=i,DBHelper._updateDB("reviews",n),n.name=unescape(n.name),n.comments=unescape(n.comments);let o=createReviewHTML(n);return fetch("api/add",{method:"POST",body:`restaurant_id=${n.restaurant_id}&name=${n.name}&rating=${n.rating}&comments=${n.comments}`}).then(t=>{r.insertBefore(o,e.parentNode),r.removeChild(e.parentNode),showNotification("Your review has been posted.",3)}).catch(t=>{r.insertBefore(o,e.parentNode),r.removeChild(e.parentNode),showNotification("Offline! Your review will be posted as soon as possible.",3)})}),fillBreadcrumb=((e=self.restaurant)=>{const t=document.getElementById("breadcrumb");resetBreadcrumb(t);const n=document.createElement("li");n.setAttribute("aria-current","page"),n.innerHTML=e.name,t.appendChild(n)}),resetBreadcrumb=(e=>{const t=e.children.length;for(let n=1;n<t;n++)e.removeChild(e.children.item(n))}),getParameterByName=((e,t)=>{t||(t=window.location.href),e=e.replace(/[\[\]]/g,"\\$&");const n=new RegExp(`[?&]${e}(=([^&#]*)|&|#|$)`).exec(t);return n?n[2]?decodeURIComponent(n[2].replace(/\+/g," ")):"":null});
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInJlc3RhdXJhbnRfaW5mby5qcyJdLCJuYW1lcyI6WyJyZXN0YXVyYW50IiwicmV2aWV3cyIsIm1hcCIsImRvY3VtZW50IiwiYWRkRXZlbnRMaXN0ZW5lciIsImV2ZW50IiwiREJIZWxwZXIiLCJyZWdpc3RlclNlcnZpY2VXb3JrZXIiLCJ0aGlzIiwiX2RiUHJvbWlzZSIsIm9wZW5EYXRhYmFzZSIsIl90b2FzdHNWaWV3IiwiVG9hc3QiLCJmZXRjaFJlc3RhdXJhbnRGcm9tVVJMIiwic2hvd05vdGlmaWNhdGlvbiIsIm1zZyIsImR1cmF0aW9uIiwib3B0aW9ucyIsImNyZWF0ZSIsIndpbmRvdyIsImluaXRNYXAiLCJzZWxmIiwiZ29vZ2xlIiwibWFwcyIsIk1hcCIsImdldEVsZW1lbnRCeUlkIiwiem9vbSIsImNlbnRlciIsImxhdGxuZyIsInNjcm9sbHdoZWVsIiwibWFwTWFya2VyRm9yUmVzdGF1cmFudCIsImlkIiwiZ2V0UGFyYW1ldGVyQnlOYW1lIiwiZmV0Y2hEYXRhQnlJZCIsImVycm9yIiwiZmlsbFJlc3RhdXJhbnRIVE1MIiwiSGVscGVyIiwibGF6eUxvYWQiLCJmZXRjaFJldmlld3NCeVJlc3RhdXJhbnRJZCIsImZpbGxSZXZpZXdzSFRNTCIsInJlc2V0UmV2aWV3cyIsImlubmVySFRNTCIsImZpbGxCcmVhZGNydW1iIiwiaGVhZCIsImdldEVsZW1lbnRzQnlUYWdOYW1lIiwiZGVzY3JpcHRpb24iLCJjcmVhdGVFbGVtZW50Iiwic2V0QXR0cmlidXRlIiwibmFtZSIsImFwcGVuZCIsInRpdGxlIiwiZmF2b3VyaXRlVG9nZ2xlIiwidHlwZSIsInZhbHVlIiwiY2hlY2tlZCIsImlzX2Zhdm9yaXRlIiwidG9nZ2xlTGJsIiwiYXBwZW5kQ2hpbGQiLCJhZGRyZXNzIiwiaW1nU3JjIiwiaW1hZ2VVcmxGb3JSZXN0YXVyYW50IiwiaW1hZ2UiLCJjbGFzc05hbWUiLCJjbGFzc0xpc3QiLCJhZGQiLCJzcmMiLCJpbWFnZVNSQ1NldFVybHNGb3JSZXN0YXVyYW50IiwiYWx0IiwiZ2V0UGhvdG9EZXNjcmlwdGlvbiIsImN1aXNpbmUiLCJjdWlzaW5lX3R5cGUiLCJvcGVyYXRpbmdfaG91cnMiLCJmaWxsUmVzdGF1cmFudEhvdXJzSFRNTCIsInVwZGF0ZUlzRmF2b3VyaXRlIiwiRGF0ZSIsInRvTG9jYWxlRGF0ZVN0cmluZyIsIm1vbnRoIiwiZGF5IiwieWVhciIsInBhcnNlSW50IiwiZmV0Y2giLCJtZXRob2QiLCJib2R5IiwidGhlbiIsInJlc3BvbnNlIiwic2F2ZUxvY2FsbHkiLCJjYXRjaCIsImVyciIsInNlbmREYXRhIiwiZGF0YSIsIl91cGRhdGVEQiIsIm5hdmlnYXRvciIsInNlcnZpY2VXb3JrZXIiLCJyZWFkeSIsInJlZyIsInN5bmMiLCJyZWdpc3RlciIsIm9wZXJhdGluZ0hvdXJzIiwiaG91cnMiLCJrZXkiLCJyb3ciLCJ0aW1lIiwiY29udGFpbmVyIiwidWwiLCJmaWxsU3VibWl0UmV2aWV3Rm9ybUhUTUwiLCJsZW5ndGgiLCJub1Jldmlld3MiLCJmb3JFYWNoIiwicmV2aWV3IiwiY3JlYXRlUmV2aWV3SFRNTCIsImxpIiwiZGF0ZSIsImNyZWF0ZWRBdCIsInJhdGluZyIsImNvbW1lbnRzIiwiZm9ybSIsInJlc3RhdXJhbnRJRCIsIm5hbWVTaGVsbCIsIm5hbWVMYmwiLCJmb3IiLCJuYW1lSW5wdXQiLCJwbGFjZWhvbGRlciIsIm5vdyIsInJhdGluZ1NoZWxsIiwicmF0aW5nTGJsIiwicmF0aW5nT3B0aW9ucyIsImkiLCJvcHRpb24iLCJjb21tZW50c1NoZWxsIiwiY29tbWVudHNMYmwiLCJjb21tZW50c1RleHQiLCJzdWJtaXRTaGVsbCIsInN1Ym1pdEJ0biIsInByZXZlbnREZWZhdWx0Iiwic3VibWl0UmV2aWV3IiwiRkQiLCJGb3JtRGF0YSIsImJhZERhdGEiLCJzYWZlU3RyIiwiZXNjYXBlIiwicGFyZW50Tm9kZSIsInVuZXNjYXBlIiwicmV2aWV3Tm9kZSIsInJlc3RhdXJhbnRfaWQiLCJpbnNlcnRCZWZvcmUiLCJyZW1vdmVDaGlsZCIsImJyZWFkY3J1bWIiLCJyZXNldEJyZWFkY3J1bWIiLCJjaGlsZHJlbiIsIml0ZW0iLCJ1cmwiLCJsb2NhdGlvbiIsImhyZWYiLCJyZXBsYWNlIiwicmVzdWx0cyIsIlJlZ0V4cCIsImV4ZWMiLCJkZWNvZGVVUklDb21wb25lbnQiXSwibWFwcGluZ3MiOiJBQUFBLElBQUlBLFdBQVlDLFFBQ2hCLElBQUlDLElBS0pDLFNBQVNDLGlCQUFpQixtQkFBcUJDLElBQzdDQyxTQUFTQyx3QkFDVEMsS0FBS0MsV0FBYUgsU0FBU0ksZUFDM0JGLEtBQUtHLFlBQWMsSUFBSUMsTUFDdkJDLDJCQU1GQyxpQkFBbUIsRUFBQ0MsRUFBS0MsRUFBVUMsS0FDaENULEtBQUtHLFlBQVlPLE9BQU9ILEVBQUtDLEVBQVVDLEtBTTFDRSxPQUFPQyxRQUFVLE1BQ1hDLEtBQUtyQixhQUNQcUIsS0FBS25CLElBQU0sSUFBSW9CLE9BQU9DLEtBQUtDLElBQUlyQixTQUFTc0IsZUFBZSxPQUFRLENBQzdEQyxLQUFNLEdBQ05DLE9BQVFOLEtBQUtyQixXQUFXNEIsT0FDeEJDLGFBQWEsSUFFZnZCLFNBQVN3Qix1QkFBdUJULEtBQUtyQixXQUFZcUIsS0FBS25CLFFBTzFEVyx1QkFBeUIsTUFDdkIsR0FBSVEsS0FBS3JCLFdBRVAsT0FFRixNQUFNK0IsRUFBS0MsbUJBQW1CLE1BQ3pCRCxHQUtIekIsU0FBUzJCLGNBQWMsY0FBZUYsRUFBSXZCLEtBQUtDLFdBQVksQ0FBQ3lCLEVBQU9uQixFQUFLZixLQUN0RXFCLEtBQUtyQixXQUFhQSxFQUNka0MsRUFDRnBCLGlCQUFpQm9CLElBRVRuQixHQUNSRCxpQkFBaUJDLEdBR25Cb0IscUJBQ0FDLE9BQU9DLGNBR1QvQixTQUFTZ0MsMkJBQTJCUCxFQUFJdkIsS0FBS0MsV0FBWSxDQUFDeUIsRUFBT25CLEVBQUtkLEtBQ2hFaUMsR0FDRnBCLGlCQUFpQm9CLEdBQ2pCSyxtQkFDUXhCLEdBQ1JELGlCQUFpQkMsR0FHbkJ5QixhQUFhdkMsR0FFYnNDLHFCQTFCRnpCLGlCQUFpQiw2QkFrQ3JC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cEI5SCxpQkFBaUIsK0JBQWdDLEtBQ2hEd0UsTUFBTUMsSUFDUGdCLEVBQUd5QyxhQUFhRixFQUFZM0IsRUFBS3lCLFlBQ2pDckMsRUFBRzBDLFlBQVk5QixFQUFLeUIsWUFDcEI5SCxpQkFBaUIsMkRBQTRELE9BT2pGNEIsZUFBaUIsRUFBQzFDLEVBQWFxQixLQUFLckIsY0FDbEMsTUFBTWtKLEVBQWEvSSxTQUFTc0IsZUFBZSxjQUMzQzBILGdCQUFnQkQsR0FDaEIsTUFBTXBDLEVBQUszRyxTQUFTMkMsY0FBYyxNQUNsQ2dFLEVBQUcvRCxhQUFhLGVBQWdCLFFBQ2hDK0QsRUFBR3JFLFVBQVl6QyxFQUFXZ0QsS0FDMUJrRyxFQUFXekYsWUFBWXFELEtBTXpCcUMsZ0JBQWtCLENBQUNELElBQ2pCLE1BQU16QyxFQUFTeUMsRUFBV0UsU0FBUzNDLE9BQ25DLElBQUssSUFBSXFCLEVBQUksRUFBR0EsRUFBSXJCLEVBQVFxQixJQUMxQm9CLEVBQVdELFlBQVlDLEVBQVdFLFNBQVNDLEtBQUt2QixNQU9wRDlGLG1CQUFxQixFQUFDZ0IsRUFBTXNHLEtBQ3JCQSxJQUNIQSxFQUFNbkksT0FBT29JLFNBQVNDLE1BQ3hCeEcsRUFBT0EsRUFBS3lHLFFBQVEsVUFBVyxRQUMvQixNQUNFQyxFQURZLElBQUlDLGNBQWMzRyxzQkFDZDRHLEtBQUtOLEdBQ3ZCLE9BQUtJLEVBRUFBLEVBQVEsR0FFTkcsbUJBQW1CSCxFQUFRLEdBQUdELFFBQVEsTUFBTyxNQUQzQyxHQUZBIiwiZmlsZSI6InJlc3RhdXJhbnRfaW5mby5qcyIsInNvdXJjZXNDb250ZW50IjpbImxldCByZXN0YXVyYW50LCByZXZpZXdzO1xudmFyIG1hcDtcblxuLyoqXG4gKiBGZXRjaCBkYXRhIGFzIHNvb24gYXMgdGhlIHBhZ2UgaXMgbG9hZGVkLlxuICovXG5kb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKCdET01Db250ZW50TG9hZGVkJywgKGV2ZW50KSA9PiB7XG4gIERCSGVscGVyLnJlZ2lzdGVyU2VydmljZVdvcmtlcigpO1xuICB0aGlzLl9kYlByb21pc2UgPSBEQkhlbHBlci5vcGVuRGF0YWJhc2UoKTtcbiAgdGhpcy5fdG9hc3RzVmlldyA9IG5ldyBUb2FzdCgpO1xuICBmZXRjaFJlc3RhdXJhbnRGcm9tVVJMKCk7XG59KTtcblxuLyoqXG4gKiBEaXNwbGF5IG5vdGlmaWNhdGlvbnMuXG4gKi9cbnNob3dOb3RpZmljYXRpb24gPSAobXNnLCBkdXJhdGlvbiwgb3B0aW9ucykgPT4ge1xuICAgdGhpcy5fdG9hc3RzVmlldy5jcmVhdGUobXNnLCBkdXJhdGlvbiwgb3B0aW9ucyk7XG59XG5cbi8qKlxuICogSW5pdGlhbGl6ZSBHb29nbGUgbWFwLCBjYWxsZWQgZnJvbSBIVE1MLlxuICovXG53aW5kb3cuaW5pdE1hcCA9ICgpID0+IHtcbiAgaWYgKHNlbGYucmVzdGF1cmFudCkge1xuICAgIHNlbGYubWFwID0gbmV3IGdvb2dsZS5tYXBzLk1hcChkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnbWFwJyksIHtcbiAgICAgIHpvb206IDE2LFxuICAgICAgY2VudGVyOiBzZWxmLnJlc3RhdXJhbnQubGF0bG5nLFxuICAgICAgc2Nyb2xsd2hlZWw6IGZhbHNlXG4gICAgfSk7XG4gICAgREJIZWxwZXIubWFwTWFya2VyRm9yUmVzdGF1cmFudChzZWxmLnJlc3RhdXJhbnQsIHNlbGYubWFwKTtcbiAgfVxufVxuXG4vKipcbiAqIEdldCBjdXJyZW50IHJlc3RhdXJhbnQgZnJvbSBwYWdlIFVSTC5cbiAqL1xuZmV0Y2hSZXN0YXVyYW50RnJvbVVSTCA9ICgpID0+IHtcbiAgaWYgKHNlbGYucmVzdGF1cmFudCkgeyAvLyByZXN0YXVyYW50IGFscmVhZHkgZmV0Y2hlZCFcbiAgICAvL2NhbGxiYWNrKG51bGwsIHNlbGYucmVzdGF1cmFudClcbiAgICByZXR1cm47XG4gIH1cbiAgY29uc3QgaWQgPSBnZXRQYXJhbWV0ZXJCeU5hbWUoJ2lkJyk7XG4gIGlmICghaWQpIHtcbiAgICAvLyBubyBpZCBmb3VuZCBpbiBVUkxcbiAgICBzaG93Tm90aWZpY2F0aW9uKCdObyByZXN0YXVyYW50IGlkIGluIFVSTCcpO1xuICAgIHJldHVybjtcbiAgfSBlbHNlIHtcbiAgICBEQkhlbHBlci5mZXRjaERhdGFCeUlkKCdyZXN0YXVyYW50cycsIGlkLCB0aGlzLl9kYlByb21pc2UsIChlcnJvciwgbXNnLCByZXN0YXVyYW50KSA9PiB7XG4gICAgICBzZWxmLnJlc3RhdXJhbnQgPSByZXN0YXVyYW50O1xuICAgICAgaWYgKGVycm9yKSB7XG4gICAgICAgIHNob3dOb3RpZmljYXRpb24oZXJyb3IpO1xuICAgICAgICByZXR1cm47XG4gICAgICB9IGVsc2UgaWYobXNnKSB7XG4gICAgICAgIHNob3dOb3RpZmljYXRpb24obXNnKTtcbiAgICAgIH1cblxuICAgICAgZmlsbFJlc3RhdXJhbnRIVE1MKCk7XG4gICAgICBIZWxwZXIubGF6eUxvYWQoKTtcbiAgICB9KTtcblxuICAgIERCSGVscGVyLmZldGNoUmV2aWV3c0J5UmVzdGF1cmFudElkKGlkLCB0aGlzLl9kYlByb21pc2UsIChlcnJvciwgbXNnLCByZXZpZXdzKSA9PiB7XG4gICAgICBpZiAoZXJyb3IpIHtcbiAgICAgICAgc2hvd05vdGlmaWNhdGlvbihlcnJvcik7XG4gICAgICAgIGZpbGxSZXZpZXdzSFRNTCgpO1xuICAgICAgfSBlbHNlIGlmKG1zZykge1xuICAgICAgICBzaG93Tm90aWZpY2F0aW9uKG1zZyk7XG4gICAgICB9XG5cbiAgICAgIHJlc2V0UmV2aWV3cyhyZXZpZXdzKTtcbiAgICAgIC8vIGZpbGwgcmV2aWV3c1xuICAgICAgZmlsbFJldmlld3NIVE1MKCk7XG4gICAgfSk7XG4gIH1cbn1cblxuLyoqXG4gKiBDbGVhciBjdXJyZW50IHJldmlld3MgYW5kIHRoZWlyIEhUTUwuXG4gKi9cbnJlc2V0UmV2aWV3cyA9IChyZXZpZXdzKSA9PiB7XG4gIC8vIFJlbW92ZSBhbGwgcmVzdGF1cmFudHNcbiAgc2VsZi5yZXZpZXdzID0gW107XG4gIGNvbnN0IHVsID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3Jldmlld3MtbGlzdCcpO1xuICB1bC5pbm5lckhUTUwgPSAnJztcbiAgc2VsZi5yZXZpZXdzID0gcmV2aWV3cztcbn1cblxuLyoqXG4gKiBDcmVhdGUgcmVzdGF1cmFudCBIVE1MIGFuZCBhZGQgaXQgdG8gdGhlIHdlYnBhZ2VcbiAqL1xuZmlsbFJlc3RhdXJhbnRIVE1MID0gKHJlc3RhdXJhbnQgPSBzZWxmLnJlc3RhdXJhbnQpID0+IHtcbiAgZmlsbEJyZWFkY3J1bWIoKTtcblxuICBjb25zdCBoZWFkID0gZG9jdW1lbnQuZ2V0RWxlbWVudHNCeVRhZ05hbWUoJ2hlYWQnKVswXTtcbiAgY29uc3QgZGVzY3JpcHRpb24gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdtZXRhJyk7XG4gIGRlc2NyaXB0aW9uLnNldEF0dHJpYnV0ZSgnbmFtZScsICdkZXNjcmlwdGlvbicpO1xuICBkZXNjcmlwdGlvbi5zZXRBdHRyaWJ1dGUoJ2NvbnRlbnQnLCBgRGV0YWlsZWQgaW5mb3JtYXRpb24gYWJvdXQgJHtyZXN0YXVyYW50Lm5hbWV9YCk7XG4gIGhlYWQuYXBwZW5kKGRlc2NyaXB0aW9uKTtcblxuICBjb25zdCBuYW1lID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3Jlc3RhdXJhbnQtbmFtZScpO1xuICBuYW1lLmlubmVySFRNTCA9IHJlc3RhdXJhbnQubmFtZTtcbiAgbmFtZS50aXRsZSA9ICdyZXN0YXVyYW50IG5hbWUnO1xuICBjb25zdCBmYXZvdXJpdGVUb2dnbGUgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdpbnB1dCcpO1xuICBmYXZvdXJpdGVUb2dnbGUudHlwZSA9ICdjaGVja2JveCc7XG4gIGZhdm91cml0ZVRvZ2dsZS5uYW1lID0gJ2Zhdm91cml0ZSc7XG4gIGZhdm91cml0ZVRvZ2dsZS52YWx1ZSA9ICdmYXZvdXJpdGUnO1xuICBmYXZvdXJpdGVUb2dnbGUuaWQgPSAnZmF2b3VyaXRlJztcbiAgZmF2b3VyaXRlVG9nZ2xlLmNoZWNrZWQgPSByZXN0YXVyYW50LmlzX2Zhdm9yaXRlO1xuICBmYXZvdXJpdGVUb2dnbGUuc2V0QXR0cmlidXRlKCdvbmNoYW5nZScsICd1cGRhdGVJc0Zhdm91cml0ZSgpJyk7XG4gIGNvbnN0IHRvZ2dsZUxibCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2xhYmVsJyk7XG4gIHRvZ2dsZUxibC5zZXRBdHRyaWJ1dGUoJ2ZvcicsICdmYXZvdXJpdGUnKTtcbiAgbmFtZS5hcHBlbmRDaGlsZChmYXZvdXJpdGVUb2dnbGUpO1xuICBuYW1lLmFwcGVuZENoaWxkKHRvZ2dsZUxibCk7XG5cbiAgY29uc3QgYWRkcmVzcyA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdyZXN0YXVyYW50LWFkZHJlc3MnKTtcbiAgYWRkcmVzcy5pbm5lckhUTUwgPSByZXN0YXVyYW50LmFkZHJlc3M7XG4gIGFkZHJlc3MudGl0bGUgPSAncmVzdGF1cmFudCBhZGRyZXNzJztcblxuICBjb25zdCBpbWdTcmMgPSBEQkhlbHBlci5pbWFnZVVybEZvclJlc3RhdXJhbnQocmVzdGF1cmFudCwgdHJ1ZSk7XG4gIGNvbnN0IGltYWdlID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3Jlc3RhdXJhbnQtaW1nJyk7XG4gIGltYWdlLmNsYXNzTmFtZSA9ICdyZXN0YXVyYW50LWltZyc7XG4gIGltYWdlLmNsYXNzTGlzdC5hZGQoJ2xhenknKTtcbiAgaW1hZ2Uuc3JjID0gaW1nU3JjO1xuICBpbWFnZS5zZXRBdHRyaWJ1dGUoJ2RhdGEtc3JjJywgREJIZWxwZXIuaW1hZ2VVcmxGb3JSZXN0YXVyYW50KHJlc3RhdXJhbnQpKTtcbiAgaW1hZ2Uuc2V0QXR0cmlidXRlKCdkYXRhLXNyY3NldCcsIERCSGVscGVyLmltYWdlU1JDU2V0VXJsc0ZvclJlc3RhdXJhbnQocmVzdGF1cmFudCwgWycxeCcsICcyeCddKSk7XG4gIGltYWdlLmFsdCA9IChyZXN0YXVyYW50LnBob3RvZ3JhcGgpID8gREJIZWxwZXIuZ2V0UGhvdG9EZXNjcmlwdGlvbihyZXN0YXVyYW50KSA6XG4gICdubyBwaWN0dXJlIGZvdW5kJztcblxuICBjb25zdCBjdWlzaW5lID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3Jlc3RhdXJhbnQtY3Vpc2luZScpO1xuICBjdWlzaW5lLmlubmVySFRNTCA9IHJlc3RhdXJhbnQuY3Vpc2luZV90eXBlO1xuICBjdWlzaW5lLnRpdGxlID0gJ3Jlc3RhdXJhbnQgY3Vpc2luZSB0eXBlJztcblxuICAvLyBmaWxsIG9wZXJhdGluZyBob3Vyc1xuICBpZiAocmVzdGF1cmFudC5vcGVyYXRpbmdfaG91cnMpIHtcbiAgICBmaWxsUmVzdGF1cmFudEhvdXJzSFRNTCgpO1xuICB9XG59XG5cbi8qKlxuICogSGFkbGUgZmF2b3VyaXRlIHRvZ2dsZVxuICovXG4gdXBkYXRlSXNGYXZvdXJpdGUgPSAocmVzdGF1cmFudCA9IHNlbGYucmVzdGF1cmFudCkgPT4ge1xuICAgY29uc3QgaXNfZmF2b3JpdGUgPSAocmVzdGF1cmFudC5pc19mYXZvcml0ZSkgPyAwIDogMTtcblxuICAgY29uc3Qgb3B0aW9ucyA9IHttb250aDogJ2xvbmcnLCBkYXk6ICdudW1lcmljJywgeWVhcjogJ251bWVyaWMnfTtcbiAgIGNvbnN0IG5vdyA9IG5ldyBEYXRlKCkudG9Mb2NhbGVEYXRlU3RyaW5nKCdlbi11cycsIG9wdGlvbnMpO1xuICAgY29uc3QgaXNGYXZvdXJpdGUgPSB7XG4gICAgIFwicmVzdGF1cmFudF9pZFwiOiByZXN0YXVyYW50LmlkLFxuICAgICBcImlzX2Zhdm9yaXRlXCI6IHBhcnNlSW50KGlzX2Zhdm9yaXRlKSxcbiAgICAgXCJjcmVhdGVkQXRcIjogbm93XG4gICB9XG5cbiAgIHJldHVybiBmZXRjaCgnYXBpL2FsdGVyJywge1xuICAgICBtZXRob2Q6ICdQVVQnLFxuICAgICBib2R5OiBgaXNfZmF2b3JpdGU9JHtpc19mYXZvcml0ZX0mcmVzdGF1cmFudF9pZD0ke3Jlc3RhdXJhbnQuaWR9YFxuICAgfSkudGhlbihyZXNwb25zZSA9PiB7XG4gICAgIHNhdmVMb2NhbGx5KCk7XG4gICAgIHNob3dOb3RpZmljYXRpb24oYFJlc3RhdXJhbnQgaXMgJHsoaXNfZmF2b3JpdGUpID8gJ2Zhdm91cml0ZSBub3cgOiknIDogJ25vdCBmYXZvdXJpdGUgYW55bW9yZSA6KCd9YCwgMS41KTtcbiAgIH0pLmNhdGNoKGVyciA9PiB7XG4gICAgIHNob3dOb3RpZmljYXRpb24oJ09mZmxpbmUhIFdpbGwgdXBkYXRlIHN0YXRlIGFzIHNvb24gYXMgcG9zc2libGUuJywgMik7XG4gICAgIHNhdmVMb2NhbGx5KCk7XG4gICB9KTtcblxuICAgLy8gc2VuZERhdGEoaXNGYXZvdXJpdGUpLnRoZW4oKGEpID0+IHtcbiAgIC8vICAgc2F2ZUxvY2FsbHkoKVxuICAgLy8gfSk7XG4gfVxuXG4vKipcbiAqIFNlbmQgZGF0YVxuICovXG4gc2VuZERhdGEgPSAoZGF0YSkgPT4ge1xuICByZXR1cm4gREJIZWxwZXIuX3VwZGF0ZURCKCduZXdJc0Zhdm91cml0ZScsIGRhdGEpLnRoZW4oKCkgPT4ge1xuICAgIC8vIFdhaXQgZm9yIHRoZSBzY29wZWQgc2VydmljZSB3b3JrZXIgcmVnaXN0cmF0aW9uIHRvIGdldCBhXG4gICAgLy8gc2VydmljZSB3b3JrZXIgd2l0aCBhbiBhY3RpdmUgc3RhdGVcbiAgICByZXR1cm4gbmF2aWdhdG9yLnNlcnZpY2VXb3JrZXIucmVhZHk7XG4gIH0pLnRoZW4ocmVnID0+IHtcbiAgICByZXR1cm4gcmVnLnN5bmMucmVnaXN0ZXIoJ3NlbmQtaXNGYXZvdXJpdGUnKTtcbiAgfSkudGhlbigoKSA9PiB7XG4gICAgc2hvd05vdGlmaWNhdGlvbihgUmVzdGF1cmFudCBpcyAkeyhkYXRhLmlzX2Zhdm9yaXRlKSA/ICdmYXZvdXJpdGUgbm93IDopJyA6ICdub3QgZmF2b3VyaXRlIGFueW1vcmUgOignfWAsIDEuNSk7XG4gIH0pLmNhdGNoKCgpID0+IHtcbiAgICBzaG93Tm90aWZpY2F0aW9uKCdPb3BzISBTb21ldGhpbmcgd2VudCB3cm9uZy4nLCAzKTtcbiAgfSk7XG59XG5cbnNhdmVMb2NhbGx5ID0gKHJlc3RhdXJhbnQgPSBzZWxmLnJlc3RhdXJhbnQpID0+IHtcbiAgcmVzdGF1cmFudC5pc19mYXZvcml0ZSA9ICFyZXN0YXVyYW50LmlzX2Zhdm9yaXRlO1xuICByZXR1cm4gREJIZWxwZXIuX3VwZGF0ZURCKCdyZXN0YXVyYW50cycsIHJlc3RhdXJhbnQpLnRoZW4oKCkgPT4ge1xuICAgIC8vY29uc29sZS5sb2coJ3VwZGF0ZWQgbG9jYWwgY29weScpO1xuICB9KTtcbn1cblxuLyoqXG4gKiBDcmVhdGUgcmVzdGF1cmFudCBvcGVyYXRpbmcgaG91cnMgSFRNTCB0YWJsZSBhbmQgYWRkIGl0IHRvIHRoZSB3ZWJwYWdlLlxuICovXG5maWxsUmVzdGF1cmFudEhvdXJzSFRNTCA9IChvcGVyYXRpbmdIb3VycyA9IHNlbGYucmVzdGF1cmFudC5vcGVyYXRpbmdfaG91cnMpID0+IHtcbiAgY29uc3QgaG91cnMgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgncmVzdGF1cmFudC1ob3VycycpO1xuICBob3Vycy5pbm5lckhUTUwgPSAnJztcbiAgZm9yIChsZXQga2V5IGluIG9wZXJhdGluZ0hvdXJzKSB7XG4gICAgY29uc3Qgcm93ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgndHInKTtcblxuICAgIGNvbnN0IGRheSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3RkJyk7XG4gICAgZGF5LmlubmVySFRNTCA9IGtleTtcbiAgICBkYXkuY2xhc3NOYW1lID0gJ29wZW5ob3Vycy1kYXknO1xuICAgIHJvdy5hcHBlbmRDaGlsZChkYXkpO1xuXG4gICAgY29uc3QgdGltZSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3RkJyk7XG4gICAgdGltZS5pbm5lckhUTUwgPSBvcGVyYXRpbmdIb3Vyc1trZXldO1xuICAgIHRpbWUuY2xhc3NOYW1lID0gJ29wZW5ob3Vycy10aW1lJztcbiAgICByb3cuYXBwZW5kQ2hpbGQodGltZSk7XG5cbiAgICBob3Vycy5hcHBlbmRDaGlsZChyb3cpO1xuICB9XG59XG5cbi8qKlxuICogQ3JlYXRlIGFsbCByZXZpZXdzIEhUTUwgYW5kIGFkZCB0aGVtIHRvIHRoZSB3ZWJwYWdlLlxuICovXG5maWxsUmV2aWV3c0hUTUwgPSAocmV2aWV3cyA9IHNlbGYucmV2aWV3cykgPT4ge1xuICBjb25zdCBjb250YWluZXIgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgncmV2aWV3cy1jb250YWluZXInKTtcbiAgY29uc3QgdWwgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgncmV2aWV3cy1saXN0Jyk7XG4gIGZpbGxTdWJtaXRSZXZpZXdGb3JtSFRNTCh1bCk7XG5cbiAgaWYgKHJldmlld3MubGVuZ3RoID09PSAwKSB7XG4gICAgY29uc3Qgbm9SZXZpZXdzID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgncCcpO1xuICAgIG5vUmV2aWV3cy5pbm5lckhUTUwgPSAnTm8gcmV2aWV3cyB5ZXQhJztcbiAgICBjb250YWluZXIuYXBwZW5kQ2hpbGQobm9SZXZpZXdzKTtcbiAgICByZXR1cm47XG4gIH1cblxuICByZXZpZXdzLmZvckVhY2gocmV2aWV3ID0+IHtcbiAgICB1bC5hcHBlbmRDaGlsZChjcmVhdGVSZXZpZXdIVE1MKHJldmlldykpO1xuICB9KTtcbn1cblxuLyoqXG4gKiBDcmVhdGUgcmV2aWV3IEhUTUwgYW5kIGFkZCBpdCB0byB0aGUgd2VicGFnZS5cbiAqL1xuY3JlYXRlUmV2aWV3SFRNTCA9IChyZXZpZXcpID0+IHtcbiAgY29uc3QgbGkgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdsaScpO1xuICBjb25zdCBuYW1lID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgncCcpO1xuICBuYW1lLmlubmVySFRNTCA9IHJldmlldy5uYW1lO1xuICBuYW1lLmNsYXNzTmFtZSA9ICdyZXZpZXctbmFtZSc7XG4gIG5hbWUudGl0bGUgPSBcInJldmlld2VyJ3MgbmFtZVwiO1xuICBsaS5hcHBlbmRDaGlsZChuYW1lKTtcblxuICBjb25zdCBkYXRlID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgncCcpO1xuICBjb25zdCBvcHRpb25zID0ge21vbnRoOiAnbG9uZycsIGRheTogJ251bWVyaWMnLCB5ZWFyOiAnbnVtZXJpYyd9O1xuICBjb25zdCBjcmVhdGVkQXQgPSBuZXcgRGF0ZShyZXZpZXcuY3JlYXRlZEF0KS50b0xvY2FsZURhdGVTdHJpbmcoJ2VuLXVzJywgb3B0aW9ucyk7XG4gIGRhdGUuaW5uZXJIVE1MID0gY3JlYXRlZEF0O1xuICBkYXRlLmNsYXNzTmFtZSA9ICdyZXZpZXctZGF0ZSc7XG4gIGRhdGUudGl0bGUgPSAnZGF0ZSB3aGVuIHJldmlldyB3YXMgcG9zdGVkJztcbiAgbGkuYXBwZW5kQ2hpbGQoZGF0ZSk7XG5cbiAgY29uc3QgcmF0aW5nID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgncCcpO1xuICByYXRpbmcuaW5uZXJIVE1MID0gYFJhdGluZzogJHtyZXZpZXcucmF0aW5nfWA7XG4gIHJhdGluZy5jbGFzc05hbWUgPSAncmV2aWV3LXJhdGluZyc7XG4gIHJhdGluZy50aXRsZSA9ICdnaXZlbiByYXRpbmcnO1xuICBsaS5hcHBlbmRDaGlsZChyYXRpbmcpO1xuXG4gIGNvbnN0IGNvbW1lbnRzID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgncCcpO1xuICBjb21tZW50cy5pbm5lckhUTUwgPSByZXZpZXcuY29tbWVudHM7XG4gIGNvbW1lbnRzLmNsYXNzTmFtZSA9ICdyZXZpZXctY29tbWVudHMnO1xuICBjb21tZW50cy50aXRsZSA9ICdjb21tZW50cyBmcm9tIHRoZSByZXZpZXdlcic7XG4gIGxpLmFwcGVuZENoaWxkKGNvbW1lbnRzKTtcblxuICByZXR1cm4gbGk7XG59XG5cbi8qKlxuICogIENyZWF0ZSBhIEhUTUwgc3VibWl0IGZvcm0gYW5kIGFkZCBpdCB0byB0aGUgd2VicGFnZS5cbiAqL1xuZmlsbFN1Ym1pdFJldmlld0Zvcm1IVE1MID0gKHVsLCByZXN0YXVyYW50ID0gc2VsZi5yZXN0YXVyYW50KSA9PiB7XG4gIGNvbnN0IGxpID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnbGknKTtcbiAgY29uc3QgZm9ybSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2Zvcm0nKTtcbiAgZm9ybS5pZCA9ICdmb3JtLXJldmlldyc7XG4gIGZvcm0ubWV0aG9kID0gJ1BPU1QnO1xuICBmb3JtLnNldEF0dHJpYnV0ZSgnYXJpYS1sYWJlbCcsICdBZGQgcmV2aWV3IGZvciByZXN0YXVyYW50Jyk7XG5cbiAgY29uc3QgcmVzdGF1cmFudElEID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnaW5wdXQnKTtcbiAgcmVzdGF1cmFudElELmlkID0gJ3Jlc3RhdXJhbnRfaWQnO1xuICByZXN0YXVyYW50SUQubmFtZSA9ICdyZXN0YXVyYW50X2lkJztcbiAgcmVzdGF1cmFudElELnR5cGUgPSAnaGlkZGVuJztcbiAgcmVzdGF1cmFudElELnZhbHVlID0gcmVzdGF1cmFudC5pZDtcbiAgZm9ybS5hcHBlbmRDaGlsZChyZXN0YXVyYW50SUQpO1xuXG4gIGNvbnN0IG5hbWVTaGVsbCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3AnKTtcbiAgbmFtZVNoZWxsLmNsYXNzTmFtZSA9ICdyZXZpZXctbmFtZSc7XG4gIGNvbnN0IG5hbWVMYmwgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdsYWJlbCcpO1xuICBuYW1lTGJsLmlubmVySFRNTCA9ICcqTmFtZTonO1xuICBuYW1lTGJsLmZvciA9ICd1TmFtZSc7XG4gIG5hbWVMYmwudGl0bGUgPSBcInJldmlld2VyJ3MgbmFtZVwiO1xuICBuYW1lU2hlbGwuYXBwZW5kQ2hpbGQobmFtZUxibCk7XG5cbiAgY29uc3QgbmFtZUlucHV0ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnaW5wdXQnKTtcbiAgbmFtZUlucHV0LmlkID0gJ3VOYW1lJztcbiAgbmFtZUlucHV0Lm5hbWUgPSAnbmFtZSdcbiAgbmFtZUlucHV0LnBsYWNlaG9sZGVyID0gJ1lvdXIgTmFtZSc7XG4gIG5hbWVJbnB1dC5zZXRBdHRyaWJ1dGUoJ2FyaWEtcmVxdWlyZWQnLCAndHJ1ZScpXG4gIG5hbWVJbnB1dC5zZXRBdHRyaWJ1dGUoJ2FyaWEtbGFiZWwnLCAnWW91ciBuYW1lJyk7XG4gIG5hbWVMYmwuYXBwZW5kQ2hpbGQobmFtZUlucHV0KTtcbiAgZm9ybS5hcHBlbmRDaGlsZChuYW1lU2hlbGwpO1xuXG4gIGNvbnN0IGRhdGUgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdwJyk7XG4gIGNvbnN0IG9wdGlvbnMgPSB7bW9udGg6ICdsb25nJywgZGF5OiAnbnVtZXJpYycsIHllYXI6ICdudW1lcmljJ307XG4gIGNvbnN0IG5vdyA9IG5ldyBEYXRlKCkudG9Mb2NhbGVEYXRlU3RyaW5nKCdlbi11cycsIG9wdGlvbnMpO1xuICBkYXRlLmlubmVySFRNTCA9IG5vdztcbiAgZGF0ZS5jbGFzc05hbWUgPSAncmV2aWV3LWRhdGUnO1xuICBkYXRlLnRpdGxlID0gJ2RhdGUgd2hlbiByZXZpZXcgaXMgcG9zdGVkJztcbiAgZm9ybS5hcHBlbmRDaGlsZChkYXRlKTtcblxuICBjb25zdCByYXRpbmdTaGVsbCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3AnKTtcbiAgcmF0aW5nU2hlbGwuY2xhc3NOYW1lID0gJ3Jldmlldy1yYXRpbmcnO1xuICBjb25zdCByYXRpbmdMYmwgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdsYWJlbCcpO1xuICByYXRpbmdMYmwuaW5uZXJIVE1MID0gJ1JhdGluZzonO1xuICBjb25zdCByYXRpbmdPcHRpb25zID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnc2VsZWN0Jyk7XG4gIHJhdGluZ09wdGlvbnMubmFtZSA9ICdyYXRpbmcnO1xuICBmb3IgKHZhciBpID0gMTsgaSA8PSA1OyBpKyspIHtcbiAgICBjb25zdCBvcHRpb24gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdvcHRpb24nKTtcbiAgICBvcHRpb24udmFsdWUgPSBpO1xuICAgIG9wdGlvbi5pbm5lckhUTUwgPSBpO1xuICAgIHJhdGluZ09wdGlvbnMuYXBwZW5kQ2hpbGQob3B0aW9uKTtcbiAgfVxuICByYXRpbmdMYmwuYXBwZW5kQ2hpbGQocmF0aW5nT3B0aW9ucyk7XG4gIHJhdGluZ1NoZWxsLmFwcGVuZENoaWxkKHJhdGluZ0xibCk7XG4gIGZvcm0uYXBwZW5kQ2hpbGQocmF0aW5nU2hlbGwpO1xuXG4gIGNvbnN0IGNvbW1lbnRzU2hlbGwgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdwJyk7XG4gIGNvbW1lbnRzU2hlbGwuY2xhc3NOYW1lID0gJ3Jldmlldy1jb21tZW50cyc7XG4gIGNvbnN0IGNvbW1lbnRzTGJsID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnbGFiZWwnKTtcbiAgY29tbWVudHNMYmwuaW5uZXJIVE1MID0gJypDb21tZW50czonO1xuICBjb25zdCBjb21tZW50c1RleHQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCd0ZXh0YXJlYScpO1xuICBjb21tZW50c1RleHQubmFtZSA9ICdjb21tZW50cyc7XG4gIGNvbW1lbnRzVGV4dC5pZCA9ICdjb21tZW50c1RleHQnO1xuICBjb21tZW50c1RleHQuc2V0QXR0cmlidXRlKCdhcmlhLXJlcXVpcmVkJywgJ3RydWUnKVxuICBjb21tZW50c1RleHQuc2V0QXR0cmlidXRlKCdhcmlhLWxhYmVsJywgJ0FkZGl0aW9uYWwgY29tbWVudHMgZm9yIHRoZSByZXZpZXcnKTtcbiAgY29tbWVudHNTaGVsbC5hcHBlbmRDaGlsZChjb21tZW50c0xibCk7XG4gIGNvbW1lbnRzU2hlbGwuYXBwZW5kQ2hpbGQoY29tbWVudHNUZXh0KTtcbiAgZm9ybS5hcHBlbmRDaGlsZChjb21tZW50c1NoZWxsKTtcblxuICBjb25zdCBzdWJtaXRTaGVsbCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3AnKTtcbiAgY29uc3Qgc3VibWl0QnRuID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnYnV0dG9uJyk7XG4gIHN1Ym1pdEJ0bi5pZCA9ICdzdWJtaXRCdG4nO1xuICBzdWJtaXRCdG4udHlwZSA9ICdzdWJtaXQnO1xuICBzdWJtaXRCdG4uaW5uZXJIVE1MID0gJ1N1Ym1pdCBSZXZpZXchJztcbiAgc3VibWl0QnRuLnZhbHVlID0gJ1N1Ym1pdCc7XG4gIHN1Ym1pdEJ0bi5zZXRBdHRyaWJ1dGUoJ2FyaWEtbGFiZWwnLCAnU3VibWl0IHJldmlldycpO1xuICBzdWJtaXRTaGVsbC5hcHBlbmRDaGlsZChzdWJtaXRCdG4pO1xuICBmb3JtLmFwcGVuZENoaWxkKHN1Ym1pdFNoZWxsKTtcblxuICBsaS5hcHBlbmRDaGlsZChmb3JtKTtcbiAgdWwuYXBwZW5kQ2hpbGQobGkpO1xuXG4gIGZvcm0uYWRkRXZlbnRMaXN0ZW5lcihcInN1Ym1pdFwiLCBmdW5jdGlvbiAoZXZlbnQpIHtcbiAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuXG4gICAgc3VibWl0UmV2aWV3KGZvcm0pO1xuICB9KTtcbn1cblxuLyoqXG4qIFN1Ym1pdCByZXZpZXdzIHRob3VnaCBqYXZhc2NyaXB0LlxuKi9cbnN1Ym1pdFJldmlldyA9IChmb3JtKSA9PiB7XG4gIC8vIEJpbmQgdGhlIEZvcm1EYXRhIG9iamVjdCBhbmQgdGhlIGZvcm0gZWxlbWVudFxuICBjb25zdCBGRCA9IG5ldyBGb3JtRGF0YShmb3JtKTtcblxuICBjb25zdCByZXZpZXcgPSB7fTtcbiAgbGV0IGJhZERhdGEgPSBmYWxzZTtcbiAgRkQuZm9yRWFjaChmdW5jdGlvbih2YWx1ZSwga2V5KSB7XG4gICAgY29uc3Qgc2FmZVN0ciA9IGVzY2FwZSh2YWx1ZSk7XG4gICAgaWYgKHNhZmVTdHIgPT09ICcnKSB7XG4gICAgICBzaG93Tm90aWZpY2F0aW9uKGBPaCBubyEgU29tZXRoaW5nIHdlbnQgd3JvbmcsIHBsZWFzZSBjaGVjayAke2tleX0gZmllbGRgKTtcbiAgICAgIGJhZERhdGEgPSB0cnVlO1xuICAgIH1cbiAgICByZXZpZXdba2V5XSA9IHNhZmVTdHI7XG4gIH0pO1xuXG4gIC8vIGRvbid0IHBvc3QgYmFkbHkgZm9ybWVkIHJldmlld3NcbiAgaWYgKGJhZERhdGEpIHtcbiAgICByZXR1cm47XG4gIH1cblxuICBsZXQgdWwgPSBmb3JtLnBhcmVudE5vZGUucGFyZW50Tm9kZTtcblxuICBjb25zdCBvcHRpb25zID0ge21vbnRoOiAnbG9uZycsIGRheTogJ251bWVyaWMnLCB5ZWFyOiAnbnVtZXJpYyd9O1xuICBjb25zdCBub3cgPSBuZXcgRGF0ZSgpLnRvTG9jYWxlRGF0ZVN0cmluZygnZW4tdXMnLCBvcHRpb25zKTtcbiAgcmV2aWV3WydjcmVhdGVkQXQnXSA9IG5vdztcbiAgREJIZWxwZXIuX3VwZGF0ZURCKCdyZXZpZXdzJywgcmV2aWV3KTtcblxuICByZXZpZXcubmFtZSA9IHVuZXNjYXBlKHJldmlldy5uYW1lKTtcbiAgcmV2aWV3LmNvbW1lbnRzID0gdW5lc2NhcGUocmV2aWV3LmNvbW1lbnRzKTtcbiAgbGV0IHJldmlld05vZGUgPSBjcmVhdGVSZXZpZXdIVE1MKHJldmlldyk7XG5cbiAgcmV0dXJuIGZldGNoKCdhcGkvYWRkJywge1xuICAgIG1ldGhvZDogJ1BPU1QnLFxuICAgIGJvZHk6IGByZXN0YXVyYW50X2lkPSR7cmV2aWV3LnJlc3RhdXJhbnRfaWR9Jm5hbWU9JHtyZXZpZXcubmFtZX0mcmF0aW5nPSR7cmV2aWV3LnJhdGluZ30mY29tbWVudHM9JHtyZXZpZXcuY29tbWVudHN9YFxuICB9KS50aGVuKHJlc3BvbnNlID0+IHtcbiAgICB1bC5pbnNlcnRCZWZvcmUocmV2aWV3Tm9kZSwgZm9ybS5wYXJlbnROb2RlKTtcbiAgICB1bC5yZW1vdmVDaGlsZChmb3JtLnBhcmVudE5vZGUpO1xuICAgIHNob3dOb3RpZmljYXRpb24oJ1lvdXIgcmV2aWV3IGhhcyBiZWVuIHBvc3RlZC4nLCAzKTtcbiAgfSkuY2F0Y2goZXJyID0+IHtcbiAgICB1bC5pbnNlcnRCZWZvcmUocmV2aWV3Tm9kZSwgZm9ybS5wYXJlbnROb2RlKTtcbiAgICB1bC5yZW1vdmVDaGlsZChmb3JtLnBhcmVudE5vZGUpO1xuICAgIHNob3dOb3RpZmljYXRpb24oJ09mZmxpbmUhIFlvdXIgcmV2aWV3IHdpbGwgYmUgcG9zdGVkIGFzIHNvb24gYXMgcG9zc2libGUuJywgMyk7XG4gIH0pO1xufVxuXG4vKipcbiAqIEFkZCByZXN0YXVyYW50IG5hbWUgdG8gdGhlIGJyZWFkY3J1bWIgbmF2aWdhdGlvbiBtZW51XG4gKi9cbmZpbGxCcmVhZGNydW1iID0gKHJlc3RhdXJhbnQgPSBzZWxmLnJlc3RhdXJhbnQpID0+IHtcbiAgY29uc3QgYnJlYWRjcnVtYiA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdicmVhZGNydW1iJyk7XG4gIHJlc2V0QnJlYWRjcnVtYihicmVhZGNydW1iKTtcbiAgY29uc3QgbGkgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdsaScpO1xuICBsaS5zZXRBdHRyaWJ1dGUoJ2FyaWEtY3VycmVudCcsICdwYWdlJylcbiAgbGkuaW5uZXJIVE1MID0gcmVzdGF1cmFudC5uYW1lO1xuICBicmVhZGNydW1iLmFwcGVuZENoaWxkKGxpKTtcbn1cblxuLyoqXG4gKiBDbGVhciBicmVhZGNydW1iLCByZW1vdmVzIGFsbCBlbnRpdGllcyBleGNlcHQgZmlyc3QsIEhvbWUuXG4gKi9cbnJlc2V0QnJlYWRjcnVtYiA9IChicmVhZGNydW1iKSA9PiB7XG4gIGNvbnN0IGxlbmd0aCA9IGJyZWFkY3J1bWIuY2hpbGRyZW4ubGVuZ3RoO1xuICBmb3IgKGxldCBpID0gMTsgaSA8IGxlbmd0aDsgaSsrKSB7XG4gICAgYnJlYWRjcnVtYi5yZW1vdmVDaGlsZChicmVhZGNydW1iLmNoaWxkcmVuLml0ZW0oaSkpO1xuICB9XG59XG5cbi8qKlxuICogR2V0IGEgcGFyYW1ldGVyIGJ5IG5hbWUgZnJvbSBwYWdlIFVSTC5cbiAqL1xuZ2V0UGFyYW1ldGVyQnlOYW1lID0gKG5hbWUsIHVybCkgPT4ge1xuICBpZiAoIXVybClcbiAgICB1cmwgPSB3aW5kb3cubG9jYXRpb24uaHJlZjtcbiAgbmFtZSA9IG5hbWUucmVwbGFjZSgvW1xcW1xcXV0vZywgJ1xcXFwkJicpO1xuICBjb25zdCByZWdleCA9IG5ldyBSZWdFeHAoYFs/Jl0ke25hbWV9KD0oW14mI10qKXwmfCN8JClgKSxcbiAgICByZXN1bHRzID0gcmVnZXguZXhlYyh1cmwpO1xuICBpZiAoIXJlc3VsdHMpXG4gICAgcmV0dXJuIG51bGw7XG4gIGlmICghcmVzdWx0c1syXSlcbiAgICByZXR1cm4gJyc7XG4gIHJldHVybiBkZWNvZGVVUklDb21wb25lbnQocmVzdWx0c1syXS5yZXBsYWNlKC9cXCsvZywgJyAnKSk7XG59XG4iXX0=
