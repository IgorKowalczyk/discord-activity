/* @ts-ignore BigInt cannot convert to json */
BigInt.prototype.toJSON = function () {
 return this.toString();
};
