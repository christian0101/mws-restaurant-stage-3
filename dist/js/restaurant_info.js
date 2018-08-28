let restaurant,reviews;var map;document.addEventListener("DOMContentLoaded",e=>{DBHelper.registerServiceWorker(),this._toastsView=new Toast,fetchRestaurantFromURL()}),window.initMap=(()=>{self.restaurant&&(self.map=new google.maps.Map(document.getElementById("map"),{zoom:16,center:self.restaurant.latlng,scrollwheel:!1}),DBHelper.mapMarkerForRestaurant(self.restaurant,self.map))}),fetchRestaurantFromURL=(()=>{if(self.restaurant)return;const e=getParameterByName("id");if(e)DBHelper.fetchDataById("restaurants",e,(t,n)=>{if(self.restaurant=n,!t||n)DBHelper.fetchReviewsByRestaurantId(e,(e,t)=>{if(self.reviews=t,e){this._toastsView.create(e)}fillRestaurantHTML(),Helper.lazyLoad()});else{this._toastsView.create(t)}});else{this._toastsView.create("No restaurant id in URL")}}),fillRestaurantHTML=((e=self.restaurant)=>{fillBreadcrumb();const t=document.getElementsByTagName("head")[0],n=document.createElement("meta");n.setAttribute("name","description"),n.setAttribute("content",`Detailed information about ${e.name}`),t.append(n);const a=document.getElementById("restaurant-name");a.innerHTML=e.name,a.title="restaurant name";const r=document.getElementById("restaurant-address");r.innerHTML=e.address,r.title="restaurant address";const i=DBHelper.imageUrlForRestaurant(e,!0),s=document.getElementById("restaurant-img");s.className="restaurant-img",s.classList.add("lazy"),s.src=i,s.setAttribute("data-src",DBHelper.imageUrlForRestaurant(e)),s.setAttribute("data-srcset",DBHelper.imageSRCSetUrlsForRestaurant(e,["1x","2x"])),s.alt=e.photograph?DBHelper.getPhotoDescription(e):"no picture found";const l=document.getElementById("restaurant-cuisine");l.innerHTML=e.cuisine_type,l.title="restaurant cuisine type",e.operating_hours&&fillRestaurantHoursHTML(),fillSubmitReviewFormHTML(),fillReviewsHTML()}),fillRestaurantHoursHTML=((e=self.restaurant.operating_hours)=>{const t=document.getElementById("restaurant-hours");for(let n in e){const a=document.createElement("tr"),r=document.createElement("td");r.innerHTML=n,r.className="openhours-day",a.appendChild(r);const i=document.createElement("td");i.innerHTML=e[n],i.className="openhours-time",a.appendChild(i),t.appendChild(a)}}),fillReviewsHTML=((e=self.reviews)=>{const t=document.getElementById("reviews-container"),n=document.createElement("h3");if(n.innerHTML="Reviews",t.appendChild(n),0===e.length){const e=document.createElement("p");return e.innerHTML="No reviews yet!",void t.appendChild(e)}const a=document.getElementById("reviews-list");e.forEach(e=>{a.appendChild(createReviewHTML(e))}),t.appendChild(a)}),createReviewHTML=(e=>{const t=document.createElement("li"),n=document.createElement("p");n.innerHTML=e.name,n.className="review-name",n.title="reviewer's name",t.appendChild(n);const a=document.createElement("p"),r=new Date(e.createdAt).toLocaleDateString("en-us",{month:"long",day:"numeric",year:"numeric"});a.innerHTML=r,a.className="review-date",a.title="date when review was posted",t.appendChild(a);const i=document.createElement("p");i.innerHTML=`Rating: ${e.rating}`,i.className="review-rating",i.title="given rating",t.appendChild(i);const s=document.createElement("p");return s.innerHTML=e.comments,s.className="review-comments",s.title="comments from the reviewer",t.appendChild(s),t}),fillSubmitReviewFormHTML=((e=self.restaurant)=>{const t=document.getElementById("reviews-list"),n=document.createElement("li"),a=document.createElement("form");a.action=`${DBHelper.DATABASE_URL}/reviews`,a.method="POST";const r=document.createElement("input");r.id="restaurant id",r.name="restaurant_id",r.type="hidden",r.value=e.id,a.appendChild(r);const i=document.createElement("p");i.className="review-name";const s=document.createElement("label");s.innerHTML="Name:",s.for="uName",s.title="reviewer's name",i.appendChild(s);const l=document.createElement("input");l.id="uName",l.name="name",s.appendChild(l),a.appendChild(i);const m=document.createElement("p"),c=(new Date).toLocaleDateString("en-us",{month:"long",day:"numeric",year:"numeric"});m.innerHTML=c,m.className="review-date",m.title="date when review is posted",a.appendChild(m);const d=document.createElement("p");d.className="review-rating";const o=document.createElement("label");o.innerHTML="Rating:";const u=document.createElement("select");u.name="rating";for(var p=1;p<=5;p++){const e=document.createElement("option");e.value=p,e.innerHTML=p,u.appendChild(e)}o.appendChild(u),d.appendChild(o),a.appendChild(d);const h=document.createElement("p");h.className="review-comments";const w=document.createElement("label");w.innerHTML="Comments:";const g=document.createElement("textarea");g.name="comments",h.appendChild(w),h.appendChild(g),a.appendChild(h);const E=document.createElement("p"),f=document.createElement("button");f.className="review-rating",f.type="submit",f.innerHTML="Submit review!",E.appendChild(f),a.appendChild(E),n.appendChild(a),t.appendChild(n)}),fillBreadcrumb=((e=self.restaurant)=>{const t=document.getElementById("breadcrumb"),n=document.createElement("li");n.setAttribute("aria-current","page"),n.innerHTML=e.name,t.appendChild(n)}),getParameterByName=((e,t)=>{t||(t=window.location.href),e=e.replace(/[\[\]]/g,"\\$&");const n=new RegExp(`[?&]${e}(=([^&#]*)|&|#|$)`).exec(t);return n?n[2]?decodeURIComponent(n[2].replace(/\+/g," ")):"":null});
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInJlc3RhdXJhbnRfaW5mby5qcyJdLCJuYW1lcyI6WyJyZXN0YXVyYW50IiwicmV2aWV3cyIsIm1hcCIsImRvY3VtZW50IiwiYWRkRXZlbnRMaXN0ZW5lciIsImV2ZW50IiwiREJIZWxwZXIiLCJyZWdpc3RlclNlcnZpY2VXb3JrZXIiLCJ0aGlzIiwiX3RvYXN0c1ZpZXciLCJUb2FzdCIsImZldGNoUmVzdGF1cmFudEZyb21VUkwiLCJ3aW5kb3ciLCJpbml0TWFwIiwic2VsZiIsImdvb2dsZSIsIm1hcHMiLCJNYXAiLCJnZXRFbGVtZW50QnlJZCIsInpvb20iLCJjZW50ZXIiLCJsYXRsbmciLCJzY3JvbGx3aGVlbCIsIm1hcE1hcmtlckZvclJlc3RhdXJhbnQiLCJpZCIsImdldFBhcmFtZXRlckJ5TmFtZSIsImZldGNoRGF0YUJ5SWQiLCJlcnJvciIsImZldGNoUmV2aWV3c0J5UmVzdGF1cmFudElkIiwiY3JlYXRlIiwiZmlsbFJlc3RhdXJhbnRIVE1MIiwiSGVscGVyIiwibGF6eUxvYWQiLCJmaWxsQnJlYWRjcnVtYiIsImhlYWQiLCJnZXRFbGVtZW50c0J5VGFnTmFtZSIsImRlc2NyaXB0aW9uIiwiY3JlYXRlRWxlbWVudCIsInNldEF0dHJpYnV0ZSIsIm5hbWUiLCJhcHBlbmQiLCJpbm5lckhUTUwiLCJ0aXRsZSIsImFkZHJlc3MiLCJpbWdTcmMiLCJpbWFnZVVybEZvclJlc3RhdXJhbnQiLCJpbWFnZSIsImNsYXNzTmFtZSIsImNsYXNzTGlzdCIsImFkZCIsInNyYyIsImltYWdlU1JDU2V0VXJsc0ZvclJlc3RhdXJhbnQiLCJhbHQiLCJnZXRQaG90b0Rlc2NyaXB0aW9uIiwiY3Vpc2luZSIsImN1aXNpbmVfdHlwZSIsIm9wZXJhdGluZ19ob3VycyIsImZpbGxSZXN0YXVyYW50SG91cnNIVE1MIiwiZmlsbFN1Ym1pdFJldmlld0Zvcm1IVE1MIiwiZmlsbFJldmlld3NIVE1MIiwib3BlcmF0aW5nSG91cnMiLCJob3VycyIsImtleSIsInJvdyIsImRheSIsImFwcGVuZENoaWxkIiwidGltZSIsImNvbnRhaW5lciIsImxlbmd0aCIsIm5vUmV2aWV3cyIsInVsIiwiZm9yRWFjaCIsInJldmlldyIsImNyZWF0ZVJldmlld0hUTUwiLCJsaSIsImRhdGUiLCJjcmVhdGVkQXQiLCJEYXRlIiwidG9Mb2NhbGVEYXRlU3RyaW5nIiwibW9udGgiLCJ5ZWFyIiwicmF0aW5nIiwiY29tbWVudHMiLCJmb3JtIiwiYWN0aW9uIiwiREFUQUJBU0VfVVJMIiwibWV0aG9kIiwicmVzdGF1cmFudElEIiwidHlwZSIsInZhbHVlIiwibmFtZVNoZWxsIiwibmFtZUxibCIsImZvciIsIm5hbWVJbnB1dCIsIm5vdyIsInJhdGluZ1NoZWxsIiwicmF0aW5nTGJsIiwicmF0aW5nT3B0aW9ucyIsImkiLCJvcHRpb24iLCJjb21tZW50c1NoZWxsIiwiY29tbWVudHNMYmwiLCJjb21tZW50c1RleHQiLCJzdWJtaXRTaGVsbCIsInN1Ym1pdEJ0biIsImJyZWFkY3J1bWIiLCJ1cmwiLCJsb2NhdGlvbiIsImhyZWYiLCJyZXBsYWNlIiwicmVzdWx0cyIsIlJlZ0V4cCIsImV4ZWMiLCJkZWNvZGVVUklDb21wb25lbnQiXSwibWFwcGluZ3MiOiJBQUFBLElBQUlBLFdBQVlDLFFBQ2hCLElBQUlDLElBS0pDLFNBQVNDLGlCQUFpQixtQkFBcUJDLElBQzdDQyxTQUFTQyx3QkFDVEMsS0FBS0MsWUFBYyxJQUFJQyxNQUN2QkMsMkJBT0ZDLE9BQU9DLFFBQVUsTUFDWEMsS0FBS2QsYUFDUGMsS0FBS1osSUFBTSxJQUFJYSxPQUFPQyxLQUFLQyxJQUFJZCxTQUFTZSxlQUFlLE9BQVEsQ0FDN0RDLEtBQU0sR0FDTkMsT0FBUU4sS0FBS2QsV0FBV3FCLE9BQ3hCQyxhQUFhLElBRWZoQixTQUFTaUIsdUJBQXVCVCxLQUFLZCxXQUFZYyxLQUFLWixRQU8xRFMsdUJBQXlCLE1BQ3ZCLEdBQUlHLEtBQUtkLFdBRVAsT0FFRixNQUFNd0IsRUFBS0MsbUJBQW1CLE1BQzlCLEdBQUtELEVBS0hsQixTQUFTb0IsY0FB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RUFBS2xCLFlBQVltQyxHQUVqQixNQUFNRyxFQUFjcEcsU0FBU2tDLGNBQWMsS0FDckNtRSxFQUFZckcsU0FBU2tDLGNBQWMsVUFDekNtRSxFQUFVekQsVUFBWSxnQkFDdEJ5RCxFQUFVaEIsS0FBTyxTQUNqQmdCLEVBQVUvRCxVQUFZLGlCQUN0QjhELEVBQVl0QyxZQUFZdUMsR0FDeEJyQixFQUFLbEIsWUFBWXNDLEdBRWpCN0IsRUFBR1QsWUFBWWtCLEdBQ2ZiLEVBQUdMLFlBQVlTLEtBTWpCekMsZUFBaUIsRUFBQ2pDLEVBQWFjLEtBQUtkLGNBQ2xDLE1BQU15RyxFQUFhdEcsU0FBU2UsZUFBZSxjQUNyQ3dELEVBQUt2RSxTQUFTa0MsY0FBYyxNQUNsQ3FDLEVBQUdwQyxhQUFhLGVBQWdCLFFBQ2hDb0MsRUFBR2pDLFVBQVl6QyxFQUFXdUMsS0FDMUJrRSxFQUFXeEMsWUFBWVMsS0FNekJqRCxtQkFBcUIsRUFBQ2MsRUFBTW1FLEtBQ3JCQSxJQUNIQSxFQUFNOUYsT0FBTytGLFNBQVNDLE1BQ3hCckUsRUFBT0EsRUFBS3NFLFFBQVEsVUFBVyxRQUMvQixNQUNFQyxFQURZLElBQUlDLGNBQWN4RSxzQkFDZHlFLEtBQUtOLEdBQ3ZCLE9BQUtJLEVBRUFBLEVBQVEsR0FFTkcsbUJBQW1CSCxFQUFRLEdBQUdELFFBQVEsTUFBTyxNQUQzQyxHQUZBIiwiZmlsZSI6InJlc3RhdXJhbnRfaW5mby5qcyIsInNvdXJjZXNDb250ZW50IjpbImxldCByZXN0YXVyYW50LCByZXZpZXdzO1xudmFyIG1hcDtcblxuLyoqXG4gKiBGZXRjaCBkYXRhIGFzIHNvb24gYXMgdGhlIHBhZ2UgaXMgbG9hZGVkLlxuICovXG5kb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKCdET01Db250ZW50TG9hZGVkJywgKGV2ZW50KSA9PiB7XG4gIERCSGVscGVyLnJlZ2lzdGVyU2VydmljZVdvcmtlcigpO1xuICB0aGlzLl90b2FzdHNWaWV3ID0gbmV3IFRvYXN0KCk7XG4gIGZldGNoUmVzdGF1cmFudEZyb21VUkwoKTtcbn0pO1xuXG5cbi8qKlxuICogSW5pdGlhbGl6ZSBHb29nbGUgbWFwLCBjYWxsZWQgZnJvbSBIVE1MLlxuICovXG53aW5kb3cuaW5pdE1hcCA9ICgpID0+IHtcbiAgaWYgKHNlbGYucmVzdGF1cmFudCkge1xuICAgIHNlbGYubWFwID0gbmV3IGdvb2dsZS5tYXBzLk1hcChkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnbWFwJyksIHtcbiAgICAgIHpvb206IDE2LFxuICAgICAgY2VudGVyOiBzZWxmLnJlc3RhdXJhbnQubGF0bG5nLFxuICAgICAgc2Nyb2xsd2hlZWw6IGZhbHNlXG4gICAgfSk7XG4gICAgREJIZWxwZXIubWFwTWFya2VyRm9yUmVzdGF1cmFudChzZWxmLnJlc3RhdXJhbnQsIHNlbGYubWFwKTtcbiAgfVxufVxuXG4vKipcbiAqIEdldCBjdXJyZW50IHJlc3RhdXJhbnQgZnJvbSBwYWdlIFVSTC5cbiAqL1xuZmV0Y2hSZXN0YXVyYW50RnJvbVVSTCA9ICgpID0+IHtcbiAgaWYgKHNlbGYucmVzdGF1cmFudCkgeyAvLyByZXN0YXVyYW50IGFscmVhZHkgZmV0Y2hlZCFcbiAgICAvL2NhbGxiYWNrKG51bGwsIHNlbGYucmVzdGF1cmFudClcbiAgICByZXR1cm47XG4gIH1cbiAgY29uc3QgaWQgPSBnZXRQYXJhbWV0ZXJCeU5hbWUoJ2lkJyk7XG4gIGlmICghaWQpIHtcbiAgICAvLyBubyBpZCBmb3VuZCBpbiBVUkxcbiAgICBjb25zdCBlcnJvciA9IHRoaXMuX3RvYXN0c1ZpZXcuY3JlYXRlKCdObyByZXN0YXVyYW50IGlkIGluIFVSTCcpO1xuICAgIHJldHVybjtcbiAgfSBlbHNlIHtcbiAgICBEQkhlbHBlci5mZXRjaERhdGFCeUlkKCdyZXN0YXVyYW50cycsIGlkLCAoZXJyb3IsIHJlc3RhdXJhbnQpID0+IHtcbiAgICAgIHNlbGYucmVzdGF1cmFudCA9IHJlc3RhdXJhbnQ7XG4gICAgICBpZiAoZXJyb3IgJiYgIXJlc3RhdXJhbnQpIHtcbiAgICAgICAgY29uc3QgbmV0d29ya1dhcm5pbmcgPSB0aGlzLl90b2FzdHNWaWV3LmNyZWF0ZShlcnJvcik7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cblxuICAgICAgREJIZWxwZXIuZmV0Y2hSZXZpZXdzQnlSZXN0YXVyYW50SWQoaWQsIChlcnJvciwgcmV2aWV3cykgPT4ge1xuICAgICAgICBzZWxmLnJldmlld3MgPSByZXZpZXdzO1xuICAgICAgICBpZiAoZXJyb3IpIHtcbiAgICAgICAgICBjb25zdCBuZXR3b3JrV2FybmluZyA9IHRoaXMuX3RvYXN0c1ZpZXcuY3JlYXRlKGVycm9yKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGZpbGxSZXN0YXVyYW50SFRNTCgpO1xuICAgICAgICBIZWxwZXIubGF6eUxvYWQoKTtcbiAgICAgICAgfSk7XG4gICAgfSk7XG4gIH1cbn1cblxuLyoqXG4gKiBDcmVhdGUgcmVzdGF1cmFudCBIVE1MIGFuZCBhZGQgaXQgdG8gdGhlIHdlYnBhZ2VcbiAqL1xuZmlsbFJlc3RhdXJhbnRIVE1MID0gKHJlc3RhdXJhbnQgPSBzZWxmLnJlc3RhdXJhbnQpID0+IHtcbiAgZmlsbEJyZWFkY3J1bWIoKTtcblxuICBjb25zdCBoZWFkID0gZG9jdW1lbnQuZ2V0RWxlbWVudHNCeVRhZ05hbWUoJ2hlYWQnKVswXTtcbiAgY29uc3QgZGVzY3JpcHRpb24gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdtZXRhJyk7XG4gIGRlc2NyaXB0aW9uLnNldEF0dHJpYnV0ZSgnbmFtZScsICdkZXNjcmlwdGlvbicpO1xuICBkZXNjcmlwdGlvbi5zZXRBdHRyaWJ1dGUoJ2NvbnRlbnQnLCBgRGV0YWlsZWQgaW5mb3JtYXRpb24gYWJvdXQgJHtyZXN0YXVyYW50Lm5hbWV9YCk7XG4gIGhlYWQuYXBwZW5kKGRlc2NyaXB0aW9uKTtcblxuICBjb25zdCBuYW1lID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3Jlc3RhdXJhbnQtbmFtZScpO1xuICBuYW1lLmlubmVySFRNTCA9IHJlc3RhdXJhbnQubmFtZTtcbiAgbmFtZS50aXRsZSA9ICdyZXN0YXVyYW50IG5hbWUnO1xuXG4gIGNvbnN0IGFkZHJlc3MgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgncmVzdGF1cmFudC1hZGRyZXNzJyk7XG4gIGFkZHJlc3MuaW5uZXJIVE1MID0gcmVzdGF1cmFudC5hZGRyZXNzO1xuICBhZGRyZXNzLnRpdGxlID0gJ3Jlc3RhdXJhbnQgYWRkcmVzcyc7XG5cbiAgY29uc3QgaW1nU3JjID0gREJIZWxwZXIuaW1hZ2VVcmxGb3JSZXN0YXVyYW50KHJlc3RhdXJhbnQsIHRydWUpO1xuICBjb25zdCBpbWFnZSA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdyZXN0YXVyYW50LWltZycpO1xuICBpbWFnZS5jbGFzc05hbWUgPSAncmVzdGF1cmFudC1pbWcnO1xuICBpbWFnZS5jbGFzc0xpc3QuYWRkKCdsYXp5Jyk7XG4gIGltYWdlLnNyYyA9IGltZ1NyYztcbiAgaW1hZ2Uuc2V0QXR0cmlidXRlKCdkYXRhLXNyYycsIERCSGVscGVyLmltYWdlVXJsRm9yUmVzdGF1cmFudChyZXN0YXVyYW50KSk7XG4gIGltYWdlLnNldEF0dHJpYnV0ZSgnZGF0YS1zcmNzZXQnLCBEQkhlbHBlci5pbWFnZVNSQ1NldFVybHNGb3JSZXN0YXVyYW50KHJlc3RhdXJhbnQsIFsnMXgnLCAnMngnXSkpO1xuICBpbWFnZS5hbHQgPSAocmVzdGF1cmFudC5waG90b2dyYXBoKSA/IERCSGVscGVyLmdldFBob3RvRGVzY3JpcHRpb24ocmVzdGF1cmFudCkgOlxuICAnbm8gcGljdHVyZSBmb3VuZCc7XG5cbiAgY29uc3QgY3Vpc2luZSA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdyZXN0YXVyYW50LWN1aXNpbmUnKTtcbiAgY3Vpc2luZS5pbm5lckhUTUwgPSByZXN0YXVyYW50LmN1aXNpbmVfdHlwZTtcbiAgY3Vpc2luZS50aXRsZSA9ICdyZXN0YXVyYW50IGN1aXNpbmUgdHlwZSc7XG5cbiAgLy8gZmlsbCBvcGVyYXRpbmcgaG91cnNcbiAgaWYgKHJlc3RhdXJhbnQub3BlcmF0aW5nX2hvdXJzKSB7XG4gICAgZmlsbFJlc3RhdXJhbnRIb3Vyc0hUTUwoKTtcbiAgfVxuICAvLyBmaWxsIHN1Ym1pdCByZXZpZXcgZm9ybVxuICBmaWxsU3VibWl0UmV2aWV3Rm9ybUhUTUwoKTtcbiAgLy8gZmlsbCByZXZpZXdzXG4gIGZpbGxSZXZpZXdzSFRNTCgpO1xufVxuXG4vKipcbiAqIENyZWF0ZSByZXN0YXVyYW50IG9wZXJhdGluZyBob3VycyBIVE1MIHRhYmxlIGFuZCBhZGQgaXQgdG8gdGhlIHdlYnBhZ2UuXG4gKi9cbmZpbGxSZXN0YXVyYW50SG91cnNIVE1MID0gKG9wZXJhdGluZ0hvdXJzID0gc2VsZi5yZXN0YXVyYW50Lm9wZXJhdGluZ19ob3VycykgPT4ge1xuICBjb25zdCBob3VycyA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdyZXN0YXVyYW50LWhvdXJzJyk7XG4gIGZvciAobGV0IGtleSBpbiBvcGVyYXRpbmdIb3Vycykge1xuICAgIGNvbnN0IHJvdyA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3RyJyk7XG5cbiAgICBjb25zdCBkYXkgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCd0ZCcpO1xuICAgIGRheS5pbm5lckhUTUwgPSBrZXk7XG4gICAgZGF5LmNsYXNzTmFtZSA9ICdvcGVuaG91cnMtZGF5JztcbiAgICByb3cuYXBwZW5kQ2hpbGQoZGF5KTtcblxuICAgIGNvbnN0IHRpbWUgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCd0ZCcpO1xuICAgIHRpbWUuaW5uZXJIVE1MID0gb3BlcmF0aW5nSG91cnNba2V5XTtcbiAgICB0aW1lLmNsYXNzTmFtZSA9ICdvcGVuaG91cnMtdGltZSc7XG4gICAgcm93LmFwcGVuZENoaWxkKHRpbWUpO1xuXG4gICAgaG91cnMuYXBwZW5kQ2hpbGQocm93KTtcbiAgfVxufVxuXG4vKipcbiAqIENyZWF0ZSBhbGwgcmV2aWV3cyBIVE1MIGFuZCBhZGQgdGhlbSB0byB0aGUgd2VicGFnZS5cbiAqL1xuZmlsbFJldmlld3NIVE1MID0gKHJldmlld3MgPSBzZWxmLnJldmlld3MpID0+IHtcbiAgY29uc3QgY29udGFpbmVyID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3Jldmlld3MtY29udGFpbmVyJyk7XG4gIGNvbnN0IHRpdGxlID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnaDMnKTtcbiAgdGl0bGUuaW5uZXJIVE1MID0gJ1Jldmlld3MnO1xuICBjb250YWluZXIuYXBwZW5kQ2hpbGQodGl0bGUpO1xuXG4gIGlmIChyZXZpZXdzLmxlbmd0aCA9PT0gMCkge1xuICAgIGNvbnN0IG5vUmV2aWV3cyA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3AnKTtcbiAgICBub1Jldmlld3MuaW5uZXJIVE1MID0gJ05vIHJldmlld3MgeWV0ISc7XG4gICAgY29udGFpbmVyLmFwcGVuZENoaWxkKG5vUmV2aWV3cyk7XG4gICAgcmV0dXJuO1xuICB9XG4gIGNvbnN0IHVsID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3Jldmlld3MtbGlzdCcpO1xuICByZXZpZXdzLmZvckVhY2gocmV2aWV3ID0+IHtcbiAgICB1bC5hcHBlbmRDaGlsZChjcmVhdGVSZXZpZXdIVE1MKHJldmlldykpO1xuICB9KTtcbiAgY29udGFpbmVyLmFwcGVuZENoaWxkKHVsKTtcbn1cblxuLyoqXG4gKiBDcmVhdGUgcmV2aWV3IEhUTUwgYW5kIGFkZCBpdCB0byB0aGUgd2VicGFnZS5cbiAqL1xuY3JlYXRlUmV2aWV3SFRNTCA9IChyZXZpZXcpID0+IHtcbiAgY29uc3QgbGkgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdsaScpO1xuICBjb25zdCBuYW1lID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgncCcpO1xuICBuYW1lLmlubmVySFRNTCA9IHJldmlldy5uYW1lO1xuICBuYW1lLmNsYXNzTmFtZSA9ICdyZXZpZXctbmFtZSc7XG4gIG5hbWUudGl0bGUgPSBcInJldmlld2VyJ3MgbmFtZVwiO1xuICBsaS5hcHBlbmRDaGlsZChuYW1lKTtcblxuICBjb25zdCBkYXRlID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgncCcpO1xuICBjb25zdCBvcHRpb25zID0ge21vbnRoOiAnbG9uZycsIGRheTogJ251bWVyaWMnLCB5ZWFyOiAnbnVtZXJpYyd9O1xuICBjb25zdCBjcmVhdGVkQXQgPSBuZXcgRGF0ZShyZXZpZXcuY3JlYXRlZEF0KS50b0xvY2FsZURhdGVTdHJpbmcoJ2VuLXVzJywgb3B0aW9ucyk7XG4gIGRhdGUuaW5uZXJIVE1MID0gY3JlYXRlZEF0O1xuICBkYXRlLmNsYXNzTmFtZSA9ICdyZXZpZXctZGF0ZSc7XG4gIGRhdGUudGl0bGUgPSAnZGF0ZSB3aGVuIHJldmlldyB3YXMgcG9zdGVkJztcbiAgbGkuYXBwZW5kQ2hpbGQoZGF0ZSk7XG5cbiAgY29uc3QgcmF0aW5nID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgncCcpO1xuICByYXRpbmcuaW5uZXJIVE1MID0gYFJhdGluZzogJHtyZXZpZXcucmF0aW5nfWA7XG4gIHJhdGluZy5jbGFzc05hbWUgPSAncmV2aWV3LXJhdGluZyc7XG4gIHJhdGluZy50aXRsZSA9ICdnaXZlbiByYXRpbmcnO1xuICBsaS5hcHBlbmRDaGlsZChyYXRpbmcpO1xuXG4gIGNvbnN0IGNvbW1lbnRzID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgncCcpO1xuICBjb21tZW50cy5pbm5lckhUTUwgPSByZXZpZXcuY29tbWVudHM7XG4gIGNvbW1lbnRzLmNsYXNzTmFtZSA9ICdyZXZpZXctY29tbWVudHMnO1xuICBjb21tZW50cy50aXRsZSA9ICdjb21tZW50cyBmcm9tIHRoZSByZXZpZXdlcic7XG4gIGxpLmFwcGVuZENoaWxkKGNvbW1lbnRzKTtcblxuICByZXR1cm4gbGk7XG59XG5cbi8qKlxuICogIENyZWF0ZSBhIEhUTUwgc3VibWl0IGZvcm0gYW5kIGFkZCBpdCB0byB0aGUgd2VicGFnZS5cbiAqL1xuZmlsbFN1Ym1pdFJldmlld0Zvcm1IVE1MID0gKHJlc3RhdXJhbnQgPSBzZWxmLnJlc3RhdXJhbnQpID0+IHtcbiAgY29uc3QgdWwgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgncmV2aWV3cy1saXN0Jyk7XG5cbiAgY29uc3QgbGkgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdsaScpO1xuICBjb25zdCBmb3JtID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZm9ybScpO1xuICBmb3JtLmFjdGlvbiA9IGAke0RCSGVscGVyLkRBVEFCQVNFX1VSTH0vcmV2aWV3c2A7XG4gIGZvcm0ubWV0aG9kID0gJ1BPU1QnO1xuXG4gIGNvbnN0IHJlc3RhdXJhbnRJRCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2lucHV0Jyk7XG4gIHJlc3RhdXJhbnRJRC5pZCA9ICdyZXN0YXVyYW50IGlkJztcbiAgcmVzdGF1cmFudElELm5hbWUgPSAncmVzdGF1cmFudF9pZCc7XG4gIHJlc3RhdXJhbnRJRC50eXBlID0gJ2hpZGRlbic7XG4gIHJlc3RhdXJhbnRJRC52YWx1ZSA9IHJlc3RhdXJhbnQuaWQ7XG4gIGZvcm0uYXBwZW5kQ2hpbGQocmVzdGF1cmFudElEKTtcblxuICBjb25zdCBuYW1lU2hlbGwgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdwJyk7XG4gIG5hbWVTaGVsbC5jbGFzc05hbWUgPSAncmV2aWV3LW5hbWUnO1xuICBjb25zdCBuYW1lTGJsID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnbGFiZWwnKTtcbiAgbmFtZUxibC5pbm5lckhUTUwgPSAnTmFtZTonO1xuICBuYW1lTGJsLmZvciA9ICd1TmFtZSc7XG4gIG5hbWVMYmwudGl0bGUgPSBcInJldmlld2VyJ3MgbmFtZVwiO1xuICBuYW1lU2hlbGwuYXBwZW5kQ2hpbGQobmFtZUxibCk7XG5cbiAgY29uc3QgbmFtZUlucHV0ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnaW5wdXQnKTtcbiAgbmFtZUlucHV0LmlkID0gJ3VOYW1lJztcbiAgbmFtZUlucHV0Lm5hbWUgPSAnbmFtZSdcbiAgbmFtZUxibC5hcHBlbmRDaGlsZChuYW1lSW5wdXQpO1xuICBmb3JtLmFwcGVuZENoaWxkKG5hbWVTaGVsbCk7XG5cbiAgY29uc3QgZGF0ZSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3AnKTtcbiAgY29uc3Qgb3B0aW9ucyA9IHttb250aDogJ2xvbmcnLCBkYXk6ICdudW1lcmljJywgeWVhcjogJ251bWVyaWMnfTtcbiAgY29uc3Qgbm93ID0gbmV3IERhdGUoKS50b0xvY2FsZURhdGVTdHJpbmcoJ2VuLXVzJywgb3B0aW9ucyk7XG4gIGRhdGUuaW5uZXJIVE1MID0gbm93O1xuICBkYXRlLmNsYXNzTmFtZSA9ICdyZXZpZXctZGF0ZSc7XG4gIGRhdGUudGl0bGUgPSAnZGF0ZSB3aGVuIHJldmlldyBpcyBwb3N0ZWQnO1xuICBmb3JtLmFwcGVuZENoaWxkKGRhdGUpO1xuXG4gIGNvbnN0IHJhdGluZ1NoZWxsID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgncCcpO1xuICByYXRpbmdTaGVsbC5jbGFzc05hbWUgPSAncmV2aWV3LXJhdGluZyc7XG4gIGNvbnN0IHJhdGluZ0xibCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2xhYmVsJyk7XG4gIHJhdGluZ0xibC5pbm5lckhUTUwgPSAnUmF0aW5nOic7XG4gIGNvbnN0IHJhdGluZ09wdGlvbnMgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdzZWxlY3QnKTtcbiAgcmF0aW5nT3B0aW9ucy5uYW1lID0gJ3JhdGluZyc7XG4gIGZvciAodmFyIGkgPSAxOyBpIDw9IDU7IGkrKykge1xuICAgIGNvbnN0IG9wdGlvbiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ29wdGlvbicpO1xuICAgIG9wdGlvbi52YWx1ZSA9IGk7XG4gICAgb3B0aW9uLmlubmVySFRNTCA9IGk7XG4gICAgcmF0aW5nT3B0aW9ucy5hcHBlbmRDaGlsZChvcHRpb24pO1xuICB9XG4gIHJhdGluZ0xibC5hcHBlbmRDaGlsZChyYXRpbmdPcHRpb25zKTtcbiAgcmF0aW5nU2hlbGwuYXBwZW5kQ2hpbGQocmF0aW5nTGJsKTtcbiAgZm9ybS5hcHBlbmRDaGlsZChyYXRpbmdTaGVsbCk7XG5cbiAgY29uc3QgY29tbWVudHNTaGVsbCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3AnKTtcbiAgY29tbWVudHNTaGVsbC5jbGFzc05hbWUgPSAncmV2aWV3LWNvbW1lbnRzJztcbiAgY29uc3QgY29tbWVudHNMYmwgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdsYWJlbCcpO1xuICBjb21tZW50c0xibC5pbm5lckhUTUwgPSAnQ29tbWVudHM6JztcbiAgY29uc3QgY29tbWVudHNUZXh0ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgndGV4dGFyZWEnKTtcbiAgY29tbWVudHNUZXh0Lm5hbWUgPSAnY29tbWVudHMnO1xuICBjb21tZW50c1NoZWxsLmFwcGVuZENoaWxkKGNvbW1lbnRzTGJsKTtcbiAgY29tbWVudHNTaGVsbC5hcHBlbmRDaGlsZChjb21tZW50c1RleHQpO1xuICBmb3JtLmFwcGVuZENoaWxkKGNvbW1lbnRzU2hlbGwpO1xuXG4gIGNvbnN0IHN1Ym1pdFNoZWxsID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgncCcpO1xuICBjb25zdCBzdWJtaXRCdG4gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdidXR0b24nKTtcbiAgc3VibWl0QnRuLmNsYXNzTmFtZSA9ICdyZXZpZXctcmF0aW5nJztcbiAgc3VibWl0QnRuLnR5cGUgPSAnc3VibWl0JztcbiAgc3VibWl0QnRuLmlubmVySFRNTCA9ICdTdWJtaXQgcmV2aWV3ISc7XG4gIHN1Ym1pdFNoZWxsLmFwcGVuZENoaWxkKHN1Ym1pdEJ0bik7XG4gIGZvcm0uYXBwZW5kQ2hpbGQoc3VibWl0U2hlbGwpO1xuXG4gIGxpLmFwcGVuZENoaWxkKGZvcm0pO1xuICB1bC5hcHBlbmRDaGlsZChsaSk7XG59XG5cbi8qKlxuICogQWRkIHJlc3RhdXJhbnQgbmFtZSB0byB0aGUgYnJlYWRjcnVtYiBuYXZpZ2F0aW9uIG1lbnVcbiAqL1xuZmlsbEJyZWFkY3J1bWIgPSAocmVzdGF1cmFudCA9IHNlbGYucmVzdGF1cmFudCkgPT4ge1xuICBjb25zdCBicmVhZGNydW1iID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2JyZWFkY3J1bWInKTtcbiAgY29uc3QgbGkgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdsaScpO1xuICBsaS5zZXRBdHRyaWJ1dGUoJ2FyaWEtY3VycmVudCcsICdwYWdlJylcbiAgbGkuaW5uZXJIVE1MID0gcmVzdGF1cmFudC5uYW1lO1xuICBicmVhZGNydW1iLmFwcGVuZENoaWxkKGxpKTtcbn1cblxuLyoqXG4gKiBHZXQgYSBwYXJhbWV0ZXIgYnkgbmFtZSBmcm9tIHBhZ2UgVVJMLlxuICovXG5nZXRQYXJhbWV0ZXJCeU5hbWUgPSAobmFtZSwgdXJsKSA9PiB7XG4gIGlmICghdXJsKVxuICAgIHVybCA9IHdpbmRvdy5sb2NhdGlvbi5ocmVmO1xuICBuYW1lID0gbmFtZS5yZXBsYWNlKC9bXFxbXFxdXS9nLCAnXFxcXCQmJyk7XG4gIGNvbnN0IHJlZ2V4ID0gbmV3IFJlZ0V4cChgWz8mXSR7bmFtZX0oPShbXiYjXSopfCZ8I3wkKWApLFxuICAgIHJlc3VsdHMgPSByZWdleC5leGVjKHVybCk7XG4gIGlmICghcmVzdWx0cylcbiAgICByZXR1cm4gbnVsbDtcbiAgaWYgKCFyZXN1bHRzWzJdKVxuICAgIHJldHVybiAnJztcbiAgcmV0dXJuIGRlY29kZVVSSUNvbXBvbmVudChyZXN1bHRzWzJdLnJlcGxhY2UoL1xcKy9nLCAnICcpKTtcbn1cbiJdfQ==