let newData={db:null,init:function(t){return newData.db?Promise.resolve(newData.db):idb.open("restaurantsData",1,function(n){n.createObjectStore(t,{autoIncrement:!0,keyPath:"id"})}).then(function(t){return newData.db=t})},data:function(t,n){return newData.init(t).then(function(e){return e.transaction(t,n).objectStore(t)})}};
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5ld0RhdGEuanMiXSwibmFtZXMiOlsibmV3RGF0YSIsImRiIiwiaW5pdCIsIm5hbWUiLCJQcm9taXNlIiwicmVzb2x2ZSIsImlkYiIsIm9wZW4iLCJ1cGdyYWRlRGIiLCJjcmVhdGVPYmplY3RTdG9yZSIsImF1dG9JbmNyZW1lbnQiLCJrZXlQYXRoIiwidGhlbiIsImRhdGEiLCJtb2RlIiwidHJhbnNhY3Rpb24iLCJvYmplY3RTdG9yZSJdLCJtYXBwaW5ncyI6IkFBRUEsSUFBSUEsUUFBVSxDQUNaQyxHQUFJLEtBRUpDLEtBQU0sU0FBU0MsR0FDYixPQUFJSCxRQUFRQyxHQUNIRyxRQUFRQyxRQUFRTCxRQUFRQyxJQUcxQkssSUFBSUMsS0FBSyxrQkFBbUIsRUFBRyxTQUFTQyxHQUM3Q0EsRUFBVUMsa0JBQWtCTixFQUFNLENBQUVPLGVBQWdCLEVBQU1DLFFBQVMsU0FDbEVDLEtBQUssU0FBU1gsR0FDZixPQUFPRCxRQUFRQyxHQUFLQSxLQUl4QlksS0FBTSxTQUFTVixFQUFNVyxHQUNuQixPQUFPZCxRQUFRRSxLQUFLQyxHQUFNUyxLQUFLLFNBQVNYLEdBQ3RDLE9BQU9BLEVBQUdjLFlBQVlaLEVBQU1XLEdBQU1FLFlBQVliIiwiZmlsZSI6Im5ld0RhdGEuanMiLCJzb3VyY2VzQ29udGVudCI6WyIvLyBpbnNwaXJlZCBieSAoc291cmNlKVxuLy8gaHR0cHM6Ly93d3cudHdpbGlvLmNvbS9ibG9nLzIwMTcvMDIvc2VuZC1tZXNzYWdlcy13aGVuLXlvdXJlLWJhY2stb25saW5lLXdpdGgtc2VydmljZS13b3JrZXJzLWFuZC1iYWNrZ3JvdW5kLXN5bmMuaHRtbFxubGV0IG5ld0RhdGEgPSB7XG4gIGRiOiBudWxsLFxuXG4gIGluaXQ6IGZ1bmN0aW9uKG5hbWUpIHtcbiAgICBpZiAobmV3RGF0YS5kYikge1xuICAgICAgcmV0dXJuIFByb21pc2UucmVzb2x2ZShuZXdEYXRhLmRiKTtcbiAgICB9XG5cbiAgICByZXR1cm4gaWRiLm9wZW4oJ3Jlc3RhdXJhbnRzRGF0YScsIDEsIGZ1bmN0aW9uKHVwZ3JhZGVEYikge1xuICAgICAgdXBncmFkZURiLmNyZWF0ZU9iamVjdFN0b3JlKG5hbWUsIHsgYXV0b0luY3JlbWVudCA6IHRydWUsIGtleVBhdGg6ICdpZCcgfSk7XG4gICAgfSkudGhlbihmdW5jdGlvbihkYikge1xuICAgICAgcmV0dXJuIG5ld0RhdGEuZGIgPSBkYjtcbiAgICB9KTtcbiAgfSxcblxuICBkYXRhOiBmdW5jdGlvbihuYW1lLCBtb2RlKSB7XG4gICAgcmV0dXJuIG5ld0RhdGEuaW5pdChuYW1lKS50aGVuKGZ1bmN0aW9uKGRiKSB7XG4gICAgICByZXR1cm4gZGIudHJhbnNhY3Rpb24obmFtZSwgbW9kZSkub2JqZWN0U3RvcmUobmFtZSk7XG4gICAgfSlcbiAgfVxufVxuIl19