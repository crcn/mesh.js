```javascript
var Observable = require("rx").Observable;

function fromStream(stream) {
  return Observable.create(function(observer) {
    stream.pipeTo({
      write: function(data) {
        observer.onNext(data);
      },
      close: function() {
        observer.onCompleted();
      },
      abort: functon(error) {
        observer.onError(error);
      }
    });
  });
}

fromStream(BufferedBus.create(void 0, "chunk").execute()).subscribe(function(x) {
  console.log(x); // chunk
})
```
