var pump = (stream, each, reject) => {
  stream.read().then((chunk) => {
    each(chunk);
    if (!chunk.done) pump(stream, each, reject);
  }, reject);
};

export default pump;
