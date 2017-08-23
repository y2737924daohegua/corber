module.exports = {
  camelize(str) {
    return str.replace(/-([(a-zA-Z1-9])/g, function (m, w) {
      return w.toUpperCase();
    });
  }
};
