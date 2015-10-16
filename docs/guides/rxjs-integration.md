```javascript
var Observable = require("rx").Observable;

function fromStream(busStream) {
  return Observable.create(function(observer) {
    busStream.pipeTo(WrapWriter.create({
      write: function(data) {
        observer.onNext(data);
      },
      abort: functon(error) {
        observer.onError(error);
      },
      end: function() {
        observer.onCompleted();
      }
    }));
  });
}

fromStream(BufferedBus.create(void 0, "chunk").execute()).subscribe(function(x) {
  console.log(x); // chunk
})
```
