export class OrderHasBeenReturnedError extends Error {
    constructor(){
        super('order has been returned')
    }
}